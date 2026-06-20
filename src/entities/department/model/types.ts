export interface Department {
  id: string;
  name: string;
  description: string | null;
  memberCount: string;
}

export interface Process {
  id: string;
  name: string;
  description: string | null;
  semester: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  applicationCount: string;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  semester: string;
  instagram: string;
  linkedinUrl: string;
  motivation: string;
}
