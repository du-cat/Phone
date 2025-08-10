import { NextRequest, NextResponse } from 'next/server';
import { verifyTelnyxSignature } from '@/server/utils/telnyxVerify';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    // Get required headers
    const signature = request.headers.get('telnyx-signature-ed25519');
    const timestamp = request.headers.get('telnyx-timestamp');
    
    if (!signature || !timestamp) {
      console.error('Missing required Telnyx headers');
      return NextResponse.json({ error: 'Missing signature headers' }, { status: 400 });
    }
    
    // Verify signature
    const isValid = verifyTelnyxSignature({
      signatureB64: signature,
      timestamp,
      rawBody,
    });
    
    if (!isValid) {
      console.error('Invalid Telnyx signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    
    // Log abbreviated payload for debugging
    console.log('Telnyx events webhook:', {
      event_type: payload.data?.event_type,
      call_control_id: payload.data?.call_control_id,
      call_session_id: payload.data?.call_session_id,
      occurred_at: payload.data?.occurred_at,
    });
    
    // TODO: Process call events
    // - Handle call state changes
    // - Process media stream events
    // - Log events to database
    
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing events webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Events webhook endpoint is active' });
}