"use client"

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardSidebar } from '../dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Send } from 'lucide-react';

// Define some pre-set responses for common vocal health questions
const VOCAL_RESPONSES = {
  'throat pain': 'If you are experiencing throat pain, it could be due to vocal strain, infection, or irritation. Rest your voice, drink warm liquids, and if the pain persists for more than 3 days, please consult a healthcare professional.',
  'throat': 'Throat discomfort can be caused by many factors. If you have throat pain, try resting your voice, drinking warm teas with honey, and using throat lozenges. If symptoms persist for more than 3 days, please see a doctor.',
  'pain in throat': 'Pain in your throat could be due to vocal strain, infection, or irritation. Rest your voice, drink warm liquids, and if the pain persists for more than 3 days, please consult a healthcare professional.',
  'sore throat': 'For a sore throat, try resting your voice, drinking warm liquids like tea with honey, and using throat lozenges. If it lasts more than 3-4 days or is severe, please see a doctor.',
  'hoarse voice': 'Hoarseness can be caused by vocal strain, reflux, or infections. Try to rest your voice, stay hydrated, and avoid caffeine and alcohol. If hoarseness lasts more than 2 weeks, you should see an ENT specialist.',
  'losing voice': 'Losing your voice is often due to vocal cord inflammation or overuse. Complete voice rest is recommended along with staying hydrated. Avoid whispering as it can strain your vocal cords further.',
  'voice crack': 'Voice cracking is common and usually caused by muscle tension or dehydration. Practice gentle vocal exercises, stay hydrated, and work on proper breathing techniques.',
  'difficulty swallowing': 'Difficulty swallowing could indicate a more serious condition. Please consult a doctor immediately, especially if accompanied by pain or if it persists.',
  'cough': 'A persistent cough can irritate your vocal cords. Try throat lozenges, honey with warm water, and avoid irritants like smoke. If the cough persists for more than 2 weeks, see a doctor.',
  'vocal exercises': 'Good vocal exercises include lip trills, humming, and gentle sirens. Start with 5-10 minutes daily, gradually increasing time. Make sure to warm up before intensive voice use.',
  'voice therapy': 'Voice therapy with a speech-language pathologist can help improve vocal quality, stamina, and technique. It\'s particularly useful for professional voice users or those recovering from vocal injuries.',
  'hydration': 'Staying hydrated is crucial for vocal health. Aim for at least 8 glasses of water daily, and increase intake when speaking or singing extensively.',
  'reflux': 'Acid reflux can damage vocal cords. Avoid eating late at night, reduce acidic and spicy foods, and elevate your head when sleeping. Over-the-counter antacids may help, but consult a doctor for persistent symptoms.',
  'vocal nodules': 'Vocal nodules are callous-like growths on vocal cords due to overuse. They require voice rest, therapy, and sometimes medical intervention. Consult with an ENT specialist.',
  'strain': 'Vocal strain typically results from overuse or improper technique. Rest your voice, practice proper breathing, and avoid shouting. If strain persists, consider voice therapy.',
  'singing': 'For healthy singing, maintain good posture, proper breath support, and adequate warm-up. Stay hydrated and give your voice regular rest periods, especially after intense use.',
  'treatment': 'Treatment for voice issues depends on the specific condition. Generally, it may include voice rest, hydration, steam inhalation, and in some cases, medication or therapy.',
  'prevention': 'Prevent voice problems by staying hydrated, avoiding shouting, taking voice breaks, using proper breathing techniques, and maintaining overall health by avoiding smoking and excessive alcohol.',
  'warm up': 'Effective vocal warm-ups include lip trills, humming, gentle sirens, and light stretching of the neck and shoulders. Start with 5-10 minutes before intensive voice use.',
  'default': 'I\'m a simple vocal health assistant. I can provide basic information about common voice issues like throat pain, hoarseness, or vocal exercises. How can I help with your vocal health today?'
};

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<{type: 'user' | 'bot', text: string}[]>([
    {type: 'bot', text: "Hello! I'm your vocal health assistant. How can I help you today?"}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {type: 'user' as const, text: input};
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate a delay for bot response
    setTimeout(() => {
      // Find a relevant response based on keywords in the user's message
      const userInput = input.toLowerCase();
      let botResponse = VOCAL_RESPONSES.default;
      
      // Look for the longest matching keyword to find the most specific match
      let bestMatchLength = 0;
      
      for (const [keyword, response] of Object.entries(VOCAL_RESPONSES)) {
        if (userInput.includes(keyword) && keyword.length > bestMatchLength) {
          botResponse = response;
          bestMatchLength = keyword.length;
        }
      }
      
      // Special handling for common questions about throat pain
      if (
        userInput.includes("throat") && 
        (userInput.includes("pain") || userInput.includes("hurt") || userInput.includes("sore"))
      ) {
        botResponse = VOCAL_RESPONSES['throat pain'];
      }
      
      // Add bot response
      setMessages(prev => [...prev, {type: 'bot', text: botResponse}]);
      setLoading(false);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-rose-500" />
                  Vocal Health Assistant
                </CardTitle>
                <CardDescription>
                  Ask me about common vocal health issues and remedies
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex flex-col h-[calc(100%-12rem)] overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.type === 'user' 
                            ? 'bg-rose-500 text-white' 
                            : 'bg-muted'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2 flex space-x-2">
                        <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-4">
                <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about vocal health..."
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 