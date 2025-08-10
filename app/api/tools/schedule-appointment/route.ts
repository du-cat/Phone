import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { addMinutes } from '@/server/utils/time';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, contactId, startsAt, durationMinutes = 30 } = body;
    
    console.log('Scheduling appointment:', { tenantId, contactId, startsAt, durationMinutes });
    
    const startTime = new Date(startsAt);
    const endTime = addMinutes(startTime, durationMinutes);
    
    // Create appointment record
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        tenant_id: tenantId,
        contact_id: contactId,
        starts_at: startTime.toISOString(),
        ends_at: endTime.toISOString(),
        status: 'scheduled',
      })
      .select(`
        *,
        contacts (
          name,
          phone,
          email
        )
      `)
      .single();
    
    if (error) throw error;
    
    // TODO: Integrate with calendar provider (Microsoft, Google, etc.)
    // TODO: Send confirmation email/SMS to contact
    
    return NextResponse.json({ 
      ok: true,
      appointment: data 
    });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to schedule appointment' },
      { status: 500 }
    );
  }
}