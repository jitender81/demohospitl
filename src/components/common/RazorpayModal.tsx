import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { db } from '../../services/mockDatabase';
import { BillingReceipt, BillingItem } from '../../types';
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Receipt, 
  Smartphone,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  category: 'Consultation' | 'Pharmacy' | 'Lab Test' | 'Procedure' | 'Registration';
  patientId?: string;
  appointmentId?: string;
  onPaymentSuccess: (receipt: BillingReceipt) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  category,
  patientId,
  appointmentId,
  onPaymentSuccess
}) => {
  const { currentHospital, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('9876543210@paytm');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [cardNumber, setCardNumber] = useState('4532 8819 0294 8812');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('781');
  const [cardName, setCardName] = useState(currentUser?.name || 'Rahul Sharma');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<BillingReceipt | null>(null);

  if (!isOpen) return null;

  const handlePay = (mode: 'upi' | 'razorpay' | 'card') => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      
      const receiptNumber = `PLS-INV-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      const txnId = `pay_RZP_${Math.random().toString(36).substring(2, 14).toUpperCase()}`;
      
      const item: BillingItem = {
        description,
        category,
        hsn: '999312',
        amount: amount,
        gstRate: 0,
        gstAmount: 0,
        total: amount
      };

      const newReceipt: BillingReceipt = {
        id: `rec-${Date.now()}`,
        hospital_id: currentHospital.id,
        patient_id: patientId || currentUser?.id || 'pat-rahul-01',
        appointment_id: appointmentId,
        receiptNumber,
        date: new Date().toISOString().split('T')[0],
        items: [item],
        subTotal: amount,
        gstTotal: 0,
        grandTotal: amount,
        paymentMode: mode,
        transactionId: txnId,
        paymentStatus: 'completed',
        collectedBy: 'Razorpay PG Gateway (Automated)'
      };

      db.addBillingReceipt(newReceipt);

      // Trigger WhatsApp invoice confirmation
      db.sendWhatsAppNotification({
        hospital_id: currentHospital.id,
        recipientPhone: currentUser?.phone || '9876543210',
        recipientName: currentUser?.name || 'Valued Patient',
        templateName: 'billing_receipt',
        messageText: `Payment of ₹${amount} received successfully for ${description}. Receipt #${receiptNumber} generated. Hospital: ${currentHospital.name}. Txn ID: ${txnId}`,
        variables: {
          amount: amount.toString(),
          receipt_no: receiptNumber,
          payment_mode: mode.toUpperCase(),
          hospital_name: currentHospital.name
        }
      });

      // Audit Log
      db.addAuditLog({
        hospital_id: currentHospital.id,
        actorId: currentUser?.id || 'sys-pg',
        actorName: currentUser?.name || 'Patient Online PG',
        actorRole: currentUser?.role || 'patient',
        action: 'COLLECT_PAYMENT',
        ipAddress: '127.0.0.1 (Razorpay Secured Webhook)',
        details: `Successfully processed online billing ₹${amount} for ${description}. Txn: ${txnId}`
      });

      setPaidReceipt(newReceipt);
      onPaymentSuccess(newReceipt);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header with Razorpay & Hospital Branding */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white flex items-center justify-between border-b border-indigo-700/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xl font-bold">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Razorpay Checkout</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                  PCI-DSS Level 1
                </span>
              </div>
              <p className="text-xs text-blue-200/80">{currentHospital.name}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paidReceipt ? (
          /* Payment Success View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
              <p className="text-xs text-slate-400 mt-1">Transaction ID: <span className="font-mono text-emerald-400">{paidReceipt.transactionId}</span></p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Receipt Number:</span>
                <span className="font-mono font-bold text-white">{paidReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Description:</span>
                <span className="font-medium text-slate-200">{description}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Hospital:</span>
                <span className="text-slate-200">{currentHospital.name}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
                <span className="font-bold text-white">Amount Paid:</span>
                <span className="font-bold text-emerald-400 text-sm">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Tax invoice receipt sent to patient WhatsApp & portal billing history.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Done & Close</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Payment Selection Tabs */
          <div className="p-6 space-y-5">
            
            {/* Amount Summary Pill */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Bill Summary</span>
                <span className="text-sm font-semibold text-white">{description}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Payable</span>
                <span className="text-xl font-bold text-emerald-400">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'upi'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'card'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'netbanking'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Tab 1: UPI & QR Code */}
            {activeTab === 'upi' && (
              <div className="space-y-4 text-center">
                <div className="bg-white p-4 rounded-xl inline-block shadow-lg mx-auto border-2 border-blue-500/30">
                  {/* Simulated High-Res UPI QR Code */}
                  <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white relative">
                    <QrCode className="w-24 h-24 text-white" />
                    <span className="text-[9px] font-mono tracking-tighter bg-emerald-600 px-1.5 py-0.5 rounded text-white mt-1">
                      BHIM UPI 2.0
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  Scan with <span className="font-semibold text-emerald-400">Google Pay, PhonePe, Paytm or BHIM</span>
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI VPA (e.g. mobile@upi)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    disabled={isProcessing}
                    onClick={() => handlePay('upi')}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1 shadow-md"
                  >
                    {isProcessing ? 'Verifying...' : 'Pay via UPI'}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card */}
            {activeTab === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8819 0294 8812"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/29"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as on Card"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <button
                  disabled={isProcessing}
                  onClick={() => handlePay('card')}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing 3D-Secure...' : `Pay ₹${amount.toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            )}

            {/* Tab 3: NetBanking */}
            {activeTab === 'netbanking' && (
              <div className="space-y-4">
                <label className="text-[11px] font-medium text-slate-400 block">Popular Indian Banks</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India (SBI)', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between ${
                        selectedBank === bank
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{bank}</span>
                      {selectedBank === bank && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  ))}
                </div>

                <button
                  disabled={isProcessing}
                  onClick={() => handlePay('razorpay')}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Redirecting to Bank Gateway...' : `Proceed with ${selectedBank}`}</span>
                </button>
              </div>
            )}

            {/* Security Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> 256-bit SSL Encrypted
              </span>
              <span>Powered by Razorpay India</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
