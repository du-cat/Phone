import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, label, engine, voiceId, sampleUrl, consent } = body;
    
    console.log('Creating voice profile:', { tenantId, label, engine, voiceId });
    
    // Insert voice profile into database
    const { data, error } = await supabaseAdmin
      .from('voice_profiles')
      .insert({
        tenant_id: tenantId,
        label,
        engine: engine || 'elevenlabs',
        engine_voice_id: voiceId,
        sample_url: sampleUrl,
        consent: consent || false,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      ok: true,
      voiceProfile: data 
    });
  } catch (error) {
    console.error('Error creating voice profile:', error);
    return NextResponse.json(
      { error: 'Failed to create voice profile' },
      { status: 500 }
    );
  }
}