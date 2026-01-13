
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
  UNEXCUSED = 'UNEXCUSED'
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum RSVPStatus {
  GOING = 'GOING',
  NOT_GOING = 'NOT_GOING',
  MAYBE = 'MAYBE',
  PENDING = 'PENDING'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  password?: string; // For simulation
}

export interface BaseEntity {
  version: number;
  lastModified: string;
  modifiedBy: string;
}

export interface Student extends BaseEntity {
  id: string;
  name: string;
  dob: string;
  grade: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  parentId: string;
  academicHistory: AcademicRecord[];
  attendance: AttendanceRecord[];
  disciplinaryRecords: string[];
  assignedRouteId?: string;
}

export interface AcademicRecord {
  subject: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  year: string;
  grade: number;
  weight: number;
  type: 'Homework' | 'Quiz' | 'Exam';
}

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  classId: string;
}

export interface Invoice extends BaseEntity {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID' | 'LATE';
  type: string;
  billingPeriod: string;
}

export interface FeeConfig {
  grade: string;
  baseTuition: number;
  labFees: number;
  activities: number;
}

export interface DiscountRule {
  id: string;
  name: string;
  percentage: number;
  type: 'SIBLING' | 'MERIT' | 'STAFF' | 'OTHER';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
}

export interface ChecklistItem {
  id: string;
  title: string;
  status: 'Pending' | 'Completed';
  category: string;
}

export interface SchoolNotification {
  id: string;
  recipientId: string;
  studentId: string;
  studentName: string;
  message: string;
  channel: 'SMS' | 'PUSH' | 'EMAIL';
  timestamp: string;
  status: 'DELIVERED' | 'SENT' | 'FAILED';
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  submittedAt: string;
  reviewerComments?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  startTime: string;
  endTime: string;
  type: 'General' | 'PTM' | 'Academic' | 'Holiday';
  location: string;
  organizerId: string;
  rsvpRequired: boolean;
  slots?: { time: string; bookedBy?: string }[]; // For PTM
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // "08:00"
  endTime: string;   // "09:00"
  subject: string;
  teacher: string;
  room: string;
  classId: string;
  color: string;
}

export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  MAINTENANCE = 'MAINTENANCE',
  LOST = 'LOST'
}

export interface LibraryAsset {
  id: string;
  title: string;
  author: string;
  category: string;
  status: AssetStatus;
  location: string;
  isbn?: string;
  coverImage?: string;
}

export interface BorrowingRecord {
  id: string;
  assetId: string;
  assetName: string;
  studentId: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export interface ArchivalDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'JPG' | 'XLSX';
  category: 'Academic' | 'Finance' | 'Personnel' | 'Legal' | 'Personal';
  size: string;
  ownerId: string;
  uploadDate: string;
  isSigned?: boolean;
  folderId?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface TransportRoute {
  id: string;
  name: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  capacity: number;
  activeStudents: number;
  status: 'STATIONARY' | 'IN_ROUTE' | 'COMPLETED' | 'MAINTENANCE';
  stops: { name: string; time: string; arrived: boolean }[];
  lastUpdate: string;
}

export interface StaffRecord {
  id: string;
  userId: string;
  name: string;
  department: string;
  designation: string;
  joiningDate: string;
  salaryBase: number;
  performanceScore: number; // 0-100
  status: 'ACTIVE' | 'ON_LEAVE' | 'PROBATION';
}

export interface Payslip {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  year: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PAID' | 'PENDING' | 'VOID';
  disbursementDate?: string;
}

export interface MedicalRecord {
  studentId: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  conditions: string[];
  medications: string[];
  vaccinations: { name: string; date: string; status: 'COMPLETED' | 'PENDING' }[];
}

export interface InfirmaryVisit {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  complaint: string;
  treatment: string;
  temperature?: string;
  outcome: 'RETURN_TO_CLASS' | 'SENT_HOME' | 'HOSPITAL_REFERRAL';
  nurseName: string;
}

export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
  version?: number;
}

export interface SyncConflict {
  id: string;
  entityType: string;
  localVersion: number;
  serverVersion: number;
  localData: any;
  serverData: any;
}

export interface AlumniRecord {
  id: string;
  name: string;
  graduationYear: number;
  university?: string;
  major?: string;
  currentCompany?: string;
  jobTitle?: string;
  email: string;
  linkedIn?: string;
  avatar?: string;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  company: string;
  type: 'Full-time' | 'Internship' | 'Project';
  location: string;
  description: string;
  postedBy: string;
  deadline: string;
}

export interface GraduationTask {
  id: string;
  title: string;
  status: 'PENDING' | 'COMPLETED' | 'BLOCKED';
  category: 'FINANCE' | 'LIBRARY' | 'ADMIN' | 'ACADEMIC';
}
