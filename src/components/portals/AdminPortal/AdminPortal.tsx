import React, { useState } from 'react';
import { useAuth } from '../../../services/authContext';
import { db } from '../../../services/mockDatabase';
import { 
  User, 
  Doctor, 
  AuditLog, 
  PatientFeedback, 
  BillingReceipt,
  UserRole 
} from '../../../types';
import { 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2, 
  FileCheck, 
  UserPlus, 
  Lock, 
  Star, 
  Search, 
  Activity, 
  BarChart3, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  Image,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Check
} from 'lucide-react';

const WALLPAPER_PRESETS = [
  {
    name: 'Modern Natural Healthcare Pavilion (Approved)',
    url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1920&auto=format&fit=crop&q=80',
    desc: 'Lush green architectural glass facade with warm natural lighting'
  },
  {
    name: 'Serene Medical Atrium & Greenery',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&auto=format&fit=crop&q=80',
    desc: 'Spacious hospital lobby with warm natural wooden accents and skylight'
  },
  {
    name: 'Minimalist Clean Clinic Interior',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&auto=format&fit=crop&q=80',
    desc: 'Soft sage and warm ivory interior with contemporary doctor consult desk'
  },
  {
    name: 'Emerald Healing Gardens & Exterior',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1920&auto=format&fit=crop&q=80',
    desc: 'Tranquil garden pathway with contemporary surgical tower in background'
  }
];

export const AdminPortal: React.FC = () => {
  const { currentHospital, currentUser, updateHospitalProfile, loginWallpaper, setLoginWallpaper } = useAuth();

  const [activeTab, setActiveTab] = useState<'analytics' | 'staff' | 'audit_logs' | 'feedback' | 'hospital_settings' | 'login_design'>('analytics');
  
  // Hospital Settings State
  const [hospName, setHospName] = useState(currentHospital.name);
  const [hospCity, setHospCity] = useState(currentHospital.city);
  const [hospAddress, setHospAddress] = useState(currentHospital.address);
  const [hospGstin, setHospGstin] = useState(currentHospital.gstin);
  const [hospNabh, setHospNabh] = useState(currentHospital.nabhLevel || 'Level 3 - Full Accreditation');
  const [hospRegNumber, setHospRegNumber] = useState(currentHospital.registrationNumber);
  const [hospOpdTimings, setHospOpdTimings] = useState(currentHospital.opdTiming);

  // Login Wallpaper State
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState(loginWallpaper || currentHospital.loginWallpaperUrl || WALLPAPER_PRESETS[0].url);
  const [wallpaperSavedSuccess, setWallpaperSavedSuccess] = useState(false);

  // New Staff Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Hospital@123');
  const [newUserRole, setNewUserRole] = useState<UserRole>('doctor');
  const [newUserSpecialization, setNewUserSpecialization] = useState('General Medicine');
  const [newUserQualification, setNewUserQualification] = useState('MBBS, MD');
  const [newUserRoom, setNewUserRoom] = useState('Room 105');
  const [newUserFee, setNewUserFee] = useState<number>(800);

  // Password Visibility Toggle for staff table
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});

  // Reset Password Modal
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('Doctor@2025');

  // Filter audit logs
  const [auditRoleFilter, setAuditRoleFilter] = useState<string>('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Filter staff users
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Data Queries
  const allUsers = db.getUsers(currentHospital.id);
  const allDoctors = db.getDoctors(currentHospital.id);
  const allAppointments = db.getAppointments(currentHospital.id);
  const allBilling = db.getBillingReceipts(currentHospital.id);
  const allAuditLogs = db.getAuditLogs(currentHospital.id);
  const allFeedbacks = db.getFeedbacks(currentHospital.id);

  // Analytics Computations
  const totalRevenue = allBilling.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const totalPatientsSeen = allAppointments.filter(a => a.queueStatus === 'completed').length;
  const avgDoctorRating = (allFeedbacks.reduce((acc, curr) => acc + curr.doctorRating, 0) / (allFeedbacks.length || 1)).toFixed(1);
  const avgCleanlinessRating = (allFeedbacks.reduce((acc, curr) => acc + curr.cleanlinessRating, 0) / (allFeedbacks.length || 1)).toFixed(1);

  // Toggle password visibility
  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Save Hospital Profile
  const handleSaveHospitalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalProfile({
      name: hospName,
      city: hospCity,
      address: hospAddress,
      gstin: hospGstin,
      nabhLevel: hospNabh,
      registrationNumber: hospRegNumber,
      opdTiming: hospOpdTimings
    });

    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: currentUser?.id || 'usr-admin-01',
      actorName: currentUser?.name || 'Dr. Vikram Malhotra',
      actorRole: 'admin',
      action: 'UPDATE_HOSPITAL_CONFIG',
      ipAddress: '10.0.0.1 (Executive Admin Console)',
      details: `Updated hospital configuration profile for ${hospName}`
    });

    alert('Hospital profile and regulatory statutory settings updated successfully.');
  };

  // Save Login Wallpaper
  const handleSaveWallpaper = (urlToSave: string) => {
    setLoginWallpaper(urlToSave);
    updateHospitalProfile({ loginWallpaperUrl: urlToSave });

    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: currentUser?.id || 'usr-admin-01',
      actorName: currentUser?.name || 'Dr. Vikram Malhotra',
      actorRole: 'admin',
      action: 'UPDATE_LOGIN_WALLPAPER',
      ipAddress: '10.0.0.1 (Executive Admin Console)',
      details: `Updated the front login page photographic wallpaper`
    });

    setWallpaperSavedSuccess(true);
    setTimeout(() => setWallpaperSavedSuccess(false), 3000);
  };

  // Add New Staff Member (Exclusive Admin Privilege)
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUserId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      hospital_id: currentHospital.id,
      email: newUserEmail.toLowerCase().trim(),
      name: newUserName.trim(),
      phone: newUserPhone.trim(),
      password: newUserPassword,
      role: newUserRole,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    if (newUserRole === 'doctor') {
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        user_id: newUserId,
        hospital_id: currentHospital.id,
        name: newUserName.startsWith('Dr.') ? newUserName : `Dr. ${newUserName}`,
        qualification: newUserQualification,
        specialization: newUserSpecialization,
        registrationNumber: `MCI-${Math.floor(10000 + Math.random() * 90000)}`,
        department_id: 'dept-genmed',
        consultationFee: newUserFee,
        opdRoom: newUserRoom,
        experienceYears: 10,
        rating: 4.9,
        totalConsultations: 0,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        availability: {
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          startTime: '09:30 AM',
          endTime: '01:30 PM',
          slotDurationMinutes: 15,
          isLeaveToday: false
        }
      };
      db.addDoctor(newDoc);
    }

    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: currentUser?.id || 'usr-admin-01',
      actorName: currentUser?.name || 'Dr. Vikram Malhotra',
      actorRole: 'admin',
      action: 'CREATE_USER',
      ipAddress: '10.0.0.1 (Executive Admin Console)',
      details: `Provisioned new staff user ${newUserName} with role ${newUserRole.toUpperCase()} and initialized credentials.`
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserPassword('Hospital@123');
    alert(`New staff member "${newUserName}" created! They can now log in with email ${newUserEmail} and password.`);
  };

  // Reset user password handler
  const handleSaveResetPassword = () => {
    if (!resettingUser || !newPasswordValue.trim()) return;

    db.updateUser(resettingUser.id, { password: newPasswordValue.trim() });
    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: currentUser?.id || 'usr-admin-01',
      actorName: currentUser?.name || 'Dr. Vikram Malhotra',
      actorRole: 'admin',
      action: 'RESET_PASSWORD',
      ipAddress: '10.0.0.1 (Executive Admin Console)',
      details: `Admin reset login password for staff user ${resettingUser.name} (${resettingUser.email})`
    });

    alert(`Password for ${resettingUser.name} successfully updated to: ${newPasswordValue}`);
    setResettingUser(null);
  };

  const filteredLogs = allAuditLogs.filter(log => {
    const matchesRole = auditRoleFilter === 'all' || log.actorRole === auditRoleFilter;
    const matchesQuery = !auditSearchQuery || 
      log.actorName.toLowerCase().includes(auditSearchQuery.toLowerCase()) || 
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      (log.targetPatientUhid && log.targetPatientUhid.toLowerCase().includes(auditSearchQuery.toLowerCase()));
    return matchesRole && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Admin Executive Header */}
      <div className="bg-white border border-emerald-100 rounded-[28px] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 text-2xl font-bold shadow-xs">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{currentHospital.name}</h2>
                <span className="bg-emerald-50 text-emerald-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {currentHospital.nabhLevel || 'NABH Level 3'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hospital Administration, Staff Credential Provisioning, Login Theme Customizer & Regulatory Audit Trail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Hospital Gross Collections</span>
              <span className="text-lg font-black text-emerald-700 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-500 block font-medium">Active Hospital Staff</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {allUsers.filter(u => u.role !== 'patient').length} Members
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-white/80 p-1.5 rounded-2xl border border-emerald-100 shadow-xs overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: 'Executive Analytics & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'staff', label: 'Staff Accounts & Passwords (RBAC)', icon: <Users className="w-4 h-4" /> },
          { id: 'login_design', label: 'Front Login Page Wallpaper', icon: <Image className="w-4 h-4" /> },
          { id: 'audit_logs', label: 'Security & EMR Audit Trail', icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'feedback', label: 'Patient CSAT & Quality', icon: <Star className="w-4 h-4" /> },
          { id: 'hospital_settings', label: 'Hospital Master Profile', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
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

      {/* TAB 1: Executive Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium block">Total OPD Consultations</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{allAppointments.length}</span>
              <p className="text-[11px] text-emerald-700 font-semibold">{totalPatientsSeen} completed consultations</p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium block">Digital Gross Collections</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</span>
              <p className="text-[11px] text-emerald-700 font-semibold">100% GST & NHA compliant ledger</p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium block">Patient Satisfaction Score</span>
              <span className="text-2xl font-black text-amber-600 font-mono">{avgDoctorRating} ★</span>
              <p className="text-[11px] text-slate-500">{allFeedbacks.length} verified patient reviews</p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium block">Hospital Cleanliness Index</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">{avgCleanlinessRating} / 5.0</span>
              <p className="text-[11px] text-emerald-700 font-semibold">NABH Hygiene Benchmark</p>
            </div>
          </div>

          {/* Doctor Performance Summary */}
          <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-slate-900">Specialist OPD & Clinical Department Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Consultant Doctor</th>
                    <th className="p-3">Specialization & Room</th>
                    <th className="p-3 text-center">Consultation Fee</th>
                    <th className="p-3 text-center">OPD Load</th>
                    <th className="p-3 text-right">Collections (INR)</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allDoctors.map((doc) => {
                    const docApts = allAppointments.filter(a => a.doctor_id === doc.id);
                    const docRev = docApts.reduce((acc, curr) => acc + curr.fee, 0);
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2.5">
                          <img src={doc.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <span>{doc.name}</span>
                        </td>
                        <td className="p-3 text-slate-600">
                          {doc.specialization.split(',')[0]} • <span className="text-slate-500 font-mono">{doc.opdRoom}</span>
                        </td>
                        <td className="p-3 text-center font-mono font-semibold text-slate-800">
                          ₹{doc.consultationFee}
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-800">
                          {docApts.length} Patients
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">
                          ₹{docRev.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Active OPD
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Staff & RBAC User Management with Passwords */}
      {activeTab === 'staff' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Hospital Staff Credentials & RBAC Access Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin exclusively provisions and assigns staff accounts (Doctors, Receptionists, Lab / Pharmacy Technicians, Admins) with Email and Passwords.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <div className="relative flex-1 sm:w-64 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search staff by name, email, role..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Provision Account</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {allUsers
              .filter(u => u.role !== 'patient')
              .filter(u => {
                if (!staffSearchQuery.trim()) return true;
                const q = staffSearchQuery.toLowerCase();
                return (
                  u.name.toLowerCase().includes(q) ||
                  u.email.toLowerCase().includes(q) ||
                  u.role.toLowerCase().includes(q) ||
                  (u.phone && u.phone.includes(q))
                );
              })
              .map((u) => {
              const isPasswordVisible = visiblePasswords[u.id];
              return (
                <div key={u.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 p-2 rounded-xl transition">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                      <span className={`font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : u.role === 'doctor'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : u.role === 'reception'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {u.role === 'department' ? 'Lab / Pharmacy' : u.role}
                      </span>
                      {u.isActive ? (
                        <span className="text-emerald-700 text-[10px] flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Active Staff
                        </span>
                      ) : (
                        <span className="text-rose-600 text-[10px] font-semibold">Inactive</span>
                      )}
                    </div>
                    <p className="text-slate-500">
                      Login Email: <strong className="text-slate-800 font-mono">{u.email}</strong> • Mobile Phone: <span className="font-mono text-slate-700">+91 {u.phone}</span>
                    </p>
                  </div>

                  {/* Password & Security Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-700 font-bold">
                        {isPasswordVisible ? (u.password || 'SecretPass123') : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(u.id)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                        title={isPasswordVisible ? "Hide password" : "Show password"}
                      >
                        {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setResettingUser(u);
                        setNewPasswordValue('Doctor@2025');
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5"
                      title="Reset Staff Login Password"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 mt-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Patient Self-Registration vs Staff Security Policy:</strong>
              <p className="text-emerald-900 text-[11px] mt-0.5">
                Patients create their own accounts via Mobile Phone Number & Instant OTP verification on the login page. All staff accounts (Doctors, Receptionists, Diagnostic Lab Technicians, Administrators) are strictly managed and assigned by the Hospital Admin above.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Front Login Page Wallpaper Customizer (USER REQUESTED) */}
      {activeTab === 'login_design' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">Front Login Page Photographic Wallpaper Manager</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Admin Managed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select or upload the photographic background visual that greets patients and healthcare staff on the main login screen.
            </p>
          </div>

          {wallpaperSavedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-3.5 text-xs flex items-center gap-2 font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Login page background photo updated and published immediately!</span>
            </div>
          )}

          {/* Current Wallpaper Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Active Login Background Preview:</span>
            <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-inner relative group">
              <img
                src={customWallpaperUrl}
                alt="Login Page Wallpaper"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Live Login Background</span>
                </div>
                <h4 className="font-black text-lg">{currentHospital.name}</h4>
                <p className="text-xs text-slate-200">NABH {currentHospital.nabhLevel || 'Accredited'} • High Resolution Visual Identity</p>
              </div>
            </div>
          </div>

          {/* Preset Wallpaper Gallery */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Curated Hospital Wallpaper Presets:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WALLPAPER_PRESETS.map((preset, idx) => {
                const isSelected = customWallpaperUrl === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomWallpaperUrl(preset.url);
                      handleSaveWallpaper(preset.url);
                    }}
                    className={`text-left rounded-2xl overflow-hidden border-2 transition p-2 bg-slate-50 hover:bg-emerald-50/50 cursor-pointer space-y-2 ${
                      isSelected ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden relative">
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-sm">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{preset.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{preset.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL or Upload Input */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-900 block">Or Set Custom Wallpaper Image URL / Upload:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customWallpaperUrl}
                onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                placeholder="https://example.com/hospital-exterior-photo.jpg"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => handleSaveWallpaper(customWallpaperUrl)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Apply Wallpaper</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Security & Regulatory EMR Audit Trail */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Immutable Security & Regulatory Audit Trail</h3>
              <p className="text-xs text-slate-500 mt-0.5">NABH & DISHA compliant tracking of all EMR access, token bookings, and prescription changes.</p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={auditRoleFilter}
                onChange={(e) => setAuditRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:bg-white focus:border-emerald-600 shrink-0 cursor-pointer font-medium"
              >
                <option value="all">All Roles</option>
                <option value="doctor">Doctor Actions</option>
                <option value="reception">Reception Actions</option>
                <option value="department">Department / Lab Actions</option>
                <option value="patient">Patient Self Actions</option>
                <option value="admin">Admin Actions</option>
              </select>

              <div className="relative flex-1 sm:w-64 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search logs, UHID, IP..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      {log.actorRole}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>
                </div>

                <p className="text-slate-600 text-xs">{log.details}</p>

                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200">
                  <span>IP: {log.ipAddress}</span>
                  {log.targetPatientUhid && (
                    <span className="text-emerald-700 font-medium">Target UHID: {log.targetPatientUhid}</span>
                  )}
                  {log.targetPatientName && (
                    <span>Patient: {log.targetPatientName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Patient Feedback & Quality Audit */}
      {activeTab === 'feedback' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Verified Patient Feedback & Quality Audit</h3>
            <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-xl font-bold border border-amber-200">
              Avg CSAT: {avgDoctorRating} ★
            </span>
          </div>

          <div className="space-y-3">
            {allFeedbacks.map((fb) => {
              const pat = db.getPatientById(fb.patient_id);
              const doc = db.getDoctorById(fb.doctor_id);

              return (
                <div key={fb.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{pat?.fullName || 'Verified Patient'}</span>
                      <span className="text-amber-600 font-bold">★ {fb.rating}.0 / 5.0</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{fb.submittedAt}</span>
                  </div>

                  <p className="text-slate-600 italic">"{fb.comment}"</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Doctor: <strong className="text-slate-800">{doc?.name}</strong> (Rating: {fb.doctorRating}★)</span>
                    <span>•</span>
                    <span>Cleanliness: {fb.cleanlinessRating}★</span>
                    <span>•</span>
                    <span>Wait Time: {fb.waitTimeRating}★</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: Hospital Master Configuration */}
      {activeTab === 'hospital_settings' && (
        <div className="bg-white border border-emerald-100 rounded-[28px] p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="font-bold text-base text-slate-900">Multi-Tenant Hospital Profile & Statutory Settings</h3>
            <p className="text-xs text-slate-500">Configure hospital legal entity details, GSTIN, NABH level, and default OPD timings.</p>
          </div>

          <form onSubmit={handleSaveHospitalSettings} className="max-w-2xl space-y-4 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Hospital Legal Name</label>
              <input
                type="text"
                value={hospName}
                onChange={(e) => setHospName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">State / City</label>
                <input
                  type="text"
                  value={hospCity}
                  onChange={(e) => setHospCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={hospGstin}
                  onChange={(e) => setHospGstin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">NABH Accreditation Tier</label>
                <select
                  value={hospNabh}
                  onChange={(e) => setHospNabh(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-emerald-600"
                >
                  <option value="Level 3 - Full Accreditation">Level 3 - Full NABH Accreditation</option>
                  <option value="Level 2 - Progressive Accreditation">Level 2 - Progressive NABH</option>
                  <option value="Level 1 - Entry Level Pre-Accredited">Level 1 - Entry Level Pre-Accredited</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Clinical Establishment Reg. No.</label>
                <input
                  type="text"
                  value={hospRegNumber}
                  onChange={(e) => setHospRegNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Hospital Campus Address</label>
              <input
                type="text"
                value={hospAddress}
                onChange={(e) => setHospAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">OPD Operational Hours</label>
              <input
                type="text"
                value={hospOpdTimings}
                onChange={(e) => setHospOpdTimings(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            >
              Save Hospital Master Config
            </button>
          </form>
        </div>
      )}

      {/* MODAL: Provision New Staff User with Password */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-emerald-100 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900">Provision New Hospital Staff Account</h3>
            <p className="text-slate-500 text-[11px]">
              Set their role, credentials, and initial password for direct login access.
            </p>

            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Staff Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Priya Nair / Sunita Verma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600 font-medium"
                >
                  <option value="doctor">Doctor (OPD & Clinical Consultant)</option>
                  <option value="reception">Receptionist (Front-Desk & Token Counter)</option>
                  <option value="department">Laboratory / Pharmacy Staff</option>
                  <option value="admin">Hospital Administrator / IT Director</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Login Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. priya.nair@pulsehealth.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Assign Login Password</label>
                  <button
                    type="button"
                    onClick={() => setNewUserPassword(`Pass@${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              {newUserRole === 'doctor' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 block">Doctor Profile Details</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Specialization (e.g. Cardiology)"
                      value={newUserSpecialization}
                      onChange={(e) => setNewUserSpecialization(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="OPD Room (e.g. Room 301)"
                      value={newUserRoom}
                      onChange={(e) => setNewUserRoom(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Consultation Fee (INR)"
                    value={newUserFee}
                    onChange={(e) => setNewUserFee(parseInt(e.target.value) || 800)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                >
                  Provision Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reset Staff Password */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-emerald-100 w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900">Change Staff Password</h3>
            <p className="text-slate-500 text-xs">
              Updating credentials for <strong>{resettingUser.name}</strong> ({resettingUser.email}).
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">New Password</label>
                <input
                  type="text"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveResetPassword}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
