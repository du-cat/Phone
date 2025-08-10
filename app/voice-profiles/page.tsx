'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Mic, Play, Settings, Trash2 } from 'lucide-react';

interface VoiceProfile {
  id: string;
  label: string;
  engine: string;
  engine_voice_id: string;
  sample_url: string | null;
  consent: boolean;
  created_at: string;
}

export default function VoiceProfilesPage() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    engine: 'elevenlabs',
    voiceId: '',
    consent: false,
  });

  useEffect(() => {
    // TODO: Fetch voice profiles from API
    // For now, use mock data
    setProfiles([
      {
        id: '1',
        label: 'Professional Receptionist',
        engine: 'elevenlabs',
        engine_voice_id: 'rachel_voice',
        sample_url: null,
        consent: true,
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        label: 'Friendly Support',
        engine: 'playht',
        engine_voice_id: 'jennifer_voice',
        sample_url: 'https://example.com/sample.mp3',
        consent: true,
        created_at: '2024-01-16T14:30:00Z',
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleCreateProfile = async () => {
    if (!formData.label || !formData.voiceId) return;

    try {
      const response = await fetch('/api/voices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'demo-tenant-id', // TODO: Get from auth
          label: formData.label,
          engine: formData.engine,
          voiceId: formData.voiceId,
          consent: formData.consent,
        }),
      });
      
      const result = await response.json();
      if (result.ok) {
        setProfiles([...profiles, result.voiceProfile]);
        setIsDialogOpen(false);
        setFormData({ label: '', engine: 'elevenlabs', voiceId: '', consent: false });
      }
    } catch (error) {
      console.error('Error creating voice profile:', error);
    }
  };

  const getEngineColor = (engine: string) => {
    switch (engine) {
      case 'elevenlabs': return 'bg-purple-100 text-purple-800';
      case 'playht': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Profiles</h1>
            <p className="text-gray-600">
              Manage how your AI receptionist sounds to callers
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Voice Profile</DialogTitle>
                <DialogDescription>
                  Set up a new voice for your AI receptionist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="label">Profile Name</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Professional Receptionist"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="engine">Voice Engine</Label>
                  <Select 
                    value={formData.engine} 
                    onValueChange={(value) => setFormData({...formData, engine: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="playht">PlayHT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="voiceId">Voice ID</Label>
                  <Input
                    id="voiceId"
                    placeholder="Enter voice identifier"
                    value={formData.voiceId}
                    onChange={(e) => setFormData({...formData, voiceId: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({...formData, consent: checked as boolean})}
                  />
                  <Label htmlFor="consent" className="text-sm">
                    I have proper consent to use this voice
                  </Label>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateProfile}
                    disabled={!formData.label || !formData.voiceId}
                    className="flex-1"
                  >
                    Create Profile
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

        {/* Voice Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-lg">{profile.label}</CardTitle>
                  </div>
                  <Badge className={getEngineColor(profile.engine)}>
                    {profile.engine}
                  </Badge>
                </div>
                <CardDescription>
                  Voice ID: {profile.engine_voice_id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consent:</span>
                    <span className={profile.consent ? 'text-green-600' : 'text-red-600'}>
                      {profile.consent ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sample:</span>
                    <span>{profile.sample_url ? 'Available' : 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {profile.sample_url && (
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  )}
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

        {profiles.length === 0 && (
          <div className="text-center py-12">
            <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No voice profiles</h3>
            <p className="text-gray-600 mb-4">
              Create your first voice profile to get started
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}