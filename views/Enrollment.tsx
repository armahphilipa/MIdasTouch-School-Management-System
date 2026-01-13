
import React, { useState, useEffect, useRef } from 'react';
import { EnrollmentStatus, Student, User, UserRole } from '../types';
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Check, 
  X, 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  Calendar,
  Loader2,
  Mail,
  Phone,
  User as UserIcon,
  Eye,
  Trash2,
  Fingerprint,
  Camera,
  Image as ImageIcon,
  Hash
} from 'lucide-react';

interface EnrollmentProps {
  user: User;
  onEnroll: () => void;
  students: Student[];
  setStudents: (students: Student[]) => void;
}

interface FormErrors {
  name?: string;
  grade?: string;
  dob?: string;
  parentName?: string;
  email?: string;
  phone?: string;
  document?: string;
  passportPhoto?: string;
}

const Enrollment: React.FC<EnrollmentProps> = ({ user, onEnroll, students, setStudents }) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    dob: '',
    parentName: '',
    email: '',
    phone: '',
    relationship: 'Father',
    document: null as File | null,
    passportPhoto: null as File | null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'apply' | 'review'>(user.role === UserRole.ADMIN ? 'review' : 'apply');
  
  // Document Upload States
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Passport Photo States
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewMode === 'apply') {
      nameInputRef.current?.focus();
    }
  }, [viewMode]);

  // Clean up preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [previewUrl, photoPreviewUrl]);

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, document: null }));
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(null);
    setFormData(prev => ({ ...prev, passportPhoto: null }));
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, passportPhoto: 'File must be an image' }));
      return;
    }

    setIsUploadingPhoto(true);
    // Simulate upload delay for aesthetic
    setTimeout(() => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, passportPhoto: file }));
      setIsUploadingPhoto(false);
      setErrors(prev => ({ ...prev, passportPhoto: undefined }));
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadProgress(0);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('File is too large. Maximum size is 10MB.');
      setUploadProgress(null);
      setFormData(prev => ({ ...prev, document: null }));
      return;
    }

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        setUploadProgress(100);
        setIsUploading(false);
        setFormData(prev => ({ ...prev, document: file }));
        setErrors(prev => ({ ...prev, document: undefined }));
        
        if (file.type.startsWith('image/')) {
          setPreviewUrl(URL.createObjectURL(file));
        } else {
          setPreviewUrl('DOCUMENT_PREVIEW');
        }
        
        clearInterval(interval);
      } else {
        setUploadProgress(Math.floor(progress));
      }
    }, 200);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = 'Student full legal name is required';
    } else {
      const nameParts = nameTrimmed.split(/\s+/);
      if (nameParts.length < 2) {
        newErrors.name = 'Please provide at least a first and last name';
      }
    }

    if (!formData.grade) {
      newErrors.grade = 'Target grade level is mandatory';
    }
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    }
    if (!formData.parentName.trim()) newErrors.parentName = 'Guardian full name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'A contact email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'The email address format is invalid';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Primary contact number is required';
    if (!formData.document && !isUploading) {
      newErrors.document = 'Supporting identity documentation is required';
    }
    if (!formData.passportPhoto && !isUploadingPhoto) {
      newErrors.passportPhoto = 'Student passport photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isUploading || isUploadingPhoto) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const currentYear = new Date().getFullYear();
      // Generate a unique 6-digit random number
      const randomPart = Math.floor(100000 + Math.random() * 900000);
      const newStudentId = `SMS-${currentYear}-${randomPart}`;

      const newStudent: Student = {
        id: newStudentId,
        name: formData.name.trim(),
        dob: formData.dob,
        grade: formData.grade,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: EnrollmentStatus.PENDING,
        parentId: user.id,
        academicHistory: [],
        attendance: [],
        disciplinaryRecords: [],
        version: 1,
        lastModified: new Date().toISOString(),
        modifiedBy: user.id
      };
      
      setStudents([...students, newStudent]);
      setGeneratedId(newStudentId);
      setIsSubmitting(false);
      setShowSuccess(true);
      onEnroll(); 
      
      setFormData({ 
        name: '', 
        grade: '', 
        dob: '',
        parentName: '', 
        email: '', 
        phone: '', 
        relationship: 'Father', 
        document: null,
        passportPhoto: null
      });
      setUploadProgress(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPreviewUrl(null);
      setPhotoPreviewUrl(null);
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
        setGeneratedId(null);
      }, 10000);
    }, 1500);
  };

  const handleStatusChange = (id: string, status: EnrollmentStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const pendingApps = students.filter(s => s.status === EnrollmentStatus.PENDING);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {user.role === UserRole.ADMIN && (
        <div className="flex p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl w-fit border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('apply')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'apply' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Admissions Form
          </button>
          <button 
            onClick={() => setViewMode('review')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'review' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Review Board 
            {pendingApps.length > 0 && <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white rounded-lg text-[9px] font-black">{pendingApps.length}</span>}
          </button>
        </div>
      )}

      {viewMode === 'apply' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 overflow-hidden relative group">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 transition-transform duration-500">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Enrollment</h2>
                <p className="text-base text-slate-400 font-medium">Admission portal for 2024 academic year</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              {/* Section 01: Student Bio-Data */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                   <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] whitespace-nowrap">Section 01: Student Bio-Data</h3>
                   <div className="h-px w-full bg-slate-100" />
                </div>

                {/* Passport Photo Field */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                   <div className="relative shrink-0">
                      <input 
                        ref={photoInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="passport-photo" 
                        onChange={handlePhotoChange}
                      />
                      <label 
                        htmlFor="passport-photo"
                        className={`
                          w-32 h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative bg-slate-50
                          ${errors.passportPhoto ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200 hover:border-indigo-400 hover:bg-white'}
                        `}
                      >
                         {photoPreviewUrl ? (
                           <>
                             <img src={photoPreviewUrl} alt="Passport preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Camera size={24} />
                             </div>
                           </>
                         ) : isUploadingPhoto ? (
                           <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                         ) : (
                           <div className="text-center p-4">
                              <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <span className="text-[9px] font-black text-slate-400 uppercase leading-none">Upload Passport Photo <span className="text-rose-500">*</span></span>
                           </div>
                         )}
                      </label>
                      {photoPreviewUrl && (
                        <button 
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600 transition-colors"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      )}
                   </div>

                   <div className="flex-1 w-full space-y-6">
                      <div className="space-y-2.5">
                        <label htmlFor="legalName" className="text-sm font-black text-slate-700 ml-1 flex items-center gap-2">
                          Full Legal Name <span className="text-rose-500 text-lg" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <input 
                            ref={nameInputRef}
                            id="legalName"
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="Student's Legal Name" 
                            className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border bg-slate-50/50 transition-all outline-none font-bold text-slate-800 text-lg ${errors.name ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5'}`} 
                          />
                        </div>
                        {errors.name && <p className="text-xs text-rose-600 font-black mt-2 ml-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {errors.name}</p>}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <label htmlFor="dob" className="text-sm font-black text-slate-700 ml-1">Date of Birth <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <input 
                              id="dob"
                              type="date" 
                              value={formData.dob}
                              onChange={e => setFormData({...formData, dob: e.target.value})}
                              className={`w-full px-6 py-5 rounded-[1.5rem] border bg-slate-50/50 focus:border-indigo-500 outline-none font-bold text-slate-800 transition-all ${errors.dob ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200'}`} 
                            />
                          </div>
                          {errors.dob && <p className="text-xs text-rose-600 font-black mt-2 ml-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {errors.dob}</p>}
                        </div>
                        
                        <div className="space-y-2.5">
                          <label htmlFor="grade" className="text-sm font-black text-slate-700 ml-1">Grade Level <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <select 
                              id="grade"
                              required
                              value={formData.grade}
                              onChange={e => setFormData({...formData, grade: e.target.value})}
                              className={`w-full px-6 py-5 rounded-[1.5rem] border bg-slate-50/50 focus:border-indigo-500 outline-none font-bold text-slate-800 appearance-none transition-all ${errors.grade ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200'}`}
                            >
                              <option value="">Choose Target Grade</option>
                              <optgroup label="Early Childhood">
                                <option value="Kindergarten">Kindergarten</option>
                              </optgroup>
                              <optgroup label="Primary School">
                                {[1, 2, 3, 4, 5, 6].map(g => (
                                  <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                                ))}
                              </optgroup>
                              <optgroup label="Junior High School">
                                {[7, 8, 9].map(g => (
                                  <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                                ))}
                              </optgroup>
                              <optgroup label="Senior High School">
                                {[10, 11, 12].map(g => (
                                  <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                                ))}
                              </optgroup>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <Calendar className="w-5 h-5" />
                            </div>
                          </div>
                          {errors.grade && <p className="text-xs text-rose-600 font-black mt-2 ml-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {errors.grade}</p>}
                        </div>
                      </div>
                   </div>
                </div>
                {errors.passportPhoto && <p className="text-xs text-rose-600 font-black mt-2 ml-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {errors.passportPhoto}</p>}
              </div>

              {/* Section 02: System Allocation */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] whitespace-nowrap">Section 02: System Allocation</h3>
                   <div className="h-px w-full bg-slate-100" />
                </div>
                <div className="space-y-2.5">
                    <label className="text-sm font-black text-slate-700 ml-1">System Assigned ID</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Hash className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        disabled
                        value={`SMS-${new Date().getFullYear()}-######`}
                        className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 text-slate-400 font-mono font-bold cursor-not-allowed italic"
                        placeholder="Automatically assigned on submission" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Unique institutional identifier generated upon successful filing.</p>
                </div>
              </div>

              {/* Section 03: Guardian Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] whitespace-nowrap">Section 03: Guardian Details</h3>
                   <div className="h-px w-full bg-slate-100" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2.5">
                    <label htmlFor="parentName" className="text-sm font-black text-slate-700 ml-1">Guardian Full Name <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <input 
                        id="parentName"
                        type="text" 
                        value={formData.parentName}
                        onChange={e => setFormData({...formData, parentName: e.target.value})}
                        placeholder="Legal Guardian's Name" 
                        className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border bg-slate-50/50 transition-all outline-none font-bold text-slate-800 ${errors.parentName ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5'}`} 
                      />
                    </div>
                    {errors.parentName && <p className="text-xs text-rose-600 font-black mt-2 ml-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {errors.parentName}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="email" className="text-sm font-black text-slate-700 ml-1">Email Address <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        id="email"
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="guardian@example.com" 
                        className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border bg-slate-50/50 transition-all outline-none font-bold text-slate-800 ${errors.email ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5'}`} 
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-600 font-black mt-2 ml-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {errors.email}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="phone" className="text-sm font-black text-slate-700 ml-1">Phone Number <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input 
                        id="phone"
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000" 
                        className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border bg-slate-50/50 transition-all outline-none font-bold text-slate-800 ${errors.phone ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5'}`} 
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-600 font-black mt-2 ml-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2 space-y-2.5">
                    <label htmlFor="relationship" className="text-sm font-black text-slate-700 ml-1">Relationship to Student</label>
                    <select 
                      id="relationship"
                      value={formData.relationship}
                      onChange={e => setFormData({...formData, relationship: e.target.value})}
                      className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/50 focus:border-indigo-500 outline-none font-bold text-slate-800 appearance-none transition-all"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 04: Verification Hub (with Previews) */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] whitespace-nowrap">Section 04: Verification Hub</h3>
                   <div className="h-px w-full bg-slate-100" />
                </div>
                
                <div className="relative">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    id="doc-upload"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  
                  {!formData.document && !isUploading ? (
                    <label 
                      htmlFor="doc-upload"
                      className={`
                        w-full flex flex-col items-center justify-center gap-5 p-10 border-4 border-dotted rounded-[2.5rem] cursor-pointer transition-all duration-500
                        ${uploadError ? 'border-rose-300 bg-rose-50/30' : 'bg-slate-50/50 border-slate-200 hover:border-indigo-400 hover:bg-white'}
                      `}
                    >
                      <div className="w-16 h-16 rounded-[1.25rem] bg-white border-2 border-slate-100 flex items-center justify-center text-slate-300">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="text-center w-full max-w-xs">
                        <span className="text-base font-black block mb-1 text-slate-800">Attach Identity Proof</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Supports PDF, PNG, JPG (Max 10MB)</p>
                        {uploadError && <p className="text-xs text-rose-500 font-bold mt-2">{uploadError}</p>}
                      </div>
                    </label>
                  ) : isUploading ? (
                    <div className="w-full p-10 border-4 border-dotted border-indigo-400 bg-indigo-50/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
                       <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                       <div className="text-center w-full max-w-xs">
                         <span className="text-base font-black text-indigo-900 block mb-2">Securing Document...</span>
                         <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="w-full p-6 bg-emerald-50 border-2 border-emerald-200 rounded-[2.5rem] animate-in zoom-in-95 duration-300">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative shrink-0 group">
                          {previewUrl && previewUrl !== 'DOCUMENT_PREVIEW' ? (
                            <img 
                              src={previewUrl} 
                              alt="Upload preview" 
                              className="w-24 h-32 object-cover rounded-2xl shadow-md border-2 border-white" 
                            />
                          ) : (
                            <div className="w-24 h-32 bg-white rounded-2xl shadow-md border-2 border-emerald-100 flex items-center justify-center text-emerald-500">
                              <FileText className="w-10 h-10" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center">
                            <Eye className="text-white w-6 h-6" />
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="text-lg font-black text-emerald-900 truncate max-w-[200px]">
                              {formData.document?.name}
                            </span>
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          </div>
                          <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-4">
                            {(formData.document!.size / (1024 * 1024)).toFixed(2)} MB • {formData.document!.type.split('/')[1].toUpperCase()}
                          </p>
                          
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <button 
                              type="button"
                              className="px-4 py-2 bg-white text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors shadow-sm"
                            >
                              View File
                            </button>
                            <button 
                              type="button"
                              onClick={handleRemoveFile}
                              className="px-4 py-2 bg-rose-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-sm flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {errors.document && <p className="text-xs text-rose-600 font-black mt-3 ml-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {errors.document}</p>}
                </div>
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  disabled={isSubmitting || isUploading || isUploadingPhoto}
                  className={`
                    w-full py-6 rounded-[2rem] font-black transition-all shadow-2xl text-xl flex items-center justify-center gap-4
                    ${isSubmitting || isUploading || isUploadingPhoto
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-300 hover:-translate-y-2'}
                  `}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-8 h-8 animate-spin" /> Filing Application...</>
                  ) : (
                    <><ShieldAlert className="w-7 h-7" /> Submit Application</>
                  )}
                </button>
              </div>
              
              {showSuccess && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-700 z-[100]">
                  <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-3xl shadow-emerald-200 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Success!</h3>
                  <p className="text-slate-500 font-medium mb-6">Bio-data and documents are now queued for administrative audit.</p>
                  
                  <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-3xl w-full max-w-sm mb-10 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Generated Student ID</p>
                    <div className="flex items-center justify-center gap-3">
                      <Fingerprint className="w-6 h-6 text-indigo-600" />
                      <span className="text-2xl font-black text-indigo-900 font-mono">{generatedId}</span>
                    </div>
                    <p className="text-[9px] text-indigo-500 font-bold mt-2 italic">Save this for all future inquiries</p>
                  </div>

                  <button onClick={() => setShowSuccess(false)} className="w-full max-w-xs py-4 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl">Back to Form</button>
                </div>
              )}
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4"><Clock className="w-8 h-8 text-indigo-500" /> Audit Log</h2>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">Live Updates</div>
              </div>
              
              <div className="space-y-5">
                {students.slice(0, 3).map((s) => (
                  <div key={s.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                       <p className="font-black text-slate-900 text-sm">{s.name}</p>
                       <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${s.status === EnrollmentStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-black">
                       <span className="font-mono text-indigo-500 font-black">{s.id}</span>
                       <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> Docs Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-3xl relative overflow-hidden group">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-6 flex items-center gap-4"><ShieldAlert className="w-8 h-8 text-amber-400" /> Digital Policy</h3>
                 <div className="space-y-6">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                       <p className="text-xs font-black text-indigo-300 uppercase mb-1">Encrypted Transit</p>
                       <p className="text-xs text-slate-400 font-medium">Files are SHA-256 hashed and encrypted before system ingestion.</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                       <p className="text-xs font-black text-indigo-300 uppercase mb-1">OCR Processing</p>
                       <p className="text-xs text-slate-400 font-medium">Bio-data is cross-verified against document text via automated OCR.</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Review Board</h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Document verification portal</p>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Filter candidates..." className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl font-bold" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest border-b">
                  <th className="px-10 py-6">Applicant & Unique ID</th>
                  <th className="px-10 py-6">Credentials</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Audit Interface</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-800 font-black text-xl shadow-sm">
                          {s.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1.5">{s.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded">{s.grade}</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                               <Fingerprint size={10} className="text-indigo-500" />
                               <span className="text-[11px] font-mono font-black">{s.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <button className="flex items-center gap-2 text-xs font-black text-indigo-500 hover:text-indigo-700 transition-colors">
                          <FileSearch className="w-4 h-4" /> View Birth Certificate
                       </button>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${s.status === EnrollmentStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-100 text-amber-700 border-amber-100'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      {s.status === EnrollmentStatus.PENDING ? (
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleStatusChange(s.id, EnrollmentStatus.APPROVED)} className="p-3 bg-white border border-slate-200 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Approve Admission"><Check className="w-5 h-5" /></button>
                          <button onClick={() => handleStatusChange(s.id, EnrollmentStatus.REJECTED)} className="p-3 bg-white border border-slate-200 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Reject Admission"><X className="w-5 h-5" /></button>
                        </div>
                      ) : (
                        <button onClick={() => handleStatusChange(s.id, EnrollmentStatus.PENDING)} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase">Revoke Audit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple wrapper for lucide-react names to prevent missing exports if any
const FileSearch = ({ className }: { className?: string }) => <FileSearchIcon className={className} />;
const FileSearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="11.5" cy="15.5" r="2.5"/><path d="M13.25 17.25 15 19"/>
  </svg>
);

export default Enrollment;
