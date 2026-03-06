import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GeneratedExercise {
  title: string;
  description: string;
  duration: string;
  reason: string;
}

interface GeneratedRoutine {
  routineTitle: string;
  exercises: GeneratedExercise[];
  advice: string;
}

export function RoutineGenerator() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateRoutine = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setRoutine(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Genera una rutina de Tai Chi personalizada para una persona mayor de 60 años con la siguiente condición o preferencia: "${input}". 
        La rutina debe ser segura y fácil de seguir.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              routineTitle: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "Por qué este ejercicio es bueno para la condición del usuario" }
                  },
                  required: ["title", "description", "duration", "reason"]
                }
              },
              advice: { type: Type.STRING, description: "Un consejo final de seguridad y motivación" }
            },
            required: ["routineTitle", "exercises", "advice"]
          },
          systemInstruction: "Eres un experto en Tai Chi terapéutico. Generas rutinas personalizadas seguras para personas mayores. Siempre incluyes advertencias de seguridad si el usuario menciona dolor agudo.",
        }
      });

      const data = JSON.parse(response.text || '{}');
      setRoutine(data);
    } catch (err) {
      console.error("Routine Gen Error:", err);
      setError("No pudimos generar tu rutina en este momento. Por favor, intenta ser más específico con tu descripción.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-brand-olive/10 overflow-hidden shadow-sm">
      <div className="bg-brand-olive p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} />
            <span className="uppercase tracking-widest text-[10px] font-bold opacity-80">Inteligencia Vital</span>
          </div>
          <h3 className="text-3xl font-serif mb-2">Generador de Sesión a Medida</h3>
          <p className="text-white/70 text-sm max-w-md">
            Cuéntanos cómo te sientes hoy o qué te gustaría trabajar (ej: "me duelen las rodillas", "quiero dormir mejor") y crearé una sesión para ti.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: Tengo tensión en los hombros y busco relax..."
            className="flex-1 bg-brand-cream/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-olive outline-none text-sm"
          />
          <button
            onClick={generateRoutine}
            disabled={isLoading || !input.trim()}
            className="bg-brand-olive text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-brand-olive/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creando...
              </>
            ) : (
              <>
                Diseñar Rutina
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center gap-3"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {routine && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 border-t border-brand-olive/5 pt-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-serif text-brand-olive">{routine.routineTitle}</h4>
                <span className="bg-brand-sage/10 text-brand-sage px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Personalizada
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routine.exercises.map((ex, i) => (
                  <div key={i} className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-olive/5">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-brand-ink">{ex.title}</h5>
                      <span className="text-[10px] text-brand-olive font-bold">{ex.duration}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{ex.description}</p>
                    <div className="flex items-start gap-2 bg-white/50 p-2 rounded-lg">
                      <CheckCircle2 size={12} className="text-brand-sage mt-0.5" />
                      <p className="text-[10px] text-brand-sage italic leading-tight">{ex.reason}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-olive/5 p-4 rounded-2xl border border-brand-olive/10">
                <p className="text-xs text-brand-olive italic">
                  <strong>Consejo del Maestro:</strong> {routine.advice}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
