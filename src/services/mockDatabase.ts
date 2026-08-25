import { 
  Hospital, 
  Department, 
  Doctor, 
  Patient, 
  Appointment, 
  Prescription, 
  LabReport, 
  BillingReceipt, 
  InventoryItem, 
  PatientFeedback, 
  AuditLog, 
  WhatsAppNotification, 
  NotificationTemplate,
  User,
  PatientChatMessage
} from '../types';

// Pre-seeded multi-tenant hospitals in India
export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-delhi-01',
    name: 'PulseHealth Superspeciality Hospital',
    slug: 'pulsehealth-delhi',
    logo: '🏥',
    address: 'Plot 14, Institutional Area, Sector 44',
    city: 'Gurugram / New Delhi NCR',
    state: 'Haryana',
    pincode: '122003',
    phone: '+91 124 489 9000',
    emergencyPhone: '1066 / +91 124 489 9999',
    email: 'helpdesk@pulsehealth.in',
    gstin: '07AAAAH2394K1Z5',
    nabhAccredited: true,
    opdTiming: 'Mon - Sat: 08:00 AM - 08:00 PM | Sun: 09:00 AM - 01:00 PM',
    tagline: 'Centre of Medical Excellence & Precision Care',
    primaryColor: '#059669' // Emerald
  },
  {
    id: 'hosp-mumbai-02',
    name: 'Apollo City Hospital & Research Institute',
    slug: 'apollo-city-mumbai',
    logo: '🏨',
    address: 'Dr. E Moses Road, Mahalakshmi',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400011',
    phone: '+91 22 2493 8888',
    emergencyPhone: '1066',
    email: 'mumbai@apollocity.org',
    gstin: '27AABCA1234M1Z2',
    nabhAccredited: true,
    opdTiming: '24x7 Emergency | OPD: 08:30 AM - 07:30 PM',
    tagline: 'Touched by Compassion, Backed by Science',
    primaryColor: '#0284c7' // Sky
  },
  {
    id: 'hosp-blr-03',
    name: 'Fortis Memorial Healthcare',
    slug: 'fortis-health-blr',
    logo: '🏥',
    address: 'Bannerghatta Main Road, Opposite IIM-B',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560076',
    phone: '+91 80 6621 4444',
    emergencyPhone: '105010',
    email: 'care.blr@fortishealth.com',
    gstin: '29AAACF5567L1ZX',
    nabhAccredited: true,
    opdTiming: 'Mon - Sat: 08:00 AM - 09:00 PM',
    tagline: 'Saving and Enriching Lives',
    primaryColor: '#7c3aed' // Violet
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cardio',
    hospital_id: 'hosp-delhi-01',
    name: 'Cardiology & Cardiac Surgery',
    code: 'CARD',
    headOfDept: 'Dr. Rajesh Sharma, MD, DM (Cardiology)',
    icon: 'HeartPulse',
    description: 'Comprehensive interventional cardiology, 24x7 primary PCI, coronary care, echocardiography, and heart failure clinic.',
    opdFloor: '2nd Floor, Wing A, Room 201-206',
    consultationFee: 1200
  },
  {
    id: 'dept-ortho',
    hospital_id: 'hosp-delhi-01',
    name: 'Orthopaedics & Joint Replacement',
    code: 'ORTH',
    headOfDept: 'Dr. Vikram Malhotra, MS (Ortho), M.Ch',
    icon: 'Bone',
    description: 'Robotic joint replacement, sports injury rehab, arthroscopy, trauma center, and spine surgery.',
    opdFloor: 'Ground Floor, Wing B, Room 102-108',
    consultationFee: 1000
  },
  {
    id: 'dept-neuro',
    hospital_id: 'hosp-delhi-01',
    name: 'Neurology & Neurosurgery',
    code: 'NEUR',
    headOfDept: 'Dr. Ananya Mukherjee, DM (Neuro - AIIMS)',
    icon: 'Brain',
    description: 'Comprehensive stroke care unit, epilepsy management, headache clinic, Parkinson\'s care and microneurosurgery.',
    opdFloor: '3rd Floor, Wing C, Room 301-305',
    consultationFee: 1500
  },
  {
    id: 'dept-genmed',
    hospital_id: 'hosp-delhi-01',
    name: 'General & Internal Medicine',
    code: 'GMED',
    headOfDept: 'Dr. Priya Nair, MD (Internal Medicine)',
    icon: 'Stethoscope',
    description: 'Diagnosis and management of lifestyle disorders, infectious diseases, hypertension, diabetes mellitus, and adult vaccinations.',
    opdFloor: '1st Floor, OPD Complex, Room 111-120',
    consultationFee: 800
  },
  {
    id: 'dept-gynae',
    hospital_id: 'hosp-delhi-01',
    name: 'Obstetrics & Gynaecology',
    code: 'GYNA',
    headOfDept: 'Dr. Suniti Singhania, MD, DGO, FICOG',
    icon: 'Baby',
    description: 'High-risk pregnancy unit, fetal medicine, laparoscopic gynaecology, fertility counseling and painless delivery.',
    opdFloor: '4th Floor, Mother & Child Block',
    consultationFee: 1100
  },
  {
    id: 'dept-paed',
    hospital_id: 'hosp-delhi-01',
    name: 'Paediatrics & Neonatology',
    code: 'PAED',
    headOfDept: 'Dr. Rohan Deshmukh, MD (Paediatrics)',
    icon: 'Smile',
    description: 'Level-3 NICU/PICU, child immunization clinic, developmental assessment and paediatric emergency care.',
    opdFloor: '4th Floor, Room 410-415',
    consultationFee: 900
  },
  {
    id: 'dept-lab',
    hospital_id: 'hosp-delhi-01',
    name: 'Laboratory & Diagnostic Pathology',
    code: 'PATH',
    headOfDept: 'Dr. Meenakshi Soni, MD (Pathology - NABL Assessor)',
    icon: 'FlaskConical',
    description: 'Automated biochemistry, haematology, molecular biology, immunology and histopathology with barcode sample tracking.',
    opdFloor: 'Basement 1, Diagnostic Core',
    consultationFee: 0
  },
  {
    id: 'dept-pharmacy',
    hospital_id: 'hosp-delhi-01',
    name: 'Central 24x7 In-House Pharmacy',
    code: 'PHARM',
    headOfDept: 'Pharmacist Amit Kumar (B.Pharm, R.Ph)',
    icon: 'Pill',
    description: 'NABH-compliant automated pharmacy stocking all scheduled drugs, oncology formulations, and surgical consumables.',
    opdFloor: 'Ground Floor Atrium',
    consultationFee: 0
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-rajesh',
    user_id: 'usr-doc-01',
    hospital_id: 'hosp-delhi-01',
    department_id: 'dept-cardio',
    name: 'Dr. Rajesh Sharma',
    qualification: 'MBBS, MD (Medicine), DM (Cardiology - AIIMS Delhi), FACC',
    registrationNumber: 'DMC/R/2004/4819',
    opdRoom: 'Room 204 (Wing A)',
    consultationFee: 1200,
    experienceYears: 18,
    rating: 4.9,
    totalConsultations: 1420,
    specialization: 'Interventional Cardiology, Heart Failure & Angioplasty',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      startTime: '09:00 AM',
      endTime: '02:00 PM',
      slotDurationMinutes: 15,
      isLeaveToday: false,
      otBlocks: ['14:00 - 16:30 (Cath Lab Procedures)']
    }
  },
  {
    id: 'doc-priya',
    user_id: 'usr-doc-02',
    hospital_id: 'hosp-delhi-01',
    department_id: 'dept-genmed',
    name: 'Dr. Priya Nair',
    qualification: 'MBBS, MD (General Medicine - KEM Mumbai), MRCP (UK)',
    registrationNumber: 'MMC/2010/08129',
    opdRoom: 'Room 114 (OPD Complex)',
    consultationFee: 800,
    experienceYears: 14,
    rating: 4.8,
    totalConsultations: 2850,
    specialization: 'Diabetology, Infectious Diseases & Hypertension',
    avatar: 'https://images.unsplash.com/photo-1594824813515-585806652436?w=400&auto=format&fit=crop&q=80',
    availability: {
      days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
      startTime: '10:00 AM',
      endTime: '05:00 PM',
      slotDurationMinutes: 15,
      isLeaveToday: false
    }
  },
  {
    id: 'doc-ananya',
    user_id: 'usr-doc-03',
    hospital_id: 'hosp-delhi-01',
    department_id: 'dept-neuro',
    name: 'Dr. Ananya Mukherjee',
    qualification: 'MBBS, MD (Medicine), DM (Neurology - NIMHANS)',
    registrationNumber: 'KMC/2012/6530',
    opdRoom: 'Room 302 (Wing C)',
    consultationFee: 1500,
    experienceYears: 12,
    rating: 4.95,
    totalConsultations: 980,
    specialization: 'Stroke Rehab, Migraine, Epilepsy & Movement Disorders',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    availability: {
      days: ['Tue', 'Wed', 'Thu', 'Sat'],
      startTime: '11:00 AM',
      endTime: '04:00 PM',
      slotDurationMinutes: 20,
      isLeaveToday: false
    }
  },
  {
    id: 'doc-vikram',
    user_id: 'usr-doc-04',
    hospital_id: 'hosp-delhi-01',
    department_id: 'dept-ortho',
    name: 'Dr. Vikram Malhotra',
    qualification: 'MBBS, MS (Orthopaedics - PGI Chandigarh), M.Ch (UK)',
    registrationNumber: 'DMC/R/1998/1042',
    opdRoom: 'Room 105 (Wing B)',
    consultationFee: 1000,
    experienceYears: 22,
    rating: 4.85,
    totalConsultations: 3410,
    specialization: 'Robotic Knee & Hip Replacement, Sports Medicine',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    availability: {
      days: ['Mon', 'Tue', 'Thu', 'Fri'],
      startTime: '09:30 AM',
      endTime: '01:30 PM',
      slotDurationMinutes: 15,
      isLeaveToday: false,
      otBlocks: ['14:00 - 18:00 (Joint Arthroplasty OT-4)']
    }
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-rahul-01',
    user_id: 'usr-pat-01',
    hospital_id: 'hosp-delhi-01',
    uhid: 'PLS-2025-04821',
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.in',
    age: 38,
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Tower 4, Flat 902, DLF Phase 5, Gurugram, Haryana 122009',
    emergencyContact: {
      name: 'Sunita Sharma (Spouse)',
      relation: 'Wife',
      phone: '+91 98765 43211'
    },
    allergies: ['Penicillin / Amoxicillin', 'Sulfa Drugs'],
    chronicConditions: ['Hypertension (Stage 1)', 'Mild Hyperlipidaemia'],
    registeredAt: '2025-01-15'
  },
  {
    id: 'pat-kavita-02',
    user_id: 'usr-pat-02',
    hospital_id: 'hosp-delhi-01',
    uhid: 'PLS-2025-05119',
    fullName: 'Kavita Sundaram',
    phone: '9811223344',
    email: 'kavita.s@example.com',
    age: 54,
    gender: 'Female',
    bloodGroup: 'O+',
    address: 'B-42, South Extension Part 2, New Delhi 110049',
    emergencyContact: {
      name: 'Ramesh Sundaram (Husband)',
      relation: 'Spouse',
      phone: '+91 98112 23355'
    },
    allergies: ['No Known Drug Allergies (NKDA)'],
    chronicConditions: ['Type 2 Diabetes Mellitus (HbA1c 7.4%)', 'Hypothyroidism'],
    registeredAt: '2025-02-01'
  },
  {
    id: 'pat-amit-03',
    user_id: 'usr-pat-03',
    hospital_id: 'hosp-delhi-01',
    uhid: 'PLS-2025-06380',
    fullName: 'Amitabh Sen',
    phone: '9717001122',
    email: 'amitabh.sen@example.com',
    age: 62,
    gender: 'Male',
    bloodGroup: 'A+',
    address: 'Flat 304, Green Glen Layout, Bellandur, Bengaluru 560103',
    emergencyContact: {
      name: 'Deepak Sen (Son)',
      relation: 'Son',
      phone: '+91 97170 01133'
    },
    allergies: ['Aspirin (triggers asthma)', 'NSAIDs'],
    chronicConditions: ['Coronary Artery Disease (Post-PTCA 2022)', 'Asthma'],
    registeredAt: '2025-02-18'
  },
  {
    id: 'pat-pooja-04',
    user_id: 'usr-pat-04',
    hospital_id: 'hosp-delhi-01',
    uhid: 'PLS-2025-07204',
    fullName: 'Pooja Aggarwal',
    phone: '9999888777',
    email: 'pooja.aggarwal@example.com',
    age: 29,
    gender: 'Female',
    bloodGroup: 'AB+',
    address: 'C-12, Sector 15, Noida, UP 201301',
    emergencyContact: {
      name: 'Vikas Aggarwal (Brother)',
      relation: 'Brother',
      phone: '+91 99998 88778'
    },
    allergies: ['Dust, Pollen'],
    chronicConditions: ['Migraine with Aura'],
    registeredAt: '2025-03-01'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-rahul-01',
    doctor_id: 'doc-rajesh',
    department_id: 'dept-cardio',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '10:15 AM',
    tokenNumber: 'A-01',
    queueStatus: 'in_consultation',
    priority: 'normal',
    type: 'opd',
    reason: 'Routine cardiac evaluation & chest tightness on exertion',
    symptoms: ['Mild chest heaviness', 'Palpitations', 'High blood pressure readings'],
    vitals: {
      bp: '138/88',
      pulse: 78,
      temp: 98.4,
      weight: 72,
      spo2: 99,
      recordedAt: '09:50 AM by Nurse Sarita'
    },
    fee: 1200,
    paymentStatus: 'paid',
    paymentMode: 'razorpay',
    bookedBy: 'self',
    createdAt: '2025-08-20T10:00:00Z'
  },
  {
    id: 'apt-102',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-kavita-02',
    doctor_id: 'doc-rajesh',
    department_id: 'dept-cardio',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '10:30 AM',
    tokenNumber: 'A-02',
    queueStatus: 'waiting',
    priority: 'senior_citizen',
    type: 'followup',
    reason: 'Post-ECG check & review of Lipid Profile report',
    symptoms: ['Fatigue', 'Dizziness while standing'],
    vitals: {
      bp: '142/90',
      pulse: 82,
      temp: 98.6,
      weight: 64,
      spo2: 98,
      recordedAt: '10:10 AM by Nurse Sarita'
    },
    fee: 1200,
    paymentStatus: 'paid',
    paymentMode: 'upi',
    bookedBy: 'reception',
    createdAt: '2025-08-21T08:30:00Z'
  },
  {
    id: 'apt-103',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-amit-03',
    doctor_id: 'doc-rajesh',
    department_id: 'dept-cardio',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '11:00 AM',
    tokenNumber: 'A-03',
    queueStatus: 'waiting',
    priority: 'urgent',
    type: 'opd',
    reason: 'Severe shortness of breath at night and leg swelling',
    symptoms: ['Orthopnea', 'Bilateral pedal edema', 'Breathlessness NYHA Class II'],
    vitals: {
      bp: '150/96',
      pulse: 88,
      temp: 98.2,
      weight: 79,
      spo2: 96,
      recordedAt: '10:25 AM by Nurse Sarita'
    },
    fee: 1200,
    paymentStatus: 'paid',
    paymentMode: 'cash',
    bookedBy: 'reception',
    createdAt: '2025-08-21T09:15:00Z'
  },
  {
    id: 'apt-104',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-pooja-04',
    doctor_id: 'doc-ananya',
    department_id: 'dept-neuro',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:30 AM',
    tokenNumber: 'N-01',
    queueStatus: 'scheduled',
    priority: 'normal',
    type: 'opd',
    reason: 'Frequent throbbing unilateral headaches and visual blur',
    symptoms: ['Photophobia', 'Nausea', 'Pulsating left temple ache'],
    fee: 1500,
    paymentStatus: 'paid',
    paymentMode: 'razorpay',
    bookedBy: 'self',
    createdAt: '2025-08-20T14:20:00Z'
  },
  {
    id: 'apt-105',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-rahul-01',
    doctor_id: 'doc-priya',
    department_id: 'dept-genmed',
    date: '2025-08-10',
    timeSlot: '02:30 PM',
    tokenNumber: 'G-12',
    queueStatus: 'completed',
    priority: 'normal',
    type: 'opd',
    reason: 'Seasonal viral fever & acute sore throat',
    symptoms: ['Fever 101F', 'Myalgia', 'Dry Cough'],
    vitals: {
      bp: '126/82',
      pulse: 84,
      temp: 100.8,
      weight: 73,
      spo2: 98
    },
    fee: 800,
    paymentStatus: 'paid',
    paymentMode: 'upi',
    bookedBy: 'self',
    createdAt: '2025-08-10T09:00:00Z'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-2025-0089',
    hospital_id: 'hosp-delhi-01',
    appointment_id: 'apt-105',
    patient_id: 'pat-rahul-01',
    doctor_id: 'doc-priya',
    date: '2025-08-10',
    diagnosis: 'Acute Upper Respiratory Tract Infection (URTI) with Reactive Pharyngitis',
    icdCode: 'J06.9 - Acute upper respiratory infection',
    symptoms: ['Fever spike', 'Sore throat', 'General body malaise'],
    clinicalNotes: 'Throat examination revealed tonsillar erythema without purulent exudates. Chest bilaterally clear. Advised warm saline gargles & adequate hydration.',
    medications: [
      {
        name: 'Tab. Dolo 650 (Paracetamol 650mg)',
        dosage: '650 mg',
        frequency: '1-0-1 (Twice daily after meals)',
        duration: '3 Days',
        timing: 'After Food',
        instructions: 'Take SOS if body temperature exceeds 99.5°F'
      },
      {
        name: 'Tab. Montair-LC (Montelukast 10mg + Levocetirizine 5mg)',
        dosage: '10mg/5mg',
        frequency: '0-0-1 (Night time)',
        duration: '5 Days',
        timing: 'After Food',
        instructions: 'Take with warm water before bedtime'
      },
      {
        name: 'Syp. Ascoril-D Cough Syrup',
        dosage: '10 ml',
        frequency: '1-1-1 (Thrice daily)',
        duration: '5 Days',
        timing: 'After Food',
        instructions: 'Do not drink chilled water immediately after syrup'
      }
    ],
    labTestsOrdered: ['Complete Blood Count (CBC) with ESR', 'Serum Ferritin'],
    advice: 'Avoid cold beverages, ice creams and oily fast foods. Steam inhalation twice daily. Review after 5 days if fever persists.',
    followUpDate: '2025-08-16',
    isDispensed: true,
    dispensedAt: '2025-08-10 15:45',
    dispensedBy: 'Amit Kumar (R.Ph)'
  },
  {
    id: 'rx-2025-0104',
    hospital_id: 'hosp-delhi-01',
    appointment_id: 'apt-101',
    patient_id: 'pat-rahul-01',
    doctor_id: 'doc-rajesh',
    date: new Date().toISOString().split('T')[0],
    diagnosis: 'Stage-1 Essential Hypertension with Sinus Tachycardia',
    icdCode: 'I10 - Essential (primary) hypertension',
    symptoms: ['Morning occipital headache', 'Exertional palpitation', 'BP 138/88 mmHg'],
    clinicalNotes: 'S1/S2 heard normally, no gallop or heart murmur. Peripheral pulses well felt. Rest ECG shows normal sinus rhythm with borderline LVH criteria. Advised low salt DASH diet.',
    medications: [
      {
        name: 'Tab. Telma-AM (Telmisartan 40mg + Amlodipine 5mg)',
        dosage: '40mg + 5mg',
        frequency: '1-0-0 (Morning)',
        duration: '30 Days',
        timing: 'After Food',
        instructions: 'Take regularly at 9 AM every morning. Do not skip.'
      },
      {
        name: 'Tab. Rosuvas-10 (Rosuvastatin Calcium)',
        dosage: '10 mg',
        frequency: '0-0-1 (Night)',
        duration: '30 Days',
        timing: 'After Food',
        instructions: 'Night after dinner for lipid control'
      },
      {
        name: 'Tab. Pan-D (Pantoprazole 40mg + Domperidone 30mg SR)',
        dosage: '40mg/30mg',
        frequency: '1-0-0 (Morning)',
        duration: '14 Days',
        timing: 'Empty Stomach',
        instructions: 'Take 30 minutes before morning breakfast'
      }
    ],
    labTestsOrdered: [
      'Lipid Profile (Fasting)',
      '2D Echocardiography with Color Doppler',
      'Serum Creatinine & Electrolytes',
      'HbA1c (Glycated Haemoglobin)'
    ],
    advice: 'Strictly restrict dietary sodium (< 2.5g/day). 30 minutes brisk walking 5 times weekly. Maintain home BP diary twice daily.',
    followUpDate: '2025-09-20',
    isDispensed: false
  }
];

export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: 'lab-2025-0819',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-rahul-01',
    doctor_id: 'doc-rajesh',
    department_id: 'dept-lab',
    testName: 'Complete Lipid Profile (Fasting 12 hrs)',
    testCategory: 'biochemistry',
    sampleCollectedAt: '2025-08-19 08:30 AM',
    reportedAt: '2025-08-19 04:15 PM',
    status: 'ready',
    parameters: [
      { name: 'Total Cholesterol', value: '228', unit: 'mg/dL', referenceRange: '125 - 200', flag: 'high' },
      { name: 'HDL Cholesterol (Good)', value: '42', unit: 'mg/dL', referenceRange: '> 40 (Male)', flag: 'normal' },
      { name: 'LDL Cholesterol (Bad)', value: '146', unit: 'mg/dL', referenceRange: '< 100', flag: 'high' },
      { name: 'Triglycerides', value: '198', unit: 'mg/dL', referenceRange: '< 150', flag: 'high' },
      { name: 'VLDL Cholesterol', value: '39.6', unit: 'mg/dL', referenceRange: '5.0 - 30.0', flag: 'high' },
      { name: 'Chol / HDL Ratio', value: '5.42', unit: 'ratio', referenceRange: '3.3 - 4.4', flag: 'high' }
    ],
    conclusion: 'Dyslipidaemia with elevated LDL and border-high Triglycerides. Statin therapy and lifestyle modification indicated.',
    pathologist: 'Dr. Meenakshi Soni, MD (Pathology), Consultant Clinical Biochemist',
    isWhatsAppSent: true
  },
  {
    id: 'lab-2025-0820',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-rahul-01',
    doctor_id: 'doc-priya',
    department_id: 'dept-lab',
    testName: 'Complete Blood Count (CBC) with Automated Differential',
    testCategory: 'blood',
    sampleCollectedAt: '2025-08-10 10:00 AM',
    reportedAt: '2025-08-10 02:00 PM',
    status: 'ready',
    parameters: [
      { name: 'Haemoglobin (Hb)', value: '14.8', unit: 'g/dL', referenceRange: '13.0 - 17.0', flag: 'normal' },
      { name: 'Total Leucocyte Count (TLC)', value: '7,400', unit: '/cu.mm', referenceRange: '4,000 - 11,000', flag: 'normal' },
      { name: 'Platelet Count', value: '2.45', unit: 'Lakhs/cumm', referenceRange: '1.50 - 4.50', flag: 'normal' },
      { name: 'Neutrophils', value: '62', unit: '%', referenceRange: '40 - 75', flag: 'normal' },
      { name: 'Lymphocytes', value: '30', unit: '%', referenceRange: '20 - 45', flag: 'normal' },
      { name: 'Erythrocyte Sed. Rate (ESR)', value: '12', unit: 'mm/1st hr', referenceRange: '0 - 15', flag: 'normal' }
    ],
    conclusion: 'Haematological parameters within physiological limits. No evidence of active bacterial sepsis or anaemia.',
    pathologist: 'Dr. Meenakshi Soni, MD (Pathology)',
    isWhatsAppSent: true
  },
  {
    id: 'lab-2025-0821',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-kavita-02',
    doctor_id: 'doc-priya',
    department_id: 'dept-lab',
    testName: 'HbA1c & Fasting Plasma Glucose',
    testCategory: 'biochemistry',
    sampleCollectedAt: '2025-08-20 08:15 AM',
    reportedAt: '2025-08-20 01:30 PM',
    status: 'ready',
    parameters: [
      { name: 'HbA1c (Glycosylated Hb)', value: '7.4', unit: '%', referenceRange: '< 5.7 (Normal), > 6.5 (Diabetic)', flag: 'high' },
      { name: 'Estimated Avg Glucose (eAG)', value: '166', unit: 'mg/dL', referenceRange: '70 - 120', flag: 'high' },
      { name: 'Fasting Plasma Glucose', value: '142', unit: 'mg/dL', referenceRange: '70 - 100', flag: 'high' }
    ],
    conclusion: 'Sub-optimally controlled Type-2 Diabetes Mellitus. Review oral hypoglycaemic drug dosages.',
    pathologist: 'Dr. Meenakshi Soni, MD (Pathology)',
    isWhatsAppSent: true
  }
];

export const INITIAL_BILLING_RECEIPTS: BillingReceipt[] = [
  {
    id: 'rec-2025-01001',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-rahul-01',
    appointment_id: 'apt-101',
    receiptNumber: 'PLS-INV-2025-0482',
    date: new Date().toISOString().split('T')[0],
    items: [
      {
        description: 'Super-Speciality OPD Consultation - Dr. Rajesh Sharma (Cardiology)',
        category: 'Consultation',
        hsn: '999312',
        amount: 1200,
        gstRate: 0,
        gstAmount: 0,
        total: 1200
      },
      {
        description: 'Hospital Digital OPD Registration & EMR Token Fee',
        category: 'Registration',
        hsn: '999311',
        amount: 100,
        gstRate: 0,
        gstAmount: 0,
        total: 100
      }
    ],
    subTotal: 1300,
    gstTotal: 0,
    grandTotal: 1300,
    paymentMode: 'razorpay',
    transactionId: 'pay_RZP_994827104921',
    paymentStatus: 'completed',
    collectedBy: 'Sunita Verma (Reception Desk 1)'
  },
  {
    id: 'rec-2025-00940',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-rahul-01',
    receiptNumber: 'PLS-INV-2025-0391',
    date: '2025-08-19',
    items: [
      {
        description: 'NABL Certified Lipid Profile (6 Parameters Automated Analyzer)',
        category: 'Lab Test',
        hsn: '999313',
        amount: 850,
        gstRate: 0,
        gstAmount: 0,
        total: 850
      }
    ],
    subTotal: 850,
    gstTotal: 0,
    grandTotal: 850,
    paymentMode: 'upi',
    transactionId: 'UPI-REF-9382104819',
    paymentStatus: 'completed',
    collectedBy: 'Amit Kumar (Central Lab Counter)'
  },
  {
    id: 'rec-2025-00820',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-kavita-02',
    appointment_id: 'apt-102',
    receiptNumber: 'PLS-INV-2025-0210',
    date: new Date().toISOString().split('T')[0],
    items: [
      {
        description: 'OPD Follow-Up Consultation - Cardiology',
        category: 'Consultation',
        hsn: '999312',
        amount: 1200,
        gstRate: 0,
        gstAmount: 0,
        total: 1200
      }
    ],
    subTotal: 1200,
    gstTotal: 0,
    grandTotal: 1200,
    paymentMode: 'upi',
    transactionId: 'UPI-AXIS-99201948',
    paymentStatus: 'completed',
    collectedBy: 'Sunita Verma'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'med-01',
    hospital_id: 'hosp-delhi-01',
    department: 'pharmacy',
    itemName: 'Telma-AM Tab (Telmisartan 40mg + Amlodipine 5mg)',
    genericName: 'Telmisartan + Amlodipine',
    category: 'Cardiovascular / Antihypertensive',
    batchNumber: 'TLM-2025-09B',
    expiryDate: '2026-11-30',
    currentStock: 480,
    minThreshold: 100,
    unit: 'Strips (1x15)',
    unitPrice: 165.50,
    mrp: 210.00,
    supplier: 'Glenmark Pharmaceuticals India Ltd'
  },
  {
    id: 'med-02',
    hospital_id: 'hosp-delhi-01',
    department: 'pharmacy',
    itemName: 'Rosuvas-10 Tab (Rosuvastatin Calcium 10mg)',
    genericName: 'Rosuvastatin',
    category: 'Lipid Lowering / Statin',
    batchNumber: 'RSV-88210',
    expiryDate: '2027-02-28',
    currentStock: 320,
    minThreshold: 80,
    unit: 'Strips (1x10)',
    unitPrice: 190.00,
    mrp: 245.00,
    supplier: 'Sun Pharma Laboratories'
  },
  {
    id: 'med-03',
    hospital_id: 'hosp-delhi-01',
    department: 'pharmacy',
    itemName: 'Pan-D Capsule (Pantoprazole 40mg + Domperidone 30mg)',
    genericName: 'Pantoprazole + Domperidone',
    category: 'Gastrointestinal / PPI',
    batchNumber: 'PND-4410',
    expiryDate: '2026-08-31',
    currentStock: 42,
    minThreshold: 150, // LOW STOCK ALERT
    unit: 'Strips (1x15)',
    unitPrice: 140.00,
    mrp: 195.00,
    supplier: 'Alkem Laboratories'
  },
  {
    id: 'med-04',
    hospital_id: 'hosp-delhi-01',
    department: 'pharmacy',
    itemName: 'Dolo-650 Tab (Paracetamol 650mg IP)',
    genericName: 'Paracetamol',
    category: 'Analgesic / Antipyretic',
    batchNumber: 'DOL-99014',
    expiryDate: '2027-05-31',
    currentStock: 1200,
    minThreshold: 300,
    unit: 'Strips (1x15)',
    unitPrice: 24.50,
    mrp: 33.60,
    supplier: 'Micro Labs Ltd'
  },
  {
    id: 'med-05',
    hospital_id: 'hosp-delhi-01',
    department: 'pharmacy',
    itemName: 'Augmentin 625 Duo (Amoxicillin 500mg + Clavulanate 125mg)',
    genericName: 'Amoxicillin + Potassium Clavulanate',
    category: 'Antibiotics',
    batchNumber: 'AUG-7721A',
    expiryDate: '2026-04-30',
    currentStock: 28,
    minThreshold: 100, // CRITICAL LOW STOCK
    unit: 'Strips (1x10)',
    unitPrice: 158.00,
    mrp: 201.50,
    supplier: 'GlaxoSmithKline Pharmaceuticals'
  },
  {
    id: 'lab-reagent-01',
    hospital_id: 'hosp-delhi-01',
    department: 'lab',
    itemName: 'Roche Cobas c501 Lipid Direct Enzymatic Kit',
    genericName: 'Enzymatic Cholesterol / Triglyceride Reagents',
    category: 'Biochemistry Reagents',
    batchNumber: 'RCH-98124',
    expiryDate: '2026-01-15',
    currentStock: 14,
    minThreshold: 20, // Reorder alert
    unit: 'Kits (500 tests/kit)',
    unitPrice: 4200.00,
    mrp: 5800.00,
    supplier: 'Roche Diagnostics India'
  }
];

export const INITIAL_FEEDBACK: PatientFeedback[] = [
  {
    id: 'fb-01',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-rahul-01',
    doctor_id: 'doc-rajesh',
    appointment_id: 'apt-101',
    rating: 5,
    doctorRating: 5,
    waitTimeRating: 4,
    cleanlinessRating: 5,
    comment: 'Dr. Rajesh Sharma explained the ECG and BP findings very patiently. Excellent digital prescription and instant WhatsApp updates. Very clean OPD waiting area.',
    tags: ['Caring Doctor', 'Minimal Wait Time', 'Clean Hospital', 'Digital Prescriptions'],
    submittedAt: '2025-08-20 16:30'
  },
  {
    id: 'fb-02',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-kavita-02',
    doctor_id: 'doc-priya',
    appointment_id: 'apt-105',
    rating: 5,
    doctorRating: 5,
    waitTimeRating: 5,
    cleanlinessRating: 5,
    comment: 'Reception gave us a token right away and senior citizen queue was very fast. Blood test report arrived on WhatsApp within 4 hours!',
    tags: ['Senior Citizen Friendly', 'Fast Lab Reports', 'Helpful Staff'],
    submittedAt: '2025-08-11 11:00'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    hospital_id: 'hosp-delhi-01',
    actorId: 'usr-doc-01',
    actorName: 'Dr. Rajesh Sharma',
    actorRole: 'doctor',
    action: 'CREATE_PRESCRIPTION',
    targetPatientUhid: 'PLS-2025-04821',
    targetPatientName: 'Rahul Sharma',
    ipAddress: '10.0.4.18 (OPD Room 204 Terminal)',
    timestamp: new Date().toISOString(),
    details: 'Generated digital prescription #rx-2025-0104 with 3 medications and ordered 4 lab tests.'
  },
  {
    id: 'aud-02',
    hospital_id: 'hosp-delhi-01',
    actorId: 'usr-rec-01',
    actorName: 'Sunita Verma',
    actorRole: 'reception',
    action: 'TOKEN_ISSUED',
    targetPatientUhid: 'PLS-2025-05119',
    targetPatientName: 'Kavita Sundaram',
    ipAddress: '10.0.1.12 (Front Desk 1)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Issued OPD Token #A-02 for Cardiology consultation and collected ₹1200 via UPI QR.'
  },
  {
    id: 'aud-03',
    hospital_id: 'hosp-delhi-01',
    actorId: 'usr-lab-01',
    actorName: 'Amit Kumar',
    actorRole: 'department',
    action: 'UPLOAD_LAB_REPORT',
    targetPatientUhid: 'PLS-2025-04821',
    targetPatientName: 'Rahul Sharma',
    ipAddress: '10.0.2.8 (Pathology Core Lab)',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'Published verified Lipid Profile report #lab-2025-0819. Dispatched automated WhatsApp notification.'
  },
  {
    id: 'aud-04',
    hospital_id: 'hosp-delhi-01',
    actorId: 'usr-admin-01',
    actorName: 'Dr. Vikram Malhotra',
    actorRole: 'admin',
    action: 'ADMIN_USER_UPDATE',
    ipAddress: '10.0.10.1 (Directorate Office)',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: 'Updated OPD slot durations and consultation tariff structure across Cardiology and Neurology.'
  }
];

export const INITIAL_NOTIFICATIONS: WhatsAppNotification[] = [
  {
    id: 'wa-01',
    hospital_id: 'hosp-delhi-01',
    recipientPhone: '+91 98765 43210',
    recipientName: 'Rahul Sharma',
    templateName: 'appointment_confirmation',
    messageText: 'Namaste Rahul Sharma! Your OPD appointment with Dr. Rajesh Sharma (Cardiology) is confirmed for Today at 10:15 AM. Token #A-01. PulseHealth Delhi.',
    variables: { patient_name: 'Rahul Sharma', doctor_name: 'Dr. Rajesh Sharma', token: 'A-01', time: '10:15 AM' },
    sentAt: '2025-08-21 09:00 AM',
    status: 'read'
  },
  {
    id: 'wa-02',
    hospital_id: 'hosp-delhi-01',
    recipientPhone: '+91 98765 43210',
    recipientName: 'Rahul Sharma',
    templateName: 'lab_report_ready',
    messageText: 'Dear Rahul Sharma, your lab test report for "Complete Lipid Profile" is now ready. Click here to download secure PDF or view in your Patient Portal.',
    variables: { patient_name: 'Rahul Sharma', test_name: 'Complete Lipid Profile' },
    sentAt: '2025-08-19 04:20 PM',
    status: 'delivered'
  },
  {
    id: 'wa-03',
    hospital_id: 'hosp-delhi-01',
    recipientPhone: '+91 98112 23344',
    recipientName: 'Kavita Sundaram',
    templateName: 'queue_reminder',
    messageText: 'Hospital Alert: You are 2 tokens away from consultation with Dr. Rajesh Sharma. Please proceed to Room 204, Wing A.',
    variables: { patient_name: 'Kavita Sundaram', remaining: '2', room: 'Room 204' },
    sentAt: '2025-08-21 10:20 AM',
    status: 'read'
  }
];

export const INITIAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-01',
    name: 'appointment_confirmation',
    category: 'appointment',
    body: 'Namaste {{patient_name}}! Your OPD appointment with {{doctor_name}} ({{department}}) is confirmed for {{date}} at {{time}}. Your Token is #{{token}}. Location: {{hospital_name}}. Please arrive 10 mins prior for vitals check.',
    variables: ['patient_name', 'doctor_name', 'department', 'date', 'time', 'token', 'hospital_name'],
    isActive: true
  },
  {
    id: 'tpl-02',
    name: 'queue_reminder',
    category: 'queue',
    body: 'Live Queue Alert: {{patient_name}}, Token #{{token}} is next for consultation with {{doctor_name}} at {{room}}. Please be seated near the OPD waiting bay.',
    variables: ['patient_name', 'token', 'doctor_name', 'room'],
    isActive: true
  },
  {
    id: 'tpl-03',
    name: 'lab_report_ready',
    category: 'lab_report',
    body: 'Dear {{patient_name}}, your diagnostic report for "{{test_name}}" has been signed off by Pathologist {{pathologist_name}} and is available for download at {{portal_link}}.',
    variables: ['patient_name', 'test_name', 'pathologist_name', 'portal_link'],
    isActive: true
  },
  {
    id: 'tpl-04',
    name: 'prescription_shared',
    category: 'prescription',
    body: 'Namaste {{patient_name}}, your digital prescription by {{doctor_name}} has been uploaded. You can collect your medicines directly from our 24x7 In-House Pharmacy using your UHID {{uhid}}.',
    variables: ['patient_name', 'doctor_name', 'uhid'],
    isActive: true
  },
  {
    id: 'tpl-05',
    name: 'billing_receipt',
    category: 'billing',
    body: 'Payment of ₹{{amount}} received successfully for Receipt #{{receipt_no}} via {{payment_mode}}. Thank you for choosing {{hospital_name}}.',
    variables: ['amount', 'receipt_no', 'payment_mode', 'hospital_name'],
    isActive: true
  }
];

// Pre-seeded Demo Users with credentials managed by Admin & Phone-based Patients
export const DEMO_USERS: User[] = [
  {
    id: 'usr-pat-01',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.in',
    role: 'patient',
    hospital_id: 'hosp-delhi-01',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-pat-02',
    name: 'Kavita Sundaram',
    phone: '9811223344',
    email: 'kavita.s@example.com',
    role: 'patient',
    hospital_id: 'hosp-delhi-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2025-02-01'
  },
  {
    id: 'usr-doc-01',
    name: 'Dr. Rajesh Sharma',
    phone: '9810012345',
    email: 'dr.rajesh@pulsehealth.in',
    password: 'Doctor@123',
    role: 'doctor',
    department: 'Cardiology',
    hospital_id: 'hosp-delhi-01',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-05-10'
  },
  {
    id: 'usr-rec-01',
    name: 'Sunita Verma',
    phone: '9899112233',
    email: 'reception.delhi@pulsehealth.in',
    password: 'Reception@123',
    role: 'reception',
    department: 'Front Desk',
    hospital_id: 'hosp-delhi-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-06-01'
  },
  {
    id: 'usr-lab-01',
    name: 'Amit Kumar',
    phone: '9871223344',
    email: 'pharmacy.lab@pulsehealth.in',
    password: 'Lab@123',
    role: 'department',
    department: 'Diagnostic Pathology & Pharmacy',
    hospital_id: 'hosp-delhi-01',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-07-15'
  },
  {
    id: 'usr-admin-01',
    name: 'Dr. Vikram Malhotra',
    phone: '9811004455',
    email: 'admin.director@pulsehealth.in',
    password: 'Admin@123',
    role: 'admin',
    department: 'Hospital Administration',
    hospital_id: 'hosp-delhi-01',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-01-01'
  }
];

export const DEFAULT_LOGIN_WALLPAPER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop';

export const WALLPAPER_PRESETS = [
  {
    id: 'mountain-peak',
    name: 'Snowy Alpine Mountains',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'pine-forest',
    name: 'Serene Pine Forest Fog',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'modern-hospital',
    name: 'Modern Medical Center',
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'calm-lake',
    name: 'Tranquil Mountain Lake',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PATIENT_CHAT_MESSAGES: PatientChatMessage[] = [
  {
    id: 'msg-01',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-01',
    patient_uhid: 'PLS-2025-08412',
    patient_name: 'Rahul Sharma',
    patient_phone: '9876543210',
    sender: 'patient',
    senderName: 'Rahul Sharma',
    message: 'Namaste Front Desk, could you please confirm if Dr. Rajesh Sharma has arrived in OPD Room 102? My token is #A-15.',
    timestamp: 'Today, 10:15 AM',
    read: true,
    category: 'appointment_inquiry'
  },
  {
    id: 'msg-02',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-01',
    patient_uhid: 'PLS-2025-08412',
    patient_name: 'Rahul Sharma',
    patient_phone: '9876543210',
    sender: 'reception',
    senderName: 'Sunita (Reception Desk)',
    message: 'Namaste Mr. Rahul. Yes, Dr. Rajesh has started consultations and is currently examining Token #A-14. You are next in line in approx 5-8 minutes.',
    timestamp: 'Today, 10:18 AM',
    read: true,
    category: 'appointment_inquiry'
  },
  {
    id: 'msg-03',
    hospital_id: 'hosp-delhi-01',
    patient_id: 'pat-02',
    patient_uhid: 'PLS-2025-09144',
    patient_name: 'Priya Patel',
    patient_phone: '9812345678',
    sender: 'patient',
    senderName: 'Priya Patel',
    message: 'Hello Reception desk, I need to collect my Fasting Blood Glucose lab report before seeing Dr. Ananya. Is it ready at Counter 3?',
    timestamp: 'Today, 11:02 AM',
    read: false,
    category: 'report_scan'
  }
];

// Persistent Database Layer backed by localStorage & in-memory fallback
class MockDatabaseService {
  private hospitals: Hospital[];
  private departments: Department[];
  private doctors: Doctor[];
  private patients: Patient[];
  private appointments: Appointment[];
  private prescriptions: Prescription[];
  private labReports: LabReport[];
  private billingReceipts: BillingReceipt[];
  private inventory: InventoryItem[];
  private feedbacks: PatientFeedback[];
  private auditLogs: AuditLog[];
  private notifications: WhatsAppNotification[];
  private templates: NotificationTemplate[];
  private users: User[];
  private patientChatMessages: PatientChatMessage[];

  constructor() {
    this.hospitals = this.loadFromStorage('ph_hospitals', INITIAL_HOSPITALS);
    this.departments = this.loadFromStorage('ph_departments', INITIAL_DEPARTMENTS);
    this.doctors = this.loadFromStorage('ph_doctors', INITIAL_DOCTORS);
    this.patients = this.loadFromStorage('ph_patients', INITIAL_PATIENTS);
    this.appointments = this.loadFromStorage('ph_appointments', INITIAL_APPOINTMENTS);
    this.prescriptions = this.loadFromStorage('ph_prescriptions', INITIAL_PRESCRIPTIONS);
    this.labReports = this.loadFromStorage('ph_lab_reports', INITIAL_LAB_REPORTS);
    this.billingReceipts = this.loadFromStorage('ph_receipts', INITIAL_BILLING_RECEIPTS);
    this.inventory = this.loadFromStorage('ph_inventory', INITIAL_INVENTORY);
    this.feedbacks = this.loadFromStorage('ph_feedbacks', INITIAL_FEEDBACK);
    this.auditLogs = this.loadFromStorage('ph_audit_logs', INITIAL_AUDIT_LOGS);
    this.notifications = this.loadFromStorage('ph_notifications', INITIAL_NOTIFICATIONS);
    this.templates = this.loadFromStorage('ph_templates', INITIAL_TEMPLATES);
    this.users = this.loadFromStorage('ph_users', DEMO_USERS);
    this.patientChatMessages = this.loadFromStorage('ph_patient_chats', INITIAL_PATIENT_CHAT_MESSAGES);
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore fallback
    }
    return defaultValue;
  }

  private saveToStorage(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Ignore
    }
  }

  // Hospital Methods
  getHospitals(): Hospital[] {
    return this.hospitals;
  }
  getHospitalById(id: string): Hospital | undefined {
    return this.hospitals.find(h => h.id === id) || this.hospitals[0];
  }
  updateHospital(hospital: Hospital): void {
    this.hospitals = this.hospitals.map(h => h.id === hospital.id ? hospital : h);
    this.saveToStorage('ph_hospitals', this.hospitals);
  }

  // Department Methods
  getDepartments(hospitalId?: string): Department[] {
    if (hospitalId) {
      return this.departments.filter(d => d.hospital_id === hospitalId);
    }
    return this.departments;
  }
  addDepartment(dept: Department): void {
    this.departments.push(dept);
    this.saveToStorage('ph_departments', this.departments);
  }

  // Doctor Methods
  getDoctors(hospitalId?: string): Doctor[] {
    if (hospitalId) {
      return this.doctors.filter(d => d.hospital_id === hospitalId);
    }
    return this.doctors;
  }
  getDoctorById(id: string): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }
  addDoctor(doctor: Doctor): void {
    this.doctors.push(doctor);
    this.saveToStorage('ph_doctors', this.doctors);
  }
  updateDoctorAvailability(doctorId: string, availability: Doctor['availability']): void {
    this.doctors = this.doctors.map(d => d.id === doctorId ? { ...d, availability } : d);
    this.saveToStorage('ph_doctors', this.doctors);
  }

  // Patient Methods
  getPatients(hospitalId?: string): Patient[] {
    if (hospitalId) {
      return this.patients.filter(p => p.hospital_id === hospitalId);
    }
    return this.patients;
  }
  getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id || p.user_id === id);
  }
  getPatientByPhoneOrUhid(query: string, hospitalId?: string): Patient | undefined {
    const q = query.toLowerCase().trim();
    return this.patients.find(p => {
      const matchHospital = !hospitalId || p.hospital_id === hospitalId;
      const matchQuery = p.phone.includes(q) || p.uhid.toLowerCase().includes(q) || p.fullName.toLowerCase().includes(q);
      return matchHospital && matchQuery;
    });
  }
  addPatient(patient: Patient): Patient {
    this.patients.unshift(patient);
    this.saveToStorage('ph_patients', this.patients);
    return patient;
  }

  // Appointment & Queue Methods
  getAppointments(hospitalId?: string): Appointment[] {
    if (hospitalId) {
      return this.appointments.filter(a => a.hospital_id === hospitalId);
    }
    return this.appointments;
  }
  getAppointmentById(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }
  addAppointment(apt: Appointment): Appointment {
    this.appointments.unshift(apt);
    this.saveToStorage('ph_appointments', this.appointments);
    return apt;
  }
  updateAppointmentStatus(id: string, queueStatus: Appointment['queueStatus'], vitals?: Appointment['vitals']): void {
    this.appointments = this.appointments.map(a => {
      if (a.id === id) {
        return {
          ...a,
          queueStatus,
          ...(vitals ? { vitals } : {})
        };
      }
      return a;
    });
    this.saveToStorage('ph_appointments', this.appointments);
  }
  updateAppointmentPayment(id: string, paymentStatus: Appointment['paymentStatus'], paymentMode?: Appointment['paymentMode']): void {
    this.appointments = this.appointments.map(a => a.id === id ? { ...a, paymentStatus, paymentMode } : a);
    this.saveToStorage('ph_appointments', this.appointments);
  }

  // Prescription Methods
  getPrescriptions(hospitalId?: string): Prescription[] {
    if (hospitalId) {
      return this.prescriptions.filter(p => p.hospital_id === hospitalId);
    }
    return this.prescriptions;
  }
  getPrescriptionById(id: string): Prescription | undefined {
    return this.prescriptions.find(p => p.id === id);
  }
  addPrescription(rx: Prescription): Prescription {
    this.prescriptions.unshift(rx);
    this.saveToStorage('ph_prescriptions', this.prescriptions);
    return rx;
  }
  markPrescriptionDispensed(id: string, dispensedBy: string = 'Central Pharmacy Staff'): void {
    this.prescriptions = this.prescriptions.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isDispensed: true,
          dispensedAt: new Date().toLocaleString(),
          dispensedBy
        };
      }
      return p;
    });
    this.saveToStorage('ph_prescriptions', this.prescriptions);
  }

  dispensePrescription(id: string, dispensedBy: string = 'Central Pharmacy Staff'): void {
    this.markPrescriptionDispensed(id, dispensedBy);
  }

  // Lab Reports Methods
  getLabReports(hospitalId?: string): LabReport[] {
    if (hospitalId) {
      return this.labReports.filter(r => r.hospital_id === hospitalId);
    }
    return this.labReports;
  }
  addLabReport(report: LabReport): LabReport {
    this.labReports.unshift(report);
    this.saveToStorage('ph_lab_reports', this.labReports);
    return report;
  }
  updateLabReportStatus(id: string, status: LabReport['status'], parameters?: LabReport['parameters'], conclusion?: string): void {
    this.labReports = this.labReports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(parameters ? { parameters } : {}),
          ...(conclusion ? { conclusion } : {})
        };
      }
      return r;
    });
    this.saveToStorage('ph_lab_reports', this.labReports);
  }

  // Billing Methods
  getBillingReceipts(hospitalId?: string): BillingReceipt[] {
    if (hospitalId) {
      return this.billingReceipts.filter(b => b.hospital_id === hospitalId);
    }
    return this.billingReceipts;
  }
  addBillingReceipt(receipt: BillingReceipt): BillingReceipt {
    this.billingReceipts.unshift(receipt);
    this.saveToStorage('ph_receipts', this.billingReceipts);
    return receipt;
  }

  // Inventory Methods
  getInventory(hospitalId?: string): InventoryItem[] {
    if (hospitalId) {
      return this.inventory.filter(i => i.hospital_id === hospitalId);
    }
    return this.inventory;
  }
  updateInventoryStock(id: string, deductAmount: number): void {
    this.inventory = this.inventory.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.currentStock - deductAmount);
        return { ...item, currentStock: newStock };
      }
      return item;
    });
    this.saveToStorage('ph_inventory', this.inventory);
  }
  addInventoryItem(item: InventoryItem): void {
    this.inventory.unshift(item);
    this.saveToStorage('ph_inventory', this.inventory);
  }

  // Feedback Methods
  getFeedbacks(hospitalId?: string): PatientFeedback[] {
    if (hospitalId) {
      return this.feedbacks.filter(f => f.hospital_id === hospitalId);
    }
    return this.feedbacks;
  }
  addFeedback(feedback: PatientFeedback): PatientFeedback {
    this.feedbacks.unshift(feedback);
    this.saveToStorage('ph_feedbacks', this.feedbacks);
    return feedback;
  }

  // Audit Logs Methods
  getAuditLogs(hospitalId?: string): AuditLog[] {
    if (hospitalId) {
      return this.auditLogs.filter(a => a.hospital_id === hospitalId);
    }
    return this.auditLogs;
  }
  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const newLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    this.saveToStorage('ph_audit_logs', this.auditLogs);
  }

  // WhatsApp & Notifications Methods
  getNotifications(hospitalId?: string): WhatsAppNotification[] {
    if (hospitalId) {
      return this.notifications.filter(n => n.hospital_id === hospitalId);
    }
    return this.notifications;
  }
  sendWhatsAppNotification(notification: Omit<WhatsAppNotification, 'id' | 'sentAt' | 'status'>): WhatsAppNotification {
    const newNotif: WhatsAppNotification = {
      ...notification,
      id: `wa-${Date.now()}`,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };
    this.notifications.unshift(newNotif);
    this.saveToStorage('ph_notifications', this.notifications);
    return newNotif;
  }
  getTemplates(hospitalId?: string): NotificationTemplate[] {
    return this.templates;
  }

  // User & Staff Methods
  getUsers(hospitalId?: string): User[] {
    if (hospitalId) {
      return this.users.filter(u => u.hospital_id === hospitalId);
    }
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  getUserByPhone(phone: string): User | undefined {
    const clean = phone.replace(/[^0-9]/g, '');
    return this.users.find(u => u.phone.replace(/[^0-9]/g, '') === clean);
  }

  addUser(user: User): User {
    this.users.unshift(user);
    this.saveToStorage('ph_users', this.users);
    return user;
  }

  updateUser(userOrId: User | string, updates?: Partial<User>): void {
    if (typeof userOrId === 'string') {
      this.users = this.users.map(u => u.id === userOrId ? { ...u, ...(updates || {}) } : u);
    } else {
      this.users = this.users.map(u => u.id === userOrId.id ? userOrId : u);
    }
    this.saveToStorage('ph_users', this.users);
  }

  deleteUser(userId: string): void {
    this.users = this.users.filter(u => u.id !== userId);
    this.saveToStorage('ph_users', this.users);
  }

  // Patient Live Reception Chat Methods
  getPatientChatMessages(hospitalId?: string, patientId?: string): PatientChatMessage[] {
    let list = this.patientChatMessages;
    if (hospitalId) {
      list = list.filter(m => m.hospital_id === hospitalId);
    }
    if (patientId) {
      list = list.filter(m => m.patient_id === patientId);
    }
    return list;
  }

  sendPatientChatMessage(msg: Omit<PatientChatMessage, 'id' | 'timestamp' | 'read'>): PatientChatMessage {
    const newMsg: PatientChatMessage = {
      ...msg,
      id: `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: msg.sender === 'reception'
    };
    this.patientChatMessages.push(newMsg);
    this.saveToStorage('ph_patient_chats', this.patientChatMessages);
    return newMsg;
  }

  markPatientMessagesRead(hospitalId: string, patientId: string, readBy: 'reception' | 'patient'): void {
    this.patientChatMessages = this.patientChatMessages.map(m => {
      if (m.hospital_id === hospitalId && m.patient_id === patientId) {
        if (readBy === 'reception' && m.sender === 'patient') {
          return { ...m, read: true };
        }
        if (readBy === 'patient' && m.sender === 'reception') {
          return { ...m, read: true };
        }
      }
      return m;
    });
    this.saveToStorage('ph_patient_chats', this.patientChatMessages);
  }

  getUnreadPatientMessageCount(hospitalId: string): number {
    return this.patientChatMessages.filter(m => m.hospital_id === hospitalId && m.sender === 'patient' && !m.read).length;
  }

  // Login Wallpaper Management
  getLoginWallpaper(): string {
    return this.loadFromStorage('ph_login_wallpaper', DEFAULT_LOGIN_WALLPAPER);
  }

  setLoginWallpaper(url: string): void {
    this.saveToStorage('ph_login_wallpaper', url);
  }

  resetAllData(): void {
    localStorage.removeItem('ph_hospitals');
    localStorage.removeItem('ph_departments');
    localStorage.removeItem('ph_doctors');
    localStorage.removeItem('ph_patients');
    localStorage.removeItem('ph_appointments');
    localStorage.removeItem('ph_prescriptions');
    localStorage.removeItem('ph_lab_reports');
    localStorage.removeItem('ph_receipts');
    localStorage.removeItem('ph_inventory');
    localStorage.removeItem('ph_feedbacks');
    localStorage.removeItem('ph_audit_logs');
    localStorage.removeItem('ph_notifications');
    localStorage.removeItem('ph_templates');
    localStorage.removeItem('ph_users');
    localStorage.removeItem('ph_patient_chats');
    localStorage.removeItem('ph_login_wallpaper');
    localStorage.removeItem('ph_auth_user');
    localStorage.removeItem('ph_jwt_token');
    window.location.reload();
  }
}

export const db = new MockDatabaseService();
