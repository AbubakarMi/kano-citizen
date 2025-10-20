export type Idea = {
  id: string;
  title: string;
  description: string;
  author: string;
  upvotes: number;
  submittedAt: Date;
};

export type Directive = {
  id: string;
  title: string;
  status: "In Progress" | "Completed" | "Under Review";
  description: string;
  updates: string[];
};

export type VolunteerOpportunity = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
};

export type User = {
  name: string;
  email: string;
  location?: string;
  submittedIdeas: string[]; // array of idea ids
  votedOnIdeas: string[]; // array of idea ids
  followedDirectives: string[]; // array of directive ids
  volunteeredFor: string[]; // array of opportunity ids
};

export const ideas: Idea[] = [
  {
    id: "idea-1",
    title: "Community Solar Power Initiative",
    description: "Install solar panels on public buildings (schools, markets) to provide clean, reliable energy and reduce electricity costs for the community.",
    author: "Aisha Bello",
    upvotes: 128,
    submittedAt: new Date("2023-10-15"),
  },
  {
    id: "idea-2",
    title: "Youth Tech Training Program",
    description: "Establish free coding and digital skills bootcamps for young people in Kano to improve employment opportunities in the tech sector.",
    author: "Musa Ibrahim",
    upvotes: 256,
    submittedAt: new Date("2023-11-01"),
  },
  {
    id: "idea-3",
    title: "Waste-to-Wealth Recycling Project",
    description: "A comprehensive recycling program that rewards citizens for separating their waste, creating jobs and a cleaner environment.",
    author: "Fatima Sani",
    upvotes: 98,
    submittedAt: new Date("2023-11-20"),
  },
  {
    id: "idea-4",
    title: "Improve Public Transport Routes",
    description: "Expand and optimize bus routes to connect underserved areas with the city center and major employment hubs.",
    author: "Umar Farouk",
    upvotes: 77,
    submittedAt: new Date("2023-12-05"),
  },
];

export const directives: Directive[] = [
  {
    id: "dir-1",
    title: "Streetlight Repair and Installation Phase 1",
    status: "In Progress",
    description: "A directive to repair all faulty streetlights and install new ones in key commercial and residential areas to improve security and nightlife.",
    updates: [
      "Initial survey of faulty lights completed.",
      "Procurement of new LED bulbs is underway.",
    ],
  },
  {
    id: "dir-2",
    title: "Drainage Desilting Program",
    status: "Completed",
    description: "Clearing of major drainage channels across the metropolitan area to prevent flooding during the rainy season.",
    updates: [
      "Contract awarded.",
      "Work completed in Fagge and Gwale LGAs.",
      "Program officially concluded with 95% of target channels cleared.",
    ],
  },
];

export const volunteerOpportunities: VolunteerOpportunity[] = [
    {
        id: 'vol-1',
        title: 'Mentor for Youth Tech Program',
        description: 'Guide and mentor a small group of students in our new tech training program. Share your industry experience.',
        requiredSkills: ['Software Development', 'Project Management', 'Public Speaking'],
    },
    {
        id: 'vol-2',
        title: 'Community Garden Volunteer',
        description: 'Help with planting, watering, and harvesting at the new community garden initiative. No experience needed!',
        requiredSkills: ['Gardening (optional)', 'Teamwork'],
    }
]
