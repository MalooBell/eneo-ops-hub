import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { InterventionMap } from '@/components/map/InterventionMap';
import { InterventionsTable } from '@/components/interventions/InterventionsTable';
import { AssignmentModal } from '@/components/interventions/AssignmentModal';
import { MapFilters } from '@/components/map/MapFilters';
import { Intervention } from '@/types';

function Dashboard() {
  const { setSelectedIntervention } = useApp();
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [interventionToAssign, setInterventionToAssign] = useState<Intervention | null>(null);
  const [showInterventions, setShowInterventions] = useState(true);
  const [showAgents, setShowAgents] = useState(true);

  const handleRowClick = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
  };

  const handleAssignIntervention = (intervention: Intervention) => {
    setInterventionToAssign(intervention);
    setAssignmentModalOpen(true);
  };

  const handleCloseAssignmentModal = () => {
    setAssignmentModalOpen(false);
    setInterventionToAssign(null);
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 flex overflow-hidden">
        {/* Carte - 70% */}
        <div className="flex-1 p-6 space-y-4">
          <MapFilters
            showInterventions={showInterventions}
            showAgents={showAgents}
            onToggleInterventions={setShowInterventions}
            onToggleAgents={setShowAgents}
          />
          <div className="flex-1">
            <InterventionMap 
              onAssignIntervention={handleAssignIntervention}
              showInterventions={showInterventions}
              showAgents={showAgents}
            />
          </div>
        </div>
        
        {/* Liste des interventions - 30% */}
        <div className="w-96 p-6 pl-0">
          <InterventionsTable 
            onRowClick={handleRowClick}
            onAssignIntervention={handleAssignIntervention}
          />
        </div>
      </main>

      <AssignmentModal
        intervention={interventionToAssign}
        isOpen={assignmentModalOpen}
        onClose={handleCloseAssignmentModal}
      />
    </div>
  );
}

const Index = () => {
  return <Dashboard />;
};

export default Index;
