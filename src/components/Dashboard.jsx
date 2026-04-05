import React from 'react';
import { Wifi, Loader2, Sparkles, Droplets, FlaskConical, TestTube, ThermometerSun } from 'lucide-react';
import { Gauge, AIResponseCard } from './UI';

export const Dashboard = ({ connected, isConnecting, onShowConnect, sensors, onAnalyze, isAnalyzing, askSoilReport, aiLoading, aiResponse, setAiResponse, lang, t }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!connected ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-4 shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mb-4"><Wifi className="w-10 h-10 text-slate-400" /></div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{t.connectFirst}</h3>
          <p className="text-sm text-slate-500 mb-6">{t.connectDesc}</p>
          <button onClick={onShowConnect} disabled={isConnecting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition active:scale-95 flex items-center justify-center space-x-2">
            {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}<span>{isConnecting ? t.connecting : 'Connect Now'}</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Gauge icon={Droplets} label="Moisture" value={sensors.moisture} max={100} unit="%" optimal={[40, 80]} color="text-blue-500" t={t} />
            <Gauge icon={FlaskConical} label="pH Level" value={sensors.pH} max={14} unit="" optimal={[5.5, 7.5]} color="text-fuchsia-500" t={t} />
            <Gauge icon={TestTube} label="Nitrogen (N)" value={sensors.N} max={250} unit="kg/ha" optimal={[50, 200]} color="text-green-500" t={t} />
            <Gauge icon={TestTube} label="Phosphorus (P)" value={sensors.P} max={150} unit="kg/ha" optimal={[30, 100]} color="text-orange-500" t={t} />
            <Gauge icon={TestTube} label="Potassium (K)" value={sensors.K} max={400} unit="kg/ha" optimal={[50, 300]} color="text-purple-500" t={t} />
            <Gauge icon={ThermometerSun} label="Temperature" value={sensors.temp} max={50} unit="°C" optimal={[20, 35]} color="text-red-500" t={t} />
          </div>
          
          <button onClick={onAnalyze} disabled={isAnalyzing} className="w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/25">
            {isAnalyzing ? <><Loader2 className="w-6 h-6 animate-spin" /><span>{t.predicting}</span></> : <><Sparkles className="w-6 h-6" /><span>{t.analyzeSoil}</span></>}
          </button>

          <div className="mt-4">
            <button onClick={askSoilReport} disabled={aiLoading} className="w-full bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 p-4 rounded-xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition border border-teal-200 dark:border-teal-800 shadow-sm">
              <Sparkles className="w-6 h-6" /><span className="text-sm">✨ {t.soilReport}</span>
            </button>
          </div>
        </>
      )}
      {aiResponse && !aiLoading && <AIResponseCard text={aiResponse} lang={lang} setAiResponse={setAiResponse} />}
    </div>
  );
};
