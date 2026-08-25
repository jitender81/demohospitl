export type UserRole = 'patient' | 'doctor' | 'reception' | 'department' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: UserRole;
  hospital_id: string;
  avatar?: string;
  isActive?: boolean;
  department?: string;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  gstin: string;
  nabhAccredited: boolean;
  nabhLevel?: string;
  registrationNumber?: string;
  opdTiming: string;
  tagline: string;
  primaryColor: string;
  loginWallpaperUrl?: string;
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  code: string;
  headOfDept: string;
  icon: string;
  description: string;
  opdFloor: string;
  consultationFee: number;
}

export interface DoctorAvailability {
  days: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  slotDurationMinutes: number; // 15
  isLeaveToday: boolean;
  otBlocks?: string[]; // e.g. ["14:00 - 16:00 (Major Surgery)"]
}

export interface Doctor {
  id: string;
  user_id: string;
  hospital_id: string;
  department_id: string;
  name: string;
  qualification: string;
  registrationNumber: string; // e.g. "MCI-48291"
  opdRoom: string;
  consultationFee: number;
  experienceYears: number;
  rating: number;
  totalConsultations: number;
  availability: DoctorAvailability;
  specialization: string;
  avatar: string;
}

export interface Patient {
  id: string;
  user_id: string;
  hospital_id: string;
  uhid: string; // e.g. "PLS-2025-08412"
  fullName: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  registeredAt: string;
}

export type QueueStatus = 'scheduled' | 'waiting' | 'in_consultation' | 'completed' | 'no_show' | 'cancelled';
export type PriorityLevel = 'normal' | 'urgent' | 'senior_citizen' | 'emergency';
export type PaymentStatus = 'pending' | 'paid' | 'waived' | 'refunded';

export interface Vitals {
  bp: string; // e.g. "120/80"
  pulse: number; // 74 bpm
  temp: number; // 98.4 F
  weight: number; // 68 kg
  spo2: number; // 98 %
  recordedAt?: string;
}

export interface Appointment {
  id: string;
  hospital_id: string;
  patient_id: string;
  doctor_id: string;
  department_id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:30 AM"
  tokenNumber: string; // "A-14"
  queueStatus: QueueStatus;
  priority: PriorityLevel;
  type: 'opd' | 'followup' | 'emergency' | 'teleconsult';
  reason: string;
  symptoms?: string[];
  vitals?: Vitals;
  fee: number;
  paymentStatus: PaymentStatus;
  paymentMode?: 'upi' | 'razorpay' | 'cash' | 'card';
  bookedBy: 'self' | 'reception' | 'doctor';
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "1-0-1 (Morning & Night)"
  duration: string; // e.g. "5 days"
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach';
  instructions: string;
}

export interface Prescription {
  id: string;
  hospital_id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  diagnosis: string;
  icdCode?: string;
  symptoms: string[];
  clinicalNotes: string;
  medications: Medication[];
  labTestsOrdered: string[];
  advice: string;
  followUpDate?: string;
  isDispensed: boolean;
  dispensedAt?: string;
  dispensedBy?: string;
}

export interface LabParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'high' | 'low' | 'critical';
}

export interface LabReport {
  id: string;
  hospital_id: string;
  appointment_id?: string;
  patient_id: string;
  doctor_id: string;
  department_id: string;
  testName: string;
  testCategory: 'blood' | 'radiology' | 'biochemistry' | 'pathology' | 'urine';
  sampleCollectedAt: string;
  reportedAt: string;
  status: 'requested' | 'sample_collected' | 'processing' | 'ready';
  parameters: LabParameter[];
  conclusion: string;
  pathologist: string;
  isWhatsAppSent: boolean;
  fileUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
}

export interface BillingItem {
  description: string;
  category: 'Consultation' | 'Pharmacy' | 'Lab Test' | 'Procedure' | 'Registration';
  hsn: string;
  amount: number;
  gstRate: number; // 0 for medical consultation, 5 or 12 for meds/implants
  gstAmount: number;
  total: number;
}

export interface BillingReceipt {
  id: string;
  hospital_id: string;
  patient_id: string;
  appointment_id?: string;
  receiptNumber: string; // e.g. "REC-2025-0491"
  date: string;
  items: BillingItem[];
  subTotal: number;
  gstTotal: number;
  grandTotal: number;
  paymentMode: 'upi' | 'razorpay' | 'cash' | 'card' | 'tpa_insurance';
  transactionId?: string;
  paymentStatus: 'completed' | 'pending' | 'refunded';
  collectedBy: string;
}

export interface InventoryItem {
  id: string;
  hospital_id: string;
  department: 'pharmacy' | 'lab' | 'general';
  itemName: string;
  genericName: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  unitPrice: number;
  mrp: number;
  supplier: string;
  supplierName?: string;
}

export interface PatientFeedback {
  id: string;
  hospital_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  rating: number; // 1 to 5
  doctorRating: number;
  waitTimeRating: number;
  cleanlinessRating: number;
  comment: string;
  tags: string[];
  submittedAt: string;
}

export interface AuditLog {
  id: string;
  hospital_id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'LOGIN' | 'LOGOUT' | 'VIEW_PATIENT_RECORD' | 'CREATE_PRESCRIPTION' | 'DISPENSE_MEDICINE' | 'UPLOAD_LAB_REPORT' | 'COLLECT_PAYMENT' | 'MODIFY_SCHEDULE' | 'ADMIN_USER_UPDATE' | 'TOKEN_ISSUED' | 'UPDATE_HOSPITAL_CONFIG' | 'CREATE_USER' | 'UPDATE_LOGIN_WALLPAPER' | 'RESET_PASSWORD' | 'PATIENT_REGISTRATION';
  targetPatientUhid?: string;
  targetPatientName?: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

export interface WhatsAppNotification {
  id: string;
  hospital_id: string;
  recipientPhone: string;
  recipientName: string;
  templateName: string;
  messageText: string;
  variables: Record<string, string>;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: 'appointment' | 'queue' | 'lab_report' | 'prescription' | 'billing';
  body: string;
  variables: string[];
  isActive: boolean;
}

export interface PatientChatMessage {
  id: string;
  hospital_id: string;
  patient_id: string;
  patient_uhid: string;
  patient_name: string;
  patient_phone: string;
  sender: 'patient' | 'reception';
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
  category?: 'appointment_inquiry' | 'queue_delay' | 'billing_insurance' | 'report_scan' | 'general';
}
