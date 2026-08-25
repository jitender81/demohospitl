import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Hospital, Patient } from '../types';
import { db, DEMO_USERS, INITIAL_HOSPITALS, DEFAULT_LOGIN_WALLPAPER } from './mockDatabase';

interface RegisterPatientData {
  fullName: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  email?: string;
  address?: string;
  emergencyName?: string;
  emergencyRelation?: string;
  emergencyPhone?: string;
}

interface AuthContextType {
  currentUser: User | null;
  currentHospital: Hospital;
  activeRole: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  loginWallpaper: string;
  loginWithEmail: (email: string, password: string) => { success: boolean; message?: string };
  loginWithPhone: (phone: string, otp?: string) => { success: boolean; message?: string };
  registerPatient: (data: RegisterPatientData) => { success: boolean; message?: string; uhid?: string };
  setLoginWallpaper: (url: string) => void;
  updateHospitalProfile: (updates: Partial<Hospital>) => void;
  switchHospital: (hospitalId: string) => void;
  logout: () => void;
  requestOtp: (phone: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ph_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null; // Prompt login screen on first load / if logged out
  });

  const [currentHospital, setCurrentHospital] = useState<Hospital>(() => {
    const savedHospId = localStorage.getItem('ph_active_hospital_id');
    if (savedHospId) {
      const found = db.getHospitalById(savedHospId);
      if (found) return found;
    }
    return INITIAL_HOSPITALS[0];
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ph_jwt_token') || null;
  });

  const [loginWallpaper, setWallpaperState] = useState<string>(() => {
    return db.getLoginWallpaper();
  });

  const activeRole: UserRole = currentUser ? currentUser.role : 'patient';

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ph_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ph_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ph_active_hospital_id', currentHospital.id);
  }, [currentHospital]);

  const setLoginWallpaper = (url: string) => {
    db.setLoginWallpaper(url);
    setWallpaperState(url);
    localStorage.setItem('ph_login_wallpaper', url);
  };

  const updateHospitalProfile = (updates: Partial<Hospital>) => {
    const updated = { ...currentHospital, ...updates };
    setCurrentHospital(updated);
    db.updateHospital(updated);
    localStorage.setItem('ph_active_hospital_id', updated.id);
    if (updates.loginWallpaperUrl) {
      setWallpaperState(updates.loginWallpaperUrl);
      db.setLoginWallpaper(updates.loginWallpaperUrl);
      localStorage.setItem('ph_login_wallpaper', updates.loginWallpaperUrl);
    }
  };

  const switchHospital = (hospitalId: string) => {
    const hosp = db.getHospitalById(hospitalId);
    if (hosp) {
      setCurrentHospital(hosp);
      if (currentUser) {
        setCurrentUser({ ...currentUser, hospital_id: hospitalId });
      }
    }
  };

  const requestOtp = async (phone: string): Promise<string> => {
    // Generate standardized 6-digit OTP
    const generatedOtp = '482910';
    
    // Dispatched simulated WhatsApp notification
    db.sendWhatsAppNotification({
      hospital_id: currentHospital.id,
      recipientPhone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      recipientName: 'Patient User',
      templateName: 'otp_verification',
      messageText: `Your PulseHealth Patient Login OTP is *${generatedOtp}*. Valid for 10 minutes. Do NOT share this confidential code with anyone.`,
      variables: { otp: generatedOtp }
    });

    return generatedOtp;
  };

  // Staff Login using Email & Password (managed by Admin)
  const loginWithEmail = (email: string, password: string): { success: boolean; message?: string } => {
    const cleanEmail = email.toLowerCase().trim();
    const user = db.getUsers().find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'No registered staff account found with this email. Please contact your Hospital Administrator.' };
    }

    if (user.role === 'patient') {
      return { success: false, message: 'Patient accounts must log in using their Registered Mobile Phone Number.' };
    }

    if (user.isActive === false) {
      return { success: false, message: 'This staff account has been deactivated by the Hospital Administrator.' };
    }

    // Password validation (checks exact password or standard admin default)
    const validPassword = user.password || 'Pulse@2025';
    if (password !== validPassword && password !== 'Admin@123' && password !== 'Doctor@123' && password !== 'Reception@123' && password !== 'Lab@123') {
      return { success: false, message: 'Invalid password. Please verify your credentials or ask Administrator to reset it.' };
    }

    // Successfully authenticated
    setCurrentUser(user);
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      user_id: user.id,
      role: user.role,
      hospital_id: user.hospital_id || currentHospital.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 86400
    }))}`;
    setToken(mockJwt);
    localStorage.setItem('ph_jwt_token', mockJwt);

    // Audit Log
    db.addAuditLog({
      hospital_id: user.hospital_id || currentHospital.id,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'LOGIN',
      ipAddress: '127.0.0.1 (Hospital Staff Console)',
      details: `Staff member signed in with role: ${user.role.toUpperCase()} (${user.email})`
    });

    return { success: true };
  };

  // Patient Login using Mobile Phone Number
  const loginWithPhone = (phone: string, otp?: string): { success: boolean; message?: string } => {
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    
    if (cleanPhone.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    if (otp && otp !== '482910' && otp.length !== 6) {
      return { success: false, message: 'Incorrect OTP. Please enter 482910 or the OTP sent via WhatsApp.' };
    }

    // Find existing patient
    let patient = db.getPatients().find(p => p.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone));
    let user = db.getUsers().find(u => u.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone) && u.role === 'patient');

    if (!user) {
      if (patient) {
        user = {
          id: patient.user_id || `usr-${patient.id}`,
          name: patient.fullName,
          phone: patient.phone,
          email: patient.email || `${cleanPhone}@patient.pulsehealth.in`,
          role: 'patient',
          hospital_id: patient.hospital_id || currentHospital.id,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        db.addUser(user);
      } else {
        // Unregistered patient prompt
        return { 
          success: false, 
          message: `No patient registered with mobile number +91 ${cleanPhone}. Please click "Sign Up" above to register and generate your unique UHID.` 
        };
      }
    }

    setCurrentUser(user);
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      user_id: user.id,
      role: 'patient',
      hospital_id: user.hospital_id || currentHospital.id,
      phone: user.phone,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 86400
    }))}`;
    setToken(mockJwt);
    localStorage.setItem('ph_jwt_token', mockJwt);

    // Audit Log
    db.addAuditLog({
      hospital_id: user.hospital_id || currentHospital.id,
      actorId: user.id,
      actorName: user.name,
      actorRole: 'patient',
      action: 'LOGIN',
      ipAddress: '127.0.0.1 (Patient Mobile Portal)',
      details: `Patient signed in via mobile verification (+91 ${cleanPhone})`
    });

    return { success: true };
  };

  // Patient Registration (generates UHID & User account)
  const registerPatient = (data: RegisterPatientData): { success: boolean; message?: string; uhid?: string } => {
    const cleanPhone = data.phone.replace(/[^0-9]/g, '').slice(-10);
    
    if (!cleanPhone || cleanPhone.length !== 10) {
      return { success: false, message: 'Please provide a valid 10-digit mobile number.' };
    }

    const existing = db.getPatients().find(p => p.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone));
    if (existing) {
      return { success: false, message: `A patient with mobile +91 ${cleanPhone} is already registered with UHID: ${existing.uhid}. Please log in directly.` };
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const uhid = `PLS-2025-${randomNum}`;
    const newUserId = `usr-pat-${Date.now()}`;
    const newPatId = `pat-${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      name: data.fullName,
      phone: cleanPhone,
      email: data.email || `${cleanPhone}@patient.pulsehealth.in`,
      role: 'patient',
      hospital_id: currentHospital.id,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const newPatient: Patient = {
      id: newPatId,
      user_id: newUserId,
      hospital_id: currentHospital.id,
      uhid,
      fullName: data.fullName,
      phone: cleanPhone,
      email: data.email || `${cleanPhone}@patient.pulsehealth.in`,
      age: data.age,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      address: data.address || `${currentHospital.city}, India`,
      emergencyContact: {
        name: data.emergencyName || 'Emergency Contact',
        relation: data.emergencyRelation || 'Family Member',
        phone: data.emergencyPhone || `+91 ${cleanPhone}`
      },
      allergies: ['No Known Drug Allergies (NKDA)'],
      chronicConditions: ['None Reported'],
      registeredAt: new Date().toISOString().split('T')[0]
    };

    db.addUser(newUser);
    db.addPatient(newPatient);

    // Auto login
    setCurrentUser(newUser);
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      user_id: newUser.id,
      role: 'patient',
      hospital_id: currentHospital.id,
      phone: newUser.phone,
      name: newUser.name,
      exp: Math.floor(Date.now() / 1000) + 86400
    }))}`;
    setToken(mockJwt);
    localStorage.setItem('ph_jwt_token', mockJwt);

    // Send WhatsApp confirmation
    db.sendWhatsAppNotification({
      hospital_id: currentHospital.id,
      recipientPhone: `+91 ${cleanPhone}`,
      recipientName: data.fullName,
      templateName: 'patient_registered',
      messageText: `Namaste ${data.fullName}! Welcome to ${currentHospital.name}. Your Unique Health Identification Number (UHID) is *${uhid}*. You can use this for all OPD, Lab, and Doctor appointments.`,
      variables: { uhid, name: data.fullName }
    });

    // Audit Log
    db.addAuditLog({
      hospital_id: currentHospital.id,
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: 'patient',
      action: 'PATIENT_REGISTRATION',
      targetPatientUhid: uhid,
      targetPatientName: data.fullName,
      ipAddress: '127.0.0.1 (Self Registration Portal)',
      details: `New patient self-registered via mobile (+91 ${cleanPhone}). Assigned UHID: ${uhid}`
    });

    return { success: true, uhid };
  };

  const logout = () => {
    if (currentUser) {
      db.addAuditLog({
        hospital_id: currentUser.hospital_id || currentHospital.id,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'LOGOUT',
        ipAddress: '127.0.0.1 (Portal Client)',
        details: `User signed out from session.`
      });
    }
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('ph_auth_user');
    localStorage.removeItem('ph_jwt_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentHospital,
        activeRole,
        token,
        isAuthenticated: !!currentUser,
        loginWallpaper,
        loginWithEmail,
        loginWithPhone,
        registerPatient,
        setLoginWallpaper,
        updateHospitalProfile,
        switchHospital,
        logout,
        requestOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

