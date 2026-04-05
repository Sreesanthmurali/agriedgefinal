import React from 'react';
import { X, Wifi, Loader2, FlaskConical, Info, CheckCircle2, Sparkles, AlertTriangle, Download } from 'lucide-react';

export const ConnectModal = ({ show, onHide, espIp, setEspIp, onRealConnect, onMockConnect, isConnecting, t }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black dark:text-white">{t.connectModalTitle}</h2>
          <button onClick={onHide} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onRealConnect} className="space-y-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{t.espIpLabel}</label>
            <input type="text" value={espIp} onChange={(e) => setEspIp(e.target.value)} placeholder="192.168.4.1" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition font-mono text-center" required />
          </div>
          <button type="submit" disabled={isConnecting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl active:scale-95 flex items-center justify-center space-x-2">
            {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wifi className="w-5 h-5" />}<span>{t.connectRealBtn}</span>
          </button>
        </form>
        <button onClick={onMockConnect} disabled={isConnecting} className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:text-white font-bold py-3.5 rounded-2xl active:scale-95 flex items-center justify-center space-x-2">
          <FlaskConical className="w-5 h-5" /><span>{t.connectMockBtn}</span>
        </button>
      </div>
    </div>
  );
};

export const TutorialModal = ({ show, onHide, t }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-center mb-4 space-x-3">
          <div className="bg-emerald-100 dark:bg-emerald-900/50 w-12 h-12 flex items-center justify-center rounded-full"><Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /></div>
          <h2 className="text-xl font-black dark:text-white flex-1">{t.tutorialTitle}</h2>
        </div>
        <div className="overflow-y-auto space-y-4 pr-2 mb-6 scrollbar-hide flex-1 text-left">
          {[{ title: t.tutF1Title, desc: t.tutF1Desc }, { title: t.tutF2Title, desc: t.tutF2Desc }, { title: t.tutF3Title, desc: t.tutF3Desc }].map((f, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">{f.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={onHide} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl active:scale-95 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 shrink-0">
          <CheckCircle2 className="w-6 h-6" /><span>{t.gotIt}</span>
        </button>
      </div>
    </div>
  );
};

export const PredictionModal = ({ list, onHide, onSelect, user, lang, currentSeason, t }) => {
  if (!list) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-emerald-600 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center space-x-2"><Sparkles className="w-5 h-5" /><h3 className="font-bold text-lg">{t.topMatches}</h3></div>
          <button onClick={onHide} className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium text-center">Zone: {user?.elevation} | Season: {currentSeason}</p>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {list.map((crop, index) => (
            <div key={crop.id} className={`flex items-center justify-between p-3 rounded-2xl border-2 ${index === 0 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
              <div className="flex items-center space-x-4">
                <div className="text-4xl bg-white dark:bg-slate-700 w-14 h-14 flex items-center justify-center rounded-xl shadow-sm shrink-0">{crop.img}</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{lang === 'en' ? crop.nameEN : crop.nameML}</h4>
                  <div className="flex flex-col mt-0.5">
                     <span className={`text-xs font-bold w-fit px-2 py-0.5 mb-1 rounded-full ${index === 0 ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>{t.match}: {crop.matchPercent}%</span>
                     <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight pr-2">{crop.reason}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => onSelect(crop)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl active:scale-95 transition shrink-0 ml-2">{t.selectBtn}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
