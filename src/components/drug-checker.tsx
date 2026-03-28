"use client";

import { useState } from "react";
import { X, Search, AlertTriangle, ArrowRightLeft, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

type InteractionSeverity = 'MAJOR' | 'MODERATE' | 'MINOR';

interface InteractionResult {
  id: string;
  drugs: [string, string];
  severity: InteractionSeverity;
  description: string;
  extendedDescription: string;
  references: string[];
}

// Mock API Call
const checkInteractionsMock = async (drugs: string[]): Promise<InteractionResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: InteractionResult[] = [];
      const lowerDrugs = drugs.map(d => d.toLowerCase());
      
      if (lowerDrugs.includes('isotretinoin') && lowerDrugs.includes('doxycycline')) {
        results.push({
          id: '1',
          drugs: ['Isotretinoin', 'Doxycycline'],
          severity: 'MAJOR',
          description: 'The risk or severity of pseudotumor cerebri can be increased when Isotretinoin is combined with Doxycycline.',
          extendedDescription: 'Tetracycline antibiotics are associated with a risk of increased intracranial pressure (i.e. pseudotumor cerebri) when used as monotherapy. Tetracycline itself appears to carry the greatest risk, although minocycline and doxycycline have also been implicated.',
          references: ['1. Digre KB: Not so benign intracranial hypertension. BMJ. 2003 Mar 22;326(7390):613-4.']
        });
      }

      if (lowerDrugs.includes('calcium carbonate') && lowerDrugs.includes('doxycycline')) {
        results.push({
          id: '2',
          drugs: ['Calcium carbonate', 'Doxycycline'],
          severity: 'MODERATE',
          description: 'Calcium carbonate can cause a decrease in the absorption of Doxycycline resulting in a reduced serum concentration and potentially a decrease in efficacy.',
          extendedDescription: 'The absorption of tetracyclines from the gastrointestinal tract is impaired by the concomitant administration of di- and tri-valent cations such as iron, calcium, aluminum, magnesium, bismuth and zinc salts.',
          references: ['1. Albert KS, Welch RD, DeSante KA, DiSanto AR: Decreased tetracycline bioavailability caused by a bismuth subsalicylate antidiarrheal mixture. J Pharm Sci. 1979 May;68(5):586-8.']
        });
      }
      resolve(results);
    }, 1500); // 1.5s delay
  });
};

export function DrugChecker() {
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
    if (drugs.length < 2) return;
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

  const clearAll = () => {
    setDrugs([]);
    setInputValue("");
    setResults(null);
    setHasChecked(false);
  };

  const loadExample = () => {
    setDrugs(['Doxycycline', 'Isotretinoin', 'Calcium carbonate']);
    setResults(null);
    setHasChecked(false);
  };

  const getSeverityColor = (severity: InteractionSeverity) => {
    switch (severity) {
      case 'MAJOR': return 'bg-pink-700 hover:bg-pink-800 text-white';
      case 'MODERATE': return 'bg-rose-400 hover:bg-rose-500 text-white';
      case 'MINOR': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* SECTION 1: Searching & Adding */}
      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        {/* Left Col: Search Box */}
        <div className="bg-slate-900 dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-slate-800">
          <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
            Add Drug to Check for Interactions
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Ex. Tylenol, Doxycycline..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 h-12 text-lg rounded-full border-none shadow-inner"
              />
            </div>
            <Button 
              onClick={handleAddDrug} 
              className="h-12 px-6 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-medium shadow-md transition-all"
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-6 min-h-[48px]">
            {drugs.map(drug => (
              <Badge 
                key={drug} 
                variant="secondary"
                className="text-sm py-1.5 px-3 bg-white hover:bg-gray-100 text-slate-800 gap-2 font-medium shadow-sm transition-all"
              >
                {drug}
                <button 
                  onClick={() => removeDrug(drug)}
                  className="rounded-full bg-pink-100 p-0.5 text-pink-600 hover:bg-pink-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {drug}</span>
                </button>
              </Badge>
            ))}
            {drugs.length === 0 && (
              <span className="text-gray-400 text-sm italic py-1.5">No drugs added yet...</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Button 
              onClick={handleCheck} 
              disabled={drugs.length < 2 || loading}
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 font-bold text-base h-11"
            >
              {loading ? "Checking..." : "Check Interactions"}
            </Button>
            <Button onClick={clearAll} variant="outline" className="rounded-full h-11 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
              Clear
            </Button>
            <Button onClick={loadExample} variant="link" className="text-pink-400 hover:text-pink-300">
              Load Example
            </Button>
          </div>
        </div>

        {/* Right Col: Banner */}
        <div className="bg-gradient-to-br from-indigo-900 to-fuchsia-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3 leading-tight">Get more from our checker!</h3>
            <p className="text-sm text-indigo-100 mb-6 leading-relaxed opacity-90">
              This interaction checker is limited. Our commercial drug interaction API integrates into your software, giving your users full access to the best drug data.
            </p>
            <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full border-none shadow-lg group">
              LEARN MORE
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          {/* Subtle bg decoration */}
          <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
            <AlertTriangle className="w-48 h-48" />
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      <Alert className="border-pink-200 bg-pink-50 text-pink-900 dark:border-pink-900/50 dark:bg-pink-950/20 dark:text-pink-200 rounded-xl">
        <AlertTriangle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
        <AlertDescription className="ml-2 mt-0.5">
          <span className="font-bold">Warning:</span> If no interactions are found between two drugs, it does not necessarily mean that no interactions exist. Always consult with a healthcare professional.
        </AlertDescription>
      </Alert>

      {/* SECTION 2: Results List */}
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
          Interactions Found
          {loading && <span className="text-sm font-normal text-gray-500 animate-pulse">(checking...)</span>}
        </h2>

        {hasChecked && !loading && (!results || results.length === 0) && (
          <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100 dark:bg-zinc-800/50 dark:border-zinc-800">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No specific interactions found</h3>
            <p className="text-gray-500">We couldn&apos;t find major interactions in our database for the provided combination.</p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-6">
            
            {/* Headers for results layout (Desktop only) */}
            <div className="hidden md:grid grid-cols-[1fr_120px_2fr] gap-6 px-6 text-xs font-bold text-gray-500 tracking-wider">
              <span>DRUGS</span>
              <span className="text-center">SEVERITY</span>
              <span>DESCRIPTION</span>
            </div>

            {results.map((result) => (
              <Card key={result.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800">
                <CardContent className="p-0">
                  {/* Top row: Drugs, Severity, Desc */}
                  <div className="grid md:grid-cols-[1fr_120px_2fr] gap-y-4 gap-x-6 p-6 items-center">
                     {/* Drugs */}
                    <div className="flex items-center justify-between md:justify-start gap-4 font-bold text-gray-900 dark:text-gray-100 text-lg">
                      <span>{result.drugs[0]}</span>
                      <ArrowRightLeft className="h-5 w-5 text-pink-500 flex-shrink-0" />
                      <span>{result.drugs[1]}</span>
                    </div>

                    {/* Severity */}
                    <div className="flex justify-start md:justify-center">
                      <Badge className={`rounded-full px-3 py-1 text-xs font-bold ${getSeverityColor(result.severity)}`}>
                        {result.severity}
                      </Badge>
                    </div>

                    {/* Short Description */}
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {result.description}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-zinc-800" />

                  {/* Details section */}
                  <div className="bg-gray-50/50 dark:bg-zinc-900/30 p-6 space-y-4 text-sm">
                    <div className="grid md:grid-cols-[150px_1fr] gap-4">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase">Extended Description</span>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {result.extendedDescription} <span className="text-pink-600 font-semibold cursor-pointer hover:underline">READ MORE</span>
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-[150px_1fr] gap-4">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase">References</span>
                      <div className="text-gray-600 dark:text-gray-400">
                        {result.references.map((ref, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <p>{ref} [<span className="text-cyan-600 hover:underline cursor-pointer">Article</span>]</p>
                            <span className="text-pink-600 font-semibold cursor-pointer hover:underline text-right whitespace-nowrap">READ MORE</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
