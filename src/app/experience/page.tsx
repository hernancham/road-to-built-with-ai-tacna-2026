'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ExperiencePage() {
    const [conditions, setConditions] = useState({
        hipertension: true,
        diabetes: false,
        alergia: true,
    });

    const toggleCondition = (key: keyof typeof conditions) => {
        setConditions((prev) => ({ ...prev, [key]: !prev[key] }));
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

            {/* Navigation Drawer / Portal Switcher */}
            <nav className="flex px-6 py-2 bg-surface-container-low overflow-x-auto gap-4 scrollbar-hide">
                <button className="bg-primary-container text-white rounded-lg px-4 py-2 text-sm font-headline tracking-wide uppercase whitespace-nowrap">
                    Portal del Paciente
                </button>
                <button className="text-on-surface-variant px-4 py-2 text-sm font-headline tracking-wide uppercase whitespace-nowrap hover:bg-surface-container transition-colors rounded-lg">
                    Portal de Farmacia
                </button>
            </nav>

            <main className="px-6 py-8 space-y-8 max-w-2xl mx-auto">
                {/* Alergias y Condiciones Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-on-surface font-headline font-bold text-xl tracking-tight">Condiciones Médicas y Alergias</h2>
                        <button className="h-14 w-14 rounded-full bg-tertiary-container text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </button>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-6 space-y-4 shadow-sm">
                        {/* Condition Items */}
                        {[
                            { id: 'hipertension', label: 'Hipertensión' },
                            { id: 'diabetes', label: 'Diabetes' },
                            { id: 'alergia', label: 'Alergia Penicilina' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2">
                                <span className="font-medium text-on-surface">{item.label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={conditions[item.id as keyof typeof conditions]}
                                        onChange={() => toggleCondition(item.id as keyof typeof conditions)}
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
                    <div className="relative group cursor-pointer overflow-hidden rounded-xl bg-surface-container-low aspect-video flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-5xl text-primary-brand mb-2">upload_file</span>
                        <p className="font-bold text-primary-brand font-headline">Sube tu Receta</p>
                        <p className="text-xs text-on-surface-variant mt-1">Formatos: JPG, PNG, PDF</p>
                    </div>
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
                                <tr>
                                    <td className="px-4 py-4 font-semibold text-on-surface">Lizinopril</td>
                                    <td className="px-4 py-4 text-on-surface">10mg</td>
                                    <td className="px-4 py-4">
                                        <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded-full font-bold">ACTIVO</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-4 font-semibold text-on-surface">Metformina</td>
                                    <td className="px-4 py-4 text-on-surface">500mg</td>
                                    <td className="px-4 py-4">
                                        <span className="bg-surface-container text-on-surface-variant text-[10px] px-2 py-1 rounded-full font-bold">PENDIENTE</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Generar PIN Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-on-surface font-headline font-bold text-xl tracking-tight">Seguridad: PIN Farmacia</h2>
                        <button className="h-14 w-14 rounded-full bg-primary-brand text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </button>
                    </div>
                    <div className="bg-primary-container p-8 rounded-xl flex flex-col items-center text-center space-y-4">
                        <span className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase">Tu Código de Acceso</span>
                        <div className="flex gap-4">
                            {['4', '2', '9', '1'].map((num, i) => (
                                <span key={i} className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-widest bg-white/20 px-4 py-2 rounded-lg">
                                    {num}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Activo (Vence en 04:59)
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
