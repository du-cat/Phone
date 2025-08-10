import { NextRequest, NextResponse } from 'next/server';
import { getCarrier } from '@/server/providers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { number } = body;
    
    console.log('Verifying caller ID for:', number);
    
    const carrier = getCarrier();
    await carrier.verifyCallerId(number);
    
    // TODO: Update database with verification status
    // TODO: Handle verification callback from carrier
    
    return NextResponse.json({ 
      ok: true,
      message: 'Caller ID verification initiated',
      number 
    });
  } catch (error) {
    console.error('Error verifying caller ID:', error);
    return NextResponse.json(
      { error: 'Failed to verify caller ID' },
      { status: 500 }
    );
  }
}