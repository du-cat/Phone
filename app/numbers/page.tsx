'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Phone, Settings, Trash2 } from 'lucide-react';

interface PhoneNumber {
  id: string;
  did: string;
  provider: string;
  status: string;
  external_caller_id_verified: boolean;
  created_at: string;
}

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [areaCode, setAreaCode] = useState('');

  useEffect(() => {
    // TODO: Fetch numbers from API
    // For now, use mock data
    setNumbers([
      {
        id: '1',
        did: '+15551234567',
        provider: 'telnyx',
        status: 'active',
        external_caller_id_verified: true,
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        did: '+15559876543',
        provider: 'telnyx',
        status: 'provisioning',
        external_caller_id_verified: false,
        created_at: '2024-01-16T14:30:00Z',
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleProvisionNumber = async () => {
    if (!areaCode) return;

    try {
      const response = await fetch('/api/numbers/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tenantId: 'demo-tenant-id', // TODO: Get from auth
          areaCode 
        }),
      });
      
      const result = await response.json();
      if (result.ok) {
        setNumbers([...numbers, result.number]);
        setIsDialogOpen(false);
        setAreaCode('');
      }
    } catch (error) {
      console.error('Error provisioning number:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'provisioning': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Numbers</h1>
            <p className="text-gray-600">
              Manage your AI receptionist phone numbers and caller ID verification
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Number
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Provision New Number</DialogTitle>
                <DialogDescription>
                  Get a new phone number for your AI receptionist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="areaCode">Area Code</Label>
                  <Input
                    id="areaCode"
                    placeholder="e.g., 555"
                    value={areaCode}
                    onChange={(e) => setAreaCode(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleProvisionNumber}
                    disabled={!areaCode}
                    className="flex-1"
                  >
                    Provision Number
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

        {/* Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {numbers.map((number) => (
            <Card key={number.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-lg">{number.did}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(number.status)}>
                    {number.status}
                  </Badge>
                </div>
                <CardDescription>
                  Provider: {number.provider}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Caller ID Verified:</span>
                    <span className={number.external_caller_id_verified ? 'text-green-600' : 'text-red-600'}>
                      {number.external_caller_id_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(number.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {numbers.length === 0 && (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No phone numbers</h3>
            <p className="text-gray-600 mb-4">
              Get started by provisioning your first phone number
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Provision First Number
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}