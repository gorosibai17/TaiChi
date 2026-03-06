import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, Send, X, Sparkles, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function GeminiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: '¡Hola! Soy tu guía de Tai Chi. ¿En qué puedo ayudarte hoy? Puedo darte consejos sobre posturas, beneficios para la salud o crear una rutina personalizada para ti.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "Eres un experto instructor de Tai Chi de clase mundial, especializado en gerontología y bienestar para personas mayores de 60 años. Tu tono es extremadamente amable, paciente, alentador y profesional. Tu objetivo es ayudar a los usuarios a mejorar su equilibrio, flexibilidad y paz mental a través del Tai Chi. \n\nREGLAS CRÍTICAS:\n1. Seguridad Primero: Siempre recuerda a los usuarios que no deben forzar ninguna postura y que deben consultar con su médico si sienten dolor o incomodidad.\n2. Claridad: Usa un lenguaje sencillo pero técnico cuando sea necesario, explicando los términos de Tai Chi.\n3. Empatía: Reconoce las posibles limitaciones físicas de la edad y ofrece alternativas más sencillas si un ejercicio parece complejo.\n4. Idioma: Responde siempre en español.\n5. Formato: Usa Markdown para estructurar tus respuestas (listas, negritas) para que sean fáciles de leer.",
        }
      });

      setMessages(prev => [...prev, { role: 'model', content: response.text || 'Lo siento, no pude procesar tu solicitud.' }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: 'Hubo un error al conectar con el asistente. Por favor, inténtalo de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-olive text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center gap-2"
      >
        <MessageCircle size={24} />
        <span className="hidden md:inline font-medium">Preguntar al Maestro</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-brand-olive/10"
          >
            <div className="bg-brand-olive p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                <h3 className="font-serif text-xl">Guía Vital</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-cream/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-brand-olive text-white rounded-tr-none' 
                      : 'bg-white text-brand-ink shadow-sm border border-brand-olive/5 rounded-tl-none'
                  }`}>
                    <div className="markdown-body text-sm">
                      <Markdown>{m.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-brand-olive/5 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-olive" />
                    <span className="text-xs text-gray-500">El Maestro está pensando...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-brand-olive/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-brand-cream/50 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-brand-olive outline-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-brand-olive text-white p-2 rounded-full hover:bg-brand-olive/90 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
