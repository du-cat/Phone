'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured, checkSupabaseConnection } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mic, 
  MessageSquare, 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

interface DashboardStats {
  totalCalls: number;
  activeNumbers: number;
  voiceProfiles: number;
  appointments: number;
  callsToday: number;
  avgDuration: string;
  successRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCalls: 0,
    activeNumbers: 0,
    voiceProfiles: 0,
    appointments: 0,
    callsToday: 0,
    avgDuration: '0:00',
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    error?: string;
  }>({
    configured: false,
    connected: false,
  });

  useEffect(() => {
    // Check Supabase configuration and connection
    const checkSupabase = async () => {
      const configured = isSupabaseConfigured();
      if (configured) {
        const { connected, error } = await checkSupabaseConnection();
        setSupabaseStatus({ configured, connected, error });
      } else {
        setSupabaseStatus({ configured: false, connected: false, error: 'Not configured' });
      }
    };
    
    checkSupabase();
    
    // TODO: Fetch real stats from API
    // For now, use mock data
    setTimeout(() => {
      setStats({
        totalCalls: 247,
        activeNumbers: 3,
        voiceProfiles: 2,
        appointments: 18,
        callsToday: 12,
        avgDuration: '3:24',
        successRate: 94,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const recentCalls = [
    {
      id: '1',
      from: '+1 (555) 123-4567',
      time: '2 minutes ago',
      duration: '4:32',
      status: 'completed',
      intent: 'Schedule Appointment',
    },
    {
      id: '2',
      from: '+1 (555) 987-6543',
      time: '15 minutes ago',
      duration: '2:18',
      status: 'completed',
      intent: 'General Inquiry',
    },
    {
      id: '3',
      from: '+1 (555) 456-7890',
      time: '1 hour ago',
      duration: '6:45',
      status: 'transferred',
      intent: 'Technical Support',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Voice Receptionist</h1>
              <p className="text-gray-600 mt-1">
                Manage your intelligent phone system
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/onboarding/wizard">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Setup Wizard
                </Button>
              </Link>
              <Link href="/numbers">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Number
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCalls}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Numbers</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeNumbers}</div>
              <p className="text-xs text-muted-foreground">
                Across all locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointments}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Calls handled successfully
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Recent Calls</span>
              </CardTitle>
              <CardDescription>
                Latest incoming calls and their outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm">{call.from}</p>
                        <Badge className={getStatusColor(call.status)}>
                          {call.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{call.intent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{call.duration}</p>
                      <p className="text-xs text-gray-500">{call.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/calls">
                  <Button variant="outline" className="w-full">
                    View All Calls
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and system management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/numbers">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Phone className="w-6 h-6" />
                    <span className="text-sm">Manage Numbers</span>
                  </Button>
                </Link>
                
                <Link href="/voice-profiles">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Mic className="w-6 h-6" />
                    <span className="text-sm">Voice Profiles</span>
                  </Button>
                </Link>
                
                <Link href="/scripts">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-sm">Edit Scripts</span>
                  </Button>
                </Link>
                
                <Link href="/settings">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Settings className="w-6 h-6" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>
              Current status of all integrated services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">Telnyx</p>
                  <p className="text-xs text-green-700">Operational</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">Deepgram</p>
                  <p className="text-xs text-green-700">Operational</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">ElevenLabs</p>
                  <p className="text-xs text-green-700">Operational</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                supabaseStatus.connected 
                  ? 'bg-green-50' 
                  : supabaseStatus.configured 
                    ? 'bg-yellow-50' 
                    : 'bg-red-50'
              }`}>
                <CheckCircle className={`w-5 h-5 ${
                  supabaseStatus.connected 
                    ? 'text-green-500' 
                    : supabaseStatus.configured 
                      ? 'text-yellow-500' 
                      : 'text-red-500'
                }`} />
                <div>
                  <p className={`font-medium ${
                    supabaseStatus.connected 
                      ? 'text-green-900' 
                      : supabaseStatus.configured 
                        ? 'text-yellow-900' 
                        : 'text-red-900'
                  }`}>Supabase</p>
                  <p className={`text-xs ${
                    supabaseStatus.connected 
                      ? 'text-green-700' 
                      : supabaseStatus.configured 
                        ? 'text-yellow-700' 
                        : 'text-red-700'
                  }`}>
                    {supabaseStatus.connected 
                      ? 'Connected' 
                      : supabaseStatus.configured 
                        ? 'Configured' 
                        : 'Not Setup'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        {!supabaseStatus.connected && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Setup Required</span>
              </CardTitle>
              <CardDescription className="text-yellow-700">
                {!supabaseStatus.configured 
                  ? 'Supabase is not configured. Please set up your environment variables.'
                  : 'Supabase is configured but connection failed. Please check your credentials and run the database migration.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Connect to Supabase
                </Button>
                <Link href="/onboarding/wizard" className="flex-1">
                  <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                    <Phone className="w-4 h-4 mr-2" />
                    Setup Wizard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        
        {supabaseStatus.connected && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Getting Started</CardTitle>
              <CardDescription className="text-blue-700">
                New to AI Voice Receptionist? Follow these steps to get up and running.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding/wizard" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Start Setup Wizard
                  </Button>
                </Link>
                <Link href="/numbers" className="flex-1">
                  <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Phone className="w-4 h-4 mr-2" />
                    Get Your First Number
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}