"use client";

import { useState } from 'react';
import { SecurityValidator } from '@/components/security-validator';
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [pin, setPin] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<{name: string, conditions: { label: string }[]} | null>(null);
  const [dbMedications, setDbMedications] = useState<{ trade_name?: string; dosage?: string; db_info?: { active_ingredient?: string }; is_known?: boolean }[]>([]);
  const [dbInteractions, setDbInteractions] = useState<{ state?: string; output?: { pairs?: { status: string; medA: string; medB: string; warning_message: string }[]; interactions?: { severity: string; warning_message: string }[] } } | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Extraer información del stream de mensajes
  const lastMedicationsTool = messages
    .flatMap((m) => m.parts)
    .filter((p) => p.type === "tool-showDetectedMedications")
    .pop();
    
  // @ts-expect-error AI SDK tool typing
  const detectedMedications = lastMedicationsTool?.state === "output-available" ? lastMedicationsTool.output.matched : [];
  const isMappingMeds = (lastMedicationsTool as { state?: string })?.state === "input-streaming" || (lastMedicationsTool as { state?: string })?.state === "input-available";
  const isExtracting = isMappingMeds || (isStreaming && detectedMedications.length === 0);

  const lastInteractionsTool = messages
    .flatMap((m) => m.parts)
    .filter((p) => p.type === "tool-checkInteractions")
    .pop();

  const activeMedications = dbMedications.length > 0 ? dbMedications : detectedMedications;
  const activeInteractionsTool = dbInteractions || (lastInteractionsTool as unknown as { state?: string; output?: { pairs?: { status: string; medA: string; medB: string; warning_message: string }[]; interactions?: { severity: string; warning_message: string }[] } }) || null;

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    
    // Create local preview
    const url = URL.createObjectURL(file);
    setPreviewImage(url);

    // Send to AI
    sendMessage({
      text: "Por favor extrae los medicamentos de esta receta médica.",
      files: files,
    });
  };

  const handleManualAdd = (text: string) => {
    sendMessage({ text: `Agrégalo a la lista para cruzar interacciones: ${text}` });
  };

  const handleManualCheck = (drugs: string[]) => {
    sendMessage({ text: `Por favor revisa explícitamente las interacciones de los siguientes medicamentos: ${drugs.join(', ')}` });
  };

  const handleSearchClient = async () => {
    if (!pin || pin.length !== 6) {
      setSearchError("El PIN debe tener exactamente 6 dígitos.");
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    const supabase = createClient();
    
    const { data, error: fetchError } = await supabase
        .from('pharmacy_sessions')
        .select('*')
        .eq('pin', pin)
        .single();
        
    setIsSearching(false);
    if (fetchError || !data) {
        setSearchError("PIN inválido o expirado");
        return;
    }
    
    setPatientData({
        name: data.patient_name || 'Paciente sin nombre',
        conditions: data.conditions || []
    });
    setDbMedications(data.medications || []);
    setDbInteractions(data.interactions || null);
  };
  return (
    <>
      {/* Initial State / PIN Search Section */}
      <section className="mb-12 flex justify-center">
        <div className="bg-surface-container-low dark:bg-slate-900 p-10 rounded-xl w-full max-w-2xl text-center shadow-sm border border-outline-variant/10 dark:border-slate-800">
          <h3 className="font-headline text-2xl font-bold mb-6 text-on-surface dark:text-white">Identificación del Paciente</h3>
          <div className="flex gap-4 justify-center items-center">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline dark:text-slate-400">key</span>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-surface-container-lowest dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-brand/20 transition-all font-headline text-xl tracking-[0.5em] placeholder:tracking-normal placeholder:text-sm text-on-surface dark:text-white dark:placeholder:text-slate-500"
                placeholder="Ingresar PIN del paciente"
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSearchClient}
              disabled={isSearching}
              className="bg-linear-to-br from-primary-brand to-primary-container text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-brand/20 disabled:opacity-50">
              {isSearching ? <span className="material-symbols-outlined animate-spin">cycle</span> : <span className="material-symbols-outlined">search</span>}
              {isSearching ? "Buscando..." : "Buscar Cliente"}
            </button>
          </div>
          {searchError ? (
              <p className="mt-4 text-sm text-red-500 font-bold">{searchError}</p>
          ) : (
              <p className="mt-4 text-sm text-on-surface-variant dark:text-slate-400 italic">Solicite el PIN de 6 dígitos generado en la App del Paciente</p>
          )}
        </div>
      </section>

      {/* Active Dashboard State */}
      <div className="grid grid-cols-12 gap-8 mb-24">
        {/* Header Card: Customer Profile */}
        <div className="col-span-12">
          <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl flex items-center justify-between shadow-sm border-l-8 border-y border-r border-outline-variant/10 border-l-secondary dark:border-slate-800 dark:border-l-teal-500">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover" alt="Patient" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATz20NI_ml_2Nol5JHldp-7rkFce2CsUwcJ_0kclGn-xDETo8kyxXmuD3sRCNRj1jpf0iAIN4HPCvqn5wnb8U7HwXnSTy6O29TyjgAwqYeUwD21l1sq4Y4-B3ARTxbHzt5-TDRVDj0J21AsyuymcXO-XTrYAgu-d90V59Nt_vrecn-_GQfxhDS7z_U_mwzTRE3tQGiouyNpCw5gJ6F1lEiWFSLvvVSNqaO_2Vx9Ij913vMEn8gZl4WiWxXiAWZ1dleMyPorcrOnatv" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface dark:text-white">
                      {patientData ? patientData.name : "Ingresa un PIN"}
                  </h2>
                  {patientData && (
                      <span className="bg-secondary/10 dark:bg-teal-500/10 text-secondary dark:text-teal-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                        VÁLIDA
                      </span>
                  )}
                </div>
                <div className="flex gap-6 mt-2 text-on-surface-variant dark:text-slate-400 font-medium">
                  <span>45 años</span>
                  <span>DNI: 22.455.901</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Córdoba, AR
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-label text-outline uppercase tracking-widest">Última Visita</p>
              <p className="text-lg font-bold text-on-surface dark:text-white">12 Oct, 2023</p>
              <button className="mt-2 text-primary-brand dark:text-blue-400 font-bold text-sm flex items-center gap-1 justify-end">
                Ver historial completo <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Column 1: Patient History & Active Prescription */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
          <section>
            <h4 className="font-headline text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <span className="material-symbols-outlined text-primary-brand dark:text-blue-400">history</span>
              Historial del Paciente
            </h4>
            <div className="space-y-6">
              {/* Condiciones Declaradas */}
              <div className="bg-surface-container dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800">
                <p className="text-xs font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-4">Condiciones Declaradas & Alergias</p>
                <div className="flex flex-wrap gap-3">
                  {patientData && patientData.conditions.length > 0 ? patientData.conditions.map((cond: { label: string }, idx: number) => (
                      <span key={idx} className="bg-tertiary-container/20 dark:bg-red-500/20 text-tertiary dark:text-red-400 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">medical_information</span>
                        {cond.label}
                      </span>
                  )) : (
                      <p className="text-sm text-on-surface-variant dark:text-slate-500 italic">No hay condiciones cargadas o no hay sesión activa.</p>
                  )}
                </div>
              </div>

              {/* Receta Actual Card */}
              <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-outline-variant/10 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-widest">
                       Receta Actual {messages.length > 0 ? (isExtracting ? " (Procesando...)" : " (Procesada via IA)") : ""}
                    </p>
                    {isExtracting && <span className="material-symbols-outlined text-primary-brand animate-spin text-sm">cycle</span>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${activeMedications.length > 0 ? 'bg-primary-container text-primary-brand dark:bg-blue-900/40 dark:text-blue-400' : 'bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-400'}`}>
                    {activeMedications.length > 0 ? 'AI VERIFIED' : 'PENDING'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <div className="relative group cursor-zoom-in rounded-lg overflow-hidden border border-outline-variant/30 dark:border-slate-700 bg-surface-container dark:bg-slate-800 flex items-center justify-center h-48">
                      {previewImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Prescription" src={previewImage} />
                      ) : (
                         <div className="text-center p-4">
                           <span className="material-symbols-outlined text-4xl text-outline mb-2">image_search</span>
                           <p className="text-xs text-outline font-medium">Esperando receta...</p>
                         </div>
                      )}
                      {previewImage && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <div className="flex-1 overflow-auto">
                        {activeMedications.length > 0 ? (
                            <table className="w-full text-sm">
                            <thead>
                                <tr className="text-outline dark:text-slate-400 border-b border-outline-variant/20 dark:border-slate-800">
                                <th className="text-left pb-2 font-medium">Medicamento</th>
                                <th className="text-left pb-2 font-medium">Dosis (Extraída)</th>
                                <th className="text-center pb-2 font-medium">Validado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {activeMedications.map((med: { trade_name?: string; dosage?: string; db_info?: { active_ingredient?: string }; is_known?: boolean }, i: number) => (
                                    <tr key={i}>
                                        <td className="py-3 font-bold dark:text-white">{med.trade_name}</td>
                                        <td className="py-3 dark:text-slate-300 text-xs">{med.dosage || med.db_info?.active_ingredient || "No reconocido"}</td>
                                        <td className="py-3 text-center dark:text-slate-300">
                                            {med.is_known ? <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span> : <span className="material-symbols-outlined text-amber-500 text-base">help</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant dark:text-slate-500 text-center p-4">
                               {isExtracting ? (
                                   <div className="space-y-4">
                                       <span className="material-symbols-outlined text-4xl animate-pulse text-primary-brand">document_scanner</span>
                                       <p className="text-sm font-medium">Analizando receta por IA...</p>
                                       <div className="text-xs text-left text-slate-400 bg-surface-container p-2 rounded max-w-62.5 overflow-hidden whitespace-pre-wrap">
                                            {messages.filter(m => m.role === 'assistant').pop()?.parts?.filter(p => p.type === 'text').map(p => (p as { text: string }).text).join('\\n') || "Iniciando análisis..."}
                                       </div>
                                   </div>
                               ) : (
                                   <div className="space-y-4">
                                       <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                       <p className="text-sm">Esperando extracción de datos.</p>
                                       {error && <p className="text-xs text-red-500">Error: {error.message}</p>}
                                   </div>
                               )}
                            </div>
                        )}
                    </div>
                    {activeMedications.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-outline-variant/20 dark:border-slate-800 flex justify-end">
                        <button className="text-primary-container dark:text-blue-400 font-bold text-sm flex items-center gap-2 hover:opacity-80">
                            <span className="material-symbols-outlined text-sm">edit</span> Editar lectura OCR
                        </button>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Column 2: Validador de Seguridad -> New Custom Component */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          <SecurityValidator 
              onUpload={handleImageUpload} 
              isStreaming={isStreaming} 
              lastInteractionsTool={activeInteractionsTool || {}}
              detectedMedications={activeMedications}
              onManualAdd={handleManualAdd}
              onManualCheck={handleManualCheck}
          />
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-8 right-8 left-72 z-40">
        <div className="glass-card dark:bg-slate-900/80 p-4 rounded-2xl shadow-xl border border-white/40 dark:border-slate-700/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-secondary dark:text-teal-400" style={{ fontVariationSettings: '"FILL" 1' }}>shopping_cart_checkout</span>
            <div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">Resumen de Venta</p>
              <p className="text-lg font-bold text-on-surface dark:text-white">{activeMedications.length > 0 ? activeMedications.length : 0} Medicamentos Seleccionados</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-container-high dark:bg-slate-800 text-on-surface dark:text-white px-6 py-3 rounded-lg font-bold hover:bg-surface-container-highest dark:hover:bg-slate-700 transition-colors">
              Cancelar
            </button>
            <button className="bg-linear-to-br from-primary-brand to-primary-container text-on-primary px-10 py-3 rounded-lg font-bold shadow-lg shadow-primary-brand/20 hover:opacity-90 active:scale-95 transition-all">
              Confirmar & Dispensar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
