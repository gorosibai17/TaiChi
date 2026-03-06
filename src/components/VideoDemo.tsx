import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Play, Loader2, AlertCircle, Video, CheckCircle2, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface VideoDemoProps {
  exerciseTitle: string;
  exerciseDescription: string;
}

export function VideoDemo({ exerciseTitle, exerciseDescription }: VideoDemoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  const messages = [
    "Inspirando profundamente...",
    "El Maestro está preparando la demostración...",
    "Dibujando los movimientos en el aire...",
    "Casi listo para fluir contigo...",
    "Afinando la armonía del movimiento..."
  ];

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    setError(null);
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    }, 8000);

    try {
      const aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let operation = await aiInstance.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A high-quality, peaceful demonstration of a Tai Chi exercise called "${exerciseTitle}". A senior person performing slow, fluid movements in a beautiful garden. Soft lighting, cinematic style.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await aiInstance.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
        });
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        throw new Error("No se pudo obtener el enlace del video.");
      }
    } catch (err: any) {
      console.error("Video Gen Error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("Se requiere una clave de API válida para generar videos. Por favor, selecciona una de nuevo.");
      } else {
        setError("La generación de video tomó demasiado tiempo o falló. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  if (videoUrl) {
    return (
      <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-brand-olive/20">
        <video src={videoUrl} controls autoPlay loop className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="bg-brand-cream/50 rounded-2xl p-8 border-2 border-dashed border-brand-olive/20 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-4"
          >
            <Loader2 size={48} className="animate-spin text-brand-olive" />
            <div className="space-y-2">
              <p className="font-serif text-xl text-brand-olive">{loadingMessage}</p>
              <p className="text-xs text-gray-400">Esto puede tardar un par de minutos. Gracias por tu paciencia.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-brand-olive/10 rounded-full flex items-center justify-center mx-auto text-brand-olive">
              <Video size={32} />
            </div>
            <div>
              <h4 className="font-serif text-2xl mb-2">Demostración en Video</h4>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Genera un video animado único para visualizar este movimiento con fluidez.
              </p>
            </div>

            {!hasKey ? (
              <button
                onClick={handleOpenKeySelector}
                className="bg-brand-sage text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-sage/90 transition-all flex items-center gap-2 mx-auto"
              >
                <Key size={18} />
                Configurar Clave para Video
              </button>
            ) : (
              <button
                onClick={generateVideo}
                className="bg-brand-olive text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-olive/90 transition-all flex items-center gap-2 mx-auto shadow-lg"
              >
                <Play size={18} fill="currentColor" />
                Generar Video con IA
              </button>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs justify-center bg-red-50 p-2 rounded-lg">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
