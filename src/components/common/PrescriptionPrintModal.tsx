import React from 'react';
import { Prescription, Patient, Doctor, Hospital } from '../../types';
import { db } from '../../services/mockDatabase';
import { Printer, Download, X, ShieldCheck, QrCode, Phone, MapPin, Calendar, UserCheck } from 'lucide-react';

interface PrescriptionPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription;
}

export const PrescriptionPrintModal: React.FC<PrescriptionPrintModalProps> = ({
  isOpen,
  onClose,
  prescription
}) => {
  if (!isOpen) return null;

  const hospital: Hospital = db.getHospitalById(prescription.hospital_id) || db.getHospitals()[0];
  const doctor: Doctor | undefined = db.getDoctorById(prescription.doctor_id);
  const patient: Patient | undefined = db.getPatientById(prescription.patient_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Action Header */}
        <div className="no-print bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-sm">Digital Prescription Document</span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              {prescription.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area - Official Hospital Letterhead */}
        <div className="print-area flex-1 overflow-y-auto p-8 bg-white text-slate-900 font-sans">
          
          {/* Top Letterhead Banner */}
          <div className="border-b-2 border-emerald-700 pb-4 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md">
                  +
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-emerald-950 uppercase">
                    {hospital.name}
                  </h1>
                  <p className="text-xs font-semibold text-emerald-700">{hospital.tagline}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 inline" />
                    {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-600">
                <p className="font-bold text-slate-900">NABH Accredited Tertiary Center</p>
                <p className="flex items-center justify-end gap-1 text-[11px]">
                  <Phone className="w-3 h-3 text-emerald-700" />
                  Emergency: {hospital.emergencyPhone}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">GSTIN: {hospital.gstin}</p>
              </div>
            </div>
          </div>

          {/* Doctor & Patient Information Bar */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 text-xs">
            <div>
              <p className="font-bold text-sm text-slate-900">{doctor?.name || 'Dr. Specialist'}</p>
              <p className="text-slate-700 font-medium text-[11px]">{doctor?.qualification}</p>
              <p className="text-emerald-800 text-[11px] font-semibold">Reg. No: {doctor?.registrationNumber}</p>
              <p className="text-slate-500 text-[11px]">{doctor?.specialization}</p>
            </div>

            <div className="border-l border-slate-200 pl-4 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900">{patient?.fullName || 'Rahul Sharma'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UHID / Patient ID:</span>
                <span className="font-mono font-bold text-emerald-800">{patient?.uhid || 'PLS-2025-04821'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Age / Gender / Blood:</span>
                <span className="font-medium text-slate-800">{patient?.age} Yrs / {patient?.gender} / {patient?.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-800">{prescription.date}</span>
              </div>
            </div>
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-2 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200/80">
              <span className="font-bold text-xs text-emerald-950 uppercase tracking-wide min-w-[100px]">Diagnosis:</span>
              <div>
                <p className="text-xs font-bold text-emerald-950">{prescription.diagnosis}</p>
                {prescription.icdCode && (
                  <p className="text-[11px] text-emerald-800 font-mono">ICD-10: {prescription.icdCode}</p>
                )}
              </div>
            </div>

            {prescription.clinicalNotes && (
              <div className="text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px] block mb-1">Clinical Notes & Observations:</span>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed italic">
                  "{prescription.clinicalNotes}"
                </p>
              </div>
            )}
          </div>

          {/* Rx Medications Table */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-serif font-black text-emerald-900">℞</span>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Prescribed Medications</h3>
            </div>

            <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Medicine Brand / Strength</th>
                  <th className="p-2">Dosage & Frequency</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">Food Timing & Special Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {prescription.medications.map((med, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-2 font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-2">
                      <p className="font-bold text-slate-900">{med.name}</p>
                      <p className="text-[10px] text-slate-500">{med.dosage}</p>
                    </td>
                    <td className="p-2 font-medium text-emerald-900">{med.frequency}</td>
                    <td className="p-2 font-medium text-slate-700">{med.duration}</td>
                    <td className="p-2">
                      <span className="inline-block bg-slate-200 text-slate-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        {med.timing}
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{med.instructions}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ordered Diagnostic Lab Tests */}
          {prescription.labTestsOrdered && prescription.labTestsOrdered.length > 0 && (
            <div className="mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide mb-1.5 flex items-center gap-1.5">
                <span>🧪 Ordered Diagnostic Investigations / Scans:</span>
              </h4>
              <ul className="grid grid-cols-2 gap-1.5 pl-4 list-disc text-slate-800 font-medium">
                {prescription.labTestsOrdered.map((test, idx) => (
                  <li key={idx}>{test}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Advice & Follow up */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 mb-8 text-xs">
            <div>
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block mb-1">General Advice & Diet:</span>
              <p className="text-slate-700 leading-relaxed">{prescription.advice || 'Drink plenty of fluids. Low salt, balanced diet. Avoid strenuous activity.'}</p>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block mb-1">Next Follow-Up Date:</span>
              <p className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {prescription.followUpDate || 'SOS / In 7 Days'}
              </p>
            </div>
          </div>

          {/* Signature & QR Footer */}
          <div className="border-t-2 border-slate-200 pt-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border border-slate-300 p-1 rounded bg-white flex flex-col items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
                <span className="text-[7px] font-mono text-slate-500">Scan to Verify</span>
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <p>Digital EMR System Generated Prescription</p>
                <p>PulseHealth Hospital Management System (v4.2)</p>
                <p>Medication safety checked against Indian Pharmacopoeia</p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-emerald-800 text-sm font-bold tracking-wider mb-1">
                {doctor?.name || 'Dr. Rajesh Sharma'}
              </div>
              <p className="text-[11px] font-bold text-slate-900">Authorized Medical Practitioner</p>
              <p className="text-[10px] text-slate-500">Reg: {doctor?.registrationNumber}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
