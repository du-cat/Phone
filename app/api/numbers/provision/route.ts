import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, areaCode, provider = 'telnyx' } = body;
    
    console.log('Provisioning number:', { tenantId, areaCode, provider });
    
    // TODO: Make actual API call to provision number from carrier
    // For now, generate a fake DID
    const fakeDID = `+1${areaCode}${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`;
    
    // Insert number record into database
    const { data, error } = await supabaseAdmin
      .from('numbers')
      .insert({
        tenant_id: tenantId,
        provider,
        did: fakeDID,
        status: 'active',
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      ok: true,
      number: data 
    });
  } catch (error) {
    console.error('Error provisioning number:', error);
    return NextResponse.json(
      { error: 'Failed to provision number' },
      { status: 500 }
    );
  }
}