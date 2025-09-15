import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from '@/contexts/AppContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock } from 'lucide-react';

export default function Agents() {
  const { agents, loading } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des agents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion des Agents</h1>
        <p className="text-muted-foreground">Vue d'ensemble des agents actifs sur le terrain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Agents en ligne</span>
                <Badge variant="secondary">{agents.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Agents disponibles</span>
                <Badge variant="outline">{agents.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Agents</CardTitle>
          <CardDescription>Agents actuellement connectés et leur position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun agent connecté actuellement</p>
              </div>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.agentId}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {agent.name ? agent.name.split(' ').map(n => n[0]).join('').toUpperCase() : `A${agent.agentId}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {agent.name || `Agent #${agent.agentId}`}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {agent.latitude.toFixed(4)}, {agent.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Clock className="h-3 w-3 mr-1" />
                      En ligne
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}