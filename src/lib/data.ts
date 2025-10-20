export type Idea = {
  id: string;
  title: string;
  description: string;
  author: string;
  upvotes: number;
};

export type Directive = {
  id: string;
  title: string;
  status: "In Progress" | "Completed" | "Under Review" | "Ana ci gaba" | "An kammala" | "Ana dubawa";
  description: string;
  updates: string[];
};

export type VolunteerOpportunity = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
};

export type UserRole = 
    | "Citizen" 
    | "MDA Official" 
    | "Moderator" 
    | "SPD Coordinator" 
    | "System Administrator" 
    | "Super Admin";

export type User = {
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  submittedIdeas: string[]; // array of idea ids
  votedOnIdeas: string[]; // array of idea ids
  followedDirectives: string[]; // array of directive ids
  volunteeredFor: string[]; // array of opportunity ids
};

export type Testimonial = {
    name: string;
    location: string;
    quote: string;
}

export type FAQ = {
    question: string;
    answer: string;
}

// Mock seeded users for different roles
export const seededUsers: Omit<User, 'submittedIdeas' | 'votedOnIdeas' | 'followedDirectives' | 'volunteeredFor'>[] = [
    { name: "Citizen User", email: "citizen@test.com", role: "Citizen" },
    { name: "MDA Official", email: "mda@test.com", role: "MDA Official" },
    { name: "Content Moderator", email: "moderator@test.com", role: "Moderator" },
    { name: "SPD Coordinator", email: "spd@test.com", role: "SPD Coordinator" },
    { name: "System Admin", email: "sysadmin@test.com", role: "System Administrator" },
    { name: "Super Admin", email: "superadmin@test.com", role: "Super Admin" },
];
