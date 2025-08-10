export const policies = {
  greeting: "Hello! Thank you for calling. How can I help you today?",
  
  questions: {
    name: "Could you please tell me your name?",
    phone: "What's the best phone number to reach you at?",
    reason: "What's the reason for your call today?",
    preferred_time: "What time would work best for you?",
  },
  
  confirmTemplate: "Let me confirm: {name} at {phone}, scheduling for {preferred_time}. Is that correct?",
  
  fallback: "I apologize, but I didn't quite understand. Could you please repeat that?",
  
  handoffLine: "Let me transfer you to a human representative who can better assist you.",
  
  businessHours: {
    message: "Thank you for calling. Our business hours are Monday through Friday, 9 AM to 5 PM. Please leave a message and we'll get back to you.",
    voicemailPrompt: "Please leave your name, phone number, and a brief message after the tone.",
  },
  
  escalation: {
    keywords: ["frustrated", "angry", "manager", "supervisor", "human", "representative"],
    threshold: 3, // Number of failed attempts before escalation
  },
};