'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Circle, ExternalLink } from 'lucide-react';

const steps = [
  'Connect Calendar',
  'Provision Number',
  'Forward Existing Line', 
  'Create Voice Profile',
  'Business Hours & Escalation',
  'Go Live'
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    areaCode: '',
    voiceLabel: '',
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'America/New_York',
    },
  });

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://placing-sec-quad-assumes.trycloudflare.com';
  const MS_REDIRECT_URI = `${APP_URL}/api/oauth/microsoft/callback`;

  const handleStepComplete = async (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return;
    
    try {
      switch (stepIndex) {
        case 1: // Provision Number
          if (!formData.areaCode) {
            alert('Please enter an area code');
            return;
          }
          const response = await fetch('/api/numbers/provision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              tenantId: 'demo-tenant-id', // TODO: Get from auth
              areaCode: formData.areaCode 
            }),
          });
          const result = await response.json();
          if (result.ok) {
            alert(`Number provisioned: ${result.number.did}`);
          }
          break;
          
        case 3: // Create Voice Profile
          if (!formData.voiceLabel) {
            alert('Please enter a voice label');
            return;
          }
          const voiceResponse = await fetch('/api/voices/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantId: 'demo-tenant-id', // TODO: Get from auth
              label: formData.voiceLabel,
              engine: 'elevenlabs',
              voiceId: 'default',
              consent: true,
            }),
          });
          const voiceResult = await voiceResponse.json();
          if (voiceResult.ok) {
            alert('Voice profile created successfully');
          }
          break;
      }
      
      setCompletedSteps([...completedSteps, stepIndex]);
      if (stepIndex === currentStep && currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error completing step:', error);
      alert('Error completing step. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Connect Calendar
        return (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Calendar</CardTitle>
              <CardDescription>
                Link your Microsoft 365 or Outlook calendar to enable appointment scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Microsoft 365 / Outlook</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Click the button below to connect your Microsoft calendar
                </p>
                <Button onClick={() => window.open(MS_REDIRECT_URI, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect Microsoft Calendar
                </Button>
              </div>
              <Button onClick={() => handleStepComplete(0)} className="w-full">
                Mark as Connected
              </Button>
            </CardContent>
          </Card>
        );

      case 1: // Provision Number
        return (
          <Card>
            <CardHeader>
              <CardTitle>Provision Phone Number</CardTitle>
              <CardDescription>
                Get a new phone number for your AI receptionist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="areaCode">Area Code</Label>
                <Input
                  id="areaCode"
                  placeholder="e.g., 555"
                  value={formData.areaCode}
                  onChange={(e) => setFormData({...formData, areaCode: e.target.value})}
                />
              </div>
              <Button 
                onClick={() => handleStepComplete(1)} 
                className="w-full"
                disabled={!formData.areaCode}
              >
                Provision Number
              </Button>
            </CardContent>
          </Card>
        );

      case 2: // Forward Existing Line
        return (
          <Card>
            <CardHeader>
              <CardTitle>Forward Existing Line</CardTitle>
              <CardDescription>
                Configure your existing phone system to forward calls to the AI receptionist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-medium text-sm mb-1">Inbound Webhook URL:</p>
                  <code className="text-xs bg-white p-2 rounded border block">
                    {APP_URL}/api/voice/inbound
                  </code>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-medium text-sm mb-1">Events Webhook URL:</p>
                  <code className="text-xs bg-white p-2 rounded border block">
                    {APP_URL}/api/voice/events
                  </code>
                </div>
                <p className="text-sm text-gray-600">
                  Configure these URLs in your Telnyx dashboard under Voice → Outbound Voice Profiles
                </p>
              </div>
              <Button onClick={() => handleStepComplete(2)} className="w-full">
                Mark as Configured
              </Button>
            </CardContent>
          </Card>
        );

      case 3: // Create Voice Profile
        return (
          <Card>
            <CardHeader>
              <CardTitle>Create Voice Profile</CardTitle>
              <CardDescription>
                Choose how your AI receptionist will sound
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="voiceLabel">Voice Profile Name</Label>
                <Input
                  id="voiceLabel"
                  placeholder="e.g., Professional Receptionist"
                  value={formData.voiceLabel}
                  onChange={(e) => setFormData({...formData, voiceLabel: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="voiceEngine">Voice Engine</Label>
                <Select defaultValue="elevenlabs">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                    <SelectItem value="playht">PlayHT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleStepComplete(3)} 
                className="w-full"
                disabled={!formData.voiceLabel}
              >
                Create Voice Profile
              </Button>
            </CardContent>
          </Card>
        );

      case 4: // Business Hours & Escalation
        return (
          <Card>
            <CardHeader>
              <CardTitle>Business Hours & Escalation</CardTitle>
              <CardDescription>
                Configure when your AI receptionist is active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.businessHours.timezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleStepComplete(4)} className="w-full">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        );

      case 5: // Go Live
        return (
          <Card>
            <CardHeader>
              <CardTitle>Go Live</CardTitle>
              <CardDescription>
                Activate your AI receptionist and start receiving calls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Ready to Launch!</h4>
                  <p className="text-sm text-green-700">
                    Your AI receptionist is configured and ready to handle calls.
                  </p>
                </div>
                <Button onClick={() => handleStepComplete(5)} className="w-full" size="lg">
                  Activate AI Receptionist
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your AI Receptionist</h1>
          <p className="text-gray-600">
            Follow these steps to get your AI voice receptionist up and running
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${completedSteps.includes(index) 
                        ? 'bg-green-500 text-white' 
                        : index === currentStep 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                  >
                    {completedSteps.includes(index) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </button>
                  <span className="text-xs text-gray-600 mt-1 text-center max-w-20">
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${completedSteps.includes(index) ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 max-w-2xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}