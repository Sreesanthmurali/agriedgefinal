import React from 'react';
import { X, Download, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { AIResponseCard } from './UI';

export const ResultModal = ({ result, onHide, farmArea, setFarmArea, farmUnit, setFarmUnit, activeFerts, askOrganic, askGuide, askRotation, aiLoading, aiResponse, setAiResponse, lang, t }) => {
  if (!result) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300 print:relative print:inset-auto print:bg-transparent print:backdrop-blur-none print:items-start">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-3xl shadow-2xl p-6 pb-12 max-h-[90vh] overflow-y-auto border-t border-slate-200 dark:border-slate-800 mx-auto print:rounded-none print:shadow-none print:border-none print:max-h-none print:p-0 print:overflow-visible">
        <div className="flex justify-between items-start mb-6 print:mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-5xl bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border border-slate-200 dark:border-slate-700 print:bg-transparent print:border-none">{result.crop.img}</div>
            <div>
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Analysis Result</h3>
              <h2 className="text-2xl font-black dark:text-white print:text-black">{lang === 'en' ? result.crop.nameEN : result.crop.nameML}</h2>
              {!result.isLive && (
                 <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                   <AlertTriangle className="w-3 h-3 mr-1" /> Base Requirement (No Sensor Data)
                 </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2 print:hidden">
            <button onClick={() => window.print()} className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 hover:bg-emerald-200"><Download className="w-6 h-6" /></button>
            <button onClick={onHide} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800"><X className="w-6 h-6" /></button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-700 flex space-x-4 items-end print:border-slate-300">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">{t.area}</label>
            <input type="text" inputMode="numeric" pattern="[0-9]*" value={farmArea} onChange={e => setFarmArea(Math.max(0, e.target.value))} className="w-full text-lg font-bold p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white focus:outline-emerald-500 print:border-slate-300 print:text-black" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">{t.unit}</label>
            <select value={farmUnit} onChange={e => setFarmUnit(e.target.value)} className="w-full text-lg font-bold p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white focus:outline-emerald-500 print:border-slate-300 print:text-black">
              <option value="Cent">Cent</option><option value="Acre">Acre</option><option value="Hectare">Hectare</option>
            </select>
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 print:text-black">{t.fertilizerNeeded}</h4>
        <div className="space-y-3 mb-6">
          {activeFerts.length === 0 ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 p-4 rounded-xl font-medium border border-emerald-200"><span>{t.soilOptimal}</span></div>
          ) : (
            activeFerts.map(fert => (
              <div key={fert.key} className={`flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 ${fert.color} shadow-sm border-t border-r border-b border-slate-100 dark:border-slate-700 print:shadow-none print:border-slate-300`}>
                <span className="font-bold text-slate-700 dark:text-slate-200 print:text-black">{fert.label}</span>
                <span className="font-black text-lg dark:text-white print:text-black">{fert.val} kg</span>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 print:hidden">
          <button onClick={askOrganic} disabled={aiLoading} className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 p-2 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 active:scale-95 transition">
            <Sparkles className="w-5 h-5 mb-1" /><span className="text-[10px] text-center">✨ {t.organicAlt}</span>
          </button>
          <button onClick={askGuide} disabled={aiLoading} className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 p-2 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 active:scale-95 transition">
            <Sparkles className="w-5 h-5 mb-1" /><span className="text-[10px] text-center">✨ {t.aiGuide}</span>
          </button>
          <button onClick={askRotation} disabled={aiLoading} className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 p-2 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 active:scale-95 transition">
            <Sparkles className="w-5 h-5 mb-1" /><span className="text-[10px] text-center">✨ {t.cropRotation}</span>
          </button>
        </div>

        {aiLoading && <div className="flex justify-center p-6 print:hidden"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}
        {aiResponse && !aiLoading && <AIResponseCard text={aiResponse} lang={lang} setAiResponse={setAiResponse} />}
      </div>
    </div>
  );
};
