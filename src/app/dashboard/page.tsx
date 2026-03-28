"use client";

import { useState } from 'react';
import { SecurityValidator } from '@/components/security-validator';

export default function DashboardPage() {
  const [pin, setPin] = useState('');

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
            <button className="bg-gradient-to-br from-primary-brand to-primary-container text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-brand/20">
              <span className="material-symbols-outlined">search</span>
              Buscar Cliente
            </button>
          </div>
          <p className="mt-4 text-sm text-on-surface-variant dark:text-slate-400 italic">Solicite el PIN de 6 dígitos generado en la App del Paciente</p>
        </div>
      </section>

      {/* Active Dashboard State */}
      <div className="grid grid-cols-12 gap-8 mb-24">
        {/* Header Card: Customer Profile */}
        <div className="col-span-12">
          <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl flex items-center justify-between shadow-sm border-l-8 border-secondary dark:border-teal-500 border-y border-r border-outline-variant/10 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container dark:bg-slate-800">
                <img className="w-full h-full object-cover" alt="Patient" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATz20NI_ml_2Nol5JHldp-7rkFce2CsUwcJ_0kclGn-xDETo8kyxXmuD3sRCNRj1jpf0iAIN4HPCvqn5wnb8U7HwXnSTy6O29TyjgAwqYeUwD21l1sq4Y4-B3ARTxbHzt5-TDRVDj0J21AsyuymcXO-XTrYAgu-d90V59Nt_vrecn-_GQfxhDS7z_U_mwzTRE3tQGiouyNpCw5gJ6F1lEiWFSLvvVSNqaO_2Vx9Ij913vMEn8gZl4WiWxXiAWZ1dleMyPorcrOnatv" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface dark:text-white">Juan Pérez</h2>
                  <span className="bg-secondary/10 dark:bg-teal-500/10 text-secondary dark:text-teal-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                    VÁLIDA
                  </span>
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
                  <span className="bg-tertiary-container/20 dark:bg-red-500/20 text-tertiary dark:text-red-400 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">medical_information</span>
                    Hipertensión
                  </span>
                  <span className="bg-tertiary-container/20 dark:bg-red-500/20 text-tertiary dark:text-red-400 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">warning</span>
                    Alergia a la Penicilina
                  </span>
                  <span className="bg-secondary-container/30 dark:bg-teal-500/20 text-secondary dark:text-teal-400 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Diabetes Tipo 2 (Controlada)
                  </span>
                </div>
              </div>

              {/* Receta Actual Card */}
              <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-outline-variant/10 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xs font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-widest">Receta Actual (ID: #RX-9920)</p>
                  <span className="text-xs bg-surface-container dark:bg-slate-800 px-2 py-1 rounded font-bold text-on-surface-variant dark:text-slate-400">OCR VERIFIED</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <div className="relative group cursor-zoom-in rounded-lg overflow-hidden border border-outline-variant/30 dark:border-slate-700">
                      <img className="w-full h-48 object-cover group-hover:scale-110 transition-transform" alt="Prescription" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLwleLxcq06uYFWRMPOmKO7Zx6gmM-9_3zlXEO9_4idKbpXLflrLHu3r7r6JQPMX6S4_wZ_WTsh5on3nhS7tT41vmN76CVDvsuoyXyST29kNJRyw5gPClxKt4iYGo5NweYhUXpAgLoZbH-fOxigoUaGTKDfF8IE0lS9i79PTQ7ectV7RpvwCUJbf1RKMcmK0IdBNC908pld4dtIeO4oFqLvqjWPyuc0RYfP5a7jt4ixYmgCKOnz4Y9L8aRdLVYU1UtPoqiydbO_CTw" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-outline dark:text-slate-400 border-b border-outline-variant/20 dark:border-slate-800">
                          <th className="text-left pb-2 font-medium">Medicamento</th>
                          <th className="text-left pb-2 font-medium">Dosis</th>
                          <th className="text-right pb-2 font-medium">Cant.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                        <tr>
                          <td className="py-3 font-bold dark:text-white">Enalapril 10mg</td>
                          <td className="py-3 dark:text-slate-300">1 cada 12hs</td>
                          <td className="py-3 text-right dark:text-slate-300">30</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-bold dark:text-white">Metformina 850mg</td>
                          <td className="py-3 dark:text-slate-300">1 con almuerzo</td>
                          <td className="py-3 text-right dark:text-slate-300">60</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="mt-4 pt-4 border-t border-outline-variant/20 dark:border-slate-800 flex justify-end">
                      <button className="text-primary-container dark:text-blue-400 font-bold text-sm flex items-center gap-2 hover:opacity-80">
                        <span className="material-symbols-outlined text-sm">edit</span> Editar lectura OCR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Column 2: Validador de Seguridad -> New Custom Component */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          <SecurityValidator />
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-8 right-8 left-[calc(16rem+2rem)] z-40">
        <div className="glass-card dark:bg-slate-900/80 p-4 rounded-2xl shadow-xl border border-white/40 dark:border-slate-700/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-secondary dark:text-teal-400" style={{ fontVariationSettings: '"FILL" 1' }}>shopping_cart_checkout</span>
            <div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">Resumen de Venta</p>
              <p className="text-lg font-bold text-on-surface dark:text-white">2 Medicamentos Seleccionados</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-container-high dark:bg-slate-800 text-on-surface dark:text-white px-6 py-3 rounded-lg font-bold hover:bg-surface-container-highest dark:hover:bg-slate-700 transition-colors">
              Cancelar
            </button>
            <button className="bg-gradient-to-br from-primary-brand to-primary-container text-on-primary px-10 py-3 rounded-lg font-bold shadow-lg shadow-primary-brand/20 hover:opacity-90 active:scale-95 transition-all">
              Confirmar & Dispensar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
