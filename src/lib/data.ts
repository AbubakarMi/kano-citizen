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
  mda?: string; // MDA the user belongs to, if applicable
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

export type MDA = {
    id: string;
    name: string;
}

export const mdas: MDA[] = [
    { id: "mda-health", name: "Ministry of Health" },
    { id: "mda-works", name: "Ministry of Works & Infrastructure" },
    { id: "mda-edu", name: "Ministry of Education" },
    { id: "mda-env", name: "Ministry of Environment" },
    { id: "mda-water", name: "Ministry of Water Resources" },
    { id: "mda-agric", name: "Ministry of Agriculture" },
];

export const ideas: Idea[] = [
  {
    id: "idea-1",
    title: "Community Solar Power Initiative",
    description: "Install solar panels on public buildings (schools, markets) to provide clean, reliable energy and reduce electricity costs for the community.",
    author: "Aisha Bello",
    upvotes: 128,
  },
  {
    id: "idea-2",
    title: "Youth Tech Training Program",
    description: "Establish free coding and digital skills bootcamps for young people in Kano to improve employment opportunities in the tech sector.",
    author: "Musa Ibrahim",
    upvotes: 256,
  },
  {
    id: "idea-3",
    title: "Waste-to-Wealth Recycling Project",
    description: "A comprehensive recycling program that rewards citizens for separating their waste, creating jobs and a cleaner environment.",
    author: "Fatima Sani",
    upvotes: 98,
  },
  {
    id: "idea-4",
    title: "Improve Public Transport Routes",
    description: "Expand and optimize bus routes to connect underserved areas with the city center and major employment hubs.",
    author: "Umar Farouk",
    upvotes: 77,
  },
];


// Mock seeded users for different roles
export const seededUsers: (Omit<User, 'submittedIdeas' | 'votedOnIdeas' | 'followedDirectives' | 'volunteeredFor'> & {email: string})[] = [
    { name: "Citizen User", email: "citizen@test.com", role: "Citizen" },
    { name: "MDA Official", email: "mda@test.com", role: "MDA Official", mda: "mda-health" },
    { name: "Content Moderator", email: "moderator@test.com", role: "Moderator" },
    { name: "SPD Coordinator", email: "spd@test.com", role: "SPD Coordinator" },
    { name: "System Admin", email: "sysadmin@test.com", role: "System Administrator" },
    { name: "Super Admin", email: "superadmin@test.com", role: "Super Admin" },
];
