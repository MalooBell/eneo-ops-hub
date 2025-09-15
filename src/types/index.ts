export interface Intervention {
  id: number;
  zammadTicketId: number;
  status: 'NOUVEAU' | 'ASSIGNE' | 'RESOLU';
  problemDescription: string;
  latitude: number;
  longitude: number;
  agentId: number | null;
  customerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  agentId: number;
  latitude: number;
  longitude: number;
  name?: string;
}

export interface NearbyAgent {
  agentId: number;
  name: string;
  distance: number;
}

export type InterventionStatus = 'NOUVEAU' | 'ASSIGNE' | 'RESOLU';