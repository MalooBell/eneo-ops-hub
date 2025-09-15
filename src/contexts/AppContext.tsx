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
      // Données de démonstration en attendant que le backend soit disponible
      const interventionsData: Intervention[] = [
        {
          id: 1,
          zammadTicketId: 58,
          status: 'NOUVEAU',
          problemDescription: 'Bonjour, mon compteur semble tourner trop vite.',
          latitude: 4.0511,
          longitude: 9.7679,
          agentId: null,
          customerId: 38,
          createdAt: '2025-09-14T14:30:00.000Z',
          updatedAt: '2025-09-14T14:30:00.000Z'
        },
        {
          id: 2,
          zammadTicketId: 59,
          status: 'ASSIGNE',
          problemDescription: 'Panne d\'électricité dans mon quartier.',
          latitude: 3.8480,
          longitude: 11.5021,
          agentId: 77,
          customerId: 42,
          createdAt: '2025-09-14T15:45:00.000Z',
          updatedAt: '2025-09-14T16:00:00.000Z'
        },
        {
          id: 3,
          zammadTicketId: 60,
          status: 'RESOLU',
          problemDescription: 'Facture incorrecte reçue ce mois.',
          latitude: 4.0792,
          longitude: 9.2818,
          agentId: 78,
          customerId: 45,
          createdAt: '2025-09-14T13:20:00.000Z',
          updatedAt: '2025-09-14T17:30:00.000Z'
        }
      ];

      const agentsData: Agent[] = [
        { agentId: 77, latitude: 3.8600, longitude: 11.5200, name: 'Agent Jean Dupont' },
        { agentId: 78, latitude: 4.0800, longitude: 9.2900, name: 'Agent Marie Kenne' },
        { agentId: 79, latitude: 4.0400, longitude: 9.7500, name: 'Agent Paul Mbida' }
      ];

      // Tenter l'API d'abord, sinon utiliser les données de démo
      try {
        const [interventionsResponse, agentsResponse] = await Promise.all([
          api.getInterventions(),
          api.getOnlineAgents(),
        ]);
        setInterventions(interventionsResponse);
        setAgents(agentsResponse);
      } catch (apiError) {
        console.log('Backend non disponible, utilisation des données de démonstration');
        setInterventions(interventionsData);
        setAgents(agentsData);
      }
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