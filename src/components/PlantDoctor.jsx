import React from 'react';
import { Loader2, Send } from 'lucide-react';
import { AIResponseCard } from './UI';

export const PlantDoctor = ({ chatQuery, setChatQuery, onSubmit, aiLoading, aiResponse, setAiResponse, chatEndRef, pestsDB, lang, t }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] animate-in fade-in duration-500">
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-4 overflow-y-auto flex flex-col space-y-4 scrollbar-hide">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%] shadow-sm">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {lang === 'en' ? "Hello! I am your local Expert System. Describe the symptoms on your crops (e.g., 'Yellow spots on paddy leaves'), and I will suggest organic remedies." : "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ലോക്കൽ എക്സ്പർട്ട് സിസ്റ്റം ആണ്. വിളകളുടെ ലക്ഷണങ്ങൾ വിവരിക്കുക, ഞാൻ ജൈവ പ്രതിവിധികൾ നിർദ്ദേശിക്കാം."}
          </p>
        </div>
        {aiLoading && (
          <div className="self-start bg-slate-100 dark:bg-slate-700 p-4 rounded-2xl rounded-tl-sm flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /><span className="text-sm text-slate-500">Analyzing symptoms...</span>
          </div>
        )}
        {aiResponse && !aiLoading && <AIResponseCard text={aiResponse} lang={lang} setAiResponse={setAiResponse} />}
        <div ref={chatEndRef} />
      </div>
      
      <div className="relative shrink-0">
        <div className="flex overflow-x-auto pb-2 mb-2 space-x-2 scrollbar-hide pr-8">
          {pestsDB.map(pest => (
            <button key={pest.id} onClick={() => setChatQuery(lang === 'en' ? pest.nameEN : pest.nameML)} className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 rounded-full text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-800 transition">
              {lang === 'en' ? pest.nameEN : pest.nameML}
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent pointer-events-none" />
      </div>

      <form onSubmit={onSubmit} className="flex space-x-2 shrink-0 pb-20">
        <input type="text" value={chatQuery} onChange={(e) => setChatQuery(e.target.value)} placeholder={t.askDoctor} className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white shadow-sm" />
        <button type="submit" disabled={aiLoading || !chatQuery.trim()} className="bg-emerald-600 text-white p-3 rounded-2xl shadow-md disabled:opacity-50 transition active:scale-95"><Send className="w-6 h-6" /></button>
      </form>
    </div>
  );
};
