interface DecisionContext {
  transcript?: string;
  intent?: string;
  slots?: Record<string, any>;
  callHistory?: any[];
}

interface DecisionResult {
  nextState: string;
  utterance: string;
  slots?: Record<string, any>;
}

export async function decide(state: string, context: DecisionContext): Promise<DecisionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('openai::decide', { state, context, hasApiKey: !!apiKey });

  // TODO: Implement actual OpenAI API call
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4',
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `You are an AI receptionist. Current state: ${state}. Context: ${JSON.stringify(context)}`,
  //       },
  //       {
  //         role: 'user',
  //         content: context.transcript || '',
  //       },
  //     ],
  //   }),
  // });

  // For now, return canned responses based on state
  switch (state) {
    case 'greet':
      return {
        nextState: 'identify_intent',
        utterance: 'Hello! Thank you for calling. How can I help you today?',
      };
    case 'identify_intent':
      return {
        nextState: 'collect_slots',
        utterance: 'I understand you\'d like to schedule an appointment. Could you please tell me your name?',
        slots: { intent: 'schedule_appointment' },
      };
    case 'collect_slots':
      return {
        nextState: 'confirm',
        utterance: 'Great! And what\'s the best phone number to reach you at?',
        slots: { name: context.transcript },
      };
    case 'confirm':
      return {
        nextState: 'schedule',
        utterance: 'Perfect! Let me schedule that appointment for you. What time works best?',
      };
    case 'schedule':
      return {
        nextState: 'wrap_up',
        utterance: 'Excellent! I\'ve scheduled your appointment. Is there anything else I can help you with?',
      };
    case 'wrap_up':
      return {
        nextState: 'greet',
        utterance: 'Thank you for calling. Have a wonderful day!',
      };
    default:
      return {
        nextState: 'greet',
        utterance: 'I apologize, but I didn\'t quite understand. Could you please repeat that?',
      };
  }
}