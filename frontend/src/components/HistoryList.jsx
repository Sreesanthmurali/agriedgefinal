import React from 'react';
import { History, Clock } from 'lucide-react';

export const HistoryList = ({ history, onViewResult, lang, t }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center space-x-2 mb-4 px-1">
        <History className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xl font-bold dark:text-white">{t.historyTitle}</h2>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
          <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t.historyEmpty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <div key={record.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-all hover:border-emerald-500/50">
              <div className="flex items-center space-x-4">
                <div className="text-3xl bg-slate-100 dark:bg-slate-700 w-12 h-12 flex items-center justify-center rounded-xl shrink-0">
                  {record.crop.img}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">
                    {lang === 'en' ? record.crop.nameEN : record.crop.nameML}
                  </h4>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2 mt-0.5 mb-1.5">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {record.date} {record.time}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => onViewResult(record)} className="bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-2 rounded-xl transition shrink-0 ml-2">
                {t.viewResult}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
