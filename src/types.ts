export type GradeLevel =
  | 'Nursery'
  | 'LKG'
  | 'UKG'
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11 - Science'
  | 'Class 11 - Commerce'
  | 'Class 11 - Humanities'
  | 'Class 12 - Science'
  | 'Class 12 - Commerce'
  | 'Class 12 - Humanities';

export type GradeCategory = 'Kindergarten' | 'Primary (1-5)' | 'Middle (6-8)' | 'Secondary (9-10)' | 'Senior Secondary (11-12)';

export interface FeeItem {
  id: string;
  grade: GradeLevel;
  category: GradeCategory;
  admissionFee: number;
  tuitionFeePerQuarter: number;
  activityLabFee: number;
  developmentChargeAnnual: number;
  totalAnnualFee: number;
  seatAvailability: 'Open' | 'Limited Seats' | 'Waitlist';
  highlights: string[];
}

export interface SchoolTimings {
  kindergarten: {
    start: string;
    end: string;
    description: string;
  };
  primary: {
    start: string;
    end: string;
    description: string;
  };
  secondary: {
    start: string;
    end: string;
    description: string;
  };
  officeHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  summerShift: string;
  winterShift: string;
  lastUpdated: string;
}

export interface StudentApplication {
  id: string;
  applicationNumber: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  classApplied: GradeLevel;
  phone: string;
  email: string;
  permanentAddress: string;
  previousSchool?: string;
  emergencyContact?: string;
  notes?: string;
  status: 'Under Review' | 'Approved' | 'Cancelled' | 'Interview Scheduled';
  rejectionReason?: string;
  interviewDate?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  recipientType: 'Owner' | 'Student';
  subject: string;
  templateType: 'owner_notification' | 'student_confirmation' | 'cancellation_notice' | 'approval_offer';
  htmlContent: string;
  sentAt: string;
  status: 'Delivered' | 'Simulated Delivered';
}

export interface SchoolData {
  name: string;
  tagline: string;
  established: number;
  motto: string;
  affiliationNumber: string;
  recognizedStreams: string[];
  ratings: {
    googleRating: number;
    googleReviewsCount: number;
    justdialRating: number;
    justdialVotes: number;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    landmark: string;
    city: string;
    pinCode: string;
    instagram: string;
    ownerEmail: string;
    googleMapsDirectionsUrl: string;
  };
  timings: SchoolTimings;
  fees: FeeItem[];
}
