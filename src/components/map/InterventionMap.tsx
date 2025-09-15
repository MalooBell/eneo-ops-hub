import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { MapPin, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Intervention, Agent } from '@/types';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes personnalisées
const createInterventionIcon = (status: string) => {
  const colors = {
    NOUVEAU: '#EF4444',
    ASSIGNE: '#3B82F6', 
    RESOLU: '#10B981'
  };

  return new DivIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg" style="background-color: ${colors[status as keyof typeof colors]}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    className: 'intervention-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const createAgentIcon = () => {
  return new DivIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg bg-blue-600">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    `,
    className: 'agent-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Composant pour centrer la carte sur une intervention sélectionnée
function MapController() {
  const map = useMap();
  const { selectedIntervention } = useApp();

  useEffect(() => {
    if (selectedIntervention) {
      map.panTo([selectedIntervention.latitude, selectedIntervention.longitude]);
    }
  }, [selectedIntervention, map]);

  return null;
}

interface InterventionPopupProps {
  intervention: Intervention;
  onAssign: () => void;
}

function InterventionPopup({ intervention, onAssign }: InterventionPopupProps) {
  return (
    <div className="min-w-[250px] p-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Ticket #{intervention.zammadTicketId}</h3>
          <span className={`status-badge ${intervention.status.toLowerCase()}`}>
            {intervention.status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{intervention.problemDescription}</p>
        <div className="text-xs text-gray-500">
          Client ID: {intervention.customerId}
        </div>
        <div className="text-xs text-gray-500">
          Créé le: {new Date(intervention.createdAt).toLocaleDateString('fr-FR')}
        </div>
        {intervention.status === 'NOUVEAU' && (
          <button
            onClick={onAssign}
            className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Assigner
          </button>
        )}
      </div>
    </div>
  );
}

interface InterventionMapProps {
  onAssignIntervention: (intervention: Intervention) => void;
}

export function InterventionMap({ onAssignIntervention }: InterventionMapProps) {
  const { interventions, agents } = useApp();

  // Centre sur le Cameroun
  const center: [number, number] = [7.3697, 12.3547];

  return (
    <div className="h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController />

        {/* Marqueurs d'interventions */}
        {interventions.map((intervention) => (
          <Marker
            key={intervention.id}
            position={[intervention.latitude, intervention.longitude]}
            icon={createInterventionIcon(intervention.status)}
          >
            <Popup>
              <InterventionPopup
                intervention={intervention}
                onAssign={() => onAssignIntervention(intervention)}
              />
            </Popup>
          </Marker>
        ))}

        {/* Marqueurs d'agents */}
        {agents.map((agent) => (
          <Marker
            key={agent.agentId}
            position={[agent.latitude, agent.longitude]}
            icon={createAgentIcon()}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Agent #{agent.agentId}</h3>
                <p className="text-sm text-gray-600">
                  Position: {agent.latitude.toFixed(4)}, {agent.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}