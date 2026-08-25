import React from 'react';
import { BillingReceipt, Hospital, Patient } from '../../types';
import { db } from '../../services/mockDatabase';
import { Printer, X, QrCode, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: BillingReceipt;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt
}) => {
  if (!isOpen) return null;

  const hospital: Hospital = db.getHospitalById(receipt.hospital_id) || db.getHospitals()[0];
  const patient: Patient | undefined = db.getPatientById(receipt.patient_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm sm:max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Controls */}
        <div className="no-print bg-slate-950 p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-emerald-400 font-bold text-xs truncate block">GST Tax Invoice & Thermal Slip</span>
            <span className="text-[10px] text-slate-400 font-mono">{receipt.receiptNumber}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container (80mm width standard) */}
        <div className="print-area flex-1 overflow-y-auto p-4 sm:p-6 bg-white text-slate-900 font-mono text-xs">
          
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
            <h2 className="font-bold text-sm uppercase tracking-tight text-slate-950">{hospital.name}</h2>
            <p className="text-[10px] text-slate-600">{hospital.address}, {hospital.city}</p>
            <p className="text-[10px] text-slate-600">Ph: {hospital.phone} | GSTIN: {hospital.gstin}</p>
            <span className="inline-block bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase mt-1">
              OPD BILL CUM RECEIPT
            </span>
          </div>

          {/* Receipt Details */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-slate-400 pb-2 mb-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice No:</span>
              <span className="font-bold">{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span>{receipt.date} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient UHID:</span>
              <span className="font-bold">{patient?.uhid || 'PLS-2025-04821'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient Name:</span>
              <span className="font-bold">{patient?.fullName || 'Rahul Sharma'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Age / Gender:</span>
              <span>{patient?.age} Y / {patient?.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cashier:</span>
              <span>{receipt.collectedBy}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-b border-dashed border-slate-400 pb-2 mb-2">
            <div className="flex justify-between font-bold text-[10px] text-slate-600 uppercase border-b border-slate-200 pb-1 mb-1">
              <span>Item / Service</span>
              <span>Amt (INR)</span>
            </div>
            {receipt.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[11px] py-0.5">
                <div className="pr-2">
                  <p className="font-medium text-slate-900">{item.description}</p>
                  <span className="text-[9px] text-slate-500">HSN: {item.hsn} (GST exempt healthcare)</span>
                </div>
                <span className="font-bold text-slate-900">₹{item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1 text-xs border-b border-dashed border-slate-400 pb-2 mb-2">
            <div className="flex justify-between text-slate-600">
              <span>Sub-Total:</span>
              <span>₹{receipt.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CGST (0%):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST (0%):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-950 pt-1 border-t border-slate-300">
              <span>NET TOTAL PAID:</span>
              <span>₹{receipt.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment & QR Footer */}
          <div className="text-center pt-2 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-600 bg-slate-100 p-1.5 rounded">
              <span>Payment Mode: <strong>{receipt.paymentMode.toUpperCase()}</strong></span>
              <span>Status: <strong className="text-emerald-700 font-bold">PAID</strong></span>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <QrCode className="w-10 h-10 text-slate-800" />
              <div className="text-left text-[9px] text-slate-500">
                <p>Tax compliant digital receipt</p>
                <p>NABH Accredited Healthcare</p>
                <p>Get well soon!</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
