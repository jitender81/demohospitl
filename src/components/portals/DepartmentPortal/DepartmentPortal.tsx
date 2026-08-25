import React, { useState } from 'react';
import { useAuth } from '../../../services/authContext';
import { db } from '../../../services/mockDatabase';
import { 
  LabReport, 
  LabParameter, 
  Prescription, 
  InventoryItem,
  Patient,
  Doctor 
} from '../../../types';
import { 
  FlaskConical, 
  Pill, 
  Package, 
  Plus, 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Send,
  Upload,
  Sparkles,
  Download,
  FileCheck,
  FileSpreadsheet,
  FilePlus2,
  Trash2
} from 'lucide-react';
import { LabReportModal } from '../../common/LabReportModal';
import { PrescriptionPrintModal } from '../../common/PrescriptionPrintModal';

export const DepartmentPortal: React.FC = () => {
  const { currentHospital } = useAuth();

  const [activeTab, setActiveTab] = useState<'lab' | 'pharmacy' | 'inventory'>('lab');
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [inventorySearch, setInventorySearch] = useState('');

  // Lab Report Generation Form State
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [labPatientId, setLabPatientId] = useState('pat-rahul-01');
  const [labDoctorId, setLabDoctorId] = useState('doc-rajesh');
  const [labTestName, setLabTestName] = useState('Complete Blood Count (CBC) with ESR');
  const [labCategory, setLabCategory] = useState<'blood' | 'radiology' | 'biochemistry' | 'pathology' | 'urine'>('blood');
  const [labConclusion, setLabConclusion] = useState('Haematological parameters within physiological normal limits.');
  const [labPathologist, setLabPathologist] = useState('Dr. Meenakshi Soni, MD (Pathology)');
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string>('');
  const [uploadedPdfName, setUploadedPdfName] = useState<string>('');
  const [uploadedPdfSize, setUploadedPdfSize] = useState<string>('');

  const [labParams, setLabParams] = useState<LabParameter[]>([
    { name: 'Haemoglobin (Hb)', value: '14.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', flag: 'normal' },
    { name: 'Total Leucocyte Count (TLC)', value: '6,800', unit: '/cu.mm', referenceRange: '4,000 - 11,000', flag: 'normal' },
    { name: 'Platelet Count', value: '2.80', unit: 'Lakhs/cumm', referenceRange: '1.50 - 4.50', flag: 'normal' },
    { name: 'Erythrocyte Sed. Rate (ESR)', value: '8', unit: 'mm/1st hr', referenceRange: '0 - 15', flag: 'normal' }
  ]);

  // Inventory Add Item State
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [newInvName, setNewInvName] = useState('');
  const [newInvGeneric, setNewInvGeneric] = useState('');
  const [newInvBatch, setNewInvBatch] = useState('BAT-2025-X');
  const [newInvExpiry, setNewInvExpiry] = useState('2027-06-30');
  const [newInvStock, setNewInvStock] = useState<number>(200);
  const [newInvThreshold, setNewInvThreshold] = useState<number>(50);
  const [newInvPrice, setNewInvPrice] = useState<number>(120);

  // Queries
  const allLabReports = db.getLabReports(currentHospital.id);
  const allPrescriptions = db.getPrescriptions(currentHospital.id);
  const allInventory = db.getInventory(currentHospital.id);
  const lowStockItems = allInventory.filter(i => i.currentStock <= i.minThreshold);

  // Handle PDF File Upload via input
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;
    
    setUploadedPdfName(file.name);
    setUploadedPdfSize(sizeFormatted);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedPdfUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate Sample PDF Document Placeholder (for quick testing)
  const handleGenerateSamplePdf = () => {
    // Standard PDF placeholder or high-res document simulation
    const sampleData = `data:text/html;charset=utf-8,${encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>NABL Diagnostic Report - ${labTestName}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #fff; color: #1e293b; }
          .header { border-bottom: 2px solid #065f46; padding-bottom: 20px; display: flex; justify-content: space-between; }
          .title { font-size: 22px; font-weight: bold; color: #065f46; margin: 0; }
          .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
          .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .normal { color: #065f46; font-weight: bold; }
          .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${currentHospital.name}</div>
            <div class="sub">Department of Diagnostic Pathology & Molecular Medicine • NABL Accredited</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #64748b;">
            <div>Sample ID: <strong>LAB-2025-SCAN</strong></div>
            <div>Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div class="patient-box">
          <div>Patient: <strong>${db.getPatientById(labPatientId)?.fullName || 'Patient'}</strong> (UHID: ${db.getPatientById(labPatientId)?.uhid || 'PLS-2025'})</div>
          <div>Referring Consultant: <strong>${db.getDoctorById(labDoctorId)?.name || 'Consultant'}</strong></div>
          <div>Investigation: <strong>${labTestName}</strong></div>
          <div>Status: <strong style="color:#059669">VERIFIED / READY</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Test Parameter</th>
              <th>Observed Value</th>
              <th>Unit</th>
              <th>Reference Interval</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            ${labParams.map(p => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td><strong>${p.value}</strong></td>
                <td>${p.unit}</td>
                <td>${p.referenceRange}</td>
                <td class="normal">${p.flag.toUpperCase()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 25px; padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 13px;">
          <strong>Pathological Interpretation:</strong> ${labConclusion}
        </div>

        <div class="footer">
          <div>Digitally verified by NABL Laboratory Information System</div>
          <div style="text-align: right;">
            <div style="font-weight: bold; color: #065f46;">${labPathologist}</div>
            <div>Consultant Pathologist</div>
          </div>
        </div>
      </body>
      </html>
    `)}`;
    setUploadedPdfUrl(sampleData);
    setUploadedPdfName(`${labTestName.replace(/\s+/g, '_')}_OfficialReport.pdf`);
    setUploadedPdfSize('1.2 MB');
  };

  // Submit New Diagnostic Report
  const handleSaveLabReport = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = db.getPatientById(labPatientId);

    const newReport: LabReport = {
      id: `lab-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      hospital_id: currentHospital.id,
      patient_id: labPatientId,
      doctor_id: labDoctorId,
      department_id: 'dept-lab',
      testName: labTestName,
      testCategory: labCategory,
      sampleCollectedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      reportedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'ready',
      parameters: labParams,
      conclusion: labConclusion,
      pathologist: labPathologist,
      isWhatsAppSent: true,
      pdfUrl: uploadedPdfUrl || undefined,
      pdfFileName: uploadedPdfName || undefined,
      pdfFileSize: uploadedPdfSize || undefined
    };

    db.addLabReport(newReport);

    // Send WhatsApp notification to patient
    if (patient) {
      db.sendWhatsAppNotification({
        hospital_id: currentHospital.id,
        recipientPhone: patient.phone.startsWith('+91') ? patient.phone : `+91 ${patient.phone}`,
        recipientName: patient.fullName,
        templateName: 'lab_report_ready',
        messageText: `Dear ${patient.fullName}, your diagnostic pathology report for "${labTestName}" is verified and ready with attached PDF. Signed off by ${labPathologist}. Hospital: ${currentHospital.name}.`,
        variables: {
          patient_name: patient.fullName,
          test_name: labTestName,
          pathologist_name: labPathologist,
          portal_link: 'https://pulsehealth.servegame.com/reports'
        }
      });
    }

    setShowNewReportModal(false);
    setUploadedPdfUrl('');
    setUploadedPdfName('');
    setUploadedPdfSize('');
    alert(`Report for "${labTestName}" published with PDF document & WhatsApp notification dispatched!`);
  };

  // Mark prescription as dispensed
  const handleDispenseRx = (prescription: Prescription) => {
    db.dispensePrescription(prescription.id);
    alert(`Prescription #${prescription.id} successfully marked as DISPENSED. Pharmacy inventory updated.`);
  };

  // Add Inventory item
  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName.trim()) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      hospital_id: currentHospital.id,
      department: 'pharmacy',
      itemName: newInvName,
      genericName: newInvGeneric || newInvName,
      category: 'Oral Formulations',
      batchNumber: newInvBatch,
      expiryDate: newInvExpiry,
      currentStock: newInvStock,
      minThreshold: newInvThreshold,
      unit: 'Strips (10s)',
      unitPrice: newInvPrice * 0.7,
      mrp: newInvPrice,
      supplier: 'Cipla Healthcare Direct',
      supplierName: 'Cipla Healthcare Direct'
    };

    db.addInventoryItem(newItem);
    setShowAddInventoryModal(false);
    setNewInvName('');
    setNewInvGeneric('');
    alert(`Item "${newItem.itemName}" added to central pharmacy inventory.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Department Header */}
      <div className="bg-white border border-emerald-100 rounded-[28px] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 text-2xl font-bold shadow-xs">
              <FlaskConical className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Diagnostic Laboratory & Central Pharmacy</h2>
                <span className="bg-emerald-50 text-emerald-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  NABL & DPCO Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pathology Test Authoring, PDF Report Upload, Real-Time Drug Dispensing Queue & Reagent Inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Pending Rx Dispense</span>
              <span className="text-lg font-black text-amber-700 font-mono">
                {allPrescriptions.filter(p => !p.isDispensed).length}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Published Lab Reports</span>
              <span className="text-lg font-black text-emerald-700 font-mono">{allLabReports.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-emerald-100 shadow-xs max-w-fit">
        {[
          { id: 'lab', label: 'Diagnostic Pathology & Lab Reports', icon: <FlaskConical className="w-4 h-4" /> },
          { id: 'pharmacy', label: 'Pharmacy Dispensing Queue', icon: <Pill className="w-4 h-4" /> },
          { id: 'inventory', label: 'Medicine & Reagent Inventory', icon: <Package className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Pathology & Radiology Lab */}
      {activeTab === 'lab' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">NABL Certified Diagnostic Lab Reports & PDF Scans</h3>
              <p className="text-xs text-slate-500">Process test samples, record abnormal biological parameters, and upload PDF reports accessible to Doctors and Patients.</p>
            </div>

            <button
              onClick={() => setShowNewReportModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer self-start sm:self-center shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record & Upload PDF Report</span>
            </button>
          </div>

          <div className="space-y-3">
            {allLabReports.map((rep) => {
              const pat = db.getPatientById(rep.patient_id);
              const doc = db.getDoctorById(rep.doctor_id);

              return (
                <div key={rep.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-200 transition">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800">{rep.id}</span>
                      <h4 className="font-bold text-sm text-slate-900">{rep.testName}</h4>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded uppercase font-semibold">
                        {rep.testCategory}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase border border-emerald-200">
                        {rep.status}
                      </span>
                      {rep.pdfUrl && (
                        <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>PDF Attached ({rep.pdfFileSize || '1.4 MB'})</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      Patient: <strong className="text-slate-900">{pat?.fullName}</strong> (UHID: {pat?.uhid}) • Ref. Doctor: <span className="font-medium text-slate-800">{doc?.name}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span>Sample: {rep.sampleCollectedAt}</span>
                      <span>•</span>
                      <span>Pathologist: <strong className="text-slate-700">{rep.pathologist}</strong></span>
                      {rep.isWhatsAppSent && (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Auto WhatsApp Dispatched
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLabReport(rep)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{rep.pdfUrl ? 'View PDF & NABL Report' : 'View NABL Report'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Pharmacy Dispensing Queue */}
      {activeTab === 'pharmacy' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">OPD Pharmacy Dispensing Queue</h3>
              <p className="text-xs text-slate-500">Real-time doctor prescriptions routed for formulation packaging and patient handover.</p>
            </div>
          </div>

          <div className="space-y-3">
            {allPrescriptions.map((rx) => {
              const pat = db.getPatientById(rx.patient_id);
              const doc = db.getDoctorById(rx.doctor_id);

              return (
                <div key={rx.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800">{rx.id}</span>
                        <span className="text-xs text-slate-500">• {rx.date}</span>
                        {rx.isDispensed ? (
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> DISPENSED ({rx.dispensedAt})
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                            PENDING DISPENSING
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {pat?.fullName} <span className="text-slate-500 text-xs font-mono">({pat?.uhid})</span>
                      </h4>
                      <p className="text-xs text-slate-500">Prescribing Consultant: {doc?.name} • Diagnosis: {rx.diagnosis}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Rx Slip</span>
                      </button>

                      {!rx.isDispensed && (
                        <button
                          onClick={() => handleDispenseRx(rx)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Dispensed</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Medications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {rx.medications.map((m, i) => (
                      <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-900 block">{m.name}</span>
                        <p className="text-emerald-800 font-mono text-[11px]">{m.dosage} • {m.frequency}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{m.duration} ({m.timing})</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Medicine & Reagent Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Central Pharmacy & Lab Reagent Inventory</h3>
              <p className="text-xs text-slate-500">Track batch numbers, expiry dates, stock thresholds, and suppliers.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search item, generic, batch..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={() => setShowAddInventoryModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Batch
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Drug / Item Name</th>
                  <th className="p-3">Generic Composition</th>
                  <th className="p-3">Batch & Expiry</th>
                  <th className="p-3 text-center">Stock Level</th>
                  <th className="p-3 text-right">MRP (INR)</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allInventory
                  .filter(i => !inventorySearch || i.itemName.toLowerCase().includes(inventorySearch.toLowerCase()) || i.genericName.toLowerCase().includes(inventorySearch.toLowerCase()))
                  .map((item) => {
                    const isLow = item.currentStock <= item.minThreshold;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3 font-bold text-slate-900">{item.itemName}</td>
                        <td className="p-3 text-slate-600">{item.genericName}</td>
                        <td className="p-3 font-mono text-slate-700">
                          {item.batchNumber} <span className="text-slate-400 text-[10px]">({item.expiryDate})</span>
                        </td>
                        <td className="p-3 text-center font-bold font-mono">
                          <span className={isLow ? 'text-rose-600 font-black' : 'text-slate-800'}>
                            {item.currentStock} Units
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-emerald-800">
                          ₹{item.mrp}
                        </td>
                        <td className="p-3 text-slate-600">{item.supplierName}</td>
                        <td className="p-3 text-center">
                          {isLow ? (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 justify-center">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 justify-center">
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Record & Publish New Lab Report with PDF Upload */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-emerald-100 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Record & Upload Diagnostic Lab Report</h3>
                <p className="text-xs text-emerald-200">Patient, Doctor, and Pathologist will access this report instantly.</p>
              </div>
              <button onClick={() => setShowNewReportModal(false)} className="text-emerald-300 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveLabReport} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Select Patient</label>
                  <select
                    value={labPatientId}
                    onChange={(e) => setLabPatientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    {db.getPatients(currentHospital.id).map(p => (
                      <option key={p.id} value={p.id}>{p.fullName} ({p.uhid})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Referring Doctor</label>
                  <select
                    value={labDoctorId}
                    onChange={(e) => setLabDoctorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    {db.getDoctors(currentHospital.id).map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialization.split(',')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Investigation / Test Name</label>
                  <input
                    type="text"
                    value={labTestName}
                    onChange={(e) => setLabTestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Diagnostic Category</label>
                  <select
                    value={labCategory}
                    onChange={(e) => setLabCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  >
                    <option value="blood">Haematology (Blood)</option>
                    <option value="biochemistry">Clinical Biochemistry</option>
                    <option value="radiology">Radiology & Imaging</option>
                    <option value="pathology">Histopathology</option>
                    <option value="urine">Urinalysis</option>
                  </select>
                </div>
              </div>

              {/* PDF ATTACHMENT SECTION (USER REQUESTED) */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-emerald-950 text-xs">Attach Diagnostic PDF Report / Scan</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateSamplePdf}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Auto-Attach Sample PDF</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Upload signed report PDF or scan. Patients & Doctors can view and download this file directly.
                </p>

                {uploadedPdfUrl ? (
                  <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{uploadedPdfName}</p>
                        <p className="text-[10px] text-slate-500">Ready to publish • Size: {uploadedPdfSize}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPdfUrl('');
                        setUploadedPdfName('');
                        setUploadedPdfSize('');
                      }}
                      className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Remove PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-4 bg-white/80 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition text-center">
                    <Upload className="w-6 h-6 text-emerald-600" />
                    <span className="font-bold text-slate-700 text-xs">Click to browse or drop PDF file here</span>
                    <span className="text-[10px] text-slate-400">Supported: .pdf, scanned documents, clinical images (up to 15MB)</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf,image/*"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Observed Clinical Parameters */}
              <div className="space-y-2">
                <label className="text-slate-700 font-semibold block">Observed Clinical Parameters (NABL Structured Format)</label>
                <div className="space-y-2">
                  {labParams.map((param, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900 self-center truncate text-[11px]">{param.name}</span>
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => {
                          const updated = [...labParams];
                          updated[i].value = e.target.value;
                          setLabParams(updated);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-mono text-center text-xs"
                      />
                      <span className="text-slate-500 text-[10px] self-center truncate">{param.referenceRange} ({param.unit})</span>
                      <select
                        value={param.flag}
                        onChange={(e) => {
                          const updated = [...labParams];
                          updated[i].flag = e.target.value as any;
                          setLabParams(updated);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Pathologist's Final Impression</label>
                <textarea
                  rows={2}
                  value={labConclusion}
                  onChange={(e) => setLabConclusion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish & Send WhatsApp Alert</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Inventory Item */}
      {showAddInventoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-emerald-100 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900">Add Medicine / Consumable Batch</h3>

            <form onSubmit={handleAddInventory} className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Medicine Brand Name</label>
                <input
                  type="text"
                  value={newInvName}
                  onChange={(e) => setNewInvName(e.target.value)}
                  placeholder="e.g. Azithral 500 Tab"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Generic Salt Composition</label>
                <input
                  type="text"
                  value={newInvGeneric}
                  onChange={(e) => setNewInvGeneric(e.target.value)}
                  placeholder="e.g. Azithromycin 500mg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newInvBatch}
                    onChange={(e) => setNewInvBatch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newInvExpiry}
                    onChange={(e) => setNewInvExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newInvStock}
                    onChange={(e) => setNewInvStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">MRP per Strip (INR)</label>
                  <input
                    type="number"
                    value={newInvPrice}
                    onChange={(e) => setNewInvPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddInventoryModal(false)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lab Report Modal */}
      {selectedLabReport && (
        <LabReportModal
          isOpen={!!selectedLabReport}
          onClose={() => setSelectedLabReport(null)}
          report={selectedLabReport}
        />
      )}

      {/* Prescription Modal */}
      {selectedPrescription && (
        <PrescriptionPrintModal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          prescription={selectedPrescription}
        />
      )}

    </div>
  );
};
