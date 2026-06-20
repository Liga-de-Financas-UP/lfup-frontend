const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function fetchAPI<T>(
  path: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return res.json();
}

export async function getDepartments() {
  return fetchAPI<
    { id: string; name: string; description: string | null; memberCount: string }[]
  >("/departments/public");
}

export async function getProcesses() {
  return fetchAPI<
    {
      id: string;
      name: string;
      description: string | null;
      semester: string;
      isActive: boolean;
      startsAt: string | null;
      endsAt: string | null;
      applicationCount: string;
    }[]
  >("/processes");
}

export interface DepartmentMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  course: string | null;
  semester: number | null;
  bio: string | null;
  linkedinUrl: string | null;
  instagram: string | null;
}

export interface DepartmentDetail {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  members: DepartmentMember[];
}

export async function getDepartmentById(id: string) {
  return fetchAPI<DepartmentDetail>(`/departments/public/${id}`);
}

export async function submitApplication(
  processId: string,
  data: {
    fullName: string;
    email: string;
    phone: string;
    course: string;
    semester: number;
    instagram: string;
    linkedinUrl: string;
    motivation: string;
    departmentPreference: string;
  }
) {
  return fetchAPI(`/processes/${processId}/apply`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
