'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function ExperiencePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [conditions, setConditions] = useState([
        { id: 'hipertension', label: 'Hipertensión', checked: true },
        { id: 'diabetes', label: 'Diabetes', checked: false },
        { id: 'alergia', label: 'Alergia Penicilina', checked: true },
    ]);

    const [pin, setPin] = useState(['4', '2', '9', '1']);
    const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { messages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

    const isStreaming = status === "streaming" || status === "submitted";

    const lastMedicationsTool = messages
        .flatMap((m) => m.parts)
        .filter((p) => p.type === "tool-showDetectedMedications")
        .pop();
        
    // @ts-expect-error AI SDK tool typing
    const detectedMedications = lastMedicationsTool?.state === "output-available" ? lastMedicationsTool.output.matched : [];

    const lastInteractionsTool = messages
        .flatMap((m) => m.parts)
        .filter((p) => p.type === "tool-checkInteractions")
        .pop();

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleCondition = (id: string) => {
        setConditions((prev) => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
    };

    const handleAddCondition = () => {
        const newCondition = prompt("Ingrese la nueva condición médica o alergia:");
        if (newCondition && newCondition.trim()) {
            setConditions([...conditions, { 
                id: Date.now().toString(), 
                label: newCondition.trim(), 
                checked: true 
            }]);
        }
    };

    const handleGeneratePin = () => {
        const newPin = Array.from({length: 4}, () => Math.floor(Math.random() * 10).toString());
        setPin(newPin);
        setTimeLeft(300);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
           const file = e.target.files[0];
           const url = URL.createObjectURL(file);
           setPreviewImage(url);
           
           sendMessage({
               text: "Por favor extrae los medicamentos de esta receta médica.",
               files: e.target.files,
           });
        }
    };

    const handleCheckInteractions = () => {
        const activeConditions = conditions.filter(c => c.checked).map(c => c.label);
        const parsedMeds = detectedMedications.map((m: { trade_name?: string; db_info?: { active_ingredient?: string } }) => m.trade_name || m.db_info?.active_ingredient).filter(Boolean);
        
        const medsStr = parsedMeds.length > 0 ? parsedMeds.join(', ') : 'los medicamentos listados';
        const condStr = activeConditions.length > 0 ? `Mis condiciones actuales son: ${activeConditions.join(', ')}.` : '';
        
        sendMessage({
            text: `Por favor analiza las interacciones de los siguientes medicamentos farmacéuticos: ${medsStr}. ${condStr} Dame posibles advertencias o contraindicaciones.`
        });
    };

    return (
        <div className="bg-background-dashboard text-on-background-dashboard min-h-screen pb-24 font-sans">
            {/* TopAppBar */}
            <header className="bg-background-dashboard fixed top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container text-3xl">health_and_safety</span>
                    <span className="text-primary-brand font-extrabold tracking-tighter text-2xl font-headline">GoodPills</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
                    <img
                        className="h-full w-full object-cover"
                        alt="professional medical clinician"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAedAEFivVxEFPnQylPHrApPZKyFwvFKrK1YUNSdRz7BBS6XB9-H5aty5YVCsQelqIYhnVB9nRFYjSR9vJZy3Y5o4v_Iz44kaUNxfOzIcwCsihYLXaL-L1rBLh8T5lQ4ruC1DM4MjkS5swpub0m4ehfF5jAaClvBHobBNNL8Lgg-Q92bEDtURHDmNhyMaYYEIsIw26bQ1YkNyaL8aN5Rcg33kCPH6T_hzmZXrdDJcHZyBKKxGDdxkoD-aySRB5fZVAwGSseMNYHCS9y"
                    />
                </div>
            </header>

            <div className="h-20" /> {/* Spacer for fixed header */}

            <nav className="flex px-6 py-2 bg-surface-container-low overflow-x-auto gap-4 scrollbar-hide">
                <button className="bg-primary-container text-white rounded-lg px-4 py-2 text-sm font-headline tracking-wide uppercase whitespace-nowrap">
                    Portal del Paciente
                </button>
                <button onClick={() => router.push('/dashboard')} className="text-on-surface-variant px-4 py-2 text-sm font-headline tracking-wide uppercase whitespace-nowrap hover:bg-surface-container transition-colors rounded-lg">
                    Portal de Farmacia
                </button>
            </nav>

            <main className="px-6 py-8 space-y-8 max-w-2xl mx-auto">
                {/* Alergias y Condiciones Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-on-surface font-headline font-bold text-xl tracking-tight">Condiciones Médicas y Alergias</h2>
                        <button onClick={handleAddCondition} className="h-14 w-14 rounded-full bg-tertiary-container text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform" title="Añadir Condición">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </button>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-6 space-y-4 shadow-sm">
                        {/* Condition Items */}
                        {conditions.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2">
                                <span className="font-medium text-on-surface">{item.label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={item.checked}
                                        onChange={() => toggleCondition(item.id)}
                                    />
                                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-brand"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mis Recetas Section */}
                <section className="space-y-6">
                    <h2 className="text-on-surface font-headline font-bold text-xl tracking-tight">Mis Recetas Actuales</h2>
                    <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/png, image/jpeg, application/pdf"
                       onChange={handleFileUpload} 
                    />
                    {previewImage ? (
                        <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer overflow-hidden rounded-xl bg-surface-container-low aspect-video border-2 border-dashed border-outline-variant hover:border-primary-brand transition-all">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={previewImage} alt="Receta subida" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all backdrop-blur-sm">
                                 <span className="material-symbols-outlined text-white text-3xl mb-2">swap_horiz</span>
                                 <p className="font-bold text-white text-sm">Cambiar Receta</p>
                             </div>
                        </div>
                    ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer overflow-hidden rounded-xl bg-surface-container-low aspect-video flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary-brand hover:bg-surface-container transition-all">
                            <span className="material-symbols-outlined text-5xl text-primary-brand mb-2 group-hover:scale-110 transition-transform">upload_file</span>
                            <p className="font-bold text-primary-brand font-headline">Sube tu Receta</p>
                            <p className="text-xs text-on-surface-variant mt-1">Formatos: JPG, PNG, PDF</p>
                        </div>
                    )}
                    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="px-4 py-3">Medicamento</th>
                                    <th className="px-4 py-3">Dosis</th>
                                    <th className="px-4 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container text-sm">
                                {detectedMedications.length > 0 ? (
                                    detectedMedications.map((med: { trade_name?: string; dosage?: string; db_info?: { active_ingredient?: string }; is_known?: boolean }, i: number) => (
                                        <tr key={i}>
                                            <td className="px-4 py-4 font-semibold text-on-surface">{med.trade_name}</td>
                                            <td className="px-4 py-4 text-on-surface">{med.dosage || med.db_info?.active_ingredient || "-"}</td>
                                            <td className="px-4 py-4">
                                                <span className={`${med.is_known ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface-variant"} text-[10px] px-2 py-1 rounded-full font-bold`}>
                                                    {med.is_known ? 'VALIDADO' : 'PENDIENTE'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-on-surface-variant">
                                            {isStreaming ? (
                                                <div className="flex flex-col items-center justify-center gap-2 text-primary-brand">
                                                    <span className="material-symbols-outlined animate-spin text-3xl">cycle</span>
                                                    <p className="font-bold text-xs mt-2 uppercase tracking-widest">Analizando Receta...</p>
                                                </div>
                                            ) : (
                                                <p>No hay medicamentos procesados.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {detectedMedications.length > 0 && (
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleCheckInteractions} className="bg-primary-container text-primary-brand px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-xl">policy</span>
                                Analizar mis condiciones con esta receta
                            </button>
                        </div>
                    )}
                </section>

                {/* Interacciones Section */}
                {lastInteractionsTool && (
                    <section className="space-y-6">
                        <h2 className="text-on-surface font-headline font-bold text-xl tracking-tight">Análisis de Seguridad Integral</h2>
                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm p-6 space-y-4">
                            {/* @ts-expect-error AI SDK */}
                            {lastInteractionsTool.state === "output-available" ? (
                                <div className="space-y-4">
                                 {/* @ts-expect-error AI SDK */}
                                 {lastInteractionsTool.output.pairs?.map((pair: { status: string; medA: string; medB: string; warning_message: string }, i: number) => (
                                     <div key={`pair-${i}`} className={`p-4 rounded-lg flex gap-3 ${pair.status === 'Contraindicated' || pair.status === 'High Risk' ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface'}`}>
                                         <span className="material-symbols-outlined mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                                             {pair.status === 'Contraindicated' || pair.status === 'High Risk' ? 'error' : 'info'}
                                         </span>
                                         <div>
                                             <p className="font-bold text-sm">{pair.medA} + {pair.medB}</p>
                                             <p className="text-xs opacity-90 mt-1">{pair.warning_message}</p>
                                         </div>
                                     </div>
                                 ))}
                                 {/* @ts-expect-error AI SDK */}
                                 {lastInteractionsTool.output.interactions?.map((interaction: { severity: string; warning_message: string }, i: number) => (
                                     <div key={`int-${i}`} className={`p-4 rounded-lg flex gap-3 ${interaction.severity === 'Severe' || interaction.severity === 'High Risk' ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface'}`}>
                                         <span className="material-symbols-outlined mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                                             {interaction.severity === 'Severe' || interaction.severity === 'High Risk' ? 'error' : 'info'}
                                         </span>
                                         <div>
                                             <p className="font-bold text-sm">Advertencia General</p>
                                             <p className="text-xs opacity-90 mt-1">{interaction.warning_message}</p>
                                         </div>
                                     </div>
                                 ))}
                                 {/* @ts-expect-error AI SDK */}
                                 {(!lastInteractionsTool.output.pairs?.length && !lastInteractionsTool.output.interactions?.length) && (
                                     <div className="p-4 rounded-lg flex items-center gap-3 bg-secondary-container text-on-secondary-container">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        <p className="text-sm font-bold">Excelente. No se han encontrado contraindicaciones severas con tus condiciones actuales.</p>
                                     </div>
                                 )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8">
                                   <span className="material-symbols-outlined animate-spin text-4xl mb-3 text-primary-brand">sync</span>
                                   <p className="text-sm font-bold tracking-wide uppercase">Evaluando interacciones farmacológicas...</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Generar PIN Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-on-surface font-headline font-bold text-xl tracking-tight">Seguridad: PIN Farmacia</h2>
                        <button onClick={handleGeneratePin} className="h-14 w-14 rounded-full bg-primary-brand text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform" title="Generar Nuevo PIN">
                            <span className="material-symbols-outlined text-3xl">refresh</span>
                        </button>
                    </div>
                    <div className="bg-primary-container p-8 rounded-xl flex flex-col items-center text-center space-y-4 transition-all">
                        <span className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase">Tu Código de Acceso</span>
                        <div className="flex gap-4">
                            {pin.map((num, i) => (
                                <span key={i} className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-widest bg-white/20 px-4 py-2 rounded-lg shadow-inner">
                                    {num}
                                </span>
                            ))}
                        </div>
                        <div className={`flex items-center gap-2 ${timeLeft > 0 ? "bg-secondary text-white" : "bg-error text-white"} px-3 py-1 rounded-full text-xs font-bold transition-colors`}>
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {timeLeft > 0 ? "check_circle" : "cancel"}
                            </span>
                            {timeLeft > 0 ? `Activo (Vence en ${formatTime(timeLeft)})` : "PIN Vencido"}
                        </div>
                    </div>
                </section>
            </main>

            {/* BottomNavBar */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-md shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-t border-outline-variant/20">
                <div className="flex flex-col items-center justify-center bg-surface-container text-primary-brand rounded-xl px-4 py-1">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider mt-1">Inicio</span>
                </div>
                <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined">medication</span>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider mt-1">Recetas</span>
                </div>
                <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined">warning</span>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider mt-1">Alertas</span>
                </div>
                <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined">account_circle</span>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider mt-1">Perfil</span>
                </div>
            </nav>
        </div>
    );
}
