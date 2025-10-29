import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Cloud, Smartphone, Monitor, RefreshCw, Download, Upload, Wifi, WifiOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";

interface SyncStatus {
  android: {
    connected: boolean;
    lastSync: string;
    status: "synced" | "syncing" | "error" | "disconnected";
    deviceName?: string;
  };
  chrome: {
    connected: boolean;
    lastSync: string;
    status: "synced" | "syncing" | "error" | "disconnected";
    version?: string;
  };
  cloud: {
    connected: boolean;
    lastSync: string;
    status: "synced" | "syncing" | "error" | "disconnected";
    provider?: string;
    storageUsed?: number;
    storageLimit?: number;
  };
}

export default function Conflux() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const { data: prompts = [] } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // Mock sync status - in a real app this would come from your sync service
  const syncStatus: SyncStatus = {
    android: {
      connected: true,
      lastSync: "2 minutes ago",
      status: "synced",
      deviceName: "Pixel 7 Pro"
    },
    chrome: {
      connected: true,
      lastSync: "1 minute ago", 
      status: "synced",
      version: "1.2.3"
    },
    cloud: {
      connected: settings?.syncEnabled || false,
      lastSync: "30 seconds ago",
      status: settings?.syncEnabled ? "synced" : "disconnected",
      provider: settings?.syncProvider || "Google Drive",
      storageUsed: 2.4,
      storageLimit: 15
    }
  };

  const handleToggleSync = (enabled: boolean) => {
    updateSettingsMutation.mutate({ syncEnabled: enabled });
    toast({
      title: enabled ? "Sync Enabled" : "Sync Disabled",
      description: enabled 
        ? "Cross-dimensional synchronization is now active" 
        : "Sync has been disabled across all realms",
    });
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsSyncing(false);
          toast({
            title: "Sync Complete",
            description: "All realms have been synchronized successfully",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    }, 2000);
  };

  const getStatusIcon = (status: string, connected: boolean) => {
    if (!connected) return <WifiOff className="h-4 w-4 text-red-400" />;
    
    switch (status) {
      case "synced":
        return <CheckCircle className="h-4 w-4 text-ancient-green" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-neon-cyan animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string, connected: boolean) => {
    if (!connected) return "Disconnected";
    
    switch (status) {
      case "synced":
        return "Synchronized";
      case "syncing":
        return "Synchronizing...";
      case "error":
        return "Sync Error";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string, connected: boolean) => {
    if (!connected) return "text-red-400";
    
    switch (status) {
      case "synced":
        return "text-ancient-green";
      case "syncing":
        return "text-neon-cyan";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const connectedRealms = [syncStatus.android, syncStatus.chrome, syncStatus.cloud].filter(realm => realm.connected).length;
  const totalSpells = prompts.length;
  const lastSyncTime = syncStatus.cloud.connected ? syncStatus.cloud.lastSync : "Never";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">
            <SacredLogo size="md" />
          </Link>
          <h1 className="font-mystical text-4xl font-semibold text-sacred-gold mt-4 mb-2">
            Conflux
          </h1>
          <p className="text-gray-300 text-lg">
            The ethereal bridge for cross-dimensional synchronization
          </p>
        </motion.div>

        {/* Sync Overview */}
        <motion.div 
          className="glow-border rounded-3xl p-8 mb-8 bg-gradient-to-br from-midnight/90 to-forest/70 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-ethereal-pink/5 pointer-events-none" />
          
          <div className="text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-ethereal-pink rounded-full"
                animate={{ 
                  boxShadow: [
                    "0 0 20px var(--neon-cyan)",
                    "0 0 40px var(--ethereal-pink)",
                    "0 0 20px var(--neon-cyan)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="absolute inset-2 bg-midnight rounded-full flex items-center justify-center">
                <i className="fas fa-infinity text-3xl text-sacred-gold sigil-icon" />
              </div>
            </div>
            
            <h2 className="font-mystical text-3xl font-semibold text-sacred-gold mb-4">
              Synchronization Nexus
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-cyan">{connectedRealms}</div>
                <div className="text-sm text-gray-400">Connected Realms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ethereal-pink">{totalSpells}</div>
                <div className="text-sm text-gray-400">Synchronized Spells</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sacred-gold">{lastSyncTime}</div>
                <div className="text-sm text-gray-400">Last Sync</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ancient-green">
                  {syncStatus.cloud.storageUsed?.toFixed(1) || "0"}MB
                </div>
                <div className="text-sm text-gray-400">Cloud Storage</div>
              </div>
            </div>

            {/* Master Sync Toggle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Label className="text-gray-300 font-mystical">Master Synchronization</Label>
              <Switch
                checked={settings?.syncEnabled || false}
                onCheckedChange={handleToggleSync}
                disabled={updateSettingsMutation.isPending}
                data-testid="switch-master-sync"
              />
            </div>

            {/* Manual Sync Button */}
            <Button
              onClick={handleManualSync}
              disabled={isSyncing || !settings?.syncEnabled}
              className="sacred-button px-8"
              data-testid="button-manual-sync"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? "Synchronizing..." : "Force Sync All Realms"}
            </Button>

            {/* Sync Progress */}
            {isSyncing && (
              <motion.div 
                className="mt-4 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Progress 
                  value={syncProgress} 
                  className="bg-midnight/50 border border-sacred-gold/30" 
                />
                <p className="text-sm text-gray-400 mt-2">
                  Synchronizing across dimensions... {syncProgress}%
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Realm Status Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Android Realm */}
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mystical text-sacred-gold flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-ancient-green to-neon-cyan rounded-full flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                Android Realm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(syncStatus.android.status, syncStatus.android.connected)}
                  <span className={getStatusColor(syncStatus.android.status, syncStatus.android.connected)}>
                    {getStatusText(syncStatus.android.status, syncStatus.android.connected)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Device</span>
                <span className="text-gray-400">{syncStatus.android.deviceName || "Unknown"}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Sync</span>
                <span className="text-gray-400">{syncStatus.android.lastSync}</span>
              </div>
              
              <Separator className="bg-sacred-gold/20" />
              
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-ancient-green/50 text-ancient-green hover:bg-ancient-green/10"
                  data-testid="button-configure-android"
                >
                  Configure App
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chrome Extension Realm */}
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mystical text-sacred-gold flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-ethereal-pink to-mystic-purple rounded-full flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-white" />
                </div>
                Chrome Extension
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(syncStatus.chrome.status, syncStatus.chrome.connected)}
                  <span className={getStatusColor(syncStatus.chrome.status, syncStatus.chrome.connected)}>
                    {getStatusText(syncStatus.chrome.status, syncStatus.chrome.connected)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Version</span>
                <Badge variant="outline" className="border-ethereal-pink/50 text-ethereal-pink">
                  v{syncStatus.chrome.version || "Unknown"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Sync</span>
                <span className="text-gray-400">{syncStatus.chrome.lastSync}</span>
              </div>
              
              <Separator className="bg-sacred-gold/20" />
              
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-ethereal-pink/50 text-ethereal-pink hover:bg-ethereal-pink/10"
                  data-testid="button-configure-chrome"
                >
                  Manage Extension
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cloud Sanctum */}
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mystical text-sacred-gold flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-mystic-purple to-sacred-gold rounded-full flex items-center justify-center">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                Cloud Sanctum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(syncStatus.cloud.status, syncStatus.cloud.connected)}
                  <span className={getStatusColor(syncStatus.cloud.status, syncStatus.cloud.connected)}>
                    {getStatusText(syncStatus.cloud.status, syncStatus.cloud.connected)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Provider</span>
                <span className="text-gray-400">{syncStatus.cloud.provider || "None"}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Storage</span>
                <span className="text-gray-400">
                  {syncStatus.cloud.storageUsed?.toFixed(1) || 0}MB / {syncStatus.cloud.storageLimit || 0}GB
                </span>
              </div>
              
              {syncStatus.cloud.connected && (
                <div>
                  <Progress 
                    value={(syncStatus.cloud.storageUsed || 0) / ((syncStatus.cloud.storageLimit || 15) * 1024) * 100} 
                    className="bg-midnight/50 border border-sacred-gold/30"
                  />
                </div>
              )}
              
              <Separator className="bg-sacred-gold/20" />
              
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-mystic-purple/50 text-mystic-purple hover:bg-mystic-purple/10"
                  data-testid="button-configure-cloud"
                >
                  Cloud Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sync History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mystical text-sacred-gold flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Recent Synchronization Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "2 minutes ago", action: "Synchronized 3 new spells to Android", type: "upload" },
                  { time: "5 minutes ago", action: "Downloaded spell updates from Chrome", type: "download" },
                  { time: "10 minutes ago", action: "Backed up complete grimoire to Cloud", type: "backup" },
                  { time: "1 hour ago", action: "Resolved sync conflicts for 'AI Prompt Templates'", type: "conflict" },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-midnight/30 border border-sacred-gold/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-sacred-gold flex items-center justify-center flex-shrink-0">
                      {activity.type === "upload" && <Upload className="h-4 w-4 text-white" />}
                      {activity.type === "download" && <Download className="h-4 w-4 text-white" />}
                      {activity.type === "backup" && <Cloud className="h-4 w-4 text-white" />}
                      {activity.type === "conflict" && <AlertCircle className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">{activity.action}</p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  className="border-sacred-gold/50 text-sacred-gold"
                  data-testid="button-view-full-history"
                >
                  View Full Sync History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
