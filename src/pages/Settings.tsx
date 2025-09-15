import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, MapPin } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('20');
  const [mapZoom, setMapZoom] = useState('6');
  const [showAgents, setShowAgents] = useState(true);
  const [showInterventions, setShowInterventions] = useState(true);

  const handleSaveSettings = () => {
    // Ici on sauvegarderait normalement dans localStorage ou via une API
    localStorage.setItem('eneo-settings', JSON.stringify({
      autoRefresh,
      refreshInterval,
      mapZoom,
      showAgents,
      showInterventions
    }));

    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été enregistrées avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configuration de l'application et préférences utilisateur</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres de la carte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Paramètres de la Carte</span>
            </CardTitle>
            <CardDescription>
              Configuration de l'affichage et du comportement de la carte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="mapZoom">Niveau de zoom par défaut</Label>
              <Select value={mapZoom} onValueChange={setMapZoom}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 - Vue pays</SelectItem>
                  <SelectItem value="6">6 - Vue régionale</SelectItem>
                  <SelectItem value="8">8 - Vue ville</SelectItem>
                  <SelectItem value="10">10 - Vue quartier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Éléments à afficher</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showInterventions">Afficher les interventions</Label>
                  <p className="text-sm text-muted-foreground">
                    Montrer les marqueurs d'interventions sur la carte
                  </p>
                </div>
                <Switch
                  id="showInterventions"
                  checked={showInterventions}
                  onCheckedChange={setShowInterventions}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showAgents">Afficher les agents</Label>
                  <p className="text-sm text-muted-foreground">
                    Montrer les marqueurs d'agents sur la carte
                  </p>
                </div>
                <Switch
                  id="showAgents"
                  checked={showAgents}
                  onCheckedChange={setShowAgents}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de synchronisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span>Synchronisation</span>
            </CardTitle>
            <CardDescription>
              Configuration du rafraîchissement automatique des données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoRefresh">Rafraîchissement automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Actualiser automatiquement les données
                </p>
              </div>
              <Switch
                id="autoRefresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>

            {autoRefresh && (
              <div className="space-y-3">
                <Label htmlFor="refreshInterval">Intervalle de rafraîchissement (secondes)</Label>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 secondes</SelectItem>
                    <SelectItem value="20">20 secondes</SelectItem>
                    <SelectItem value="30">30 secondes</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations système */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Système</CardTitle>
            <CardDescription>
              Détails sur la version et l'état de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Version</Label>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Environnement</Label>
                <p className="font-medium">Production</p>
              </div>
              <div>
                <Label className="text-muted-foreground">API Backend</Label>
                <p className="font-medium">localhost:8082</p>
              </div>
              <div>
                <Label className="text-muted-foreground">État API</Label>
                <p className="font-medium text-yellow-600">Mode démo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Sauvegarder les paramètres</span>
        </Button>
      </div>
    </div>
  );
}