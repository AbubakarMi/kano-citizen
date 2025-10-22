
'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { UserProfile, Idea, Directive, VolunteerOpportunity, ApprovalItem } from '@/lib/data';
import { useMemoFirebase } from '@/lib/utils';
import { initialApprovalItems } from '@/lib/data';

type AppContextType = {
  activeView: string;
  setActiveView: (view: string) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  ideas: Idea[];
  setIdeas: (ideas: Idea[]) => void;
  directives: Directive[];
  setDirectives: (directives: Directive[]) => void;
  volunteerOpportunities: VolunteerOpportunity[];
  approvalQueue: ApprovalItem[];
  setApprovalQueue: React.Dispatch<React.SetStateAction<ApprovalItem[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalItem[]>(initialApprovalItems);
  
  const ideasQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'ideas')) : null, [firestore]);
  const { data: ideasData } = useCollection<Idea>(ideasQuery);
  
  const directivesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'directives')) : null, [firestore]);
  const { data: directivesData } = useCollection<Directive>(directivesQuery);
  
  const volunteerQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'volunteerOpportunities')) : null, [firestore]);
  const { data: volunteerOpportunities } = useCollection<VolunteerOpportunity>(volunteerQuery);

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [directives, setDirectives] = useState<Directive[]>([]);

  useEffect(() => {
    if (ideasData) setIdeas(ideasData);
  }, [ideasData]);

  useEffect(() => {
    if (directivesData) setDirectives(directivesData);
  }, [directivesData]);

  useEffect(() => {
    if (user?.profile?.role) {
      switch (user.profile.role) {
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
  }, [user?.profile?.role]);

  const value = {
    activeView,
    setActiveView,
    isSidebarCollapsed,
    setSidebarCollapsed,
    ideas: ideas || [],
    setIdeas: setIdeas,
    directives: directives || [],
    setDirectives,
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
