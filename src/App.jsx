import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Leaf, LayoutDashboard, Sprout, Stethoscope, History, 
  Sun, Moon, Languages, LogOut, ArrowRight, User, MapPin, Activity
} from 'lucide-react';

// Data & Utils
import { cropsDB } from './data/crops';
import { pestsDB } from './data/pests';
import { i18n } from './data/translations';
import { districts, elevations, categories, getSeason } from './data/constants';
import { 
  dbSaveUser, dbGetUser, dbClearUser, 
  dbSaveHistory, dbGetHistory, dbClearHistory 
} from './utils/db';

// Components
import { Dashboard } from './components/Dashboard';
import { CropList } from './components/CropList';
import { PlantDoctor } from './components/PlantDoctor';
import { HistoryList } from './components/HistoryList';
import { ResultModal } from './components/ResultModal';
import { ConnectModal, TutorialModal, PredictionModal } from './components/Modals';

export default function App() {
  // UI State
  const [lang, setLang] = useState('en');
  const [languageSelected, setLanguageSelected] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // User State
  const [user, setUser] = useState(null); 
  const [loginForm, setLoginForm] = useState({ name: '', phone: '', district: 'Ernakulam', elevation: 'Midland' });
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Sensor State
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [espIp, setEspIp] = useState('192.168.4.1');
  const [connected, setConnected] = useState(false);
  const [connectionType, setConnectionType] = useState('none'); 
  const [isConnecting, setIsConnecting] = useState(false);
  const [sensors, setSensors] = useState({ pH: 0, N: 0, P: 0, K: 0, temp: 0, moisture: 0 });
  const [pollIntervalId, setPollIntervalId] = useState(null);
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionList, setPredictionList] = useState(null); 
  const [resultModal, setResultModal] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [farmArea, setFarmArea] = useState(1);
  const [farmUnit, setFarmUnit] = useState('Acre'); 
  
  // Search/Filter State
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Expert System State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [chatQuery, setChatQuery] = useState('');
  const chatEndRef = useRef(null);

  const t = i18n[lang];
  const currentSeason = getSeason();

  // Initialization
  useEffect(() => {
    const loadDB = async () => {
      try {
        const savedUser = await dbGetUser();
        if (savedUser) {
          setUser(savedUser); 
          setLanguageSelected(true); 
          const savedHistory = await dbGetHistory();
          setAnalysisHistory(savedHistory || []);
        }
      } catch (error) { console.error("IndexedDB Load Error:", error); }
    };
    loadDB();
  }, []);

  // Theme Sync
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) metaThemeColor.content = darkMode ? "#064e3b" : "#059669";
  }, [darkMode]);

  // Online/Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Poll Cleanup
  useEffect(() => {
    return () => { if (pollIntervalId) clearInterval(pollIntervalId); };
  }, [pollIntervalId]);

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginForm.name && loginForm.phone.length >= 10) {
      const newUser = { ...loginForm, id: 'profile' };
      await dbSaveUser(newUser); 
      setUser(newUser);
      setShowTutorial(true);
    } else { alert(lang === 'en' ? "Please enter valid details." : "ശരിയായ വിവരങ്ങൾ നൽകുക."); }
  };

  const handleLogout = async () => {
    if (window.confirm(lang === 'en' ? "Log out completely? Data will be cleared." : "ലോഗൗട്ട് ചെയ്യണമെന്നുറപ്പാണോ?")) {
      await dbClearUser(); await dbClearHistory();
      setUser(null); setConnected(false); setConnectionType('none');
      if(pollIntervalId) clearInterval(pollIntervalId);
      setSensors({ pH: 0, N: 0, P: 0, K: 0, temp: 0, moisture: 0 });
      setAnalysisHistory([]);
    }
  };

  const handleRealConnect = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    let success = false;
    const fetchSensor = async (endpoint) => {
      try {
        const response = await fetch(`http://${espIp}${endpoint}`);
        if (response.ok) {
          const data = await response.json();
          setSensors(prev => ({ 
            pH: data.pH ?? prev.pH, N: data.N ?? prev.N, P: data.P ?? prev.P, 
            K: data.K ?? prev.K, temp: data.temp ?? prev.temp, moisture: data.moisture ?? prev.moisture 
          }));
          return true;
        }
      } catch (e) { return false; }
      return false;
    };

    let activeEndpoint = null;
    for (let endpoint of ['/data', '/sensor', '/api', '/readings']) {
      success = await fetchSensor(endpoint);
      if (success) { activeEndpoint = endpoint; break; }
    }
    
    if (success) {
      setConnected(true); setConnectionType('real'); setShowConnectModal(false);
      const id = setInterval(async () => {
        if(!(await fetchSensor(activeEndpoint))) {
          setConnected(false); setConnectionType('none'); clearInterval(id);
        }
      }, 30000);
      setPollIntervalId(id);
    } else { alert(t.fetchError); }
    setIsConnecting(false);
  };

  const handleMockConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setConnected(true); setConnectionType('mock'); setIsConnecting(false);
      setSensors({ pH: 5.8, N: 80, P: 40, K: 120, temp: 28, moisture: 65 });
      setShowConnectModal(false);
    }, 1000);
  };

  const handleAnalyze = () => {
    if (!connected) return alert(t.connectFirst);
    const s = sensors;
    if (s.moisture > 100 || s.moisture < 0 || s.pH > 14 || s.pH < 0 || s.N < 0 || s.P < 0 || s.K < 0 || s.temp > 60 || s.temp < -10) {
      return alert(t.sensorFault);
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      let scoredCrops = cropsDB.map(crop => {
        const moistGap = sensors.moisture < crop.moistMin ? crop.moistMin - sensors.moisture : (sensors.moisture > crop.moistMax ? sensors.moisture - crop.moistMax : 0);
        const tempGap = sensors.temp < crop.tempMin ? crop.tempMin - sensors.temp : (sensors.temp > crop.tempMax ? sensors.temp - crop.tempMax : 0);
        const pHGap = Math.abs(sensors.pH - crop.pH);
        let gap = (pHGap * 10) + (Math.max(0, crop.N - sensors.N) * 1) + (Math.max(0, crop.P - sensors.P) * 1) + (Math.max(0, crop.K - sensors.K) * 0.7) + (moistGap * 2) + (tempGap * 4);
        if (!crop.elevations?.includes(user?.elevation)) gap += 200; 
        if (!crop.seasons?.includes(currentSeason)) gap += 50; 
        let reason = gap < 200 ? (lang === 'en' ? "Good match 🌱" : "അനുയോജ്യമാണ് 🌱") : (lang === 'en' ? "Not optimal ⚠️" : "അനുയോജ്യമല്ല ⚠️");
        return { ...crop, gap, reason };
      });
      scoredCrops.sort((a, b) => a.gap - b.gap);
      setPredictionList(scoredCrops.slice(0, 5).map(c => ({...c, matchPercent: Math.max(5, 100 - (c.gap / 6)).toFixed(0)})));
      setIsAnalyzing(false);
    }, 1500);
  };

  const calculateFertilizer = async (crop) => {
    let urea = 0, ssp = 0, mop = 0, lime = 0;
    if (connected) {
      urea = Math.min(350, Math.max(0, (crop.N - sensors.N) / 0.46));
      ssp = Math.min(450, Math.max(0, (crop.P - sensors.P) * 6.25)); 
      mop = Math.min(300, Math.max(0, (crop.K - sensors.K) * 2));
      if (sensors.pH < 4.5) lime = 800; else if (sensors.pH < 5.5) lime = 500; else if (sensors.pH < 6.0) lime = 250;
    } else {
      urea = Math.min(350, crop.N / 0.46); ssp = Math.min(450, crop.P * 6.25); mop = Math.min(300, crop.K * 2);
    }
    const resultObj = { crop, baseReq: { urea, ssp, mop, lime }, isLive: connected };
    setResultModal(resultObj); setAiResponse(''); 
    
    if (connected) {
      const record = { id: Date.now(), timestamp: Date.now(), date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), crop, baseReq: { urea, ssp, mop, lime }, sensors };
      setAnalysisHistory([record, ...analysisHistory].slice(0, 50)); await dbSaveHistory(record);
    }
  };

  const expertSystem = (promptText, type) => {
    setAiLoading(true);
    setTimeout(() => {
      let res = "";
      if (type === 'pest') {
        const lower = promptText.toLowerCase();
        const p = pestsDB.find(p => lower.includes(p.nameEN.toLowerCase()) || promptText.includes(p.nameML) || p.keywords.some(k => lower.includes(k)));
        res = p ? (lang === 'en' ? `**${p.nameEN}**\n\n**Symptoms:** ${p.symptomsEN}\n\n**Organic:** ${p.organicEN}\n\n**Chemical:** ${p.chemicalEN}` : `**${p.nameML}**\n\n**ലക്ഷണങ്ങൾ:** ${p.symptomsML}\n\n**ജൈവ പ്രതിവിധി:** ${p.organicML}`) : t.offlineError;
      } else if (type === 'soil') {
        res = `${t.seasonPre} ${currentSeason} | Zone: ${user?.elevation}\n\n${t.fertilizerNeeded}\n${sensors.pH < 6.0 ? "Add Lime." : "Optimal pH."}`;
      } else if (type === 'guide') {
        res = lang === 'en' ? resultModal.crop.guideEN : resultModal.crop.guideML;
      } else if (type === 'organic') {
        res = resultModal?.crop.organicEN ? (lang === 'en' ? resultModal.crop.organicEN : resultModal.crop.organicML) : t.offlineAlternativeMsg;
      } else { res = t.rotationDesc; }
      setAiResponse(res); setAiLoading(false);
    }, 500);
  };

  const activeFerts = useMemo(() => {
    if (!resultModal) return [];
    let m = farmUnit === 'Acre' ? 0.404686 : (farmUnit === 'Cent' ? 0.00404686 : 1);
    const tm = m * (farmArea || 0);
    const { urea, ssp, mop, lime } = resultModal.baseReq;
    return [
      { key: 'lime', label: 'Lime / കുമ്മായം', val: (lime * tm).toFixed(1), color: 'border-yellow-400' },
      { key: 'urea', label: 'Urea / യൂറിയ', val: (urea * tm).toFixed(1), color: 'border-blue-500' },
      { key: 'ssp', label: 'SSP (Bone Meal) / അസ്ഥിപ്പൊടി', val: (ssp * tm).toFixed(1), color: 'border-purple-500' },
      { key: 'mop', label: 'MOP / പൊട്ടാഷ്', val: (mop * tm).toFixed(1), color: 'border-red-500' }
    ].filter(f => f.val > 0);
  }, [resultModal, farmUnit, farmArea]);

  const filteredCrops = useMemo(() => cropsDB.filter(c => {
    const s = searchInput.toLowerCase();
    const matchesSearch = c.nameEN.toLowerCase().includes(s) || c.nameML.includes(searchInput);
    const matchesCategory = activeCategory === 'All' || c.cat === activeCategory;
    return matchesSearch && matchesCategory;
  }), [searchInput, activeCategory]);

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen w-full overflow-hidden flex flex-col font-sans transition-colors duration-300 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900`}>
      {(!languageSelected || !user) ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
           {/* Simple Welcome/Login Screen */}
           {!languageSelected ? (
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border dark:border-slate-700">
               <Sprout className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
               <h1 className="text-2xl font-black mb-8">AGRI EDGE</h1>
               <div className="space-y-4">
                 <button onClick={() => { setLang('en'); setLanguageSelected(true); }} className="w-full bg-slate-100 dark:bg-slate-700 font-bold py-4 rounded-2xl hover:bg-emerald-50">English</button>
                 <button onClick={() => { setLang('ml'); setLanguageSelected(true); }} className="w-full bg-slate-100 dark:bg-slate-700 font-bold py-4 rounded-2xl hover:bg-emerald-50">മലയാളം</button>
               </div>
             </div>
           ) : (
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border dark:border-slate-700">
               <h1 className="text-2xl font-black text-center mb-6">{t.appName}</h1>
               <form onSubmit={handleLogin} className="space-y-4">
                 <input placeholder={t.fullNameLabel} value={loginForm.name} onChange={e => setLoginForm({...loginForm, name: e.target.value})} className="w-full p-4 rounded-2xl border dark:bg-slate-900" required />
                 <input placeholder={t.phoneLabel} value={loginForm.phone} onChange={e => setLoginForm({...loginForm, phone: e.target.value})} className="w-full p-4 rounded-2xl border dark:bg-slate-900" required />
                 <div className="grid grid-cols-2 gap-2">
                   <select value={loginForm.district} onChange={e => setLoginForm({...loginForm, district: e.target.value})} className="p-4 rounded-2xl border dark:bg-slate-900 text-sm">{districts.map(d => <option key={d} value={d}>{d}</option>)}</select>
                   <select value={loginForm.elevation} onChange={e => setLoginForm({...loginForm, elevation: e.target.value})} className="p-4 rounded-2xl border dark:bg-slate-900 text-sm">{elevations.map(el => <option key={el.id} value={el.id}>{lang === 'en' ? el.nameEN : el.nameML}</option>)}</select>
                 </div>
                 <button className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2"><span>{t.startFarming}</span><ArrowRight className="w-5 h-5" /></button>
               </form>
             </div>
           )}
        </div>
      ) : (
        <>
          <header className="shrink-0 bg-emerald-600 dark:bg-emerald-800 text-white p-4 shadow-md rounded-b-2xl z-40 print:hidden">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center space-x-2"><Sprout className="w-6 h-6" /><h1 className="text-xl font-bold">{t.appName}</h1></div>
               <div className="flex space-x-2">
                 <button onClick={handleLogout} className="p-2 bg-white/10 rounded-full"><LogOut className="w-5 h-5" /></button>
                 <button onClick={() => setLang(lang==='en'?'ml':'en')} className="p-2 bg-white/10 rounded-full"><Languages className="w-5 h-5" /></button>
                 <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-white/10 rounded-full">{darkMode?<Sun className="w-5 h-5"/>:<Moon className="w-5 h-5"/>}</button>
               </div>
            </div>
            <div className="flex justify-between items-center text-xs text-emerald-100">
               <span><User className="w-3 h-3 inline mr-1" />{user.name}</span>
               <span><MapPin className="w-3 h-3 inline mr-1" />{user.district}</span>
               <div className="flex items-center space-x-1"><div className={`w-2 h-2 rounded-full ${connected?'bg-green-400 animate-pulse':'bg-slate-400'}`} /><span>{connected?t.connected:t.disconnected}</span></div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full relative">
            {activeTab === 'dashboard' && <Dashboard connected={connected} isConnecting={isConnecting} onShowConnect={() => setShowConnectModal(true)} sensors={sensors} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} askSoilReport={() => expertSystem('soil', 'soil')} aiLoading={aiLoading} aiResponse={aiResponse} setAiResponse={setAiResponse} lang={lang} t={t} />}
            {activeTab === 'crops' && <CropList searchInput={searchInput} setSearchInput={setSearchInput} activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} filteredCrops={filteredCrops} onSelect={calculateFertilizer} lang={lang} t={t} />}
            {activeTab === 'doctor' && <PlantDoctor chatQuery={chatQuery} setChatQuery={setChatQuery} onSubmit={(e) => { e.preventDefault(); expertSystem(chatQuery, 'pest'); setChatQuery(''); }} aiLoading={aiLoading} aiResponse={aiResponse} setAiResponse={setAiResponse} chatEndRef={chatEndRef} pestsDB={pestsDB} lang={lang} t={t} />}
            {activeTab === 'history' && <HistoryList history={analysisHistory} onViewResult={setResultModal} lang={lang} t={t} />}
          </main>

          <nav className="shrink-0 bg-white dark:bg-slate-900 border-t flex justify-around p-3 z-40 print:hidden">
            <button onClick={() => setActiveTab('dashboard')} className={`p-2 flex flex-col items-center ${activeTab==='dashboard'?'text-emerald-600':'text-slate-400'}`}><LayoutDashboard className="w-6 h-6"/><span className="text-[10px] font-bold">{t.dashboard}</span></button>
            <button onClick={() => setActiveTab('crops')} className={`p-2 flex flex-col items-center ${activeTab==='crops'?'text-emerald-600':'text-slate-400'}`}><Leaf className="w-6 h-6"/><span className="text-[10px] font-bold">{t.crops}</span></button>
            <button onClick={() => setActiveTab('doctor')} className={`p-2 flex flex-col items-center ${activeTab==='doctor'?'text-emerald-600':'text-slate-400'}`}><Stethoscope className="w-6 h-6"/><span className="text-[10px] font-bold">{t.doctor}</span></button>
            <button onClick={() => setActiveTab('history')} className={`p-2 flex flex-col items-center ${activeTab==='history'?'text-emerald-600':'text-slate-400'}`}><History className="w-6 h-6"/><span className="text-[10px] font-bold">{t.history}</span></button>
          </nav>

          <ConnectModal show={showConnectModal} onHide={() => setShowConnectModal(false)} espIp={espIp} setEspIp={setEspIp} onRealConnect={handleRealConnect} onMockConnect={handleMockConnect} isConnecting={isConnecting} t={t} />
          <TutorialModal show={showTutorial} onHide={() => setShowTutorial(false)} t={t} />
          <PredictionModal list={predictionList} onHide={() => setPredictionList(null)} onSelect={(c) => { setPredictionList(null); calculateFertilizer(c); }} user={user} lang={lang} currentSeason={currentSeason} t={t} />
          <ResultModal result={resultModal} onHide={() => setResultModal(null)} farmArea={farmArea} setFarmArea={setFarmArea} farmUnit={farmUnit} setFarmUnit={setFarmUnit} activeFerts={activeFerts} askOrganic={() => expertSystem('organic', 'organic')} askGuide={() => expertSystem('guide', 'guide')} askRotation={() => expertSystem('rotation', 'rotation')} aiLoading={aiLoading} aiResponse={aiResponse} setAiResponse={setAiResponse} lang={lang} t={t} />
        </>
      )}
    </div>
  );
}
