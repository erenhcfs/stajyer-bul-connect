export type Profile = {
  id: string;
  role: string;
  approval_status?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  location?: string | null;
  school?: string | null;
  grade?: string | null;
  department?: string | null;
  age?: number | null;
  skills?: string | null;
  avatar_url?: string | null;
  internship_term?: string | null;
  company_name?: string | null;
  tax_number?: string | null;
  sector?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  about?: string | null;
  is_looking_for_internship?: boolean | null;
  created_at?: string;
};
export type JobListing = {
  id: string;
  employer_id: string;
  title: string;
  company_name: string | null;
  location: string | null;
  work_type: string | null;
  department: string | null;
  description: string | null;
  requirements: string | null;
  status?: "active" | "closed";
  created_at: string;
};

export type JobApplication = {
  id: string;
  listing_id: string;
  listing_title: string;
  candidate_id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;
  candidate_school: string | null;
  candidate_department: string | null;
  candidate_skills: string | null;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  cover_letter: string | null;
  created_at: string;
};

export type InternshipOffer = {
  id: string;
  employer_id: string;
  company_name: string | null;
  employer_email: string | null;
  employer_phone: string | null;
  message: string | null;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

export type CandidateApplication = {
  id: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  created_at: string;
  job_listings: { title: string; company_name: string | null } | null;
};
