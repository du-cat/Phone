import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId, transcript, audioUrl } = body;
    
    console.log('Voicemail received:', { callId, transcript, audioUrl });
    
    // TODO: Store voicemail in database
    // const { data, error } = await supabaseAdmin
    //   .from('voicemails')
    //   .insert({
    //     call_id: callId,
    //     transcript,
    //     audio_url: audioUrl,
    //   });
    
    // TODO: Send notification to tenant
    // TODO: Process transcript for follow-up actions
    
    return NextResponse.json({ 
      ok: true,
      message: 'Voicemail processed successfully' 
    });
  } catch (error) {
    console.error('Error processing voicemail:', error);
    return NextResponse.json(
      { error: 'Failed to process voicemail' },
      { status: 500 }
    );
  }
}