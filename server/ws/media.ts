import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

interface MediaMessage {
  event: string;
  media?: {
    payload: string; // base64 encoded μ-law
  };
  sequenceNumber?: number;
  timestamp?: string;
}

export function attachMediaServer(server: any) {
  const wss = new WebSocketServer({ 
    server,
    path: '/server/ws/media',
  });

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    console.log('WebSocket connected:', request.url);
    
    // TODO: Wire DeepgramASR here in v1; send μ-law chunks to ASR; later stream TTS back
    
    ws.on('message', (data: Buffer) => {
      try {
        const message: MediaMessage = JSON.parse(data.toString());
        
        if (message.event === 'media' && message.media?.payload) {
          const audioData = Buffer.from(message.media.payload, 'base64');
          console.log('Received audio chunk:', {
            sequenceNumber: message.sequenceNumber,
            audioLength: audioData.length,
            timestamp: message.timestamp,
          });
          
          // TODO: Send audioData to ASR service
          // const asr = getASR();
          // asr.send(audioData);
        } else if (message.event === 'start') {
          console.log('Media stream started');
        } else if (message.event === 'stop') {
          console.log('Media stream stopped');
        } else {
          console.log('Unknown message event:', message.event);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      event: 'connected',
      timestamp: new Date().toISOString(),
    }));
  });

  return wss;
}

// Helper function to send TTS audio back to caller
export function sendAudioToWebSocket(ws: WebSocket, audioBuffer: Buffer) {
  if (ws.readyState === WebSocket.OPEN) {
    const message = {
      event: 'media',
      media: {
        payload: audioBuffer.toString('base64'),
      },
      timestamp: new Date().toISOString(),
    };
    
    ws.send(JSON.stringify(message));
  }
}