'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, Settings, Trash2, Eye } from 'lucide-react';

interface Script {
  id: string;
  name: string;
  active: boolean;
  config: {
    greeting?: string;
    businessHours?: {
      start: string;
      end: string;
      timezone: string;
    };
    escalationKeywords?: string[];
    maxRetries?: number;
  };
  created_at: string;
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    greeting: 'Hello! Thank you for calling. How can I help you today?',
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'America/New_York',
    },
    escalationKeywords: 'frustrated, angry, manager, supervisor, human',
    maxRetries: 3,
  });

  useEffect(() => {
    // TODO: Fetch scripts from API
    // For now, use mock data
    setScripts([
      {
        id: '1',
        name: 'Default Professional',
        active: true,
        config: {
          greeting: 'Hello! Thank you for calling. How can I help you today?',
          businessHours: {
            start: '09:00',
            end: '17:00',
            timezone: 'America/New_York',
          },
          escalationKeywords: ['frustrated', 'angry', 'manager', 'supervisor'],
          maxRetries: 3,
        },
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        name: 'Casual Friendly',
        active: false,
        config: {
          greeting: 'Hi there! Thanks for calling. What can I do for you?',
          businessHours: {
            start: '08:00',
            end: '18:00',
            timezone: 'America/New_York',
          },
          escalationKeywords: ['help', 'human', 'representative'],
          maxRetries: 2,
        },
        created_at: '2024-01-16T14:30:00Z',
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleCreateScript = async () => {
    if (!formData.name) return;

    const newScript: Script = {
      id: Date.now().toString(),
      name: formData.name,
      active: scripts.length === 0, // First script is active by default
      config: {
        greeting: formData.greeting,
        businessHours: formData.businessHours,
        escalationKeywords: formData.escalationKeywords.split(',').map(k => k.trim()),
        maxRetries: formData.maxRetries,
      },
      created_at: new Date().toISOString(),
    };

    try {
      // TODO: Save to database
      setScripts([...scripts, newScript]);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating script:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      greeting: 'Hello! Thank you for calling. How can I help you today?',
      businessHours: {
        start: '09:00',
        end: '17:00',
        timezone: 'America/New_York',
      },
      escalationKeywords: 'frustrated, angry, manager, supervisor, human',
      maxRetries: 3,
    });
  };

  const toggleScriptActive = (scriptId: string) => {
    setScripts(scripts.map(script => ({
      ...script,
      active: script.id === scriptId ? !script.active : script.active,
    })));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversation Scripts</h1>
            <p className="text-gray-600">
              Configure how your AI receptionist behaves and responds to calls
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Script
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Conversation Script</DialogTitle>
                <DialogDescription>
                  Define how your AI receptionist should behave
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="name">Script Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Professional Receptionist"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Textarea
                    id="greeting"
                    placeholder="How should the AI greet callers?"
                    value={formData.greeting}
                    onChange={(e) => setFormData({...formData, greeting: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Business Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.businessHours.start}
                        onChange={(e) => setFormData({
                          ...formData,
                          businessHours: {...formData.businessHours, start: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.businessHours.end}
                        onChange={(e) => setFormData({
                          ...formData,
                          businessHours: {...formData.businessHours, end: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="escalationKeywords">Escalation Keywords</Label>
                  <Input
                    id="escalationKeywords"
                    placeholder="frustrated, angry, manager, supervisor"
                    value={formData.escalationKeywords}
                    onChange={(e) => setFormData({...formData, escalationKeywords: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated keywords that trigger human handoff</p>
                </div>
                
                <div>
                  <Label htmlFor="maxRetries">Max Retry Attempts</Label>
                  <Input
                    id="maxRetries"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxRetries}
                    onChange={(e) => setFormData({...formData, maxRetries: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCreateScript}
                    disabled={!formData.name}
                    className="flex-1"
                  >
                    Create Script
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scripts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scripts.map((script) => (
            <Card key={script.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-lg">{script.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {script.active && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                    <Switch
                      checked={script.active}
                      onCheckedChange={() => toggleScriptActive(script.id)}
                    />
                  </div>
                </div>
                <CardDescription>
                  Created {new Date(script.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Greeting:</span>
                    <p className="text-gray-900 mt-1 text-xs bg-gray-50 p-2 rounded">
                      {script.config.greeting?.substring(0, 100)}
                      {(script.config.greeting?.length || 0) > 100 && '...'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Hours:</span>
                      <p className="text-gray-900">
                        {script.config.businessHours?.start} - {script.config.businessHours?.end}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Retries:</span>
                      <p className="text-gray-900">{script.config.maxRetries}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {scripts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scripts created</h3>
            <p className="text-gray-600 mb-4">
              Create your first conversation script to configure AI behavior
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Script
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}