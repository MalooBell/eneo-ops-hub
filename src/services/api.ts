import { Intervention, Agent, NearbyAgent } from '@/types';

const API_BASE_URL = 'http://localhost:8082';

export const api = {
  // Récupérer toutes les interventions
  async getInterventions(): Promise<Intervention[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/interventions`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des interventions');
    }
    return response.json();
  },

  // Récupérer les agents en ligne
  async getOnlineAgents(): Promise<Agent[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/agents/online`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des agents');
    }
    return response.json();
  },

  // Récupérer les agents proches d'une intervention
  async getNearbyAgents(interventionId: number): Promise<NearbyAgent[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/interventions/${interventionId}/nearby-agents`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des agents proches');
    }
    return response.json();
  },

  // Assigner une intervention à un agent
  async assignIntervention(interventionId: number, agentId: number): Promise<Intervention> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/interventions/${interventionId}/assign/${agentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'assignation de l\'intervention');
    }
    return response.json();
  },
};