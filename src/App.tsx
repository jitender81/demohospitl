import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/authContext';
import { db } from './services/mockDatabase';
import { LoginPage } from './components/auth/LoginPage';
import { HospitalNavbar } from './components/layout/HospitalNavbar';
import { PatientPortal } from './components/portals/PatientPortal/PatientPortal';
import { DoctorPortal } from './components/portals/DoctorPortal/DoctorPortal';
import { ReceptionPortal } from './components/portals/ReceptionPortal/ReceptionPortal';
import { DepartmentPortal } from './components/portals/DepartmentPortal/DepartmentPortal';
import { AdminPortal } from './components/portals/AdminPortal/AdminPortal';
import { WhatsAppDrawer } from './components/common/WhatsAppDrawer';
import { 
  ShieldCheck, 
  FileCheck2,
  Server,
  MessageSquare
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, currentUser, activeRole, currentHospital } = useAuth();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // If unauthenticated or no current user, show the scenic custom login page
  if (!isAuthenticated || !currentUser) {
    return <LoginPage />;
  }

  const notificationsCount = db.getNotifications(currentHospital.id).length;
  const showWhatsAppFAB = activeRole === 'patient' || activeRole === 'reception';

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#2D3A3A] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      {/* Top Multi-Tenant Navigation Header with clean, non-overlapping design */}
      <HospitalNavbar />

      {/* Main Role-Based Isolated Content Area - User ONLY sees their authorized portal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeRole === 'patient' && <PatientPortal />}
        {activeRole === 'doctor' && <DoctorPortal />}
        {activeRole === 'reception' && <ReceptionPortal />}
        {activeRole === 'department' && <DepartmentPortal />}
        {activeRole === 'admin' && <AdminPortal />}
      </main>

      {/* Floating WhatsApp Action Button - ONLY on Patient and Reception Portals */}
      {showWhatsAppFAB && (
        <aside aria-label="WhatsApp Feed Controls" className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsWhatsAppOpen(true)}
            className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border-2 border-white/40"
            title="Open WhatsApp Live Channel & Notifications"
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
              {notificationsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {notificationsCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold tracking-wide pr-1">WhatsApp Feed</span>
          </button>
        </aside>
      )}

      {/* WhatsApp Live Simulator Drawer */}
      <WhatsAppDrawer
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Indian Healthcare Regulatory Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-xs">
              +
            </div>
            <div>
              <p className="text-emerald-950 font-bold text-sm">{currentHospital.name}</p>
              <p className="text-[11px] text-slate-500">
                NABH Level: <strong className="text-emerald-700 font-semibold">{currentHospital.nabhLevel || 'Accredited'}</strong> • GSTIN: <span className="font-mono text-slate-600 font-medium">{currentHospital.gstin}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              DISHA / EMR Compliant
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              ABDM & NABL Diagnostic Standard
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100">
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              Multi-Tenant Architecture
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
