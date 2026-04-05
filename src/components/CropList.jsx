import React from 'react';
import { Search, X } from 'lucide-react';

export const CropList = ({ searchInput, setSearchInput, activeCategory, setActiveCategory, categories, filteredCrops, onSelect, lang, t }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 relative">
      <div className="sticky top-[-16px] z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col space-y-3">
        <div className="flex items-center w-full">
          <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
          <input type="text" placeholder={t.searchCrops} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="bg-transparent w-full focus:outline-none dark:text-white" />
          {searchInput && <button onClick={() => setSearchInput('')}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>}
        </div>
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide pb-1">
          {categories.map((catObj) => {
            const isSelected = activeCategory === catObj.en || activeCategory === catObj.ml || (activeCategory === 'All' && catObj.id === 'All');
            return (
              <button key={catObj.id} onClick={() => setActiveCategory(catObj.en)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isSelected ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {lang === 'en' ? catObj.en : catObj.ml}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-20">
        {filteredCrops.length > 0 ? filteredCrops.map(crop => (
          <button key={crop.id} onClick={() => onSelect(crop)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center space-y-2 hover:border-emerald-500 active:scale-95 transition">
            <span className="text-4xl">{crop.img}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm text-center">{lang === 'en' ? crop.nameEN : crop.nameML}</span>
          </button>
        )) : (
          <div className="col-span-2 text-center p-8 text-slate-500">{lang === 'en' ? 'No crops found' : 'വിളകൾ കണ്ടെത്തിയില്ല'}</div>
        )}
      </div>
    </div>
  );
};
