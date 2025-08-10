import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId, contactId, message, priority = 'normal' } = body;
    
    console.log('Taking message:', { callId, contactId, message, priority });
    
    // TODO: Create messages table in database schema
    // For now, store as call event
    const { data, error } = await supabaseAdmin
      .from('call_events')
      .insert({
        call_id: callId,
        type: 'message_taken',
        data: {
          contact_id: contactId,
          message,
          priority,
          taken_at: new Date().toISOString(),
        },
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // TODO: Send notification to appropriate team members
    // TODO: Create follow-up task if needed
    
    return NextResponse.json({ 
      ok: true,
      messageId: data.id 
    });
  } catch (error) {
    console.error('Error taking message:', error);
    return NextResponse.json(
      { error: 'Failed to take message' },
      { status: 500 }
    );
  }
}