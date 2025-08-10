interface DialogueState {
  state: string;
  slots: Record<string, any>;
  attemptCount: number;
}

interface StepResult {
  state: string;
  say: string;
  done?: boolean;
  slots?: Record<string, any>;
}

const states = [
  'greet',
  'identify_intent',
  'collect_slots',
  'confirm',
  'schedule',
  'wrap_up'
];

export function step(currentState: string, input: any): StepResult {
  console.log('stateMachine::step', { currentState, input });

  switch (currentState) {
    case 'greet':
      return {
        state: 'identify_intent',
        say: 'Hello! Thank you for calling. How can I help you today?',
      };

    case 'identify_intent':
      // Simple intent recognition based on keywords
      const transcript = input?.transcript?.toLowerCase() || '';
      
      if (transcript.includes('appointment') || transcript.includes('schedule')) {
        return {
          state: 'collect_slots',
          say: 'I\'d be happy to help you schedule an appointment. Could you please tell me your name?',
          slots: { intent: 'schedule_appointment' },
        };
      }
      
      if (transcript.includes('information') || transcript.includes('hours')) {
        return {
          state: 'wrap_up',
          say: 'Our business hours are Monday through Friday, 9 AM to 5 PM. Is there anything else I can help you with?',
        };
      }
      
      return {
        state: 'collect_slots',
        say: 'I understand you need assistance. Could you please tell me your name?',
        slots: { intent: 'general_inquiry' },
      };

    case 'collect_slots':
      const slots = input?.slots || {};
      
      if (!slots.name && input?.transcript) {
        return {
          state: 'collect_slots',
          say: 'Thank you. And what\'s the best phone number to reach you at?',
          slots: { ...slots, name: input.transcript.trim() },
        };
      }
      
      if (!slots.phone && input?.transcript) {
        return {
          state: 'collect_slots',
          say: 'Great! What time would work best for your appointment?',
          slots: { ...slots, phone: input.transcript.trim() },
        };
      }
      
      if (!slots.preferred_time && input?.transcript) {
        return {
          state: 'confirm',
          say: `Let me confirm: ${slots.name} at ${slots.phone}, scheduling for ${input.transcript.trim()}. Is that correct?`,
          slots: { ...slots, preferred_time: input.transcript.trim() },
        };
      }
      
      return {
        state: 'collect_slots',
        say: 'Could you please provide that information again?',
      };

    case 'confirm':
      const confirmation = input?.transcript?.toLowerCase() || '';
      
      if (confirmation.includes('yes') || confirmation.includes('correct') || confirmation.includes('right')) {
        return {
          state: 'schedule',
          say: 'Perfect! I\'m scheduling that appointment for you now.',
        };
      }
      
      if (confirmation.includes('no') || confirmation.includes('wrong')) {
        return {
          state: 'collect_slots',
          say: 'No problem. Let\'s start over. Could you please tell me your name?',
          slots: {},
        };
      }
      
      return {
        state: 'confirm',
        say: 'I didn\'t catch that. Is the information I read back correct?',
      };

    case 'schedule':
      return {
        state: 'wrap_up',
        say: 'Excellent! Your appointment has been scheduled. You\'ll receive a confirmation shortly. Is there anything else I can help you with?',
      };

    case 'wrap_up':
      const response = input?.transcript?.toLowerCase() || '';
      
      if (response.includes('no') || response.includes('nothing') || response.includes('that\'s all')) {
        return {
          state: 'greet',
          say: 'Thank you for calling. Have a wonderful day!',
          done: true,
        };
      }
      
      return {
        state: 'identify_intent',
        say: 'How else can I assist you today?',
      };

    default:
      return {
        state: 'greet',
        say: 'I apologize, but something went wrong. Let me start over. How can I help you today?',
      };
  }
}

export function getInitialState(): DialogueState {
  return {
    state: 'greet',
    slots: {},
    attemptCount: 0,
  };
}

export function isValidTransition(from: string, to: string): boolean {
  const stateIndex = states.indexOf(from);
  const nextStateIndex = states.indexOf(to);
  
  if (stateIndex === -1 || nextStateIndex === -1) {
    return false;
  }
  
  // Allow moving forward, backward, or staying in the same state
  return true;
}