import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { db } from '../../services/mockDatabase';
import { MessageSquare, X, CheckCheck, Send, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';
import { WhatsAppNotification } from '../../types';

interface WhatsAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppDrawer: React.FC<WhatsAppDrawerProps> = ({ isOpen, onClose }) => {
  const { currentHospital, currentUser } = useAuth();
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>(() => db.getNotifications(currentHospital.id));
  const [customMsg, setCustomMsg] = useState('');

  // Refresh notifications list
  const refreshLogs = () => {
    setNotifications(db.getNotifications(currentHospital.id));
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    db.sendWhatsAppNotification({
      hospital_id: currentHospital.id,
      recipientPhone: currentUser?.phone || '9876543210',
      recipientName: currentUser?.name || 'Patient',
      templateName: 'custom_alert',
      messageText: customMsg,
      variables: {}
    });

    setCustomMsg('');
    refreshLogs();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-[#F4F7F2] border-l border-emerald-100 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        
        {/* WhatsApp Phone Top Header */}
        <div className="bg-emerald-800 text-white px-4 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
              🏥
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>{currentHospital.name.split(' ')[0]} Official WA</span>
                <ShieldCheck className="w-4 h-4 text-emerald-300 inline" />
              </div>
              <p className="text-xs text-emerald-100 font-medium">Meta Verified Healthcare Channel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={refreshLogs} 
              title="Refresh messages"
              className="p-1.5 hover:bg-emerald-700/60 rounded-full transition text-emerald-100 text-xs"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-emerald-700 rounded-full transition text-emerald-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Background Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EAEFE8] [background-size:16px_16px]">
          
          <div className="text-center my-2">
            <span className="text-[11px] font-medium bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              🔒 End-to-end encrypted hospital service bot
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-12">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-600" />
              No notifications triggered yet. Actions like booking appointments, OTP requests, and lab reports will appear here in real-time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="flex flex-col items-end">
                <div className="max-w-[85%] bg-white border border-emerald-100 text-slate-800 rounded-2xl rounded-tr-xs p-3.5 shadow-xs">
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-emerald-50 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                      {notif.templateName.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500">{notif.recipientPhone}</span>
                  </div>
                  
                  <p className="text-xs leading-relaxed whitespace-pre-line text-slate-700">
                    {notif.messageText}
                  </p>

                  <div className="flex items-center justify-end gap-1 mt-1.5 pt-1 text-[10px] text-slate-400">
                    <span>{notif.sentAt}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Simulator Test Trigger */}
        <div className="p-3 bg-white border-t border-emerald-100">
          <form onSubmit={handleSendTest} className="flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Send custom simulated WhatsApp message..."
              className="flex-1 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span>Integrated with WhatsApp Meta Cloud API / Gupshup</span>
            <span className="text-emerald-700 font-bold font-mono">Status: Connected</span>
          </div>
        </div>

      </div>
    </div>
  );
};
