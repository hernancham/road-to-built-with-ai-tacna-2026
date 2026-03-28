"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type InteractionSeverity = 'MAJOR' | 'MODERATE' | 'MINOR';

interface InteractionResult {
  id: string;
  drugs: [string, string];
  severity: InteractionSeverity;
  description: string;
}

// Mock API Call adapted for the current combinations requested
const checkInteractionsMock = async (drugs: string[]): Promise<InteractionResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: InteractionResult[] = [];
      const lowerDrugs = drugs.map(d => d.toLowerCase());

      // Critical interaction case
      if (lowerDrugs.includes('ibuprofeno') && lowerDrugs.includes('enalapril')) {
        results.push({
          id: '1',
          drugs: ['Ibuprofeno', 'Enalapril'],
          severity: 'MAJOR',
          description: 'Riesgo de insuficiencia renal aguda y disminución del efecto antihipertensivo.',
        });
      }

      // Warning interaction case
      if (lowerDrugs.includes('enalapril') && lowerDrugs.includes('lisinopril')) {
        results.push({
          id: '2',
          drugs: ['Enalapril', 'Lisinopril'],
          severity: 'MODERATE',
          description: 'El paciente ya posee una receta activa de un IECA similar. Verifique dosis acumulada.',
        });
      }

      resolve(results);
    }, 1500); // 1.5s delay to mock API check
  });
};

export function SecurityValidator() {
  const [inputValue, setInputValue] = useState("");
  const [drugs, setDrugs] = useState<string[]>([]);
  const [results, setResults] = useState<InteractionResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleAddDrug = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !drugs.includes(trimmed)) {
      setDrugs([...drugs, trimmed]);
      setInputValue("");
      setResults(null);
      setHasChecked(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDrug();
    }
  };

  const removeDrug = (drugToRemove: string) => {
    setDrugs(drugs.filter(d => d !== drugToRemove));
    setResults(null);
    setHasChecked(false);
  };

  const handleCheck = async () => {
    if (drugs.length === 0) return;
    setLoading(true);
    setHasChecked(true);
    try {
      const data = await checkInteractionsMock(drugs);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface-container-high dark:bg-slate-900 p-8 rounded-xl h-full border border-outline-variant/10 dark:border-slate-800">
      <h4 className="font-headline text-lg font-bold mb-6 flex items-center gap-2 text-on-surface dark:text-white">
        <span className="material-symbols-outlined text-primary-brand dark:text-blue-400">security</span>
        Validador de Seguridad
      </h4>

      {/* Search Section */}
      <div className="space-y-4 mb-4">
        <div className="bg-surface-container-lowest dark:bg-slate-800 p-2 rounded-xl flex gap-2 shadow-sm border border-outline-variant/10 dark:border-slate-700 items-center">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 font-medium dark:text-white dark:placeholder:text-slate-500 min-w-0 outline-none"
            placeholder="Buscar medicamento..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleAddDrug}
            className="bg-surface-container dark:bg-slate-700 text-on-surface dark:text-white w-10 h-10 rounded-lg flex items-center justify-center transition-transform active:scale-95 hover:bg-surface-container-highest"
            title="Agregar a la lista"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button
            className="bg-surface-container dark:bg-slate-700 text-on-surface dark:text-white w-10 h-10 rounded-lg flex items-center justify-center transition-transform active:scale-95 hover:bg-surface-container-highest"
            title="Subir Receta/Foto"
          >
            <span className="material-symbols-outlined">add_a_photo</span>
          </button>
          <button
            onClick={handleCheck}
            disabled={loading || drugs.length === 0}
            className="bg-primary-brand text-on-primary px-4 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-10 flex items-center justify-center"
          >
            {loading ? "Verificando..." : "Verificar Interacción"}
          </button>
        </div>
      </div>

      {/* Pill List Section */}
      <div className="flex flex-wrap gap-2 mb-8 min-h-[36px]">
        {drugs.map(drug => (
          <Badge
            key={drug}
            className="text-sm py-1.5 px-3 bg-surface-container-lowest dark:bg-slate-800 dark:text-white text-on-surface gap-2 font-medium shadow-sm transition-all border border-outline-variant/20 hover:bg-surface-container-low"
            variant="outline"
          >
            {drug}
            <button
              onClick={() => removeDrug(drug)}
              className="rounded-full bg-red-50 dark:bg-red-900/50 p-0.5 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors ml-1"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {drug}</span>
            </button>
          </Badge>
        ))}
        {drugs.length === 0 && (
          <span className="text-on-surface-variant dark:text-slate-500 text-sm italic py-1.5 px-2">Aún no hay medicamentos en la lista...</span>
        )}
      </div>

      {/* Result Cards Conditional UI */}
      {hasChecked && !loading && (
        <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* Combinacion Segura - if NO results found */}
          {(!results || results.length === 0) && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl flex gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              </div>
              <div>
                <h5 className="font-bold text-emerald-900 dark:text-emerald-300 leading-tight">Combinación Segura</h5>
                <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-1">
                  No se han encontrado interacciones conocidas entre los medicamentos actuales.
                </p>
              </div>
            </div>
          )}

          {/* Map through actual interaction results */}
          {results && results.map((result) => (
            <div key={result.id}>
              {result.severity === 'MAJOR' && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex gap-4">
                  <div className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>error</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-red-900 dark:text-red-300 leading-tight">Interacción Crítica Detectada</h5>
                    <p className="text-sm text-red-700 dark:text-red-400/80 mt-1">
                      <strong>{result.drugs.join(' + ')}:</strong> {result.description}
                    </p>
                  </div>
                </div>
              )}

              {result.severity !== 'MAJOR' && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>warning</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-900 dark:text-amber-300 leading-tight">Advertencia de Duplicidad / Riesgo Menor</h5>
                    <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                      {result.description}
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
