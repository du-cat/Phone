'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, Clock, User, MessageSquare, Calendar, Download } from 'lucide-react';

interface CallData {
  id: string;
  from_number: string;
  to_number: string;
  started_at: string;
  ended_at: string | null;
  status: string;
  recording_url: string | null;
  duration_ms: number;
  transcript_segments: {
    id: string;
    start_ms: number;
    end_ms: number;
    text: string;
    is_final: boolean;
    speaker: 'caller' | 'ai';
  }[];
  events: {
    id: string;
    timestamp: string;
    type: string;
    description: string;
  }[];
}

export default function CallDetailsPage() {
  const params = useParams();
  const callId = params.id as string;
  const [callData, setCallData] = useState<CallData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch call data from API
    // For now, use mock data
    const mockData: CallData = {
      id: callId,
      from_number: '+15551234567',
      to_number: '+15559876543',
      started_at: '2024-01-15T10:30:00Z',
      ended_at: '2024-01-15T10:35:30Z',
      status: 'completed',
      recording_url: 'https://example.com/recording.mp3',
      duration_ms: 330000, // 5.5 minutes
      transcript_segments: [
        {
          id: '1',
          start_ms: 0,
          end_ms: 3000,
          text: 'Hello! Thank you for calling. How can I help you today?',
          is_final: true,
          speaker: 'ai',
        },
        {
          id: '2',
          start_ms: 3000,
          end_ms: 8000,
          text: 'Hi, I\'d like to schedule an appointment for next week.',
          is_final: true,
          speaker: 'caller',
        },
        {
          id: '3',
          start_ms: 8000,
          end_ms: 12000,
          text: 'I\'d be happy to help you schedule an appointment. Could you please tell me your name?',
          is_final: true,
          speaker: 'ai',
        },
        {
          id: '4',
          start_ms: 12000,
          end_ms: 15000,
          text: 'My name is John Smith.',
          is_final: true,
          speaker: 'caller',
        },
        {
          id: '5',
          start_ms: 15000,
          end_ms: 20000,
          text: 'Thank you, John. And what\'s the best phone number to reach you at?',
          is_final: true,
          speaker: 'ai',
        },
      ],
      events: [
        {
          id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          type: 'call_initiated',
          description: 'Call received from +15551234567',
        },
        {
          id: '2',
          timestamp: '2024-01-15T10:30:02Z',
          type: 'call_answered',
          description: 'AI receptionist answered the call',
        },
        {
          id: '3',
          timestamp: '2024-01-15T10:30:05Z',
          type: 'streaming_started',
          description: 'Audio streaming initiated',
        },
        {
          id: '4',
          timestamp: '2024-01-15T10:32:30Z',
          type: 'intent_identified',
          description: 'Intent: schedule_appointment',
        },
        {
          id: '5',
          timestamp: '2024-01-15T10:35:30Z',
          type: 'call_ended',
          description: 'Call completed successfully',
        },
      ],
    };

    setTimeout(() => {
      setCallData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [callId]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'missed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!callData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call not found</h2>
          <p className="text-gray-600">The call you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Call Details</h1>
          <p className="text-gray-600">
            Call from {callData.from_number} on {new Date(callData.started_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Call Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span>Call Summary</span>
                    </CardTitle>
                    <CardDescription>
                      {new Date(callData.started_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(callData.status)}>
                    {callData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-medium">{callData.from_number}</p>
                  </div>
                  <div className="text-center">
                    <Phone className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-medium">{callData.to_number}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{formatDuration(callData.duration_ms)}</p>
                  </div>
                  <div className="text-center">
                    {callData.recording_url && (
                      <>
                        <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Recording</p>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Conversation Transcript</span>
                </CardTitle>
                <CardDescription>
                  Real-time transcript of the conversation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {callData.transcript_segments.map((segment) => (
                    <div
                      key={segment.id}
                      className={`flex ${segment.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          segment.speaker === 'ai'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {segment.speaker === 'ai' ? 'AI Receptionist' : 'Caller'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(segment.start_ms)}
                          </span>
                        </div>
                        <p className="text-sm">{segment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Call Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Call Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {callData.events.map((event, index) => (
                    <div key={event.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === callData.events.length - 1
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {event.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Create Follow-up Task
                </Button>
                <Button className="w-full" variant="outline">
                  Add to CRM
                </Button>
                <Button className="w-full" variant="outline">
                  Schedule Callback
                </Button>
                <Separator />
                <Button className="w-full" variant="outline" size="sm">
                  Export Transcript
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Share Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}