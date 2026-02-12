
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Download, 
  ExternalLink, 
  Filter, 
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon
} from 'lucide-react';
import { ColoringPage } from '../types';
import { getHistory, deleteGeneration } from '../services/storageService';

const History: React.FC = () => {
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedPage, setSelectedPage] = useState<ColoringPage | null>(null);

  useEffect(() => {
    setPages(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this from your collection?")) {
      deleteGeneration(id);
      setPages(getHistory());
      if (selectedPage?.id === id) setSelectedPage(null);
    }
  };

  const filteredPages = pages.filter(p => 
    p.prompt.toLowerCase().includes(filter.toLowerCase()) || 
    p.style.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Collection</h2>
          <p className="text-slate-500">Manage and download your previously generated KDP assets.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {filteredPages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page) => (
                <div 
                  key={page.id} 
                  className={`group relative bg-white rounded-3xl border border-slate-100 kdp-shadow overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${selectedPage?.id === page.id ? 'ring-2 ring-indigo-600' : ''}`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="aspect-[17/22] bg-slate-50 flex items-center justify-center p-4">
                    <img src={page.url} alt={page.prompt} className="w-full h-full object-contain shadow-sm" />
                  </div>
                  <div className="p-4 bg-white border-t border-slate-50">
                    <p className="text-sm font-bold text-slate-900 truncate mb-1">{page.prompt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{page.style}</span>
                      <span className="text-[10px] text-slate-400">{new Date(page.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(page.id); }}
                      className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No assets found</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">Try adjusting your search or generate new coloring pages to see them here.</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="hidden lg:block lg:col-span-1">
          {selectedPage ? (
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 kdp-shadow p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="aspect-[17/22] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                <img src={selectedPage.url} alt="Selected" className="w-full h-full object-contain p-2" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">PROMPT</h4>
                <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{selectedPage.prompt}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-1">STYLE</h5>
                  <p className="text-xs font-bold">{selectedPage.style}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-1">MODEL</h5>
                  <p className="text-xs font-bold">{selectedPage.model || 'Standard'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <a 
                  href={selectedPage.url} 
                  download={`kdp-${selectedPage.id}.png`}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High Res</span>
                </a>
                <button 
                  onClick={() => handleDelete(selectedPage.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-100 hover:text-red-500 py-3 rounded-2xl font-bold text-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Asset</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-slate-400 text-sm font-medium">Select an asset to view details and options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
