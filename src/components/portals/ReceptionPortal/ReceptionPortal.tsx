import React, { useState } from 'react';
import { useAuth } from '../../../services/authContext';
import { db } from '../../../services/mockDatabase';
import { 
  Patient, 
  Appointment, 
  Doctor, 
  Department, 
  BillingReceipt, 
  BillingItem,
  PatientChatMessage
} from '../../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Printer, 
  CreditCard, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  Phone, 
  AlertCircle, 
  Activity, 
  Plus, 
  FileText,
  Calendar,
  Building,
  Receipt,
  Sparkles,
  MessageSquare,
  Send,
  CheckCheck,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ThermalReceiptModal } from '../../common/ThermalReceiptModal';

export const ReceptionPortal: React.FC = () => {
  const { currentHospital, currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'walkin' | 'queue_board' | 'patient_lookup' | 'billing_desk' | 'patient_chat'>('walkin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<BillingReceipt | null>(null);

  // Core Data Queries
  const allPatients = db.getPatients(currentHospital.id);
  const departments = db.getDepartments(currentHospital.id);
  const allDoctors = db.getDoctors(currentHospital.id);
  const allAppointments = db.getAppointments(currentHospital.id);

  // Patient Chat States
  const [chatMessages, setChatMessages] = useState<PatientChatMessage[]>(() => db.getPatientChatMessages(currentHospital.id));
  const [selectedChatPatientId, setSelectedChatPatientId] = useState<string>('pat-01');
  const [receptionReplyText, setReceptionReplyText] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread'>('all');

  // Unread message count for reception
  const unreadMessagesCount = db.getUnreadPatientMessageCount(currentHospital.id);

  // Group chat messages by patient
  const patientChatThreads = allPatients.map((pat) => {
    const msgs = chatMessages.filter(m => m.patient_id === pat.id);
    const unreadCount = msgs.filter(m => m.sender === 'patient' && !m.read).length;
    const lastMsg = msgs[msgs.length - 1];
    return {
      patient: pat,
      messages: msgs,
      unreadCount,
      lastMessage: lastMsg
    };
  }).filter(t => t.messages.length > 0 || t.patient.id === selectedChatPatientId);

  const selectedThread = patientChatThreads.find(t => t.patient.id === selectedChatPatientId) || patientChatThreads[0] || {
    patient: allPatients[0],
    messages: [],
    unreadCount: 0,
    lastMessage: undefined
  };

  const handleSendReceptionReply = (e?: React.FormEvent, quickText?: string) => {
    if (e) e.preventDefault();
    const textToSend = quickText || receptionReplyText;
    if (!textToSend.trim() || !selectedThread?.patient) return;

    const newMsg = db.sendPatientChatMessage({
      hospital_id: currentHospital.id,
      patient_id: selectedThread.patient.id,
      patient_uhid: selectedThread.patient.uhid,
      patient_name: selectedThread.patient.fullName,
      patient_phone: selectedThread.patient.phone,
      sender: 'reception',
      senderName: `${currentUser?.name || 'Sunita'} (Front Desk)`,
      message: textToSend.trim(),
      category: 'general'
    });

    // Send WhatsApp notification as well
    db.sendWhatsAppNotification({
      hospital_id: currentHospital.id,
      recipientPhone: selectedThread.patient.phone.startsWith('+91') ? selectedThread.patient.phone : `+91 ${selectedThread.patient.phone}`,
      recipientName: selectedThread.patient.fullName,
      templateName: 'reception_reply',
      messageText: `Namaste ${selectedThread.patient.fullName}! Message from ${currentHospital.name} Front Desk: "${textToSend.trim()}". Please reply if you need further help.`,
      variables: {}
    });

    setReceptionReplyText('');
    setChatMessages(db.getPatientChatMessages(currentHospital.id));
  };

  const handleSelectThread = (patId: string) => {
    setSelectedChatPatientId(patId);
    db.markPatientMessagesRead(currentHospital.id, patId, 'reception');
    setChatMessages(db.getPatientChatMessages(currentHospital.id));
  };
  const [patientMode, setPatientMode] = useState<'new' | 'existing'>('new');
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);

  // New Patient Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-'>('B+');
  const [address, setAddress] = useState('New Delhi NCR');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [allergies, setAllergies] = useState('No Known Drug Allergies (NKDA)');

  // Booking fields
  const [deptId, setDeptId] = useState(departments[0]?.id || 'dept-cardio');
  const doctors = db.getDoctors(currentHospital.id).filter(d => d.department_id === deptId);
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 'doc-rajesh');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'senior_citizen'>('normal');
  const [reason, setReason] = useState('Walk-in OPD consultation');

  // Vitals
  const [vitalsBp, setVitalsBp] = useState('120/80');
  const [vitalsPulse, setVitalsPulse] = useState<number>(76);
  const [vitalsTemp, setVitalsTemp] = useState<number>(98.4);
  const [vitalsSpo2, setVitalsSpo2] = useState<number>(99);
  const [vitalsWeight, setVitalsWeight] = useState<number>(68);

  // Payment at counter
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'card'>('upi');

  // Queries
  const todayAppointments = allAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);

  // Patient Search
  const handleSearchPatient = () => {
    if (!searchQuery.trim()) return;
    const p = db.getPatientByPhoneOrUhid(searchQuery, currentHospital.id);
    if (p) {
      setFoundPatient(p);
      setPatientMode('existing');
      setFullName(p.fullName);
      setPhone(p.phone);
      setAge(p.age);
      setGender(p.gender);
      setBloodGroup(p.bloodGroup);
      setAddress(p.address);
    } else {
      alert('No existing patient record found with that Phone / UHID. You can register as a new patient.');
      setFoundPatient(null);
      setPatientMode('new');
    }
  };

  // Submit Walk-in Registration & Issue Token
  const handleRegisterAndIssueToken = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = db.getDoctorById(doctorId);
    if (!doc) return;

    let targetPatient: Patient;

    if (patientMode === 'new' || !foundPatient) {
      const uhidNumber = Math.floor(10000 + Math.random() * 90000);
      const newUhid = `PLS-2025-${uhidNumber}`;

      targetPatient = {
        id: `pat-${Date.now()}`,
        user_id: `usr-${Date.now()}`,
        hospital_id: currentHospital.id,
        uhid: newUhid,
        fullName: fullName || 'Walk-in Patient',
        phone: phone || '9876543210',
        email: `${phone || 'patient'}@pulsehealth.in`,
        age: age || 30,
        gender: gender,
        bloodGroup: bloodGroup,
        address: address,
        emergencyContact: {
          name: 'Guardian / Relative',
          relation: 'Family',
          phone: emergencyPhone || '+91 98765 00000'
        },
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        chronicConditions: [],
        registeredAt: new Date().toISOString().split('T')[0]
      };

      db.addPatient(targetPatient);
    } else {
      targetPatient = foundPatient;
    }

    // Generate Token (e.g. A-15, N-04)
    const tokenPrefix = doc.department_id === 'dept-cardio' ? 'A' : doc.department_id === 'dept-neuro' ? 'N' : doc.department_id === 'dept-ortho' ? 'O' : 'G';
    const queueIndex = todayAppointments.filter(a => a.doctor_id === doc.id).length + 1;
    const tokenNumber = `${tokenPrefix}-${queueIndex < 10 ? '0' + queueIndex : queueIndex}`;

    // Add Appointment
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      hospital_id: currentHospital.id,
      patient_id: targetPatient.id,
      doctor_id: doc.id,
      department_id: deptId,
      date: new Date().toISOString().split('T')[0],
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokenNumber,
      queueStatus: 'waiting',
      priority: priority,
      type: 'opd',
      reason: reason,
      vitals: {
        bp: vitalsBp,
        pulse: vitalsPulse,
        temp: vitalsTemp,
        spo2: vitalsSpo2,
        weight: vitalsWeight,
        recordedAt: `Reception Desk by ${currentUser?.name || 'Sunita Verma'}`
      },
      fee: doc.consultationFee,
      paymentStatus: 'paid',
      paymentMode: paymentMode,
      bookedBy: 'reception',
      createdAt: new Date().toISOString()
    };

    db.addAppointment(newApt);

    // Create Billing Receipt
    const receiptNumber = `PLS-INV-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: BillingReceipt = {
      id: `rec-${Date.now()}`,
      hospital_id: currentHospital.id,
      patient_id: targetPatient.id,
      appointment_id: newApt.id,
      receiptNumber,
      date: new Date().toISOString().split('T')[0],
      items: [
        {
          description: `OPD Consultation Token #${tokenNumber} - ${doc.name}`,
          category: 'Consultation',
          hsn: '999312',
          amount: doc.consultationFee,
          gstRate: 0,
          gstAmount: 0,
          total: doc.consultationFee
        }
      ],
      subTotal: doc.consultationFee,
      gstTotal: 0,
      grandTotal: doc.consultationFee,
      paymentMode: paymentMode,
      transactionId: paymentMode === 'upi' ? `UPI-COUNTER-${Math.floor(100000 + Math.random() * 900000)}` : 'CASH-COUNTER-01',
      paymentStatus: 'completed',
      collectedBy: currentUser?.name || 'Sunita Verma (Front Desk)'
    };

    db.addBillingReceipt(newReceipt);

    // WhatsApp Notification Trigger
    db.sendWhatsAppNotification({
      hospital_id: currentHospital.id,
      recipientPhone: targetPatient.phone.startsWith('+91') ? targetPatient.phone : `+91 ${targetPatient.phone}`,
      recipientName: targetPatient.fullName,
      templateName: 'appointment_confirmation',
      messageText: `Namaste ${targetPatient.fullName}! Your walk-in token #${tokenNumber} for ${doc.name} (${doc.opdRoom}) is issued. Payment of ₹${doc.consultationFee} received via ${paymentMode.toUpperCase()}. Location: ${currentHospital.name}.`,
      variables: {
        patient_name: targetPatient.fullName,
        doctor_name: doc.name,
        token: tokenNumber,
        time: 'Now'
      }
    });

    // Audit Log
    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: currentUser?.id || 'usr-rec-01',
      actorName: currentUser?.name || 'Sunita Verma',
      actorRole: 'reception',
      action: 'TOKEN_ISSUED',
      targetPatientUhid: targetPatient.uhid,
      targetPatientName: targetPatient.fullName,
      ipAddress: '10.0.1.12 (Reception Desk 1)',
      details: `Registered walk-in patient ${targetPatient.fullName} (UHID: ${targetPatient.uhid}) and issued Token #${tokenNumber} for ${doc.name}. Receipt #${receiptNumber}`
    });

    setSelectedReceipt(newReceipt);
    alert(`Token #${tokenNumber} issued successfully for ${targetPatient.fullName}!`);

    // Reset Form
    setFullName('');
    setPhone('');
    setFoundPatient(null);
    setPatientMode('new');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-white border border-emerald-100 rounded-[28px] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 text-2xl font-bold shadow-xs">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Reception & OPD Token Desk</h2>
                <span className="bg-emerald-50 text-emerald-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Front Desk Counter 1
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Walk-in Patient Registration, Queue Management, Fee Collection & Thermal Receipt Generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Today's Tokens Issued</span>
              <span className="text-lg font-black text-emerald-700">{todayAppointments.length} Tokens</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Total Patients Registered</span>
              <span className="text-lg font-black text-slate-900">{allPatients.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-emerald-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
        {[
          { id: 'walkin', label: 'Walk-In Registration & Token Generator', icon: <UserPlus className="w-4 h-4" /> },
          { id: 'queue_board', label: `Hospital OPD Queue Board (${todayAppointments.length})`, icon: <Activity className="w-4 h-4" /> },
          { id: 'patient_lookup', label: 'Patient Directory & EMR Search', icon: <Search className="w-4 h-4" /> },
          { id: 'billing_desk', label: 'Counter Cash / UPI Billing Ledger', icon: <Receipt className="w-4 h-4" /> },
          { 
            id: 'patient_chat', 
            label: `Patient Inquiries & Live Chat ${unreadMessagesCount > 0 ? `(${unreadMessagesCount} New)` : ''}`, 
            icon: <MessageSquare className="w-4 h-4 text-emerald-600" /> 
          }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'patient_chat' && selectedThread?.patient) {
                db.markPatientMessagesRead(currentHospital.id, selectedThread.patient.id, 'reception');
                setChatMessages(db.getPatientChatMessages(currentHospital.id));
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.id === 'patient_chat' && unreadMessagesCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Walk-In Registration & Token Assignment */}
      {activeTab === 'walkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Search for Existing Patient */}
          <div className="space-y-4">
            <div className="bg-white border border-emerald-100 rounded-[28px] p-5 space-y-3 text-xs shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-emerald-700" />
                <span>Lookup Existing Patient (UHID / Mobile)</span>
              </h4>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 10-digit mobile or UHID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:bg-white focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleSearchPatient}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl transition shadow-xs"
                >
                  Lookup
                </button>
              </div>

              {foundPatient && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl space-y-1 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{foundPatient.fullName}</span>
                    <span className="text-[10px] font-mono bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">
                      {foundPatient.uhid}
                    </span>
                  </div>
                  <p className="text-slate-600">{foundPatient.age} Y • {foundPatient.gender} • Blood: <strong className="text-rose-600">{foundPatient.bloodGroup}</strong></p>
                  <p className="text-slate-500 text-[11px]">Ph: +91 {foundPatient.phone}</p>
                  <span className="inline-block text-[10px] text-emerald-700 font-bold mt-1">✓ Auto-filled in token form</span>
                </div>
              )}
            </div>

            {/* Live Doctor OPD Occupancy & Room Status */}
            <div className="bg-white border border-emerald-100 rounded-[28px] p-5 space-y-3 text-xs shadow-xs">
              <h4 className="font-bold text-sm text-slate-900">Live Doctor OPD Roster</h4>
              <div className="space-y-2.5">
                {db.getDoctors(currentHospital.id).map((doc) => {
                  const waitingCount = todayAppointments.filter(a => a.doctor_id === doc.id && a.queueStatus === 'waiting').length;
                  return (
                    <div key={doc.id} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.opdRoom} • Fee: ₹{doc.consultationFee}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {waitingCount} in Queue
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Registration & Token Issue Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleRegisterAndIssueToken} className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-5 text-xs shadow-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Walk-in Patient Token & Receipt Slip</h3>
                  <p className="text-xs text-slate-500">Register demographics, record triage vitals, and collect consultation fee.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPatientMode('new');
                      setFoundPatient(null);
                      setFullName('');
                      setPhone('');
                    }}
                    className={`px-3 py-1 rounded-xl font-bold text-xs transition ${
                      patientMode === 'new' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    + New Patient
                  </button>
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-slate-700 font-semibold block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Meera Krishnan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Mobile (WhatsApp No.)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department & Doctor Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Select Department</label>
                  <select
                    value={deptId}
                    onChange={(e) => {
                      setDeptId(e.target.value);
                      const list = db.getDoctors(currentHospital.id).filter(d => d.department_id === e.target.value);
                      if (list[0]) setDoctorId(list[0].id);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.opdFloor})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Assign Doctor & Room</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.opdRoom} (Fee: ₹{doc.consultationFee})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Triage Vitals Check */}
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider block">
                  🩺 Initial Nurse / Triage Vitals
                </span>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block">BP (mmHg)</span>
                    <input
                      type="text"
                      value={vitalsBp}
                      onChange={(e) => setVitalsBp(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Pulse (bpm)</span>
                    <input
                      type="number"
                      value={vitalsPulse}
                      onChange={(e) => setVitalsPulse(parseInt(e.target.value) || 72)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Temp (°F)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={vitalsTemp}
                      onChange={(e) => setVitalsTemp(parseFloat(e.target.value) || 98.4)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SpO2 (%)</span>
                    <input
                      type="number"
                      value={vitalsSpo2}
                      onChange={(e) => setVitalsSpo2(parseInt(e.target.value) || 98)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Weight (kg)</span>
                    <input
                      type="number"
                      value={vitalsWeight}
                      onChange={(e) => setVitalsWeight(parseInt(e.target.value) || 65)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Priority & Payment Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Queue Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    <option value="normal">Normal Walk-In</option>
                    <option value="senior_citizen">Senior Citizen Priority (Fast Track)</option>
                    <option value="urgent">Urgent / Severe Pain</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Counter Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-800 font-bold focus:bg-white focus:border-emerald-600"
                  >
                    <option value="upi">UPI QR Scan (Google Pay / PhonePe / Paytm)</option>
                    <option value="cash">Cash (Counter Collection)</option>
                    <option value="card">Debit / Credit Card POS Terminal</option>
                  </select>
                </div>
              </div>

              {/* Submit & Issue Token */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-slate-500 block text-[11px]">Payable Consultation Tariff:</span>
                  <span className="text-lg font-black text-emerald-700">
                    ₹{db.getDoctorById(doctorId)?.consultationFee || 1000} (GST Exempt)
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-xs text-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>Issue Token & Print Thermal Slip</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* TAB 2: Hospital-wide Live OPD Queue Board */}
      {activeTab === 'queue_board' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Live Central Hospital OPD Queue Board</h3>
              <p className="text-xs text-slate-500">Real-time status display across all doctor consulting rooms.</p>
            </div>
            <span className="font-mono text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200 font-bold">
              ● Live Queue Stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {db.getDoctors(currentHospital.id).map((doc) => {
              const docQueue = todayAppointments.filter(a => a.doctor_id === doc.id);
              const inConsultation = docQueue.find(a => a.queueStatus === 'in_consultation');
              const waitingList = docQueue.filter(a => a.queueStatus === 'waiting' || a.queueStatus === 'scheduled');
              const completedList = docQueue.filter(a => a.queueStatus === 'completed');

              return (
                <div key={doc.id} className="bg-slate-50/80 border border-slate-200 rounded-3xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">{doc.opdRoom}</p>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                      {doc.specialization.split(',')[0]}
                    </span>
                  </div>

                  {/* Active Patient in Room */}
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                      Now In Consultation:
                    </span>
                    {inConsultation ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-emerald-800">
                            Token #{inConsultation.tokenNumber}
                          </span>
                          <span className="text-xs text-slate-700 font-medium">
                            {db.getPatientById(inConsultation.patient_id)?.fullName}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Room Available / Calling Next</span>
                    )}
                  </div>

                  {/* Waiting Tokens */}
                  <div className="space-y-1 text-xs">
                    <span className="text-slate-600 text-[11px] font-semibold">Waiting Queue ({waitingList.length}):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {waitingList.map((w) => (
                        <span key={w.id} className="bg-white border border-slate-200 text-slate-800 text-[11px] font-mono px-2 py-0.5 rounded-lg">
                          #{w.tokenNumber}
                        </span>
                      ))}
                      {waitingList.length === 0 && <span className="text-slate-400 text-[11px]">Queue Clear</span>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                    <span>Completed Today: <strong className="text-slate-800">{completedList.length}</strong></span>
                    <span>Total: <strong className="text-slate-800">{docQueue.length}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Patient Directory */}
      {activeTab === 'patient_lookup' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-slate-900">Registered Patient Directory ({allPatients.length})</h3>
          <div className="divide-y divide-slate-100">
            {allPatients.map((pat) => (
              <div key={pat.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{pat.fullName}</span>
                    <span className="font-mono text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {pat.uhid}
                    </span>
                    <span className="text-slate-500">{pat.age} Yrs • {pat.gender} • Blood: <strong className="text-rose-600">{pat.bloodGroup}</strong></span>
                  </div>
                  <p className="text-slate-500 mt-1">Ph: +91 {pat.phone} • Email: {pat.email} • {pat.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFoundPatient(pat);
                      setPatientMode('existing');
                      setActiveTab('walkin');
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer"
                  >
                    + Book OPD Token
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Counter Billing Desk */}
      {activeTab === 'billing_desk' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Front Desk Collection Receipts</h3>
            <span className="text-xs text-slate-500">Cash / Card / UPI Counter Slips</span>
          </div>
          <div className="space-y-3">
            {db.getBillingReceipts(currentHospital.id).map((rec) => (
              <div key={rec.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-emerald-800">{rec.receiptNumber}</span>
                    <span className="text-slate-500">{rec.date}</span>
                    <span className="bg-slate-200 text-slate-700 font-bold uppercase px-2 py-0.5 rounded text-[10px]">
                      {rec.paymentMode}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-1 font-medium truncate">{rec.items[0]?.description || 'OPD Consultation Fee'}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 shrink-0">
                  <span className="font-black text-sm text-slate-900">₹{rec.grandTotal.toFixed(2)}</span>
                  <button
                    onClick={() => setSelectedReceipt(rec)}
                    className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition flex items-center gap-1.5 font-semibold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Thermal Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Reception-Only Patient Inquiries & Live Chat */}
      {activeTab === 'patient_chat' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <span>Patient Helpdesk & Live Chat Console</span>
                <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Reception Exclusive
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Respond to patient questions regarding OPD timings, token queues, doctor arrivals, and report pickup.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  chatFilter === 'all'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Threads ({patientChatThreads.length})
              </button>
              <button
                onClick={() => setChatFilter('unread')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  chatFilter === 'unread'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Unread</span>
                {unreadMessagesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
            {/* Left: Patient Thread List */}
            <div className="lg:col-span-4 border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-slate-50/50">
              <div className="p-3 bg-white border-b border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Active Patient Conversations
                </span>
                <span className="text-[10px] text-slate-400">
                  Messages sent here are delivered directly to the patient's portal & WhatsApp
                </span>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[400px]">
                {patientChatThreads
                  .filter(t => chatFilter === 'all' || t.unreadCount > 0)
                  .map((thread) => {
                    const isSelected = selectedThread?.patient.id === thread.patient.id;
                    return (
                      <button
                        key={thread.patient.id}
                        type="button"
                        onClick={() => handleSelectThread(thread.patient.id)}
                        className={`w-full text-left p-3 transition flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/90 border-l-4 border-emerald-600'
                            : 'hover:bg-white bg-transparent'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {thread.patient.fullName}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              {thread.patient.uhid}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 truncate mt-1">
                            {thread.lastMessage?.message || 'No messages yet'}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span>Ph: {thread.patient.phone}</span>
                            <span>•</span>
                            <span>{thread.lastMessage ? new Date(thread.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                        </div>

                        {thread.unreadCount > 0 && (
                          <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                            {thread.unreadCount} new
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Right: Selected Chat Thread & Reply Box */}
            <div className="lg:col-span-8 border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-white">
              {/* Header */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {selectedThread.patient.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{selectedThread.patient.fullName}</span>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {selectedThread.patient.uhid}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Mobile: +91 {selectedThread.patient.phone} • Age: {selectedThread.patient.age}Y • Blood: {selectedThread.patient.bloodGroup}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    ● Connected to Patient
                  </span>
                </div>
              </div>

              {/* Chat Message Scroll Box */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[300px] bg-slate-50/40">
                {selectedThread.messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No messages exchanged with this patient yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">You can send an update or instructions below.</p>
                  </div>
                ) : (
                  selectedThread.messages.map((msg) => {
                    const isReception = msg.sender === 'reception';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isReception ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-600">{msg.senderName}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                            isReception
                              ? 'bg-emerald-700 text-white rounded-tr-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${isReception ? 'text-emerald-200' : 'text-slate-400'}`}>
                            {isReception && <CheckCheck className="w-3 h-3" />}
                            <span>{msg.category ? msg.category.toUpperCase() : 'MSG'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Response Action Chips */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                  1-Click Quick Reception Updates
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Doctor has arrived in OPD Room. Please be seated nearby.",
                    "Your token number is next! Please proceed to the consultation room.",
                    "Your lab investigation report is ready for pickup at Counter 3.",
                    "Please visit Reception Counter 1 with your prescription for billing.",
                    "OPD schedule has a 10 min delay. Thank you for your patience."
                  ].map((quick, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendReceptionReply(undefined, quick)}
                      className="bg-white hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 transition text-left cursor-pointer"
                    >
                      + {quick}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendReceptionReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${selectedThread.patient.fullName} (sent to patient screen & SMS/WhatsApp)...`}
                  value={receptionReplyText}
                  onChange={(e) => setReceptionReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!receptionReplyText.trim()}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Modal */}
      {selectedReceipt && (
        <ThermalReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={selectedReceipt}
        />
      )}

    </div>
  );
};
