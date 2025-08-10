'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, Phone, Mic, MessageSquare, Brain, Key } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    carrier: 'telnyx',
    asr: 'deepgram',
    tts: 'elevenlabs',
    llm: 'openai',
    appUrl: '',
    webhookSecret: '',
  });

  useEffect(() => {
    // Load settings from environment or API
    setSettings({
      carrier: process.env.NEXT_PUBLIC_CARRIER || 'telnyx',
      asr: process.env.NEXT_PUBLIC_ASR || 'deepgram',
      tts: process.env.NEXT_PUBLIC_TTS || 'elevenlabs',
      llm: 'openai',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://placing-sec-quad-assumes.trycloudflare.com',
      webhookSecret: '••••••••••••',
    });
  }, []);

  const getProviderStatus = (provider: string) => {
    // TODO: Check actual provider status
    return 'connected';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Configure your AI receptionist providers and system settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Provider Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Provider Configuration</span>
              </CardTitle>
              <CardDescription>
                Current provider settings (read-only, configured via environment variables)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Carrier */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Voice Carrier</p>
                    <p className="text-sm text-gray-600">Handles phone calls and telephony</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(getProviderStatus(settings.carrier))}>
                    {getProviderStatus(settings.carrier)}
                  </Badge>
                  <Select value={settings.carrier} disabled>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telnyx">Telnyx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* ASR */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mic className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Speech Recognition (ASR)</p>
                    <p className="text-sm text-gray-600">Converts speech to text</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(getProviderStatus(settings.asr))}>
                    {getProviderStatus(settings.asr)}
                  </Badge>
                  <Select value={settings.asr} disabled>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepgram">Deepgram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* TTS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Text-to-Speech (TTS)</p>
                    <p className="text-sm text-gray-600">Converts text to speech</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(getProviderStatus(settings.tts))}>
                    {getProviderStatus(settings.tts)}
                  </Badge>
                  <Select value={settings.tts} disabled>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="playht">PlayHT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* LLM */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Language Model (LLM)</p>
                    <p className="text-sm text-gray-600">Powers conversation intelligence</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(getProviderStatus(settings.llm))}>
                    {getProviderStatus(settings.llm)}
                  </Badge>
                  <Select value={settings.llm} disabled>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Core system settings and webhook URLs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="appUrl">Application URL</Label>
                <Input
                  id="appUrl"
                  value={settings.appUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Base URL for webhook endpoints and OAuth redirects
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Inbound Webhook</Label>
                  <Input
                    value={`${settings.appUrl}/api/voice/inbound`}
                    readOnly
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <Label>Events Webhook</Label>
                  <Input
                    value={`${settings.appUrl}/api/voice/events`}
                    readOnly
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={settings.webhookSecret}
                    readOnly
                    className="font-mono"
                  />
                  <Key className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Used to verify webhook authenticity
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Provider Status */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Health</CardTitle>
              <CardDescription>
                Current status of all configured providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-900">Telnyx</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">Operational</Badge>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Mic className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-900">Deepgram</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">Operational</Badge>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-900">ElevenLabs</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">Operational</Badge>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Brain className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-900">OpenAI</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}