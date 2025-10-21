
'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { UserProfile, Idea, Directive, VolunteerOpportunity } from '@/lib/data';
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
  volunteerOpportunities: VolunteerOpportunity[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
        case 'SPD Coordinator':
          setActiveView('events');
          break;
        case 'System Administrator':
          setActiveView('health');
          break;
        case 'Super Admin':
          setActiveView('overview');
          break;
        default:
          setActiveView('overview');
      }
    } else {
      // Default for non-logged-in users or those without a role
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
