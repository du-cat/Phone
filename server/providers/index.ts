import * as telnyx from './carrier/telnyx';
import { DeepgramASR } from './asr/deepgram';
import * as elevenlabs from './tts/elevenlabs';
import * as playht from './tts/playht';

export function getCarrier() {
  const carrier = process.env.CARRIER || 'telnyx';
  
  switch (carrier) {
    case 'telnyx':
      return telnyx;
    default:
      throw new Error(`Unsupported carrier: ${carrier}`);
  }
}

export function getASR() {
  const asr = process.env.ASR || 'deepgram';
  
  switch (asr) {
    case 'deepgram':
      return new DeepgramASR();
    default:
      throw new Error(`Unsupported ASR: ${asr}`);
  }
}

export function getTTS() {
  const tts = process.env.TTS || 'elevenlabs';
  
  switch (tts) {
    case 'elevenlabs':
      return elevenlabs;
    case 'playht':
      return playht;
    default:
      throw new Error(`Unsupported TTS: ${tts}`);
  }
}