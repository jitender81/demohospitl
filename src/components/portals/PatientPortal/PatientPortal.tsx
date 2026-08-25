import React, { useState } from 'react';
import { useAuth } from '../../../services/authContext';
import { db } from '../../../services/mockDatabase';
import { 
  Appointment, 
  Prescription, 
  LabReport, 
  BillingReceipt, 
  Doctor, 
  Department, 
  PatientFeedback,
  PatientChatMessage
} from '../../../types';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Receipt, 
  Heart, 
  Plus, 
  Printer, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  CreditCard, 
  UserCheck, 
  Activity, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  PhoneCall,
  Stethoscope,
  ChevronRight,
  Send,
  CheckCheck,
  Headphones
} from 'lucide-react';
import { PrescriptionPrintModal } from '../../common/PrescriptionPrintModal';
import { ThermalReceiptModal } from '../../common/ThermalReceiptModal';
import { LabReportModal } from '../../common/LabReportModal';
import { RazorpayModal } from '../../common/RazorpayModal';

export const PatientPortal: React.FC = () => {
  const { currentHospital, currentUser } = useAuth();
  
  // Patient details (Default to Rahul Sharma if logged in as patient)
  const patient = db.getPatients(currentHospital.id).find(p => p.phone === currentUser?.phone) || db.getPatients(currentHospital.id)[0];
  
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'lab_reports' | 'billing' | 'feedback' | 'reception_chat'>('overview');
  
  // Patient Helpdesk Chat State
  const [chatMessages, setChatMessages] = useState<PatientChatMessage[]>(() => db.getPatientChatMessages(currentHospital.id, patient?.id));
  const [patientInputMsg, setPatientInputMsg] = useState('');
  const [msgCategory, setMsgCategory] = useState<'general' | 'token_query' | 'doctor_timing' | 'report_status' | 'emergency'>('general');
  
  // Modal states
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<BillingReceipt | null>(null);
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [razorpayConfig, setRazorpayConfig] = useState<{ isOpen: boolean; amount: number; description: string; aptId?: string } | null>(null);

  // Booking Form State
  const departments = db.getDepartments(currentHospital.id);
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || 'dept-cardio');
  const doctors = db.getDoctors(currentHospital.id).filter(d => d.department_id === selectedDeptId);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'doc-rajesh');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('11:15 AM');
  const [bookingReason, setBookingReason] = useState('Routine consultation & general checkup');

  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackDocRating, setFeedbackDocRating] = useState(5);
  const [feedbackWaitRating, setFeedbackWaitRating] = useState(4);
  const [feedbackCleanRating, setFeedbackCleanRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('Excellent hospital care, courteous staff and minimal wait time.');

  // Data queries
  const allAppointments = db.getAppointments(currentHospital.id).filter(a => a.patient_id === patient?.id);
  const allPrescriptions = db.getPrescriptions(currentHospital.id).filter(p => p.patient_id === patient?.id);
  const allLabReports = db.getLabReports(currentHospital.id).filter(r => r.patient_id === patient?.id);
  const allReceipts = db.getBillingReceipts(currentHospital.id).filter(b => b.patient_id === patient?.id);

  // Today active appointment
  const todayApt = allAppointments.find(a => a.date === new Date().toISOString().split('T')[0] && a.queueStatus !== 'cancelled');

  const unreadReceptionReplies = chatMessages.filter(m => m.sender === 'reception' && !m.read).length;

  const handleSendPatientMessage = (e?: React.FormEvent, quickText?: string) => {
    if (e) e.preventDefault();
    const text = quickText || patientInputMsg;
    if (!text.trim() || !patient) return;

    db.sendPatientChatMessage({
      hospital_id: currentHospital.id,
      patient_id: patient.id,
      patient_uhid: patient.uhid,
      patient_name: patient.fullName,
      patient_phone: patient.phone,
      sender: 'patient',
      senderName: patient.fullName,
      message: text.trim(),
      category: msgCategory
    });

    setPatientInputMsg('');
    setChatMessages(db.getPatientChatMessages(currentHospital.id, patient.id));
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = db.getDoctorById(selectedDoctorId);
    if (!doc) return;

    const tokenChar = doc.department_id === 'dept-cardio' ? 'A' : doc.department_id === 'dept-neuro' ? 'N' : 'G';
    const randomTokenNum = Math.floor(10 + Math.random() * 40);
    const tokenNumber = `${tokenChar}-${randomTokenNum}`;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      hospital_id: currentHospital.id,
      patient_id: patient.id,
      doctor_id: selectedDoctorId,
      department_id: selectedDeptId,
      date: selectedDate,
      timeSlot: selectedSlot,
      tokenNumber,
      queueStatus: 'scheduled',
      priority: 'normal',
      type: 'opd',
      reason: bookingReason,
      fee: doc.consultationFee,
      paymentStatus: 'pending',
      bookedBy: 'self',
      createdAt: new Date().toISOString()
    };

    db.addAppointment(newApt);

    // Trigger WhatsApp
    db.sendWhatsAppNotification({
      hospital_id: currentHospital.id,
      recipientPhone: patient.phone.startsWith('+91') ? patient.phone : `+91 ${patient.phone}`,
      recipientName: patient.fullName,
      templateName: 'appointment_confirmation',
      messageText: `Namaste ${patient.fullName}! Your OPD appointment with ${doc.name} (${departments.find(d => d.id === selectedDeptId)?.name}) is confirmed for ${selectedDate} at ${selectedSlot}. Your Token is #${tokenNumber}. Hospital: ${currentHospital.name}.`,
      variables: {
        patient_name: patient.fullName,
        doctor_name: doc.name,
        token: tokenNumber,
        time: selectedSlot
      }
    });

    // Audit Log
    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: patient.id,
      actorName: patient.fullName,
      actorRole: 'patient',
      action: 'TOKEN_ISSUED',
      targetPatientUhid: patient.uhid,
      targetPatientName: patient.fullName,
      ipAddress: '127.0.0.1 (Patient Portal Self Booking)',
      details: `Self-booked OPD appointment with ${doc.name}. Assigned Token #${tokenNumber}`
    });

    setShowBookingModal(false);
    
    // Open payment modal
    setRazorpayConfig({
      isOpen: true,
      amount: doc.consultationFee,
      description: `OPD Consultation with ${doc.name} (Token #${tokenNumber})`,
      aptId: newApt.id
    });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback: PatientFeedback = {
      id: `fb-${Date.now()}`,
      hospital_id: currentHospital.id,
      patient_id: patient.id,
      doctor_id: selectedDoctorId,
      appointment_id: todayApt?.id || 'apt-101',
      rating: feedbackRating,
      doctorRating: feedbackDocRating,
      waitTimeRating: feedbackWaitRating,
      cleanlinessRating: feedbackCleanRating,
      comment: feedbackComment,
      tags: ['Verified Patient', 'Courteous Doctor', 'Quick Consultation'],
      submittedAt: new Date().toLocaleString()
    };

    db.addFeedback(newFeedback);
    alert('Thank you! Your feedback & rating have been submitted successfully to hospital quality audit.');
    setShowFeedbackModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Patient Header Identity Card */}
      <div className="bg-white border border-emerald-100 rounded-[28px] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Patient Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-2xl font-bold text-emerald-800 shadow-xs">
              {patient?.fullName.charAt(0) || 'P'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{patient?.fullName}</h2>
                <span className="bg-emerald-50 text-emerald-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  UHID: {patient?.uhid}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient?.age} Yrs • {patient?.gender} • Blood Group: <span className="text-rose-600 font-bold">{patient?.bloodGroup}</span> • Ph: +91 {patient?.phone}
              </p>
              
              {/* Medical Alerts & Allergies Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {patient?.allergies.map((allergy, i) => (
                  <span key={i} className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-500" /> Allergy: {allergy}
                  </span>
                ))}
                {patient?.chronicConditions.map((cond, i) => (
                  <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                    🩺 {cond}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Book Doctor Appointment</span>
            </button>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-1.5"
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span>Rate Visit</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white border border-emerald-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
        {[
          { id: 'overview', label: 'Patient Dashboard', icon: <Activity className="w-4 h-4" /> },
          { id: 'appointments', label: `My Appointments (${allAppointments.length})`, icon: <Calendar className="w-4 h-4" /> },
          { id: 'prescriptions', label: `Digital Rx (${allPrescriptions.length})`, icon: <FileText className="w-4 h-4" /> },
          { id: 'lab_reports', label: `Lab & Diagnostics (${allLabReports.length})`, icon: <Activity className="w-4 h-4" /> },
          { id: 'billing', label: `Bills & Receipts (${allReceipts.length})`, icon: <Receipt className="w-4 h-4" /> },
          { 
            id: 'reception_chat', 
            label: `Front Desk Help & Chat ${unreadReceptionReplies > 0 ? `(${unreadReceptionReplies} New)` : ''}`, 
            icon: <MessageSquare className="w-4 h-4 text-emerald-600" /> 
          }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              if (tab.id === 'reception_chat' && patient) {
                db.markPatientMessagesRead(currentHospital.id, patient.id, 'patient');
                setChatMessages(db.getPatientChatMessages(currentHospital.id, patient.id));
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.id === 'reception_chat' && unreadReceptionReplies > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {unreadReceptionReplies}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Live OPD Queue Token Tracker & Recent Activities */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Queue Banner */}
            {todayApt ? (
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-[28px] p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Today's Live OPD Queue Token
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      Token #{todayApt.tokenNumber}
                    </h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Doctor: <strong className="text-white">{db.getDoctorById(todayApt.doctor_id)?.name}</strong> ({db.getDoctorById(todayApt.doctor_id)?.opdRoom})
                    </p>
                  </div>

                  <div className="text-right sm:border-l sm:border-emerald-700/60 sm:pl-6 space-y-1">
                    <div className="text-xs text-emerald-200">Queue Status</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      todayApt.queueStatus === 'in_consultation'
                        ? 'bg-white text-emerald-900 animate-pulse'
                        : todayApt.queueStatus === 'waiting'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-emerald-700 text-white'
                    }`}>
                      {todayApt.queueStatus.replace('_', ' ')}
                    </span>
                    <p className="text-[11px] text-emerald-200">Time Slot: {todayApt.timeSlot}</p>
                  </div>
                </div>

                {todayApt.vitals && (
                  <div className="mt-4 pt-4 border-t border-emerald-700/60 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-700/50">
                      <span className="text-[10px] text-emerald-300 block">BP</span>
                      <span className="font-bold text-white">{todayApt.vitals.bp} mmHg</span>
                    </div>
                    <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-700/50">
                      <span className="text-[10px] text-emerald-300 block">Pulse</span>
                      <span className="font-bold text-emerald-200">{todayApt.vitals.pulse} bpm</span>
                    </div>
                    <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-700/50">
                      <span className="text-[10px] text-emerald-300 block">SpO2</span>
                      <span className="font-bold text-teal-200">{todayApt.vitals.spo2} %</span>
                    </div>
                    <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-700/50">
                      <span className="text-[10px] text-emerald-300 block">Temp</span>
                      <span className="font-bold text-amber-200">{todayApt.vitals.temp} °F</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-emerald-100 rounded-[28px] p-6 text-center space-y-3 shadow-xs">
                <Calendar className="w-10 h-10 text-emerald-600/50 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No Appointments Scheduled for Today</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Book an appointment with specialist consultants across Cardiology, Neurology, Orthopaedics and General Medicine.
                </p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Book OPD Slot
                </button>
              </div>
            )}

            {/* Latest Digital Prescriptions */}
            <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Recent Digital Prescriptions</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('prescriptions')}
                  className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View All</span> <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {allPrescriptions.slice(0, 2).map((rx) => {
                  const doc = db.getDoctorById(rx.doctor_id);
                  return (
                    <div key={rx.id} className="bg-slate-50/70 border border-emerald-100/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-200 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{rx.diagnosis}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">{rx.date}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Consultant: <strong className="text-slate-700">{doc?.name}</strong> • {rx.medications.length} Prescribed Medications
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition self-start sm:self-center"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Rx Letterhead</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Column 3: Live Lab Reports & Quick Pay Summary */}
          <div className="space-y-6">
            
            {/* Lab Reports Card */}
            <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Diagnostic Reports</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('lab_reports')}
                  className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>All Reports</span> <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {allLabReports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="bg-slate-50/70 border border-emerald-100/70 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900">{rep.testName}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Sample: {rep.sampleCollectedAt}</p>
                    
                    <button
                      onClick={() => setSelectedLabReport(rep)}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold py-1.5 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View NABL Lab Report</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hospital Contact Info */}
            <div className="bg-emerald-900 text-white rounded-[28px] p-6 space-y-2 text-xs shadow-md">
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Hospital Facility</p>
              <span className="font-bold text-white block text-sm">{currentHospital.name}</span>
              <p className="text-emerald-100">📍 {currentHospital.address}, {currentHospital.city}</p>
              <p className="text-emerald-100">📞 OPD Helpdesk: {currentHospital.phone}</p>
              <p className="text-emerald-300 font-semibold pt-1">🕒 {currentHospital.opdTiming}</p>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: Appointments */}
      {activeSubTab === 'appointments' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">All Appointment History</h3>
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-4 h-4" /> Book New Slot
            </button>
          </div>

          <div className="divide-y divide-emerald-50">
            {allAppointments.map((apt) => {
              const doc = db.getDoctorById(apt.doctor_id);
              const dept = db.getDepartments().find(d => d.id === apt.department_id);
              return (
                <div key={apt.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{doc?.name || 'Dr. Specialist'}</span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-mono font-bold">
                        Token #{apt.tokenNumber}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        apt.queueStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : apt.queueStatus === 'in_consultation'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.queueStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      {dept?.name} • Room: {doc?.opdRoom} • Date: <strong className="text-slate-800">{apt.date}</strong> at {apt.timeSlot}
                    </p>
                    <p className="text-xs text-slate-400 italic">Reason: {apt.reason}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.paymentStatus === 'pending' ? (
                      <button
                        onClick={() => setRazorpayConfig({
                          isOpen: true,
                          amount: apt.fee,
                          description: `OPD Consultation with ${doc?.name}`,
                          aptId: apt.id
                        })}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay ₹{apt.fee} (Razorpay)</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Paid ₹{apt.fee}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Prescriptions */}
      {activeSubTab === 'prescriptions' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-slate-900">Digital Prescriptions & EMR</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPrescriptions.map((rx) => {
              const doc = db.getDoctorById(rx.doctor_id);
              return (
                <div key={rx.id} className="bg-slate-50/70 border border-emerald-100/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        {rx.id} • {rx.date}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1.5">{rx.diagnosis}</h4>
                      <p className="text-xs text-slate-500">Doctor: {doc?.name}</p>
                    </div>

                    <button
                      onClick={() => setSelectedPrescription(rx)}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 transition"
                      title="Print Prescription Letterhead"
                    >
                      <Printer className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
                    <span className="font-bold text-slate-800 block text-[11px]">Medications ({rx.medications.length}):</span>
                    {rx.medications.map((m, i) => (
                      <p key={i} className="text-slate-600 text-[11px]">
                        • <strong className="text-slate-800">{m.name}</strong> ({m.frequency} - {m.timing})
                      </p>
                    ))}
                  </div>

                  {rx.advice && (
                    <p className="text-xs text-slate-500 italic">"{rx.advice}"</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Lab Reports */}
      {activeSubTab === 'lab_reports' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-slate-900">Diagnostic Laboratory Reports</h3>
          <div className="space-y-3">
            {allLabReports.map((rep) => (
              <div key={rep.id} className="bg-slate-50/70 border border-emerald-100/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{rep.testName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded uppercase">
                      {rep.testCategory}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Sample: {rep.sampleCollectedAt} • Signed off by: <strong className="text-slate-700">{rep.pathologist}</strong>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{rep.conclusion}</p>
                </div>

                <button
                  onClick={() => setSelectedLabReport(rep)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 self-start md:self-center shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View NABL Report</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Billing */}
      {activeSubTab === 'billing' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-slate-900">Tax Invoices & Payment Ledger</h3>
          <div className="space-y-3">
            {allReceipts.map((rec) => (
              <div key={rec.id} className="bg-slate-50/70 border border-emerald-100/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-700">{rec.receiptNumber}</span>
                    <span className="text-xs text-slate-500">• {rec.date}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 uppercase font-bold px-2 py-0.5 rounded">
                      {rec.paymentMode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    {rec.items.map(i => i.description).join(', ')}
                  </p>
                  {rec.transactionId && (
                    <p className="text-[11px] text-slate-400 font-mono">Txn ID: {rec.transactionId}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-base text-slate-900">₹{rec.grandTotal.toFixed(2)}</span>
                  <button
                    onClick={() => setSelectedReceipt(rec)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Receipt Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Front Desk Helpdesk & Live Receptionist Chat */}
      {activeSubTab === 'reception_chat' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-emerald-700" />
                <span>Front Desk Reception Help & Live Support</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct channel to {currentHospital.name} reception staff for token queries, doctor delays, and assistance.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Reception Desk Active (Counter 1)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[420px]">
            
            {/* Left Column: Hospital Contact Card & Quick Info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-xs space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Front Desk Contact Info</span>
                </h4>
                
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Hospital:</span>
                    <span className="font-semibold text-slate-900 text-right">{currentHospital.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Helpdesk Phone:</span>
                    <span className="font-semibold text-emerald-700">{currentHospital.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-semibold text-slate-900">{currentHospital.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Code:</span>
                    <span className="font-bold text-rose-600">1066 / Ext 9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Registered UHID:</span>
                    <span className="font-mono font-bold text-emerald-800">{patient?.uhid}</span>
                  </div>
                </div>
              </div>

              {/* Quick Inquiry Pre-fills */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 text-xs space-y-2">
                <span className="font-bold text-emerald-950 block">Quick Question Templates:</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Is Dr. Rajesh Sharma available in OPD room right now?",
                    "How many patients are ahead of my token number?",
                    "Has my Blood CBC & Lipid lab report been signed?",
                    "I need wheelchair assistance at Hospital Gate #2.",
                    "Can I pay my OPD consultation fee in cash at Counter 1?"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendPatientMessage(undefined, preset)}
                      className="text-left bg-white hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 p-2 rounded-xl border border-emerald-100 transition text-[11px] cursor-pointer"
                    >
                      💬 {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Conversation Thread with Reception */}
            <div className="lg:col-span-8 border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-white">
              
              {/* Header */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Hospital Receptionist Desk</h4>
                    <p className="text-[10px] text-slate-500">Official Help & Inquiry Channel</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Protected & Audited Chat
                </span>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[320px] bg-slate-50/30">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No messages yet. Send a question to front desk reception above or below.</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.sender === 'patient';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-600">{msg.senderName}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                            isMe
                              ? 'bg-emerald-700 text-white rounded-tr-none'
                              : 'bg-white border border-emerald-200 text-slate-900 rounded-tl-none font-medium'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                            {isMe && <CheckCheck className="w-3 h-3" />}
                            <span>{msg.sender === 'reception' ? 'FRONT DESK' : 'YOU'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Category selector & Input form */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-[10px]">
                  <span className="text-slate-400 font-semibold shrink-0">Topic:</span>
                  {[
                    { id: 'general', label: 'General' },
                    { id: 'token_query', label: 'Token Queue' },
                    { id: 'doctor_timing', label: 'Doctor Availability' },
                    { id: 'report_status', label: 'Lab Report' },
                    { id: 'emergency', label: 'Wheelchair / Emergency' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setMsgCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                        msgCategory === cat.id
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendPatientMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your question or request to hospital reception..."
                    value={patientInputMsg}
                    onChange={(e) => setPatientInputMsg(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={!patientInputMsg.trim()}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL: Book Doctor Appointment */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-emerald-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-emerald-800 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Book OPD Doctor Consultation</h3>
                <p className="text-xs text-emerald-200">{currentHospital.name}</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4 text-xs">
              
              {/* Department */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Select Department</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => {
                    setSelectedDeptId(e.target.value);
                    const docList = db.getDoctors(currentHospital.id).filter(d => d.department_id === e.target.value);
                    if (docList[0]) setSelectedDoctorId(docList[0].id);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:border-emerald-600 focus:bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.opdFloor})</option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Select Specialist Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:border-emerald-600 focus:bg-white"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.qualification} (Fee: ₹{doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:border-emerald-600 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Preferred Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:border-emerald-600 focus:bg-white"
                  >
                    {['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '02:30 PM', '03:15 PM', '04:00 PM'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Chief Symptoms / Reason for Visit</label>
                <textarea
                  rows={2}
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="Describe your symptoms or consultation requirement..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span>WhatsApp Token Confirmation</span>
                <span className="text-emerald-700 font-bold">Enabled (Instant QR SMS)</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow-xs"
                >
                  Confirm & Proceed
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Rate Visit & Feedback */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-emerald-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>Patient Experience & Rating</span>
            </h3>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Doctor Consultation Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackDocRating(star)}
                      className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 ${
                        feedbackDocRating >= star ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Hospital Hygiene & Staff Experience</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackCleanRating(star)}
                      className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 ${
                        feedbackCleanRating >= star ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Your Detailed Comments</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Document Modals */}
      {selectedPrescription && (
        <PrescriptionPrintModal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          prescription={selectedPrescription}
        />
      )}

      {selectedReceipt && (
        <ThermalReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={selectedReceipt}
        />
      )}

      {selectedLabReport && (
        <LabReportModal
          isOpen={!!selectedLabReport}
          onClose={() => setSelectedLabReport(null)}
          report={selectedLabReport}
        />
      )}

      {razorpayConfig && (
        <RazorpayModal
          isOpen={razorpayConfig.isOpen}
          amount={razorpayConfig.amount}
          description={razorpayConfig.description}
          category="Consultation"
          patientId={patient?.id}
          appointmentId={razorpayConfig.aptId}
          onClose={() => setRazorpayConfig(null)}
          onPaymentSuccess={(rec) => {
            setSelectedReceipt(rec);
            setRazorpayConfig(null);
          }}
        />
      )}

    </div>
  );
};
