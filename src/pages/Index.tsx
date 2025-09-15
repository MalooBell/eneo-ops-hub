import React, { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { InterventionMap } from '@/components/map/InterventionMap';
import { InterventionsTable } from '@/components/interventions/InterventionsTable';
import { AssignmentModal } from '@/components/interventions/AssignmentModal';
import { Intervention } from '@/types';

function Dashboard() {
  const { setSelectedIntervention } = useApp();
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [interventionToAssign, setInterventionToAssign] = useState<Intervention | null>(null);

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
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Carte - 70% */}
        <div className="flex-1 p-6">
          <InterventionMap onAssignIntervention={handleAssignIntervention} />
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
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
};

export default Index;
