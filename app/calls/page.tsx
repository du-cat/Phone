'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Search, Filter, Download, Eye } from 'lucide-react';

interface Call {
  id: string;
  from_number: string;
  to_number: string;
  started_at: string;
  ended_at: string | null;
  duration_ms: number;
  status: string;
  intent: string;
  recording_url: string | null;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch calls from API
    // For now, use mock data
    const mockCalls: Call[] = [
      {
        id: '1',
        from_number: '+15551234567',
        to_number: '+15559876543',
        started_at: '2024-01-15T10:30:00Z',
        ended_at: '2024-01-15T10:35:30Z',
        duration_ms: 330000,
        status: 'completed',
        intent: 'Schedule Appointment',
        recording_url: 'https://example.com/recording1.mp3',
      },
      {
        id: '2',
        from_number: '+15559876543',
        to_number: '+15559876543',
        started_at: '2024-01-15T09:15:00Z',
        ended_at: '2024-01-15T09:18:45Z',
        duration_ms: 225000,
        status: 'completed',
        intent: 'General Inquiry',
        recording_url: null,
      },
      {
        id: '3',
        from_number: '+15556789012',
        to_number: '+15559876543',
        started_at: '2024-01-15T08:45:00Z',
        ended_at: '2024-01-15T08:52:30Z',
        duration_ms: 450000,
        status: 'transferred',
        intent: 'Technical Support',
        recording_url: 'https://example.com/recording3.mp3',
      },
      {
        id: '4',
        from_number: '+15554567890',
        to_number: '+15559876543',
        started_at: '2024-01-14T16:20:00Z',
        ended_at: null,
        duration_ms: 0,
        status: 'missed',
        intent: 'Unknown',
        recording_url: null,
      },
    ];

    setTimeout(() => {
      setCalls(mockCalls);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDuration = (ms: number) => {
    if (ms === 0) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.from_number.includes(searchTerm) || 
                         call.intent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Call History</h1>
          <p className="text-gray-600">
            View and manage all incoming calls and their outcomes
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by phone number or intent..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calls List */}
        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Phone className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-lg">{call.from_number}</p>
                        <Badge className={getStatusColor(call.status)}>
                          {call.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Intent: {call.intent}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(call.started_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatDuration(call.duration_ms)}</p>
                      <p className="text-xs text-gray-500">Duration</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {call.recording_url && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Link href={`/calls/${call.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCalls.length === 0 && (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No calls found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Calls will appear here once you start receiving them'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}