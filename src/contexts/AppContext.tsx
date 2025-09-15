import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Intervention, Agent } from '@/types';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  interventions: Intervention[];
  agents: Agent[];
  selectedIntervention: Intervention | null;
  loading: boolean;
  setSelectedIntervention: (intervention: Intervention | null) => void;
  refreshData: () => Promise<void>;
  assignIntervention: (interventionId: number, agentId: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshData = async () => {
    try {
      const [interventionsData, agentsData] = await Promise.all([
        api.getInterventions(),
        api.getOnlineAgents(),
      ]);
      setInterventions(interventionsData);
      setAgents(agentsData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignIntervention = async (interventionId: number, agentId: number) => {
    try {
      const updatedIntervention = await api.assignIntervention(interventionId, agentId);
      setInterventions(prev => 
        prev.map(intervention => 
          intervention.id === interventionId ? updatedIntervention : intervention
        )
      );
      toast({
        title: "Succès",
        description: "Intervention assignée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner l'intervention",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Rafraîchissement automatique toutes les 20 secondes
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 20000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    interventions,
    agents,
    selectedIntervention,
    loading,
    setSelectedIntervention,
    refreshData,
    assignIntervention,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}