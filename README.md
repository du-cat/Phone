# AI Voice Receptionist

A comprehensive Next.js application for building AI-powered voice receptionists with Telnyx, Deepgram, and ElevenLabs integration.

## Features

- **Voice Call Handling**: Telnyx integration for inbound/outbound calls
- **Speech Recognition**: Real-time transcription with Deepgram
- **Text-to-Speech**: Natural voice responses using ElevenLabs or PlayHT
- **Conversation AI**: OpenAI-powered dialogue management
- **WebSocket Streaming**: Real-time audio processing
- **Multi-tenant Support**: Supabase-powered data management
- **Conversation Scripts**: Configurable AI behavior
- **Call Analytics**: Detailed call logs and transcriptions
- **Voice Profiles**: Custom TTS voice management

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js (no Edge runtime), WebSocket support
- **Database**: Supabase with Row Level Security
- **Voice Services**: Telnyx, Deepgram, ElevenLabs, PlayHT
- **AI**: OpenAI GPT-4
- **Authentication**: Supabase Auth (planned)

## Setup

### Prerequisites

1. Node.js 18+
2. Supabase account and project
3. Telnyx account with API keys
4. Deepgram API key
5. ElevenLabs API key
6. OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-voice-receptionist
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with actual API keys and URLs.

### Database Setup

1. Run the database schema in your Supabase SQL editor:
```bash
# Copy the contents of prisma-or-sql/ddl.sql and execute in Supabase
```

2. The schema includes:
   - Multi-tenant organization structure
   - Phone number management
   - Call records and events
   - Conversation transcripts
   - Contact management
   - Appointment scheduling
   - Voice profile configuration

### Webhook Configuration

1. In your Telnyx dashboard, configure webhooks:
   - **Inbound URL**: `https://your-domain.com/api/voice/inbound`
   - **Events URL**: `https://your-domain.com/api/voice/events`

2. Make sure to use the same domain as configured in your `APP_URL` environment variable.

### Development

1. Start the development server:
```bash
npm run dev
```

2. Start a Cloudflare Tunnel (for webhook testing):
```bash
# Install cloudflared if not already installed
cloudflared tunnel --url localhost:3000
```

3. Update your `APP_URL` environment variable with the tunnel URL.

## Architecture

### File Structure

```
/app                          # Next.js App Router pages
  /onboarding/wizard/         # 6-step setup wizard
  /numbers/                   # Phone number management
  /voice-profiles/            # TTS voice configuration
  /scripts/                   # Conversation scripts
  /calls/[id]/               # Call detail views
  /settings/                 # System configuration
  /api/
    /voice/                  # Telnyx webhook handlers
    /numbers/                # Number provisioning
    /voices/                 # Voice profile management
    /tools/                  # AI tools (contacts, appointments)

/server                      # Server-side utilities
  /ws/media.ts              # WebSocket media handling
  /dialogue/                # Conversation state machine
  /providers/               # Pluggable provider adapters
    /carrier/telnyx.ts      # Telnyx API wrapper
    /asr/deepgram.ts        # Deepgram streaming client
    /tts/elevenlabs.ts      # ElevenLabs TTS
    /tts/playht.ts          # PlayHT TTS alternative
    /llm/openai.ts          # OpenAI integration
  /utils/                   # Utilities
    /telnyxVerify.ts        # Webhook signature verification
    /audio.ts               # Audio processing
    /time.ts                # Time utilities

/lib/supabase.ts            # Database client
/prisma-or-sql/ddl.sql      # Database schema
```

### Provider Architecture

The system uses a pluggable provider architecture:

- **Carrier**: Telnyx (voice calls, telephony)
- **ASR**: Deepgram (speech-to-text)
- **TTS**: ElevenLabs or PlayHT (text-to-speech)  
- **LLM**: OpenAI GPT-4 (conversation intelligence)

Providers can be swapped by changing environment variables and implementing the provider interface.

### Dialogue State Machine

The conversation flow follows a simple state machine:

1. **greet** → Initial greeting
2. **identify_intent** → Understand what caller wants
3. **collect_slots** → Gather required information
4. **confirm** → Confirm understanding
5. **schedule/action** → Perform the requested action
6. **wrap_up** → End conversation gracefully

## Next Steps

### Phase 1: Core Integration
1. Run `/prisma-or-sql/ddl.sql` in Supabase SQL editor
2. Set Telnyx webhooks to your deployed URLs
3. Start dev server + Cloudflare Tunnel
4. Place a test call to the DID → confirm inbound/event logs

### Phase 2: Live Connections  
1. Wire Telnyx answer + start stream
2. Connect Deepgram realtime WebSocket
3. Stream ElevenLabs audio back to caller
4. Test end-to-end conversation flow

### Phase 3: Intelligence
1. Implement OpenAI conversation decisions
2. Add appointment scheduling with calendar APIs
3. Build contact management and CRM integration
4. Add voicemail and message handling

### Phase 4: Production
1. Add authentication and user management
2. Implement proper error handling and retry logic
3. Add monitoring and analytics
4. Scale WebSocket connections
5. Add call recording and storage

## API Endpoints

### Webhooks
- `POST /api/voice/inbound` - Handle incoming calls
- `POST /api/voice/events` - Process call events
- `POST /api/voice/voicemail` - Handle voicemail

### Management
- `POST /api/numbers/provision` - Provision new numbers
- `POST /api/numbers/verify-caller-id` - Verify caller ID
- `POST /api/voices/create` - Create voice profiles

### Tools
- `POST /api/tools/create-contact` - Create/update contacts
- `POST /api/tools/schedule-appointment` - Schedule appointments  
- `POST /api/tools/take-message` - Record messages

## Contributing

1. Follow the existing file organization patterns
2. Add proper TypeScript types
3. Include error handling
4. Update tests for new features
5. Document new API endpoints

## License

[Your License Here]