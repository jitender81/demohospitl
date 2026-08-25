import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { db, DEMO_USERS } from '../../services/mockDatabase';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  HeartHandshake,
  Activity,
  FileCheck2,
  KeyRound,
  Hospital as HospitalIcon,
  HelpCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { 
    currentHospital, 
    loginWallpaper, 
    loginWithEmail, 
    loginWithPhone, 
    registerPatient,
    requestOtp 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginTab, setLoginTab] = useState<'staff' | 'patient'>('staff');

  // Staff Login Form
  const [staffEmail, setStaffEmail] = useState('dr.rajesh@pulsehealth.in');
  const [staffPassword, setStaffPassword] = useState('Doctor@123');
  const [showPassword, setShowPassword] = useState(false);

  // Patient Login Form
  const [patientPhone, setPatientPhone] = useState('9876543210');
  const [patientOtp, setPatientOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Patient Sign Up Form
  const [fullName, setFullName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+');
  const [address, setAddress] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminHelpModal, setShowAdminHelpModal] = useState(false);

  // Handle Staff Email/Password Submit
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithEmail(staffEmail, staffPassword);
      if (!res.success) {
        setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      }
      setIsLoading(false);
    }, 400);
  };

  // Handle Patient Phone Submit
  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithPhone(patientPhone, patientOtp || undefined);
      if (!res.success) {
        setErrorMessage(res.message || 'Verification failed. Please try again.');
      }
      setIsLoading(false);
    }, 400);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!patientPhone || patientPhone.replace(/[^0-9]/g, '').length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number before requesting OTP.');
      return;
    }
    setOtpLoading(true);
    setErrorMessage(null);
    try {
      const code = await requestOtp(patientPhone);
      setOtpSent(true);
      setPatientOtp(code);
      setSuccessMessage(`OTP sent via WhatsApp to +91 ${patientPhone}. Auto-filled: ${code}`);
    } catch {
      setErrorMessage('Could not send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Patient Sign Up
  const handlePatientSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim() || !signUpPhone || !age) {
      setErrorMessage('Please fill in all mandatory fields (Name, Phone, Age).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = registerPatient({
        fullName,
        phone: signUpPhone,
        age: Number(age),
        gender,
        bloodGroup,
        address,
        emergencyPhone
      });

      if (res.success) {
        setSuccessMessage(`Registration successful! Generated UHID: ${res.uhid}`);
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
      setIsLoading(false);
    }, 500);
  };

  // 1-Click Quick Demo Login Helper
  const handleQuickLogin = (demo: typeof DEMO_USERS[0]) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (demo.role === 'patient') {
      setLoginTab('patient');
      setPatientPhone(demo.phone);
      loginWithPhone(demo.phone);
    } else {
      setLoginTab('staff');
      setStaffEmail(demo.email);
      setStaffPassword(demo.password || 'Pulse@2025');
      loginWithEmail(demo.email, demo.password || 'Pulse@2025');
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans bg-cover bg-center bg-no-repeat transition-all duration-700 select-none overflow-y-auto"
      style={{
        backgroundImage: `url("${loginWallpaper}")`
      }}
    >
      {/* Cinematic Dark Frost Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/50 to-slate-950/70 backdrop-blur-[2px]" />

      {/* Top Floating Hospital Header */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-lg w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-md text-xl shrink-0">
            +
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-sm tracking-wide flex items-center gap-2 flex-wrap">
              <span className="truncate">{currentHospital.name}</span>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                NABH {currentHospital.nabhLevel || 'Accredited'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-300 truncate">
              {currentHospital.address ? `${currentHospital.address}, ${currentHospital.city}` : `${currentHospital.city} • Integrated EMR & OPD System`}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-200 bg-slate-900/80 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>ABDM & DISHA Regulatory Compliant</span>
        </div>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-4">
        <div className="backdrop-blur-2xl bg-white/15 sm:bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
          
          {/* Header Switcher: Login vs Sign Up */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {authMode === 'login' ? 'Login to your account' : 'Patient Registration'}
              </h2>
              <p className="text-xs text-slate-200 mt-1">
                {authMode === 'login' 
                  ? 'Enter your credentials to access your dedicated portal'
                  : 'Register with your phone to generate a unique UHID'
                }
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/30 hover:bg-white/20 transition-all text-white shrink-0"
            >
              {authMode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {/* Error & Success Feedback Banners */}
          {errorMessage && (
            <div className="mb-4 bg-rose-500/30 border border-rose-400/50 rounded-2xl p-3 text-xs text-rose-100 flex items-start gap-2 backdrop-blur-md animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-emerald-500/30 border border-emerald-400/50 rounded-2xl p-3 text-xs text-emerald-100 flex items-start gap-2 backdrop-blur-md animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* AUTH MODE 1: LOGIN */}
          {authMode === 'login' && (
            <div>
              {/* Tab Selector: Staff vs Patient */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/30 rounded-2xl border border-white/15 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('staff');
                    setErrorMessage(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                    loginTab === 'staff'
                      ? 'bg-white text-slate-900 shadow-md font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Staff & Doctors
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('patient');
                    setErrorMessage(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                    loginTab === 'patient'
                      ? 'bg-white text-slate-900 shadow-md font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Patient (Phone)
                </button>
              </div>

              {/* STAFF LOGIN FORM (Email & Password managed by Admin) */}
              {loginTab === 'staff' && (
                <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-200 font-medium mb-1.5">
                      Staff Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4 text-slate-300" />
                      </div>
                      <input
                        type="email"
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        placeholder="doctor@pulsehealth.in"
                        className="w-full bg-slate-900/50 border border-white/25 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-200 font-medium">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAdminHelpModal(true)}
                        className="text-[11px] text-emerald-300 hover:text-emerald-200 underline transition"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 text-slate-300" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/50 border border-white/25 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-300 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In to Staff Console</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* PATIENT LOGIN FORM (Phone Number only) */}
              {loginTab === 'patient' && (
                <form onSubmit={handlePatientLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-200 font-medium mb-1.5">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300 font-mono text-xs">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-slate-900/50 border border-white/25 rounded-xl pl-11 pr-3 py-2.5 text-white font-mono placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition tracking-wider"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-200 font-medium">
                        Verification Code / OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="text-[11px] text-emerald-300 hover:text-emerald-200 underline transition cursor-pointer"
                      >
                        {otpLoading ? 'Sending...' : (otpSent ? 'Resend OTP' : 'Send WhatsApp OTP')}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4 text-slate-300" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={patientOtp}
                        onChange={(e) => setPatientOtp(e.target.value)}
                        placeholder="Enter 482910 (or click Send OTP)"
                        className="w-full bg-slate-900/50 border border-white/25 rounded-xl pl-10 pr-3 py-2.5 text-white font-mono placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition tracking-widest"
                      />
                    </div>
                    <p className="text-[10px] text-slate-300 mt-1">
                      Demo OTP: <strong className="text-emerald-300 font-mono">482910</strong> or leave blank for instant phone verification.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Access Patient Health Records</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <p className="text-[11px] text-slate-300">
                      New Patient?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setSignUpPhone(patientPhone);
                        }}
                        className="text-emerald-300 hover:underline font-semibold"
                      >
                        Register & Generate UHID
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* DEMO 1-CLICK SELECTOR PILLS */}
              <div className="mt-6 pt-5 border-t border-white/15">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Quick Role Test Logins
                  </span>
                  <span className="text-[10px] text-slate-300">1-Click Auto Fill</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEMO_USERS.find(u => u.role === 'doctor')!)}
                    className="bg-black/30 hover:bg-black/50 border border-white/15 hover:border-emerald-400/50 p-2 rounded-xl text-left transition flex items-center gap-2 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                      🩺
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">Dr. Rajesh</p>
                      <p className="text-[9px] text-slate-300">Doctor Portal</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEMO_USERS.find(u => u.role === 'reception')!)}
                    className="bg-black/30 hover:bg-black/50 border border-white/15 hover:border-emerald-400/50 p-2 rounded-xl text-left transition flex items-center gap-2 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
                      👩‍💼
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">Sunita</p>
                      <p className="text-[9px] text-slate-300">Reception Desk</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEMO_USERS.find(u => u.role === 'department')!)}
                    className="bg-black/30 hover:bg-black/50 border border-white/15 hover:border-emerald-400/50 p-2 rounded-xl text-left transition flex items-center gap-2 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                      🔬
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">Amit Kumar</p>
                      <p className="text-[9px] text-slate-300">Lab & Pharmacy</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEMO_USERS.find(u => u.role === 'admin')!)}
                    className="bg-black/30 hover:bg-black/50 border border-white/15 hover:border-emerald-400/50 p-2 rounded-xl text-left transition flex items-center gap-2 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-rose-500/30 text-rose-300 flex items-center justify-center shrink-0">
                      🏥
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">Dr. Vikram</p>
                      <p className="text-[9px] text-slate-300">Admin Portal</p>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(DEMO_USERS.find(u => u.role === 'patient')!)}
                  className="w-full mt-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 p-2 rounded-xl text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🧑</span>
                    <div>
                      <p className="text-[11px] font-bold text-emerald-200">Rahul Sharma (Patient)</p>
                      <p className="text-[9px] text-slate-300">UHID: PLS-2025-08412 • Mobile: 9876543210</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          )}

          {/* AUTH MODE 2: PATIENT SIGN UP ONLY */}
          {authMode === 'signup' && (
            <form onSubmit={handlePatientSignUp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-200 font-medium mb-1">
                  Full Name (as per Aadhaar / ID) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full bg-slate-900/50 border border-white/25 rounded-xl px-3 py-2 text-white placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-200 font-medium mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 font-mono text-[11px]">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="9812345678"
                      className="w-full bg-slate-900/50 border border-white/25 rounded-xl pl-9 pr-2 py-2 text-white font-mono placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-200 font-medium mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || '')}
                    placeholder="35"
                    className="w-full bg-slate-900/50 border border-white/25 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-200 font-medium mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-900/80 border border-white/25 rounded-xl px-2 py-2 text-white focus:outline-none"
                  >
                    <option value="Male" className="bg-slate-900 text-white">Male</option>
                    <option value="Female" className="bg-slate-900 text-white">Female</option>
                    <option value="Other" className="bg-slate-900 text-white">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-200 font-medium mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full bg-slate-900/80 border border-white/25 rounded-xl px-2 py-2 text-white focus:outline-none font-mono"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg} className="bg-slate-900 text-white">{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-medium mb-1">
                  City / Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Rohini Sector 14, New Delhi"
                  className="w-full bg-slate-900/50 border border-white/25 rounded-xl px-3 py-2 text-white placeholder:text-slate-400 focus:bg-slate-900/80 focus:border-emerald-400 focus:outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Register & Generate UHID</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-slate-300 hover:text-white text-xs underline"
                >
                  Already have a UHID / Account? Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Admin Help / Password Reset Modal */}
      {showAdminHelpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/20 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-white space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Staff Credential Recovery</h3>
                <p className="text-[11px] text-slate-400">Managed by Hospital IT & Admin</p>
              </div>
            </div>

            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-2 text-slate-300 leading-relaxed">
              <p>
                In accordance with hospital statutory security protocols, staff logins (Doctors, Reception, Lab) are provisioned directly by the <strong>Hospital Administrator</strong>.
              </p>
              <p className="text-[11px]">
                <strong>Default Master Passwords for Demo:</strong>
                <br />• Doctor: <code className="text-emerald-300">Doctor@123</code>
                <br />• Reception: <code className="text-emerald-300">Reception@123</code>
                <br />• Lab/Pharmacy: <code className="text-emerald-300">Lab@123</code>
                <br />• Admin: <code className="text-emerald-300">Admin@123</code>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAdminHelpModal(false)}
              className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-2 rounded-xl transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Bottom Legal Notice */}
      <div className="absolute bottom-4 text-center text-[11px] text-slate-400 z-10 pointer-events-none">
        {currentHospital.name} • Clinical Establishment No: {currentHospital.registrationNumber || 'DEL-HOSP-2024-8842'}
      </div>
    </div>
  );
};
