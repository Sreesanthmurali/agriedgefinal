import React from 'react';
import { Sparkles, X } from 'lucide-react';

export const Gauge = ({ icon: Icon, label, value, max, unit, optimal, color, t }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const isOptimal = value >= optimal[0] && value <= optimal[1];
  return (
    <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm transition-all duration-300 ${isOptimal ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-red-400/30 bg-red-50/50 dark:bg-red-900/10'}`}>
      <Icon className={`w-8 h-8 mb-2 ${color}`} />
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium text-center">{label}</span>
      <div className="flex items-baseline space-x-1 mt-1">
        <span className="text-3xl font-bold dark:text-white">{value}</span>
        <span className="text-sm font-semibold text-slate-400">{unit}</span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${isOptimal ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className={`text-xs mt-2 font-semibold px-2 py-1 rounded-full ${isOptimal ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'}`}>
        {isOptimal ? t.optimal : t.alert}
      </span>
    </div>
  );
};

export const AIResponseCard = ({ text, lang, setAiResponse }) => (
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-emerald-900/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 relative mt-4 animate-in fade-in self-start w-full shadow-sm print:shadow-none print:border-slate-300">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h4 className="font-bold text-emerald-800 dark:text-emerald-300">
          {lang === 'en' ? "Expert System Insight" : "എക്സ്പർട്ട് സിസ്റ്റം വിവരങ്ങൾ"}
        </h4>
      </div>
      <div className="flex items-center space-x-1 print:hidden">
        <button onClick={() => setAiResponse('')} className="text-emerald-600 dark:text-emerald-400 p-1.5 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full transition">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed markdown-body">
       {text}
    </div>
  </div>
);
