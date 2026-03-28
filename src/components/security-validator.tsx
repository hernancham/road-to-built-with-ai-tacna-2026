"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  onUpload: (files: FileList | null) => void;
  isStreaming: boolean;
  lastInteractionsTool: { state?: string; output?: { pairs?: { status: string; medA: string; medB: string; warning_message: string }[]; interactions?: { severity: string; warning_message: string }[] } }; // AI Tool invocation dict
  detectedMedications: { trade_name?: string; db_info?: { active_ingredient?: string } }[]; // Detected output from tool showDetectedMedications
  onManualAdd: (text: string) => void;
  onManualCheck: (drugs: string[]) => void;
}

export function SecurityValidator({ 
    onUpload, 
    isStreaming, 
    lastInteractionsTool, 
    detectedMedications,
    onManualAdd,
    onManualCheck 
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [localDrugs, setLocalDrugs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combinar meds detectados automáticos con los manuales
  const aiMedNames = detectedMedications.map(m => m.trade_name || m.db_info?.active_ingredient || "");
  const allDrugs = Array.from(new Set([...aiMedNames, ...localDrugs])).filter(Boolean);

  const handleAddDrug = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !allDrugs.includes(trimmed)) {
      setLocalDrugs([...localDrugs, trimmed]);
      setInputValue("");
      onManualAdd(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDrug();
    }
  };

  const removeDrug = (drugToRemove: string) => {
    setLocalDrugs(localDrugs.filter(d => d !== drugToRemove));
    // Nota: para borrar uno detectado por IA, se requeriría mandarle un text prompt a la IA
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        onUpload(e.target.files);
    }
  };

  const handleCheckClick = () => {
      onManualCheck(allDrugs);
  };

  // Extraer estado de interacciones
  const isTargetingInteractions = lastInteractionsTool?.state === "input-streaming" || lastInteractionsTool?.state === "input-available";
  const hasChecked = lastInteractionsTool?.state === "output-available";
  const pairs = hasChecked ? lastInteractionsTool.output?.pairs || [] : [];
  // AI fallback compatibility just in case 
  const oldInteractions = hasChecked && !lastInteractionsTool.output?.pairs ? lastInteractionsTool.output?.interactions || [] : [];
  
  // Checking if any high risk
  const hasHighRisk = pairs.some((p: { status: string }) => p.status === "HIGH" || p.status === "DANGER") || oldInteractions.some((i: { severity: string }) => i.severity === "HIGH");

  return (
    <section className="bg-surface-container-high dark:bg-slate-900 p-8 rounded-xl h-full border border-outline-variant/10 dark:border-slate-800">
      <h4 className="font-headline text-lg font-bold mb-6 flex items-center gap-2 text-on-surface dark:text-white">
        <span className="material-symbols-outlined text-primary-brand dark:text-blue-400">security</span>
        Validador de Seguridad IA
      </h4>

      {/* Search Section */}
      <div className="space-y-4 mb-4">
        <div className="bg-surface-container-lowest dark:bg-slate-800 p-2 rounded-xl flex gap-2 shadow-sm border border-outline-variant/10 dark:border-slate-700 items-center">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 font-medium dark:text-white dark:placeholder:text-slate-500 min-w-0 outline-none"
            placeholder="Buscar medicamento extra..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />
          <button
            onClick={handleAddDrug}
            className="bg-surface-container dark:bg-slate-700 text-on-surface dark:text-white w-10 h-10 rounded-lg flex items-center justify-center transition-transform active:scale-95 hover:bg-surface-container-highest"
            title="Agregar a la lista"
            disabled={isStreaming}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
          />
          <button
            onClick={handleImageClick}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform active:scale-95 ${isStreaming ? 'opacity-50 cursor-not-allowed bg-surface-container text-on-surface' : 'bg-primary-container text-primary-brand dark:bg-blue-900/40 dark:text-blue-400 hover:bg-primary-container/80'}`}
            title="Subir Receta/Foto"
            disabled={isStreaming}
          >
            <span className="material-symbols-outlined">add_a_photo</span>
          </button>
          <button
            onClick={handleCheckClick}
            disabled={isStreaming || allDrugs.length === 0}
            className="bg-primary-brand text-on-primary px-4 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-10 flex items-center justify-center min-w-40"
          >
            {(isStreaming && !isTargetingInteractions) ? (
                 <span className="flex items-center gap-2">Procesando IA <span className="material-symbols-outlined animate-spin text-sm">cycle</span></span>
            ) : isTargetingInteractions ? (
                <span className="flex items-center gap-2">Cruzando BD... <span className="material-symbols-outlined animate-spin text-sm">cycle</span></span>
            ) : "Verificar Interacción"}
          </button>
        </div>
      </div>

      {/* Pill List Section */}
      <div className="flex flex-wrap gap-2 mb-8 min-h-9">
        {allDrugs.map(drug => {
          const isAiDetected = aiMedNames.includes(drug);
          return (
          <Badge
            key={drug}
            className={`text-sm py-1.5 px-3 gap-2 font-medium shadow-sm transition-all border ${isAiDetected ? 'border-primary-brand/30 bg-primary-container/20 text-primary-brand dark:text-blue-300' : 'border-outline-variant/20 bg-surface-container-lowest text-on-surface dark:bg-slate-800 dark:text-white hover:bg-surface-container-low'}`}
            variant="outline"
          >
            {drug}
            {isAiDetected && <span className="material-symbols-outlined text-xs ml-1" title="Detectado por IA OCR">auto_awesome</span>}
            {!isAiDetected && (
              <button
                onClick={() => removeDrug(drug)}
                className="rounded-full bg-red-50 dark:bg-red-900/50 p-0.5 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors ml-1"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {drug}</span>
              </button>
            )}
          </Badge>
          )
        })}
        {allDrugs.length === 0 && (
          <span className="text-on-surface-variant dark:text-slate-500 text-sm italic py-1.5 px-2">Sube una receta médica para extraer componentes...</span>
        )}
      </div>

      {/* Result Cards Conditional UI */}
      {hasChecked && !isStreaming && (
        <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* Combinacion Segura - if NO results found or no high risks found and pairs array exists but is ALL safe */}
          {(!hasHighRisk && (pairs.length > 0 ? pairs.every((p: { status: string }) => p.status === "SAFE") : oldInteractions.length === 0)) && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl flex gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              </div>
              <div>
                <h5 className="font-bold text-emerald-900 dark:text-emerald-300 leading-tight">Múltiple Verificación Aprobada</h5>
                <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-1">
                  Se cruzaron {pairs.length} combinaciones. No se han encontrado interacciones de riesgo.
                </p>
              </div>
            </div>
          )}

          {/* Map through actual interaction pairs results */}
          {pairs.length > 0 ? pairs.map((pair: { status: string; medA: string; medB: string; warning_message: string }, idx: number) => {
            if (pair.status === "SAFE") return null;
            
            const isMajor = pair.status === "HIGH" || pair.status === "DANGER";
            return (
              <div key={idx} className={`${isMajor ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'} border p-4 rounded-xl flex gap-4`}>
                <div className={`${isMajor ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>{isMajor ? 'error' : 'warning'}</span>
                </div>
                <div>
                  <h5 className={`font-bold ${isMajor ? 'text-red-900 dark:text-red-300' : 'text-amber-900 dark:text-amber-300'} leading-tight`}>
                    {isMajor ? 'Interacción Crítica Detectada' : 'Advertencia de Riesgo Moderado'}
                  </h5>
                  <p className={`text-sm ${isMajor ? 'text-red-700 dark:text-red-400/80' : 'text-amber-700 dark:text-amber-400/80'} mt-1`}>
                    <strong>{pair.medA} + {pair.medB}:</strong> {pair.warning_message}
                  </p>
                </div>
              </div>
            )
          }) : null}
          
          {/* Fallback old api mapping backwards compat */}
          {oldInteractions.length > 0 && oldInteractions.map((result: { severity: string; warning_message: string }, idx: number) => (
            <div key={idx}>
              {result.severity === 'HIGH' && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex gap-4">
                  <div className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>error</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-red-900 dark:text-red-300 leading-tight">Interacción Crítica Detectada</h5>
                    <p className="text-sm text-red-700 dark:text-red-400/80 mt-1">
                      {result.warning_message}
                    </p>
                  </div>
                </div>
              )}

              {result.severity !== 'HIGH' && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>warning</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-900 dark:text-amber-300 leading-tight">Advertencia de Duplicidad / Riesgo Menor</h5>
                    <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                      {result.warning_message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>
      )}

    </section>
  );
}
