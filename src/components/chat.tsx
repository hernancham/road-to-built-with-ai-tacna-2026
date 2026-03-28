"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Send, Square, User, Sparkles, UploadCloud, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Streamdown } from 'streamdown';

export function Chat() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dragActive, setDragActive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const processFileList = async (files: FileList) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    
    // Autoenviar al dropear/seleccionar imagen
    sendMessage({
      text: "Por favor extrae los medicamentos de esta receta médica.",
      files: files,
    });
  };


  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFileList(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      await processFileList(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const userInitials = (user?.user_metadata?.full_name ?? user?.email ?? "U")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3 bg-card shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="font-semibold text-sm leading-none">GoodPills AI</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gemini 2.5 Flash Vision
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isStreaming ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
        </div>
      </div>

      {/* Messages / Drag Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 min-h-0">
        {messages.length === 0 && (
          <form
            className={`flex flex-col items-center justify-center h-full gap-4 text-center py-16 border-2 border-dashed rounded-3xl transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UploadCloud className="w-10 h-10 text-primary" />
              </div>
              <p className="font-semibold text-lg">Sube tu Receta Médica</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Arrastra la imagen aquí o haz clic para subir foto. Extraeremos los medicamentos y te diremos si es seguro tomarlos juntos.
              </p>
              <div className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                Seleccionar Archivo
              </div>
            </label>
          </form>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold select-none ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {isUser ? (
                  userInitials || <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 whitespace-pre-wrap"
                    : ""
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return isUser ? (
                      <span key={i}>{part.text}</span>
                    ) : (
                      <div
                        key={i}
                        className="bg-muted text-foreground rounded-2xl rounded-tl-sm border border-border px-4 py-3 mb-2 w-fit prose prose-sm dark:prose-invert max-w-none"
                      >
                        <Streamdown>{part.text}</Streamdown>
                      </div>
                    );
                  }

                  if (
                    part.type === "file" &&
                    part.mediaType?.startsWith("image/")
                  ) {
                    return (
                      <div key={i} className="mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={part.url}
                          alt="Receta subida"
                          className="max-w-50 rounded-lg border border-primary/20"
                        />
                      </div>
                    );
                  }

                  // === UI GENERATIVA (Herramientas / Tools) ===
                  
                  if (part.type === "tool-showDetectedMedications") {
                    if (part.state === "input-streaming" || part.state === "input-available") {
                      return (
                        <div key={`tool-${i}`} className="bg-card text-card-foreground border rounded-xl p-4 shadow-sm animate-pulse flex items-center gap-3">
                           <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"/> Mapeando base de datos...
                        </div>
                      )
                    }
                    if (part.state === "output-available") {
                       return (
                         <div key={`tool-${i}`} className="bg-card border rounded-xl w-full max-w-sm shadow-sm overflow-hidden mb-2">
                           <div className="bg-muted px-4 py-3 border-b flex items-center justify-between">
                             <h4 className="font-semibold text-sm">💊 Medicamentos Detectados</h4>
                           </div>
                           <div className="p-2 space-y-1">
                             {/* @ts-expect-error AI SDK tool typing */}
                             {part.output.matched.map((med: { trade_name: string, is_known: boolean, dosage?: string, db_info?: { active_ingredient?: string } }, idx: number) => (
                               <div key={idx} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                                 <div>
                                   <p className="font-medium text-sm flex items-center gap-1">
                                    {med.trade_name} 
                                    {med.is_known && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>}
                                   </p>
                                   <p className="text-xs text-muted-foreground">{med.dosage || med.db_info?.active_ingredient || "No reconocido"}</p>
                                 </div>
                                 <button className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors">
                                   <X className="w-4 h-4"/>
                                 </button>
                               </div>
                             ))}
                           </div>
                           <div className="p-3 bg-muted/30 border-t flex justify-between gap-2">
                             <input type="text" placeholder="Agregar manual..." className="flex-1 text-sm bg-background border rounded-md px-2" disabled={isStreaming} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  sendMessage({ text: `Agrégalo: ${e.currentTarget.value}` });
                                  e.currentTarget.value = "";
                                }
                             }}/>
                           </div>
                         </div>
                       )
                    }
                  }

                  if (part.type === "tool-checkInteractions") {
                    if (part.state === "input-streaming" || part.state === "input-available") {
                       return <div key={`tool-${i}`} className="text-xs text-muted-foreground mb-2 flex items-center gap-2"><ShieldAlert className="w-3.5 h-3.5 animate-pulse"/> Cruzando información de interacciones...</div>
                    }
                    if (part.state === "output-available") {
                      /* @ts-expect-error AI SDK tool typing */
                      const status = part.output.status;
                      const isDanger = status === "DANGER";
                      const isWarning = status === "WARNING";

                      return (
                         <div key={`tool-${i}`} className={`border rounded-xl w-full max-w-sm shadow-sm mb-2 overflow-hidden ${isDanger ? 'border-destructive/50' : isWarning ? 'border-amber-500/50' : 'border-emerald-500/50'}`}>
                           <div className={`px-4 py-3 flex gap-2 items-center ${isDanger ? 'bg-destructive/10 text-destructive' : isWarning ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                              <ShieldAlert className="w-5 h-5"/>
                              <h4 className="font-bold text-sm">
                                {isDanger ? 'Riesgo Alto Detectado' : isWarning ? 'Precaución de Interacción' : 'Venta Segura'}
                              </h4>
                           </div>
                           <div className="p-4 bg-card text-sm space-y-3">
                              {/* @ts-expect-error AI SDK tool typing */}
                              {(!part.output.pairs || part.output.pairs.length === 0) ? (
                                <p className="text-muted-foreground">No hay suficientes medicamentos para comparar interacciones.</p>
                              ) : (
                                <div className="rounded-md border overflow-hidden">
                                  <table className="w-full text-left text-xs bg-background">
                                    <thead className="bg-muted text-muted-foreground">
                                      <tr>
                                        <th className="px-3 py-2 font-medium">Combinación</th>
                                        <th className="px-3 py-2 font-medium text-center">Estado</th>
                                        <th className="px-3 py-2 font-medium">Detalle</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {/* @ts-expect-error AI SDK tool typing */}
                                      {part.output.pairs.map((pair: { status: string; medA: string; medB: string; warning_message: string }, idx: number) => {
                                        const isHigh = pair.status === "HIGH" || pair.status === "DANGER";
                                        const isMod = pair.status === "MODERATE" || pair.status === "WARNING";
                                        
                                        return (
                                          <tr key={idx} className={isHigh ? 'bg-destructive/5' : isMod ? 'bg-amber-500/5' : ''}>
                                            <td className="px-3 py-2 font-medium whitespace-nowrap">
                                              {pair.medA} + {pair.medB}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                isHigh ? 'bg-destructive/10 text-destructive' : 
                                                isMod ? 'bg-amber-500/10 text-amber-600' : 
                                                'bg-emerald-500/10 text-emerald-600'
                                              }`}>
                                                {isHigh ? "ALTO RIESGO" : isMod ? "PRECAUCIÓN" : "SEGURO"}
                                              </span>
                                            </td>
                                            <td className="px-3 py-2 text-muted-foreground max-w-37.5 truncate" title={pair.warning_message}>
                                              {pair.warning_message}
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                           </div>
                         </div>
                      )
                    }
                  }

                  if (part.type === "tool-findPharmacies") {
                    if (part.state === "output-available") {
                      return (
                        <div key={`tool-${i}`} className="bg-card border rounded-xl w-full max-w-sm shadow-sm mb-2">
                           <div className="bg-muted px-4 py-3 border-b flex items-center justify-between">
                             <h4 className="font-semibold text-sm">📍 Disponibilidad en Sucursales</h4>
                           </div>
                           <div className="p-0 divide-y">
                              {/* @ts-expect-error AI SDK tool typing */}
                              {part.output.results.map((res: { pharmacy: { name: string, address: string }, available_count: number, total_requested: number }, idx: number) => (
                                <div key={idx} className="p-3 px-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-sm">{res.pharmacy.name}</p>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                      Disponibles: {res.available_count}/{res.total_requested}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{res.pharmacy.address}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      )
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {status === "submitted" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="flex gap-1 items-center h-full">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20 max-w-sm mt-4">
            ⚠️ {error.message ?? "Ocurrió un error. Intenta de nuevo."}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {messages.length > 0 && (
        <div className="border-t bg-card px-4 py-3 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              placeholder="Escribe un mensaje, modifica medicamentos o pide análisis cruzado…"
              rows={1}
              className="flex-1 resize-none bg-background border border-input rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 min-h-10 max-h-40 overflow-y-auto w-full"
            />

            {isStreaming ? (
              <button
                type="button"
                onClick={stop}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-destructive text-white hover:bg-destructive/90 transition-colors shrink-0 cursor-pointer"
                aria-label="Detener"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
