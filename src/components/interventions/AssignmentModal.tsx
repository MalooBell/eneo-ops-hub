import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, User, Loader2 } from 'lucide-react';
import { Intervention, NearbyAgent } from '@/types';
import { api } from '@/services/api';
import { useApp } from '@/contexts/AppContext';

interface AssignmentModalProps {
  intervention: Intervention | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentModal({ intervention, isOpen, onClose }: AssignmentModalProps) {
  const [nearbyAgents, setNearbyAgents] = useState<NearbyAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const { assignIntervention } = useApp();

  useEffect(() => {
    if (intervention && isOpen) {
      loadNearbyAgents();
    }
  }, [intervention, isOpen]);

  const loadNearbyAgents = async () => {
    if (!intervention) return;
    
    setLoading(true);
    try {
      const agents = await api.getNearbyAgents(intervention.id);
      setNearbyAgents(agents);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!intervention || !selectedAgent) return;

    setAssigning(true);
    try {
      await assignIntervention(intervention.id, selectedAgent);
      onClose();
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte
    } finally {
      setAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedAgent(null);
    setNearbyAgents([]);
    onClose();
  };

  if (!intervention) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Assigner l'intervention</span>
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un agent pour assigner cette intervention
          </DialogDescription>
        </DialogHeader>

        {/* Détails de l'intervention */}
        <Card className="p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Ticket #{intervention.zammadTicketId}</h3>
              <Badge className="bg-status-nouveau/10 text-status-nouveau border-status-nouveau/20">
                Nouveau
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {intervention.problemDescription}
            </p>
            <div className="text-xs text-muted-foreground">
              Client #{intervention.customerId} • Créé le {new Date(intervention.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </Card>

        {/* Liste des agents */}
        <div className="space-y-4">
          <h4 className="font-medium">Agents disponibles à proximité</h4>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Recherche d'agents...</span>
            </div>
          ) : nearbyAgents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun agent disponible à proximité
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {nearbyAgents.map((agent) => (
                <Card
                  key={agent.agentId}
                  className={`p-3 cursor-pointer transition-colors border ${
                    selectedAgent === agent.agentId
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedAgent(agent.agentId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name || `Agent #${agent.agentId}`}</p>
                        <p className="text-sm text-muted-foreground">
                          Distance: {agent.distance.toFixed(1)} km
                        </p>
                      </div>
                    </div>
                    {selectedAgent === agent.agentId && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedAgent || assigning}
          >
            {assigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Assignation...
              </>
            ) : (
              'Confirmer l\'assignation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}