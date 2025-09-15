import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Users } from 'lucide-react';

interface MapFiltersProps {
  showInterventions: boolean;
  showAgents: boolean;
  onToggleInterventions: (show: boolean) => void;
  onToggleAgents: (show: boolean) => void;
}

export function MapFilters({ 
  showInterventions, 
  showAgents, 
  onToggleInterventions, 
  onToggleAgents 
}: MapFiltersProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Filtres de la carte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <Label htmlFor="interventions-toggle" className="text-sm font-medium">
              Interventions
            </Label>
          </div>
          <Switch
            id="interventions-toggle"
            checked={showInterventions}
            onCheckedChange={onToggleInterventions}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <Label htmlFor="agents-toggle" className="text-sm font-medium">
              Agents
            </Label>
          </div>
          <Switch
            id="agents-toggle"
            checked={showAgents}
            onCheckedChange={onToggleAgents}
          />
        </div>
      </CardContent>
    </Card>
  );
}