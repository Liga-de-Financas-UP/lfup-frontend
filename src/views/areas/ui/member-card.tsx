import type { DepartmentMember } from "@/shared/lib/api";

const ROLE_LABELS: Record<string, string> = {
  presidente: "Presidente",
  diretor: "Diretor(a)",
  analista: "Analista",
  trainee: "Trainee",
  candidato: "Candidato",
  admin: "Admin",
};

interface MemberCardProps {
  member: DepartmentMember;
}

export function MemberCard({ member }: MemberCardProps) {
  const isDiretor = member.role === "diretor";

  if (isDiretor) {
    return (
      <div className="brand-mesh col-span-full flex flex-col items-center gap-4 rounded-2xl border border-cream/20 p-8 text-center sm:flex-row sm:text-left">
        {/* Avatar */}
        {member.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="h-20 w-20 flex-shrink-0 rounded-full border-2 border-cream/25 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-cream/25 bg-cream/10 text-xl font-bold text-cream">
            {member.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-cream">{member.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sage">
            {ROLE_LABELS[member.role]}
            {member.course && ` · ${member.course}`}
          </p>
          {member.bio && (
            <p className="mt-2 text-sm leading-relaxed text-cream/70">
              {member.bio}
            </p>
          )}
          {/* Social links */}
          {(member.linkedinUrl || member.instagram) && (
            <div className="mt-3 flex items-center justify-center gap-3 sm:justify-start">
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-xs text-cream/70 transition-colors hover:bg-cream/20 hover:text-cream"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {member.instagram && (
                <a
                  href={`https://instagram.com/${member.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-xs text-cream/70 transition-colors hover:bg-cream/20 hover:text-cream"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-cream/12 bg-ink-soft p-5 transition-colors hover:border-cream/30">
      {/* Avatar */}
      {member.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sage text-sm font-bold text-ink">
          {member.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-cream">
            {member.name}
          </p>
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/35 transition-colors hover:text-cream"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
        </div>
        <p className="mt-0.5 text-xs text-cream/50">
          {ROLE_LABELS[member.role] || member.role}
          {member.course && ` · ${member.course}`}
          {member.semester && ` · ${member.semester}° período`}
        </p>
        {member.bio && (
          <p className="mt-1.5 text-xs leading-relaxed text-cream/50">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );
}
