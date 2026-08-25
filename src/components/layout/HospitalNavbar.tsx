import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { db } from '../../services/mockDatabase';
import { UserRole } from '../../types';
import { 
  Building2, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  HeartHandshake, 
  Stethoscope, 
  Users, 
  FlaskConical, 
  ShieldAlert,
  RefreshCw
} from 'lucide-react';

export const HospitalNavbar: React.FC = () => {
  const { 
    currentUser, 
    currentHospital, 
    activeRole, 
    switchHospital, 
    logout 
  } = useAuth();
  
  const [showHospitalMenu, setShowHospitalMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const hospitals = db.getHospitals();

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'patient':
        return { label: 'Patient Portal', icon: <HeartHandshake className="w-3.5 h-3.5" />, bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'doctor':
        return { label: 'Doctor OPD & EMR', icon: <Stethoscope className="w-3.5 h-3.5" />, bg: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'reception':
        return { label: 'Front Desk & Reception', icon: <Users className="w-3.5 h-3.5" />, bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'department':
        return { label: 'Lab & Diagnostics', icon: <FlaskConical className="w-3.5 h-3.5" />, bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'admin':
        return { label: 'Hospital Admin', icon: <ShieldAlert className="w-3.5 h-3.5" />, bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: 'Portal', icon: <ShieldCheck className="w-3.5 h-3.5" />, bg: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  const badge = getRoleBadge(activeRole);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 text-[#2D3A3A] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Main Navbar Row */}
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Logo & Multi-Tenant Hospital Selector */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 max-w-[60%] sm:max-w-md">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-lg sm:text-xl shadow-xs text-white shrink-0">
              +
            </div>
            
            <div className="relative min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setShowHospitalMenu(!showHospitalMenu)}
                className="text-left group flex items-center gap-1.5 hover:bg-emerald-50/70 p-1 sm:px-2.5 sm:py-1.5 rounded-xl transition border border-transparent hover:border-emerald-100 w-full cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-extrabold text-xs sm:text-sm tracking-tight text-emerald-950 group-hover:text-emerald-700 transition truncate">
                      {currentHospital.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 truncate">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> NABH {currentHospital.nabhLevel ? currentHospital.nabhLevel.split('-')[0] : 'Level 3'}
                    </span>
                    <span>•</span>
                    <span className="truncate">{currentHospital.city}</span>
                  </div>
                </div>
              </button>

              {/* Hospital Dropdown */}
              {showHospitalMenu && (
                <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white border border-emerald-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-emerald-50">
                    Switch Hospital Unit
                  </div>
                  <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                    {hospitals.map((hosp) => (
                      <button
                        key={hosp.id}
                        onClick={() => {
                          switchHospital(hosp.id);
                          setShowHospitalMenu(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                          currentHospital.id === hosp.id
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-900'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold flex items-center gap-1.5 truncate">
                            <span>{hosp.logo}</span>
                            <span className="truncate">{hosp.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{hosp.city}, {hosp.state}</p>
                        </div>
                        {currentHospital.id === hosp.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Role Badge & User Account Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Clean Role Badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs ${badge.bg}`}>
              {badge.icon}
              <span className="whitespace-nowrap">{badge.label}</span>
            </div>

            {/* Current User Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white uppercase overflow-hidden shrink-0">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.name.charAt(0) || 'U'
                  )}
                </div>
                <div className="hidden sm:block text-left max-w-[110px] truncate">
                  <span className="text-xs font-bold text-slate-800 block leading-tight truncate">{currentUser?.name}</span>
                  <span className="text-[10px] text-emerald-700 uppercase font-bold">{currentUser?.role}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-emerald-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 mb-2">
                    <p className="font-bold text-xs text-slate-900 truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || currentUser?.phone}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                        Role: {currentUser?.role}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Logged In</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      db.resetAllData();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50/60 rounded-xl flex items-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Sample Demo Data</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out / Switch Account</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
};
