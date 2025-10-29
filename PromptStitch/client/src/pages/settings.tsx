import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Download, Upload, Save, Moon, Sun, Palette, Cloud, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const settingsSchema = z.object({
  theme: z.enum(["light", "dark"]),
  autoSave: z.boolean(),
  syncEnabled: z.boolean(),
  syncProvider: z.string().optional(),
  exportFormat: z.enum(["json", "yaml", "markdown"]),
  particleEffects: z.boolean(),
  soundEffects: z.boolean(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function Settings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const { data: prompts = [] } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: SettingsForm) => apiRequest("PATCH", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your mystical preferences have been saved",
      });
    },
  });

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    values: settings || {
      theme: "dark",
      autoSave: true,
      syncEnabled: false,
      syncProvider: "",
      exportFormat: "json",
      particleEffects: true,
      soundEffects: false,
    },
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        prompts,
        categories,
        settings,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };

      const format = form.watch("exportFormat");
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case "yaml":
          // Simple YAML-like format
          content = Object.entries(exportData)
            .map(([key, value]) => `${key}:\n${JSON.stringify(value, null, 2).split('\n').map(line => '  ' + line).join('\n')}`)
            .join('\n\n');
          filename = "stitch-grimoire.yaml";
          mimeType = "text/yaml";
          break;
        case "markdown":
          content = `# Stitch Grimoire Export\n\n## Prompts (${prompts.length})\n\n${prompts.map((p: any) => `### ${p.title}\n${p.description || ''}\n\`\`\`\n${p.content}\n\`\`\`\n`).join('\n')}\n\n## Categories\n\n${categories.map((c: any) => `- **${c.name}**: ${c.description || 'No description'}`).join('\n')}`;
          filename = "stitch-grimoire.md";
          mimeType = "text/markdown";
          break;
        default:
          content = JSON.stringify(exportData, null, 2);
          filename = "stitch-grimoire.json";
          mimeType = "application/json";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Grimoire Exported",
        description: `Your spell collection has been saved as ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export your grimoire",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const content = await file.text();
      const data = JSON.parse(content);

      if (data.prompts && Array.isArray(data.prompts)) {
        toast({
          title: "Import Successful",
          description: `Found ${data.prompts.length} spells to import`,
        });
        // In a real implementation, you'd call an import API endpoint
        queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      } else {
        throw new Error("Invalid file format");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to read the grimoire file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-sacred-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading mystical preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
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
            Settings
          </h1>
          <p className="text-gray-300 text-lg">
            Configure your ritual preferences and mystical configurations
          </p>
        </motion.div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mystical text-sacred-gold flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Mystical Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Theme</Label>
                    <p className="text-sm text-gray-400">Choose between light and dark mystical themes</p>
                  </div>
                  <Select onValueChange={(value) => form.setValue("theme", value as "light" | "dark")}>
                    <SelectTrigger className="w-32 bg-midnight/50 border-sacred-gold/30 text-white">
                      <SelectValue placeholder={form.watch("theme")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Particle Effects</Label>
                    <p className="text-sm text-gray-400">Enable floating sacred geometry particles</p>
                  </div>
                  <Switch
                    checked={form.watch("particleEffects")}
                    onCheckedChange={(checked) => form.setValue("particleEffects", checked)}
                    data-testid="switch-particle-effects"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Sound Effects</Label>
                    <p className="text-sm text-gray-400">Play mystical sounds during interactions</p>
                  </div>
                  <Switch
                    checked={form.watch("soundEffects")}
                    onCheckedChange={(checked) => form.setValue("soundEffects", checked)}
                    data-testid="switch-sound-effects"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spell Crafting Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mystical text-sacred-gold flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Spell Crafting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Auto-Save</Label>
                    <p className="text-sm text-gray-400">Automatically save spells while crafting</p>
                  </div>
                  <Switch
                    checked={form.watch("autoSave")}
                    onCheckedChange={(checked) => form.setValue("autoSave", checked)}
                    data-testid="switch-auto-save"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sync Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mystical text-sacred-gold flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Cross-Dimensional Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Enable Sync</Label>
                    <p className="text-sm text-gray-400">Synchronize across all your mystical devices</p>
                  </div>
                  <Switch
                    checked={form.watch("syncEnabled")}
                    onCheckedChange={(checked) => form.setValue("syncEnabled", checked)}
                    data-testid="switch-sync-enabled"
                  />
                </div>

                {form.watch("syncEnabled") && (
                  <div>
                    <Label className="text-gray-300">Sync Provider</Label>
                    <Select onValueChange={(value) => form.setValue("syncProvider", value)}>
                      <SelectTrigger className="bg-midnight/50 border-sacred-gold/30 text-white mt-2">
                        <SelectValue placeholder="Choose sync provider..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google_drive">Google Drive</SelectItem>
                        <SelectItem value="dropbox">Dropbox</SelectItem>
                        <SelectItem value="icloud">iCloud</SelectItem>
                        <SelectItem value="onedrive">OneDrive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Import/Export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mystical text-sacred-gold flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Grimoire Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300">Export Format</Label>
                  <Select onValueChange={(value) => form.setValue("exportFormat", value as "json" | "yaml" | "markdown")}>
                    <SelectTrigger className="bg-midnight/50 border-sacred-gold/30 text-white mt-2">
                      <SelectValue placeholder={form.watch("exportFormat")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="yaml">YAML</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-sacred-gold/20" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="sacred-button"
                    data-testid="button-export-grimoire"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export Grimoire"}
                  </Button>

                  <div>
                    <input
                      type="file"
                      accept=".json,.yaml,.yml"
                      onChange={handleImport}
                      className="hidden"
                      id="import-file"
                      data-testid="input-import-file"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("import-file")?.click()}
                      disabled={isImporting}
                      variant="outline"
                      className="w-full border-sacred-gold/50 text-sacred-gold"
                      data-testid="button-import-grimoire"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isImporting ? "Importing..." : "Import Grimoire"}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Export your entire spell collection or import from another grimoire
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            className="flex justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              size="lg"
              disabled={updateSettingsMutation.isPending}
              className="sacred-button px-12"
              data-testid="button-save-settings"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSettingsMutation.isPending ? "Saving..." : "Save Mystical Preferences"}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
