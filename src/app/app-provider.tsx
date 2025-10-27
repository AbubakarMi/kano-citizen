
'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { UserProfile, Idea, Directive, VolunteerOpportunity, ApprovalItem, Testimonial } from '@/lib/data';
import { useMemoFirebase } from '@/lib/utils';

type AppContextType = {
  activeView: string;
  setActiveView: (view: string) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  ideas: Idea[];
  setIdeas: (ideas: Idea[]) => void;
  directives: Directive[];
  setDirectives: (directives: Directive[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  volunteerOpportunities: VolunteerOpportunity[];
  approvalQueue: ApprovalItem[];
  setApprovalQueue: React.Dispatch<React.SetStateAction<ApprovalItem[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { authedUser } = useUser();
  const firestore = useFirestore();
  
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalItem[]>([]);
  
  const ideasQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'ideas')) : null, [firestore]);
  const { data: ideasData } = useCollection<Idea>(ideasQuery);
  
  const directivesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'directives')) : null, [firestore]);
  const { data: directivesData } = useCollection<Directive>(directivesQuery);
  
  const volunteerQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'volunteerOpportunities')) : null, [firestore]);
  const { data: volunteerOpportunities } = useCollection<VolunteerOpportunity>(volunteerQuery);

  const testimonialsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'testimonials')) : null, [firestore]);
  const { data: testimonialsData } = useCollection<Testimonial>(testimonialsQuery);

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [directives, setDirectives] = useState<Directive[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (ideasData) setIdeas(ideasData);
  }, [ideasData]);

  useEffect(() => {
    if (directivesData) setDirectives(directivesData);
  }, [directivesData]);

  useEffect(() => {
    if (testimonialsData) setTestimonials(testimonialsData);
  }, [testimonialsData]);

  useEffect(() => {
    if (authedUser?.profile?.role) {
      switch (authedUser.profile.role) {
        case 'Citizen':
          setActiveView('decide');
          break;
        case 'MDA Official':
          setActiveView('directives');
          break;
        case 'Moderator':
          setActiveView('queue');
          break;
        case 'Special Adviser':
            setActiveView('dashboard');
            break;
        case 'Governor':
            setActiveView('overview');
            break;
        default:
          setActiveView('overview');
      }
    } else {
      // Default for non-logged-in users
      setActiveView('overview');
    }
  }, [authedUser?.profile?.role]);

  const value = {
    activeView,
    setActiveView,
    isSidebarCollapsed,
    setSidebarCollapsed,
    ideas: ideas || [],
    setIdeas: setIdeas,
    directives: directives || [],
    setDirectives,
    testimonials: testimonials || [],
    setTestimonials,
    volunteerOpportunities: volunteerOpportunities || [],
    approvalQueue,
    setApprovalQueue,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
