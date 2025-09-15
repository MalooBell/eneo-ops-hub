import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, RefreshCw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Intervention, InterventionStatus } from '@/types';

interface InterventionsTableProps {
  onRowClick: (intervention: Intervention) => void;
  onAssignIntervention: (intervention: Intervention) => void;
}

export function InterventionsTable({ onRowClick, onAssignIntervention }: InterventionsTableProps) {
  const { interventions, loading, refreshData } = useApp();
  const [statusFilter, setStatusFilter] = useState<InterventionStatus | 'ALL'>('ALL');

  const filteredInterventions = interventions.filter(intervention => 
    statusFilter === 'ALL' || intervention.status === statusFilter
  );

  const getStatusColor = (status: InterventionStatus) => {
    switch (status) {
      case 'NOUVEAU':
        return 'bg-status-nouveau/10 text-status-nouveau border-status-nouveau/20';
      case 'ASSIGNE':
        return 'bg-status-assigne/10 text-status-assigne border-status-assigne/20';
      case 'RESOLU':
        return 'bg-status-resolu/10 text-status-resolu border-status-resolu/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: InterventionStatus) => {
    switch (status) {
      case 'NOUVEAU':
        return 'Nouveau';
      case 'ASSIGNE':
        return 'Assigné';
      case 'RESOLU':
        return 'Résolu';
      default:
        return status;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Interventions</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InterventionStatus | 'ALL')}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous</SelectItem>
                <SelectItem value="NOUVEAU">Nouveau</SelectItem>
                <SelectItem value="ASSIGNE">Assigné</SelectItem>
                <SelectItem value="RESOLU">Résolu</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto">
          <div className="space-y-2 p-4">
            {filteredInterventions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {loading ? 'Chargement...' : 'Aucune intervention trouvée'}
              </div>
            ) : (
              filteredInterventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onRowClick(intervention)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getStatusColor(intervention.status)}`}>
                        {getStatusLabel(intervention.status)}
                      </Badge>
                      <span className="font-medium text-sm">
                        Ticket #{intervention.zammadTicketId}
                      </span>
                    </div>
                    {intervention.status === 'NOUVEAU' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssignIntervention(intervention);
                        }}
                        className="text-xs"
                      >
                        Assigner
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {intervention.problemDescription}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Client #{intervention.customerId}</span>
                    <span>
                      {new Date(intervention.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {intervention.agentId && (
                    <div className="mt-2 text-xs text-primary">
                      Agent assigné: #{intervention.agentId}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}