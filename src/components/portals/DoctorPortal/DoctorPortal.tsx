import React, { useState } from 'react';
import { useAuth } from '../../../services/authContext';
import { db } from '../../../services/mockDatabase';
import { 
  Doctor, 
  Patient, 
  Appointment, 
  Prescription, 
  Medication, 
  LabReport 
} from '../../../types';
import { 
  Stethoscope, 
  UserCheck, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  FileText, 
  Printer, 
  Save, 
  Activity, 
  Sparkles, 
  Search,
  MessageSquare,
  ShieldCheck,
  Building,
  HeartPulse
} from 'lucide-react';
import { PrescriptionPrintModal } from '../../common/PrescriptionPrintModal';
import { LabReportModal } from '../../common/LabReportModal';

export const DoctorPortal: React.FC = () => {
  const { currentHospital, currentUser } = useAuth();
  
  // Active Doctor (Default to Dr. Rajesh Sharma)
  const currentDoctor = db.getDoctors(currentHospital.id).find(d => d.user_id === currentUser?.id || d.id === 'doc-rajesh') || db.getDoctors(currentHospital.id)[0];
  
  const [activeTab, setActiveTab] = useState<'queue' | 'consultation' | 'availability' | 'history'>('queue');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(() => {
    return db.getAppointments(currentHospital.id).find(a => a.doctor_id === currentDoctor?.id && a.queueStatus === 'in_consultation') || null;
  });
  
  const [selectedPrintRx, setSelectedPrintRx] = useState<Prescription | null>(null);
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // Prescription Form State for Active Consultation
  const [rxDiagnosis, setRxDiagnosis] = useState('Essential Hypertension Stage 1 with Mild Angina');
  const [rxIcdCode, setRxIcdCode] = useState('I10 - Essential Hypertension');
  const [rxSymptoms, setRxSymptoms] = useState('Occasional chest heaviness, exertional palpitations, headache');
  const [rxClinicalNotes, setRxClinicalNotes] = useState('S1 S2 normal. No gallop. Bilateral air entry clear. Advised salt restriction.');
  const [rxAdvice, setRxAdvice] = useState('Avoid strenuous exertion. Low salt (<2.5g) DASH diet. Home BP monitoring.');
  const [rxFollowUpDate, setRxFollowUpDate] = useState('2025-09-20');
  const [rxLabOrders, setRxLabOrders] = useState<string[]>([
    'Complete Lipid Profile (Fasting)',
    '2D Echocardiography with Color Doppler'
  ]);
  const [newLabTestInput, setNewLabTestInput] = useState('');

  const [medications, setMedications] = useState<Medication[]>([
    {
      name: 'Tab. Telma-AM (Telmisartan 40mg + Amlodipine 5mg)',
      dosage: '40mg + 5mg',
      frequency: '1-0-0 (Morning)',
      duration: '30 Days',
      timing: 'After Food',
      instructions: 'Take daily at 9 AM'
    },
    {
      name: 'Tab. Rosuvas-10 (Rosuvastatin Calcium)',
      dosage: '10 mg',
      frequency: '0-0-1 (Night)',
      duration: '30 Days',
      timing: 'After Food',
      instructions: 'After dinner'
    }
  ]);

  const [newMed, setNewMed] = useState<Medication>({
    name: '',
    dosage: '500 mg',
    frequency: '1-0-1',
    duration: '5 Days',
    timing: 'After Food',
    instructions: 'As directed'
  });

  // Doctor Availability state
  const [availability, setAvailability] = useState(currentDoctor.availability);
  const [leaveToggled, setLeaveToggled] = useState(currentDoctor.availability.isLeaveToday);

  // Queries
  const todayDate = new Date().toISOString().split('T')[0];
  const doctorAppointments = db.getAppointments(currentHospital.id).filter(a => a.doctor_id === currentDoctor?.id);
  const todayQueue = doctorAppointments.filter(a => a.date === todayDate);

  // Start Consultation
  const handleStartConsultation = (apt: Appointment) => {
    setSelectedAppointment(apt);
    db.updateAppointmentStatus(apt.id, 'in_consultation');
    setActiveTab('consultation');

    // Prepopulate symptoms
    if (apt.symptoms) {
      setRxSymptoms(apt.symptoms.join(', '));
    }

    // Audit log
    const pat = db.getPatientById(apt.patient_id);
    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: currentDoctor.id,
      actorName: currentDoctor.name,
      actorRole: 'doctor',
      action: 'VIEW_PATIENT_RECORD',
      targetPatientUhid: pat?.uhid,
      targetPatientName: pat?.fullName,
      ipAddress: '10.0.4.18 (Doctor Terminal)',
      details: `Started OPD consultation with ${pat?.fullName} for Token #${apt.tokenNumber}`
    });
  };

  // Add Medication Row
  const handleAddMedication = () => {
    if (!newMed.name.trim()) return;
    setMedications([...medications, newMed]);
    setNewMed({
      name: '',
      dosage: '500 mg',
      frequency: '1-0-1',
      duration: '5 Days',
      timing: 'After Food',
      instructions: 'As directed'
    });
  };

  // Remove Medication Row
  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  // Add Lab Test Order
  const handleAddLabTest = () => {
    if (!newLabTestInput.trim()) return;
    setRxLabOrders([...rxLabOrders, newLabTestInput.trim()]);
    setNewLabTestInput('');
  };

  // Finalize Consultation & Issue Prescription
  const handleFinalizeConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const patient = db.getPatientById(selectedAppointment.patient_id);

    const newPrescription: Prescription = {
      id: `rx-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      hospital_id: currentHospital.id,
      appointment_id: selectedAppointment.id,
      patient_id: selectedAppointment.patient_id,
      doctor_id: currentDoctor.id,
      date: todayDate,
      diagnosis: rxDiagnosis,
      icdCode: rxIcdCode,
      symptoms: rxSymptoms.split(',').map(s => s.trim()).filter(Boolean),
      clinicalNotes: rxClinicalNotes,
      medications: medications,
      labTestsOrdered: rxLabOrders,
      advice: rxAdvice,
      followUpDate: rxFollowUpDate,
      isDispensed: false
    };

    db.addPrescription(newPrescription);
    db.updateAppointmentStatus(selectedAppointment.id, 'completed');

    // Notify patient via WhatsApp
    if (patient) {
      db.sendWhatsAppNotification({
        hospital_id: currentHospital.id,
        recipientPhone: patient.phone.startsWith('+91') ? patient.phone : `+91 ${patient.phone}`,
        recipientName: patient.fullName,
        templateName: 'prescription_shared',
        messageText: `Namaste ${patient.fullName}, your digital prescription by ${currentDoctor.name} has been generated. You can collect your medicines directly from our 24x7 In-House Pharmacy using UHID: ${patient.uhid}. Hospital: ${currentHospital.name}.`,
        variables: {
          patient_name: patient.fullName,
          doctor_name: currentDoctor.name,
          uhid: patient.uhid
        }
      });
    }

    // Audit Log
    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: currentDoctor.id,
      actorName: currentDoctor.name,
      actorRole: 'doctor',
      action: 'CREATE_PRESCRIPTION',
      targetPatientUhid: patient?.uhid,
      targetPatientName: patient?.fullName,
      ipAddress: '10.0.4.18 (Doctor Terminal)',
      details: `Finalized prescription #${newPrescription.id} with ${medications.length} medications and ${rxLabOrders.length} test orders.`
    });

    setSelectedPrintRx(newPrescription);
    alert('Prescription successfully finalized! Transmitted to Central Pharmacy & Patient Portal.');
    setActiveTab('queue');
  };

  // Mark No-Show
  const handleMarkNoShow = (aptId: string) => {
    db.updateAppointmentStatus(aptId, 'no_show');
    alert('Appointment marked as No-Show.');
  };

  // Save Doctor Schedule
  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...availability,
      isLeaveToday: leaveToggled
    };
    db.updateDoctorAvailability(currentDoctor.id, updated);
    setAvailability(updated);
    alert('Doctor OPD schedule and leave settings updated successfully.');
  };

  const selectedPatient = selectedAppointment ? db.getPatientById(selectedAppointment.patient_id) : null;
  const patientPastRx = selectedPatient ? db.getPrescriptions(currentHospital.id).filter(p => p.patient_id === selectedPatient.id) : [];
  const patientPastLabs = selectedPatient ? db.getLabReports(currentHospital.id).filter(r => r.patient_id === selectedPatient.id) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Doctor Header Banner */}
      <div className="bg-white border border-emerald-100 rounded-[28px] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentDoctor.avatar}
              alt={currentDoctor.name}
              className="w-16 h-16 rounded-2xl object-cover border border-emerald-200 shadow-xs"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{currentDoctor.name}</h2>
                <span className="bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {currentDoctor.registrationNumber}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">{currentDoctor.qualification}</p>
              <p className="text-xs text-emerald-700">
                {currentDoctor.specialization} • <strong className="text-slate-900">{currentDoctor.opdRoom}</strong>
              </p>
            </div>
          </div>

          {/* OPD Live Counters */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Today's OPD Queue</span>
              <span className="text-lg font-black text-slate-900">{todayQueue.length} Patients</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Completed</span>
              <span className="text-lg font-black text-emerald-700">
                {todayQueue.filter(a => a.queueStatus === 'completed').length}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Waiting</span>
              <span className="text-lg font-black text-amber-600">
                {todayQueue.filter(a => a.queueStatus === 'waiting' || a.queueStatus === 'scheduled').length}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-emerald-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
        {[
          { id: 'queue', label: `OPD Appointment Queue (${todayQueue.length})`, icon: <Clock className="w-4 h-4" /> },
          { id: 'consultation', label: selectedAppointment ? `Active Consultation: Token #${selectedAppointment.tokenNumber}` : 'Clinical EMR Desk', icon: <Stethoscope className="w-4 h-4" /> },
          { id: 'history', label: 'Patient Medical History', icon: <FileText className="w-4 h-4" /> },
          { id: 'availability', label: 'OPD Schedule & OT Blocks', icon: <Calendar className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OPD Appointment Queue */}
      {activeTab === 'queue' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Today's OPD Queue Roster</h3>
              <p className="text-xs text-slate-500">Manage waiting queue, vitals recordings, and call patients in sequence.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">OPD Room: <strong className="text-slate-800">{currentDoctor.opdRoom}</strong></span>
            </div>
          </div>

          <div className="divide-y divide-emerald-50">
            {todayQueue.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No appointments queued for today. Reception walk-ins or patient bookings will appear here.
              </div>
            ) : (
              todayQueue.map((apt) => {
                const pat = db.getPatientById(apt.patient_id);
                return (
                  <div key={apt.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                          Token #{apt.tokenNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{pat?.fullName || 'Walk-in Patient'}</h4>
                        <span className="text-xs text-slate-500">
                          ({pat?.age} Yrs • {pat?.gender} • Blood: <strong className="text-rose-600">{pat?.bloodGroup}</strong>)
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          UHID: {pat?.uhid}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        Slot: <strong className="text-slate-800">{apt.timeSlot}</strong> • Reason: <span className="text-slate-500 italic">{apt.reason}</span>
                      </p>

                      {/* Vitals Summary */}
                      {apt.vitals ? (
                        <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                          <span>BP: <strong className="text-slate-900">{apt.vitals.bp}</strong></span>
                          <span>Pulse: <strong className="text-emerald-700">{apt.vitals.pulse} bpm</strong></span>
                          <span>SpO2: <strong className="text-teal-700">{apt.vitals.spo2}%</strong></span>
                          <span>Temp: <strong className="text-amber-700">{apt.vitals.temp}°F</strong></span>
                          <span>Weight: <strong className="text-slate-800">{apt.vitals.weight} kg</strong></span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-medium">⚠️ Vitals pending at nurse station</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs uppercase font-bold px-3 py-1 rounded-xl ${
                        apt.queueStatus === 'in_consultation'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : apt.queueStatus === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : apt.queueStatus === 'waiting'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.queueStatus.replace('_', ' ')}
                      </span>

                      {apt.queueStatus !== 'completed' && (
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>{apt.queueStatus === 'in_consultation' ? 'Resume EMR' : 'Call & Consult'}</span>
                        </button>
                      )}

                      {apt.queueStatus === 'waiting' && (
                        <button
                          onClick={() => handleMarkNoShow(apt.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Mark No-Show"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Active Clinical Consultation & Prescription Builder */}
      {activeTab === 'consultation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Patient EMR Context & History Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-emerald-100 rounded-[28px] p-5 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Patient Health Profile</span>
              </h4>

              {selectedPatient ? (
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900 text-sm">{selectedPatient.fullName}</p>
                    <p className="text-slate-500 font-mono text-[11px] mt-0.5">UHID: {selectedPatient.uhid}</p>
                    <p className="text-slate-600 mt-1">
                      {selectedPatient.age} Yrs • {selectedPatient.gender} • Blood Group: <strong className="text-rose-600">{selectedPatient.bloodGroup}</strong>
                    </p>
                  </div>

                  {/* Allergies Alert */}
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl space-y-1">
                    <span className="font-bold text-rose-800 block text-[10px] uppercase">⚠️ Known Drug Allergies</span>
                    {selectedPatient.allergies.map((a, i) => (
                      <p key={i} className="text-rose-700 text-[11px] font-medium">• {a}</p>
                    ))}
                  </div>

                  {/* Chronic Conditions */}
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1">
                    <span className="font-bold text-amber-800 block text-[10px] uppercase">Chronic Conditions</span>
                    {selectedPatient.chronicConditions.map((c, i) => (
                      <p key={i} className="text-amber-700 text-[11px] font-medium">• {c}</p>
                    ))}
                  </div>

                  {/* Past Prescriptions History */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block text-[11px]">Previous Consultations ({patientPastRx.length})</span>
                    {patientPastRx.map((prx) => (
                      <div key={prx.id} className="text-[11px] pb-1.5 border-b border-slate-200 last:border-0">
                        <div className="flex justify-between text-slate-500">
                          <span>{prx.date}</span>
                          <span className="font-mono text-[10px]">{prx.id}</span>
                        </div>
                        <p className="text-slate-800 font-medium">{prx.diagnosis}</p>
                      </div>
                    ))}
                  </div>

                  {/* Diagnostic Lab Reports & Scans */}
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-900 block text-[11px]">Diagnostic Reports & Scans</span>
                    {(() => {
                      const patReports = db.getLabReports(currentHospital.id).filter(r => r.patient_id === selectedPatient.id);
                      if (patReports.length === 0) {
                        return <p className="text-[10px] text-slate-500 italic">No lab reports on record for this patient.</p>;
                      }
                      return patReports.map((rep) => (
                        <div key={rep.id} className="bg-white p-2 rounded-lg border border-emerald-100 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 truncate">{rep.testName}</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              {rep.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">Pathologist: {rep.pathologist}</p>
                          <button
                            type="button"
                            onClick={() => setSelectedLabReport(rep)}
                            className="w-full mt-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-1 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                          >
                            <FileText className="w-3 h-3" />
                            <span>{rep.pdfUrl ? 'View PDF & NABL Report' : 'View NABL Values'}</span>
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Select a patient from the OPD Queue to begin consultation.</p>
              )}
            </div>
          </div>

          {/* Right 2 Columns: Prescription & Order Writing Desk */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleFinalizeConsultation} className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-5 text-xs shadow-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Digital Prescription Builder (EMR)</h3>
                  <p className="text-xs text-slate-500">Prescribe Indian Pharmacopoeia approved formulations & order diagnostic tests.</p>
                </div>
                <span className="font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                  NABH Compliant Rx
                </span>
              </div>

              {/* Diagnosis & ICD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Provisional / Final Diagnosis</label>
                  <input
                    type="text"
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis, Type-2 Diabetes Mellitus"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-emerald-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">ICD-10 Code Classification</label>
                  <input
                    type="text"
                    value={rxIcdCode}
                    onChange={(e) => setRxIcdCode(e.target.value)}
                    placeholder="e.g. I10 (Essential Hypertension)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-emerald-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Chief Complaints & Clinical Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Presenting Symptoms & Complaints</label>
                  <textarea
                    rows={2}
                    value={rxSymptoms}
                    onChange={(e) => setRxSymptoms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Physical Examination / Clinical Notes</label>
                  <textarea
                    rows={2}
                    value={rxClinicalNotes}
                    onChange={(e) => setRxClinicalNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Rx Medications Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-serif text-lg font-black">℞</span>
                    <span>Prescribed Medications ({medications.length})</span>
                  </label>
                </div>

                {/* Medication Rows */}
                <div className="space-y-2">
                  {medications.map((med, index) => (
                    <div key={index} className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-2">
                          <p className="font-bold text-slate-900 text-xs">{med.name}</p>
                          <p className="text-[10px] text-slate-500">{med.dosage}</p>
                        </div>
                        <div>
                          <span className="font-mono text-emerald-800 font-bold text-xs">{med.frequency}</span>
                          <p className="text-[10px] text-slate-500">{med.duration}</p>
                        </div>
                        <div>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                            {med.timing}
                          </span>
                          <p className="text-[10px] text-slate-500 truncate">{med.instructions}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Medication Inputs */}
                <div className="bg-slate-50/60 p-3 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block">+ Add New Drug Formulation</span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      placeholder="Medicine Name (e.g. Tab. Dolo 650)"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      className="sm:col-span-2 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800"
                    />
                    <select
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800"
                    >
                      <option value="1-0-1 (Morning & Night)">1-0-1 (Twice daily)</option>
                      <option value="1-0-0 (Morning)">1-0-0 (Once daily morning)</option>
                      <option value="0-0-1 (Night)">0-0-1 (Night time)</option>
                      <option value="1-1-1 (Thrice daily)">1-1-1 (Thrice daily)</option>
                      <option value="SOS (As needed)">SOS (As needed)</option>
                    </select>

                    <select
                      value={newMed.timing}
                      onChange={(e) => setNewMed({ ...newMed, timing: e.target.value as any })}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800"
                    >
                      <option value="After Food">After Food</option>
                      <option value="Before Food">Before Food</option>
                      <option value="Empty Stomach">Empty Stomach</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Ordered Lab Investigations */}
              <div className="space-y-2 pt-2">
                <label className="text-slate-700 font-semibold block">Order Diagnostic Pathology & Radiology Tests</label>
                <div className="flex flex-wrap gap-2">
                  {rxLabOrders.map((test, i) => (
                    <span key={i} className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded-xl flex items-center gap-1.5">
                      <span>🧪 {test}</span>
                      <button
                        type="button"
                        onClick={() => setRxLabOrders(rxLabOrders.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLabTestInput}
                    onChange={(e) => setNewLabTestInput(e.target.value)}
                    placeholder="Enter lab test (e.g. Serum Electrolytes, HbA1c, Chest X-Ray PA)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddLabTest}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl font-semibold transition"
                  >
                    + Add Test
                  </button>
                </div>
              </div>

              {/* Advice & Follow Up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Lifestyle & Dietary Advice</label>
                  <input
                    type="text"
                    value={rxAdvice}
                    onChange={(e) => setRxAdvice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Follow-Up Review Date</label>
                  <input
                    type="date"
                    value={rxFollowUpDate}
                    onChange={(e) => setRxFollowUpDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 shadow-xs text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Finalize Rx & Dispatch to Pharmacy & WhatsApp</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* TAB 3: Doctor Availability & OT Blocks */}
      {activeTab === 'availability' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="font-bold text-base text-slate-900">OPD Availability & Slot Configuration</h3>
            <p className="text-xs text-slate-500">Configure weekly OPD consultation timings, emergency leaves, and scheduled OT blocks.</p>
          </div>

          <form onSubmit={handleSaveAvailability} className="max-w-2xl space-y-4 text-xs">
            
            {/* Leave Today Switch */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">Mark On Leave / Unavailable Today</span>
                <span className="text-slate-500">When enabled, no new online/reception tokens will be accepted for today.</span>
              </div>
              <button
                type="button"
                onClick={() => setLeaveToggled(!leaveToggled)}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${leaveToggled ? 'bg-rose-600' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${leaveToggled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">OPD Start Time</label>
                <input
                  type="text"
                  value={availability.startTime}
                  onChange={(e) => setAvailability({ ...availability, startTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">OPD End Time</label>
                <input
                  type="text"
                  value={availability.endTime}
                  onChange={(e) => setAvailability({ ...availability, endTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            {/* Slot Duration */}
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Average Consultation Slot Duration (Minutes)</label>
              <input
                type="number"
                value={availability.slotDurationMinutes}
                onChange={(e) => setAvailability({ ...availability, slotDurationMinutes: parseInt(e.target.value) || 15 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white font-mono"
              />
            </div>

            {/* OT Blocks */}
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Scheduled Operation Theatre (OT) Blocks</label>
              <input
                type="text"
                value={availability.otBlocks?.join(', ') || '14:00 - 16:30 (Cath Lab Procedures)'}
                onChange={(e) => setAvailability({ ...availability, otBlocks: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-xs"
            >
              Save Schedule Settings
            </button>

          </form>
        </div>
      )}

      {/* TAB 4: Patient Medical History Lookup */}
      {activeTab === 'history' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Hospital EMR Patient Lookup</h3>
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search by UHID, Name, or Phone..."
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-3">
            {db.getPatients(currentHospital.id)
              .filter(p => !patientSearchQuery || p.fullName.toLowerCase().includes(patientSearchQuery.toLowerCase()) || p.uhid.toLowerCase().includes(patientSearchQuery.toLowerCase()))
              .map((pat) => (
                <div key={pat.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{pat.fullName}</span>
                      <span className="font-mono text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{pat.uhid}</span>
                      <span className="text-slate-500">{pat.age} Y / {pat.gender}</span>
                    </div>
                    <p className="text-slate-500 mt-1">Ph: +91 {pat.phone} • Address: {pat.address}</p>
                    <p className="text-rose-600 text-[11px] mt-0.5">Allergies: {pat.allergies.join(', ')}</p>
                  </div>

                  <button
                    onClick={() => {
                      const foundApt = db.getAppointments(currentHospital.id).find(a => a.patient_id === pat.id);
                      if (foundApt) {
                        handleStartConsultation(foundApt);
                      } else {
                        alert('No active appointment record found for this patient today.');
                      }
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold transition"
                  >
                    Open Clinical Record
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Prescription Preview & Print Modal */}
      {selectedPrintRx && (
        <PrescriptionPrintModal
          isOpen={!!selectedPrintRx}
          onClose={() => setSelectedPrintRx(null)}
          prescription={selectedPrintRx}
        />
      )}

      {/* Lab Report Modal */}
      {selectedLabReport && (
        <LabReportModal
          isOpen={!!selectedLabReport}
          onClose={() => setSelectedLabReport(null)}
          report={selectedLabReport}
        />
      )}

    </div>
  );
};
