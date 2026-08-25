import React, { useState } from 'react';
import { LabReport, Patient, Doctor, Hospital } from '../../types';
import { db } from '../../services/mockDatabase';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Download, 
  MessageSquare, 
  FileText, 
  Eye, 
  FileCheck,
  ExternalLink
} from 'lucide-react';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: LabReport;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  if (!isOpen) return null;

  const hospital: Hospital = db.getHospitalById(report.hospital_id) || db.getHospitals()[0];
  const patient: Patient | undefined = db.getPatientById(report.patient_id);
  const doctor: Doctor | undefined = db.getDoctorById(report.doctor_id);

  const [activeView, setActiveView] = useState<'nabl' | 'pdf'>(report.pdfUrl ? 'pdf' : 'nabl');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (report.pdfUrl) {
      // Trigger download for uploaded PDF or data URL
      const link = document.createElement('a');
      link.href = report.pdfUrl;
      link.download = report.pdfFileName || `${report.testName.replace(/\s+/g, '_')}_${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  const handleSendWhatsApp = () => {
    db.sendWhatsAppNotification({
      hospital_id: report.hospital_id,
      recipientPhone: patient?.phone ? `+91 ${patient.phone}` : '+91 98765 43210',
      recipientName: patient?.fullName || 'Patient',
      templateName: 'lab_report_ready',
      messageText: `Dear ${patient?.fullName || 'Patient'}, your verified lab report for "${report.testName}" is now available. Signed off by ${report.pathologist}. Download from your portal.`,
      variables: { test_name: report.testName }
    });
    alert('WhatsApp notification with secure report link dispatched successfully to patient!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Control Bar */}
        <div className="no-print bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">Diagnostic Investigation Report</span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {report.id}
              </span>
            </div>

            {/* View Mode Toggle if PDF is uploaded */}
            {report.pdfUrl && (
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
                <button
                  onClick={() => setActiveView('pdf')}
                  className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                    activeView === 'pdf' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Uploaded PDF</span>
                </button>
                <button
                  onClick={() => setActiveView('nabl')}
                  className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                    activeView === 'nabl' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>NABL Clinical Format</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Resend WhatsApp Alert"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Alert</span>
            </button>
            <button
              onClick={handleDownload}
              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Download Report PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          
          {/* UPLOADED PDF VIEWER MODE */}
          {activeView === 'pdf' && report.pdfUrl ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{report.pdfFileName || `${report.testName} - Report.pdf`}</h4>
                    <p className="text-xs text-slate-500">
                      Uploaded by Pathology Department • Size: {report.pdfFileSize || '1.4 MB'} • Verified NABL Standard
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={report.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                </div>
              </div>

              {/* Embedded PDF iframe / Interactive Preview Container */}
              <div className="w-full h-[650px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex flex-col items-center justify-center relative">
                {report.pdfUrl.startsWith('data:application/pdf') || report.pdfUrl.endsWith('.pdf') ? (
                  <iframe
                    src={report.pdfUrl}
                    title="PDF Lab Report"
                    className="w-full h-full border-0"
                  />
                ) : report.pdfUrl.startsWith('data:image') || report.pdfUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                  <img 
                    src={report.pdfUrl} 
                    alt="Lab Report Scan" 
                    className="max-h-full max-w-full object-contain p-2"
                  />
                ) : (
                  <iframe
                    src={report.pdfUrl}
                    title="Document Viewer"
                    className="w-full h-full border-0"
                  />
                )}
              </div>
            </div>
          ) : (
            /* STANDARD NABL REPORT CANVAS */
            <div className="print-area max-w-3xl mx-auto p-8 bg-white text-slate-900 font-sans rounded-2xl shadow-md border border-slate-200">
              
              {/* Header */}
              <div className="border-b-2 border-slate-800 pb-4 mb-4 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-800 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                    🧪
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-slate-950 uppercase">{hospital.name}</h1>
                    <p className="text-xs font-bold text-emerald-800">DEPARTMENT OF LABORATORY MEDICINE & PATHOLOGY</p>
                    <p className="text-[10px] text-slate-500">NABL Accredited Medical Laboratory (ISO 15189:2012 Certified)</p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-600">
                  <p className="font-bold text-slate-900">Certificate No: NABL-M-4819</p>
                  <p>Sample ID: <span className="font-mono font-bold text-slate-900">{report.id.toUpperCase()}</span></p>
                  <p>Barcode: <span className="font-mono text-slate-800">||| | ||||| || |||</span></p>
                </div>
              </div>

              {/* Patient Details Demographics Table */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mb-5">
                <div>
                  <p className="text-slate-500 text-[10px]">PATIENT NAME</p>
                  <p className="font-bold text-slate-900">{patient?.fullName || 'Rahul Sharma'}</p>
                  <p className="text-slate-600 mt-1 text-[10px]">UHID: <span className="font-mono font-bold text-emerald-800">{patient?.uhid || 'PLS-2025-04821'}</span></p>
                </div>

                <div>
                  <p className="text-slate-500 text-[10px]">AGE / GENDER</p>
                  <p className="font-bold text-slate-900">{patient?.age} Yrs / {patient?.gender}</p>
                  <p className="text-slate-600 mt-1 text-[10px]">Ref By: <span className="font-semibold text-slate-800">{doctor?.name || 'Dr. Self / OPD'}</span></p>
                </div>

                <div className="text-right">
                  <p className="text-slate-500 text-[10px]">COLLECTION & REPORT TIME</p>
                  <p className="font-medium text-slate-800">{report.sampleCollectedAt}</p>
                  <p className="text-slate-600 text-[10px]">Reported: {report.reportedAt}</p>
                </div>
              </div>

              {/* Test Title */}
              <div className="bg-slate-900 text-white px-3 py-1.5 rounded font-bold text-xs uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Investigation: {report.testName}</span>
                <span className="text-[10px] text-emerald-400 font-mono">STATUS: {report.status.toUpperCase()}</span>
              </div>

              {/* Parameters Table */}
              <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden mb-5">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2.5">Test Parameter</th>
                    <th className="p-2.5 text-center">Observed Value</th>
                    <th className="p-2.5 text-center">Unit</th>
                    <th className="p-2.5 text-center">Biological Reference Interval</th>
                    <th className="p-2.5 text-center">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.parameters.map((param, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                      <td className="p-2.5 font-medium text-slate-900">{param.name}</td>
                      <td className="p-2.5 text-center font-bold font-mono">
                        <span className={param.flag !== 'normal' ? 'text-amber-700 font-extrabold' : 'text-slate-900'}>
                          {param.value}
                        </span>
                      </td>
                      <td className="p-2.5 text-center text-slate-600 font-mono text-[11px]">{param.unit}</td>
                      <td className="p-2.5 text-center text-slate-600 font-mono text-[11px]">{param.referenceRange}</td>
                      <td className="p-2.5 text-center">
                        {param.flag === 'normal' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Normal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" /> {param.flag.toUpperCase()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Clinical Impression / Conclusion */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mb-8">
                <span className="font-bold text-slate-900 block uppercase text-[10px] tracking-wider mb-1">
                  Pathological Impression & Interpretation:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {report.conclusion}
                </p>
              </div>

              {/* End of Report / Signatures */}
              <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest my-4">
                *** End of Diagnostic Report ***
              </div>

              <div className="border-t-2 border-slate-200 pt-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <QrCode className="w-12 h-12 text-slate-800" />
                  <div className="text-[9px] text-slate-500">
                    <p>Digitally Authenticated Report</p>
                    <p>NABL Calibration Tested Daily</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-emerald-900 font-bold text-xs mb-1">
                    {report.pathologist}
                  </div>
                  <p className="text-[11px] font-bold text-slate-900">Consultant Pathologist & Laboratory Director</p>
                  <p className="text-[10px] text-slate-500">NABL Quality Assessor</p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
