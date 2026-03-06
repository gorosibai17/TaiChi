import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  Wind, 
  Info, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { EXERCISES, Exercise } from './data/exercises';
import { WEEKLY_ROUTINE, DayRoutine } from './data/routine';
import { TaiChiCard } from './components/TaiChiCard';
import { GeminiAssistant } from './components/GeminiAssistant';
import { RoutineGenerator } from './components/RoutineGenerator';
import { VideoDemo } from './components/VideoDemo';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSafety, setShowSafety] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const currentDayIndex = new Date().getDay(); // 0 is Sunday
  const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const todayName = daysMap[currentDayIndex];

  const toggleComplete = (id: string) => {
    setCompletedExercises(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (selectedExercise) {
      fetchAiInsight(selectedExercise);
    } else {
      setAiInsight(null);
    }
  }, [selectedExercise]);

  const fetchAiInsight = async (exercise: Exercise) => {
    setIsInsightLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: `Explica brevemente (máximo 2 frases) el beneficio específico para la salud de una persona mayor de 60 años al realizar el ejercicio de Tai Chi: "${exercise.title}".`,
        config: {
          systemInstruction: "Eres un experto en Tai Chi terapéutico. Tus consejos son breves, alentadores y basados en el bienestar senior.",
        }
      });
      setAiInsight(response.text || null);
    } catch (error) {
      console.error("Insight Error:", error);
    } finally {
      setIsInsightLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-brand-olive mb-2">
              <Wind size={24} />
              <span className="uppercase tracking-[0.2em] text-xs font-bold">Respirar · Fluir · Vivir</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-[0.9]">
              TaiChi <span className="italic text-brand-olive">Vital</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-olive/5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-olive">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Progreso Hoy</p>
                <p className="font-serif text-xl">{completedExercises.length} / {EXERCISES.length} Sesiones</p>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="px-6 max-w-7xl mx-auto space-y-12">
        {/* Safety Banner */}
        <AnimatePresence>
          {showSafety && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-olive text-white p-6 rounded-[32px] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="bg-white/20 p-4 rounded-full">
                <AlertCircle size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif mb-1">Tu seguridad es lo primero</h3>
                <p className="text-white/80 text-sm max-w-2xl">
                  Recuerda escuchar a tu cuerpo. Si sientes algún dolor o mareo, detente inmediatamente. 
                  Mantente hidratado y realiza los movimientos con suavidad y lentitud.
                </p>
              </div>
              <button 
                onClick={() => setShowSafety(false)}
                className="bg-white text-brand-olive px-6 py-2 rounded-full font-bold text-sm hover:bg-brand-cream transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-full shadow-sm border border-brand-olive/5 flex">
            <button
              onClick={() => setActiveTab('daily')}
              className={cn(
                "px-8 py-2 rounded-full text-sm font-bold transition-all",
                activeTab === 'daily' ? "bg-brand-olive text-white" : "text-gray-400 hover:text-brand-olive"
              )}
            >
              Explorar
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={cn(
                "px-8 py-2 rounded-full text-sm font-bold transition-all",
                activeTab === 'weekly' ? "bg-brand-olive text-white" : "text-gray-400 hover:text-brand-olive"
              )}
            >
              Plan Semanal
            </button>
          </div>
        </div>

        {activeTab === 'daily' ? (
          <>
            {/* AI Generator Section */}
            <section className="mb-12">
              <RoutineGenerator />
            </section>

            {/* Exercise Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-serif">Rutinas Recomendadas</h2>
                <div className="h-px flex-1 bg-brand-olive/10 mx-8 hidden md:block" />
                <p className="text-sm text-gray-500 italic">Selecciona una práctica para comenzar</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {EXERCISES.map((ex) => (
                  <TaiChiCard 
                    key={ex.id} 
                    exercise={ex} 
                    onClick={() => setSelectedExercise(ex)}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-serif">Tu Plan de Bienestar</h2>
              <div className="h-px flex-1 bg-brand-olive/10 mx-8 hidden md:block" />
              <p className="text-sm text-gray-500 italic">Una guía paso a paso para tu semana</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {WEEKLY_ROUTINE.map((day) => {
                const isToday = day.day === todayName;
                return (
                  <motion.div
                    key={day.day}
                    whileHover={{ y: -5 }}
                    className={cn(
                      "p-6 rounded-[32px] border transition-all flex flex-col h-full",
                      isToday 
                        ? "bg-brand-olive text-white border-brand-olive shadow-xl scale-105 z-10" 
                        : "bg-white text-brand-ink border-brand-olive/5 shadow-sm"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] uppercase tracking-widest font-bold mb-1",
                      isToday ? "text-white/60" : "text-gray-400"
                    )}>
                      {isToday ? 'Hoy' : day.day}
                    </span>
                    <h3 className="text-2xl font-serif mb-2">{day.day}</h3>
                    <p className={cn(
                      "text-xs mb-4 italic",
                      isToday ? "text-white/80" : "text-brand-olive"
                    )}>
                      {day.focus}
                    </p>
                    
                    <div className="space-y-2 mt-auto">
                      {day.exerciseIds.map(id => {
                        const ex = EXERCISES.find(e => e.id === id);
                        if (!ex) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => setSelectedExercise(ex)}
                            className={cn(
                              "w-full text-left p-2 rounded-xl text-[10px] font-medium transition-colors flex items-center justify-between group",
                              isToday 
                                ? "bg-white/10 hover:bg-white/20 text-white" 
                                : "bg-brand-cream hover:bg-brand-olive/10 text-brand-ink"
                            )}
                          >
                            <span className="truncate">{ex.title}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-brand-olive/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand-sage/10 text-brand-sage flex items-center justify-center">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif">¿Por qué seguir un plan?</h3>
                  <p className="text-sm text-gray-500">La constancia es la clave para ver resultados en tu equilibrio y vitalidad.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="font-bold text-brand-olive text-sm">Hábito Saludable</p>
                  <p className="text-xs text-gray-600">Practicar solo 15 minutos al día mejora significativamente la densidad ósea y la fuerza muscular.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-brand-olive text-sm">Variedad</p>
                  <p className="text-xs text-gray-600">Nuestro plan alterna entre equilibrio, flexibilidad y respiración para un bienestar integral.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-brand-olive text-sm">Escucha tu cuerpo</p>
                  <p className="text-xs text-gray-600">Si un día te sientes más cansado, puedes optar por realizar solo los ejercicios de respiración.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Daily Wisdom / Quote Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-brand-olive/5 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 text-brand-cream group-hover:text-brand-olive/5 transition-colors duration-700">
              <Wind size={200} />
            </div>
            <div className="relative z-10">
              <span className="text-brand-olive uppercase tracking-widest text-xs font-bold mb-4 block">Sabiduría del Día</span>
              <p className="text-3xl md:text-4xl font-serif italic leading-tight mb-6">
                "La suavidad es la fuerza más grande. Como el agua que fluye, el Tai Chi nos enseña a adaptarnos y encontrar la calma en el movimiento."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cream" />
                <span className="text-sm font-medium text-gray-600">Maestro Li</span>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-sage p-8 rounded-[40px] text-white flex flex-col justify-between">
            <div>
              <Heart className="mb-4" size={32} />
              <h3 className="text-3xl font-serif mb-2">Beneficios del Tai Chi</h3>
              <ul className="space-y-3 text-white/90 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} /> Mejora el equilibrio y previene caídas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} /> Reduce el estrés y la ansiedad
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} /> Fortalece las articulaciones
                </li>
              </ul>
            </div>
            <button className="mt-8 flex items-center justify-between w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-colors group">
              <span className="font-bold text-sm">Saber más</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      {/* Exercise Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-brand-ink/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-cream w-full max-w-5xl max-h-[90vh] rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={selectedExercise.imageUrl} 
                  alt={selectedExercise.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full text-brand-ink hover:scale-110 transition-transform shadow-lg"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                <div className="mb-8">
                  <span className="text-brand-olive uppercase tracking-widest text-xs font-bold mb-2 block">
                    {selectedExercise.category} · {selectedExercise.duration}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-serif mb-4">{selectedExercise.title}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedExercise.description}
                  </p>
                </div>

                <div className="space-y-6 flex-1">
                  <h4 className="font-serif text-2xl border-b border-brand-olive/10 pb-2">Instrucciones Paso a Paso</h4>
                  <div className="space-y-4">
                    {selectedExercise.instructions.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="w-8 h-8 rounded-full bg-brand-olive text-white flex-shrink-0 flex items-center justify-center font-serif text-sm">
                          {i + 1}
                        </span>
                        <p className="text-gray-700 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI Insight in Modal */}
                  <div className="mt-8 p-4 bg-brand-sage/5 rounded-2xl border border-brand-sage/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-brand-sage" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-sage">Consejo del Maestro</span>
                    </div>
                    {isInsightLoading ? (
                      <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                        <Loader2 size={12} className="animate-spin" />
                        Obteniendo sabiduría...
                      </div>
                    ) : (
                      <p className="text-xs text-brand-sage italic leading-relaxed">
                        {aiInsight || "Realiza este movimiento con suavidad para maximizar sus beneficios."}
                      </p>
                    )}
                  </div>

                  {/* Video Demo Section */}
                  <div className="mt-8">
                    <VideoDemo 
                      exerciseTitle={selectedExercise.title} 
                      exerciseDescription={selectedExercise.description} 
                    />
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button 
                    onClick={() => {
                      toggleComplete(selectedExercise.id);
                      setSelectedExercise(null);
                    }}
                    className={cn(
                      "flex-1 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2",
                      completedExercises.includes(selectedExercise.id)
                        ? "bg-brand-sage text-white"
                        : "bg-brand-olive text-white hover:bg-brand-olive/90"
                    )}
                  >
                    {completedExercises.includes(selectedExercise.id) ? (
                      <>
                        <CheckCircle2 size={20} />
                        Sesión Completada
                      </>
                    ) : (
                      "Marcar como Completada"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini Assistant */}
      <GeminiAssistant />

      {/* Footer Info */}
      <footer className="mt-24 border-t border-brand-olive/10 pt-12 pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-brand-olive mb-4">
          <Wind size={20} />
          <span className="font-serif text-2xl">TaiChi Vital</span>
        </div>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Diseñado con amor para fomentar el bienestar y la longevidad activa. 
          Consulta siempre con un profesional antes de comenzar una nueva rutina de ejercicios.
        </p>
      </footer>
    </div>
  );
}
