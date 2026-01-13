
import { UserRole, EnrollmentStatus, AttendanceStatus, Student, User, Invoice, ChecklistItem, LeaveRequest, RequestStatus, CalendarEvent, FeeConfig, DiscountRule, TimetableSlot, LibraryAsset, AssetStatus, BorrowingRecord, ArchivalDocument, DocumentFolder, TransportRoute, StaffRecord, Payslip, MedicalRecord, InfirmaryVisit, AlumniRecord, CareerOpportunity, GraduationTask } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Dr. Sarah Wilson', role: UserRole.ADMIN, email: 'admin@school.com', password: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'u2', name: 'Prof. James Black', role: UserRole.TEACHER, email: 'teacher@school.com', password: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: 'u3', name: 'Robert Johnson', role: UserRole.PARENT, email: 'parent@school.com', password: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
  { id: 'u4', name: 'Timmy Johnson', role: UserRole.STUDENT, email: 'student@school.com', password: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Timmy' },
];

export const INITIAL_ALUMNI: AlumniRecord[] = [
  { id: 'AL-001', name: 'Kwame Adjei', graduationYear: 2018, university: 'Ashesi University', major: 'Computer Science', currentCompany: 'Microsoft', jobTitle: 'Software Engineer', email: 'kwame@microsoft.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame' },
  { id: 'AL-002', name: 'Amma Mensah', graduationYear: 2020, university: 'University of Ghana', major: 'Medicine', currentCompany: 'Korle Bu', jobTitle: 'House Officer', email: 'amma@medicine.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amma' },
  { id: 'AL-003', name: 'David Osei', graduationYear: 2015, university: 'KNUST', major: 'Architecture', currentCompany: 'Building Blocks Ltd', jobTitle: 'Senior Architect', email: 'david@arch.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
];

export const INITIAL_CAREER_OPS: CareerOpportunity[] = [
  { id: 'CO-001', title: 'Summer Tech Internship', company: 'Google Ghana', type: 'Internship', location: 'Accra', description: 'Seeking enthusiastic computer science students for our summer cloud program.', postedBy: 'u1', deadline: '2024-06-15' },
  { id: 'CO-002', title: 'Junior Data Analyst', company: 'MTN Ghana', type: 'Full-time', location: 'Remote', description: 'Passionate about data? Join our analytics team to drive regional insights.', postedBy: 'u2', deadline: '2024-07-01' },
];

export const INITIAL_GRAD_TASKS: GraduationTask[] = [
  { id: 'GT-001', title: 'Tuition Balance Clearance', status: 'COMPLETED', category: 'FINANCE' },
  { id: 'GT-002', title: 'Return Library Laptops', status: 'PENDING', category: 'LIBRARY' },
  { id: 'GT-003', title: 'Final Transcript Verification', status: 'PENDING', category: 'ACADEMIC' },
  { id: 'GT-004', title: 'Cap & Gown Measurement', status: 'COMPLETED', category: 'ADMIN' },
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    studentId: 'SMS-2024-812034',
    bloodGroup: 'O+',
    allergies: ['Peanuts', 'Penicillin'],
    conditions: ['Mild Asthma'],
    medications: ['Salbutamol Inhaler (As needed)'],
    vaccinations: [
      { name: 'MMR', date: '2022-05-10', status: 'COMPLETED' },
      { name: 'Polio', date: '2022-05-10', status: 'COMPLETED' },
      { name: 'Meningitis', date: '2024-09-01', status: 'PENDING' },
    ]
  }
];

export const INITIAL_INFIRMARY_VISITS: InfirmaryVisit[] = [
  { 
    id: 'IV-1001', 
    studentId: 'SMS-2024-812034', 
    studentName: 'Timmy Johnson', 
    date: '2024-05-20', 
    time: '10:15 AM', 
    complaint: 'Seasonal headache and dizziness', 
    treatment: 'Rest for 30 mins, 500mg Paracetamol', 
    temperature: '37.2°C', 
    outcome: 'RETURN_TO_CLASS', 
    nurseName: 'Nurse Florence' 
  },
];

export const INITIAL_STAFF_RECORDS: StaffRecord[] = [
  { id: 'STF-001', userId: 'u1', name: 'Dr. Sarah Wilson', department: 'Administration', designation: 'Principal', joiningDate: '2020-01-10', salaryBase: 4500, performanceScore: 98, status: 'ACTIVE' },
  { id: 'STF-002', userId: 'u2', name: 'Prof. James Black', department: 'Sciences', designation: 'Head of Mathematics', joiningDate: '2021-08-15', salaryBase: 3200, performanceScore: 92, status: 'ACTIVE' },
  { id: 'STF-003', userId: 'u5', name: 'Ms. Emily Blunt', department: 'Humanities', designation: 'English Teacher', joiningDate: '2022-09-01', salaryBase: 2800, performanceScore: 88, status: 'PROBATION' },
];

export const INITIAL_PAYSLIPS: Payslip[] = [
  { id: 'PS-2024-05-01', staffId: 'STF-001', staffName: 'Dr. Sarah Wilson', month: 'May', year: '2024', baseSalary: 4500, allowances: 500, deductions: 200, netSalary: 4800, status: 'PAID', disbursementDate: '2024-05-25' },
  { id: 'PS-2024-05-02', staffId: 'STF-002', staffName: 'Prof. James Black', month: 'May', year: '2024', baseSalary: 3200, allowances: 300, deductions: 150, netSalary: 3350, status: 'PAID', disbursementDate: '2024-05-25' },
];

export const INITIAL_TRANSPORT_ROUTES: TransportRoute[] = [
  {
    id: 'TR-101',
    name: 'North-East Express (Route A)',
    driverName: 'Samuel Mensah',
    driverPhone: '+233 24 555 0101',
    vehiclePlate: 'GV-2024-01',
    capacity: 45,
    activeStudents: 32,
    status: 'IN_ROUTE',
    lastUpdate: '2 mins ago',
    stops: [
      { name: 'East Legon Plaza', time: '06:30 AM', arrived: true },
      { name: 'Madina Station', time: '06:50 AM', arrived: true },
      { name: 'Adenta Barrier', time: '07:15 AM', arrived: false },
      { name: 'Main Campus', time: '07:45 AM', arrived: false },
    ]
  },
  {
    id: 'TR-102',
    name: 'Lakeside Commuter (Route B)',
    driverName: 'Kojo Antwi',
    driverPhone: '+233 50 999 4421',
    vehiclePlate: 'GV-2024-05',
    capacity: 25,
    activeStudents: 18,
    status: 'STATIONARY',
    lastUpdate: '1h ago',
    stops: [
      { name: 'Lakeside Estates', time: '06:45 AM', arrived: false },
      { name: 'Ashaley Botwe', time: '07:10 AM', arrived: false },
      { name: 'School Main Gate', time: '07:40 AM', arrived: false },
    ]
  },
  {
    id: 'TR-103',
    name: 'Airport Residential (Route C)',
    driverName: 'Ebenezer Addo',
    driverPhone: '+233 54 888 1234',
    vehiclePlate: 'GV-2024-09',
    capacity: 30,
    activeStudents: 12,
    status: 'MAINTENANCE',
    lastUpdate: 'Yesterday',
    stops: [
      { name: 'Airport City', time: '07:00 AM', arrived: false },
      { name: 'Cantonments', time: '07:20 AM', arrived: false },
      { name: 'Main Campus', time: '07:45 AM', arrived: false },
    ]
  }
];

export const INITIAL_LIBRARY_ASSETS: LibraryAsset[] = [
  { id: 'BK-101', title: 'Advanced Calculus', author: 'Dr. Michael Spivak', category: 'Mathematics', status: AssetStatus.BORROWED, location: 'Shelf A-4', isbn: '978-0521867405', coverImage: 'https://images.unsplash.com/photo-1543004629-142a762df0d4?auto=format&fit=crop&q=80&w=200' },
  { id: 'BK-102', title: 'Brief History of Time', author: 'Stephen Hawking', category: 'Science', status: AssetStatus.AVAILABLE, location: 'Shelf C-1', isbn: '978-0553380163', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200' },
  { id: 'EQ-001', title: 'MacBook Air M2 (Lab 1)', author: 'Apple Inc.', category: 'Electronics', status: AssetStatus.BORROWED, location: 'Charging Cart 1' },
  { id: 'BK-103', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Literature', status: AssetStatus.AVAILABLE, location: 'Shelf B-9', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200' },
];

export const INITIAL_BORROWING_RECORDS: BorrowingRecord[] = [
  { id: 'BR-9001', assetId: 'BK-101', assetName: 'Advanced Calculus', studentId: 'SMS-2024-812034', studentName: 'Timmy Johnson', borrowDate: '2024-05-10', dueDate: '2024-05-24', status: 'OVERDUE' },
  { id: 'BR-9002', assetId: 'EQ-001', assetName: 'MacBook Air M2', studentId: 'SMS-2024-812034', studentName: 'Timmy Johnson', borrowDate: '2024-05-22', dueDate: '2024-05-29', status: 'ACTIVE' },
];

export const INITIAL_FOLDERS: DocumentFolder[] = [
  { id: 'f1', name: 'Curriculum & Syllabus', icon: 'Academic', count: 12 },
  { id: 'f2', name: 'Financial Statements', icon: 'Finance', count: 42 },
  { id: 'f3', name: 'Staff Personnel Files', icon: 'Personnel', count: 18 },
  { id: 'f4', name: 'Legal & Compliance', icon: 'Legal', count: 5 },
  { id: 'f5', name: 'My Personal Documents', icon: 'Personal', count: 8 },
];

export const INITIAL_ARCHIVAL_DOCS: ArchivalDocument[] = [
  { id: 'doc-001', name: 'Math_Grade10_Syllabus.pdf', type: 'PDF', category: 'Academic', size: '2.4 MB', ownerId: 'u2', uploadDate: '2024-01-15', folderId: 'f1' },
  { id: 'doc-002', name: 'Institutional_Audit_2023.xlsx', type: 'XLSX', category: 'Finance', size: '1.1 MB', ownerId: 'u1', uploadDate: '2023-12-20', folderId: 'f2', isSigned: true },
  { id: 'doc-003', name: 'Staff_Code_of_Conduct.docx', type: 'DOCX', category: 'Legal', size: '450 KB', ownerId: 'u1', uploadDate: '2024-02-10', folderId: 'f4' },
  { id: 'doc-004', name: 'ReportCard_Timmy_T1.pdf', type: 'PDF', category: 'Personal', size: '890 KB', ownerId: 'u3', uploadDate: '2024-05-10', folderId: 'f5', isSigned: true },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'ts1', day: 'Monday', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Prof. James Black', room: 'Room 302', classId: 'Grade 10-A', color: 'bg-indigo-500' },
  { id: 'ts2', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Physics', teacher: 'Dr. Aris Thorne', room: 'Lab 1', classId: 'Grade 10-A', color: 'bg-emerald-500' },
  { id: 'ts3', day: 'Monday', startTime: '10:30', endTime: '11:30', subject: 'English', teacher: 'Ms. Emily Blunt', room: 'Room 105', classId: 'Grade 10-A', color: 'bg-amber-500' },
  { id: 'ts4', day: 'Tuesday', startTime: '08:00', endTime: '09:00', subject: 'History', teacher: 'Mr. David Atten', room: 'Room 201', classId: 'Grade 10-A', color: 'bg-rose-500' },
  { id: 'ts5', day: 'Wednesday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics', teacher: 'Prof. James Black', room: 'Room 302', classId: 'Grade 10-A', color: 'bg-indigo-500' },
  { id: 'ts6', day: 'Thursday', startTime: '11:00', endTime: '12:00', subject: 'Arts', teacher: 'Mrs. Van Gogh', room: 'Studio 4', classId: 'Grade 10-A', color: 'bg-purple-500' },
  { id: 'ts7', day: 'Friday', startTime: '14:00', endTime: '15:00', subject: 'Physical Ed', teacher: 'Coach Carter', room: 'Gymnasium', classId: 'Grade 10-A', color: 'bg-orange-500' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'SMS-2024-812034',
    name: 'Timmy Johnson',
    dob: '2008-05-14',
    grade: 'Grade 10',
    enrollmentDate: '2023-09-01',
    status: EnrollmentStatus.APPROVED,
    parentId: 'u3',
    academicHistory: [
      { subject: 'Mathematics', term: '1st Term', year: '2024', grade: 92, weight: 40, type: 'Exam' },
      { subject: 'History', term: '1st Term', year: '2024', grade: 85, weight: 20, type: 'Quiz' },
      { subject: 'Physics', term: '1st Term', year: '2024', grade: 88, weight: 40, type: 'Exam' },
      { subject: 'English', term: '1st Term', year: '2024', grade: 95, weight: 15, type: 'Homework' },
    ],
    attendance: [
      { date: '2024-05-20', status: AttendanceStatus.PRESENT, classId: 'c1' },
      { date: '2024-05-21', status: AttendanceStatus.LATE, classId: 'c1' },
    ],
    disciplinaryRecords: [
      'Late to Assembly (Minor) - 2024-03-12',
      'Disturbing Class (Minor) - 2024-04-05'
    ],
    assignedRouteId: 'TR-101',
    version: 1,
    lastModified: '2024-05-20T10:00:00Z',
    modifiedBy: 'u1'
  },
  {
    id: 'SMS-2024-992102',
    name: 'Emily Davis',
    dob: '2009-11-22',
    grade: 'Grade 10',
    enrollmentDate: '2023-09-15',
    status: EnrollmentStatus.APPROVED,
    parentId: 'u5',
    academicHistory: [
      { subject: 'Mathematics', term: '1st Term', year: '2024', grade: 96, weight: 40, type: 'Exam' },
      { subject: 'History', term: '1st Term', year: '2024', grade: 90, weight: 20, type: 'Quiz' },
      { subject: 'Physics', term: '1st Term', year: '2024', grade: 94, weight: 40, type: 'Exam' },
    ],
    attendance: [],
    disciplinaryRecords: [],
    version: 1,
    lastModified: '2024-05-20T10:00:00Z',
    modifiedBy: 'u1'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-1001', studentId: 'SMS-2024-812034', studentName: 'Timmy Johnson', amount: 1500, dueDate: '2024-06-01', status: 'UNPAID', type: 'Tuition', billingPeriod: '1st Term 2024', version: 1, lastModified: '2024-05-20T10:00:00Z', modifiedBy: 'u1' },
  { id: 'INV-0982', studentId: 'SMS-2024-812034', studentName: 'Timmy Johnson', amount: 200, dueDate: '2024-05-01', status: 'PAID', type: 'Lab Fees', billingPeriod: '1st Term 2024', version: 1, lastModified: '2024-05-20T10:00:00Z', modifiedBy: 'u1' },
];

export const INITIAL_FEE_CONFIGS: FeeConfig[] = [
  { grade: 'Grade 1-5', baseTuition: 800, labFees: 50, activities: 100 },
  { grade: 'Grade 6-9', baseTuition: 1200, labFees: 150, activities: 150 },
  { grade: 'Grade 10-12', baseTuition: 1500, labFees: 200, activities: 200 },
];

export const INITIAL_DISCOUNT_RULES: DiscountRule[] = [
  { id: 'dr1', name: 'Sibling Discount', percentage: 15, type: 'SIBLING' },
  { id: 'dr2', name: 'Academic Scholarship', percentage: 100, type: 'MERIT' },
  { id: 'dr3', name: 'Staff Child Benefit', percentage: 50, type: 'STAFF' },
];

export const ANALYTICS_DATA = {
  gradeDistribution: [
    { range: 'A (90-100)', count: 42, color: '#10b981' },
    { range: 'B (80-89)', count: 58, color: '#6366f1' },
    { range: 'C (70-79)', count: 24, color: '#f59e0b' },
    { range: 'D (60-69)', count: 12, color: '#f97316' },
    { range: 'F (<60)', count: 5, color: '#ef4444' },
  ],
  subjectPerformance: [
    { subject: 'Math', avg: 88, top: 98 },
    { subject: 'Science', avg: 82, top: 95 },
    { subject: 'History', avg: 85, top: 92 },
    { subject: 'English', avg: 91, top: 100 },
    { subject: 'Arts', avg: 94, top: 99 },
  ]
};

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev1',
    title: 'Mid-Term Parent Review',
    description: '1st Term academic review and performance discussion.',
    date: '2024-05-28',
    startTime: '14:00',
    endTime: '17:00',
    type: 'PTM',
    location: 'Main Auditorium / Online',
    organizerId: 'u1',
    rsvpRequired: true,
    slots: [
      { time: '14:00' },
      { time: '14:30' },
      { time: '15:00', bookedBy: 'u3' },
      { time: '15:30' },
      { time: '16:00' },
    ]
  },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-001',
    studentId: 'SMS-2024-812034',
    studentName: 'Timmy Johnson',
    parentId: 'u3',
    startDate: '2024-06-10',
    endDate: '2024-06-12',
    reason: 'Family event in other city.',
    status: RequestStatus.PENDING,
    submittedAt: '2024-05-20T10:00:00Z'
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '6.1', category: 'Term System', title: 'Replace Seasonal model with 1st/2nd/3rd Term model', status: 'Completed' },
  { id: '7.1', category: 'Dash Fixes', title: 'Fix Dashboard Buttons (Report & Admission Wiring)', status: 'Completed' },
  { id: '8.1', category: 'Currency', title: 'Enforce Ghana Cedis (GHS)', status: 'Completed' },
  { id: '9.1', category: 'Grading Fixes', title: 'Activate Commit/Print/Export Buttons', status: 'Completed' },
  { id: '10.1', category: 'Chat Fixes', title: 'Repair Chat Attachment System', status: 'Completed' },
  { id: '11.1', category: 'Smart Dash', title: 'Role-Based Dashboard Personalization', status: 'Completed' },
  { id: '12.1', category: 'Auth Upgrade', title: 'Implement Full Sign-In/Up Flow', status: 'Completed' },
  { id: '13.1', category: 'Network', title: 'Offline-First Architecture & Sync Engine', status: 'Completed' },
  { id: '14.1', category: 'Finance', title: 'Automatic Receipt & Tax Invoice Generation', status: 'Completed' },
  { id: '15.1', category: 'SIS', title: 'Library Resource & Asset Tracking', status: 'Completed' },
  { id: '16.1', category: 'Infrastructure', title: 'Cloud-Based Document Archiving Hub', status: 'Completed' },
  { id: '17.1', category: 'Logistics', title: 'Transport & Fleet Management System', status: 'Completed' },
  { id: '18.1', category: 'Human Resources', title: 'Staff Payroll & Performance Appraisals', status: 'Completed' },
  { id: '19.1', category: 'Health', title: 'Student Health & Clinical Services', status: 'Completed' },
  { id: '20.1', category: 'Ecosystem', title: 'Alumni & Graduation Career Portal', status: 'Completed' },
  { id: '21.1', category: 'Admissions', title: 'Enhanced Grade-Level Selection & Mandatory Validation', status: 'Completed' },
];
