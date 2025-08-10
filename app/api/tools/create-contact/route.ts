import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, name, phone, email } = body;
    
    console.log('Creating contact:', { tenantId, name, phone, email });
    
    // Check if contact already exists
    const { data: existingContact } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('phone', phone)
      .single();
    
    if (existingContact) {
      // Update existing contact
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .update({
          name,
          email,
          last_interaction_at: new Date().toISOString(),
        })
        .eq('id', existingContact.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ 
        ok: true,
        contact: data,
        isNew: false 
      });
    } else {
      // Create new contact
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .insert({
          tenant_id: tenantId,
          name,
          phone,
          email,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ 
        ok: true,
        contact: data,
        isNew: true 
      });
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}