
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  Download, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Grid3X3,
  FileArchive,
  Cpu
} from 'lucide-react';
import { ColoringStyle, GenerationConfig, UserProfile } from '../types';
import { STYLE_TEMPLATES } from '../constants';
import { generateColoringPage, bulkGenerate, fetchAvailableModels } from '../services/pollinationsService';
import { saveGeneration } from '../services/storageService';

const Generator: React.FC<{ user: UserProfile }> = ({ user }) => {
  const isPro = user.plan === 'Pro';

  const [models, setModels] = useState<string[]>(['flux']);
  const [config, setConfig] = useState<GenerationConfig>({
    prompt: '',
    style: 'Kids Cute',
    count: 1,
    resolution: '1024x1324',
    model: 'flux'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const availableModels = await fetchAvailableModels();
      setModels(availableModels);
      if (availableModels.length > 0 && !availableModels.includes(config.model)) {
        setConfig(prev => ({ ...prev, model: availableModels[0] }));
      }
    };
    loadModels();
  }, []);

  const handleGenerate = async () => {
    if (!config.prompt.trim()) {
      setError("Please enter a prompt describing your coloring page.");
      return;
    }

    if (!isPro && user.generationsRemaining < config.count) {
      setError("You don't have enough credits for this operation. Upgrade for unlimited access.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    setProgress(0);
    setResult([]);

    try {
      if (config.count === 1) {
        const dataUrl = await generateColoringPage(config);
        setResult([dataUrl]);
        saveGeneration({
          id: Math.random().toString(36).substr(2, 9),
          url: dataUrl,
          prompt: config.prompt,
          style: config.style,
          model: config.model,
          createdAt: Date.now()
        });
      } else {
        const urls = await bulkGenerate(config, (p) => setProgress(p));
        setResult(urls);
        urls.forEach((url) => {
          saveGeneration({
            id: Math.random().toString(36).substr(2, 9),
            url,
            prompt: config.prompt,
            style: config.style,
            model: config.model,
            createdAt: Date.now(),
            isBulk: true,
            bulkGroupId: 'bulk-' + Date.now()
          });
        });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent kdp-gradient">AI Coloring Generator</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          {isPro ? "Unlimited access enabled. Create high-resolution line art without limits." : "Create professional, print-ready coloring pages for Amazon KDP."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 kdp-shadow space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">The Subject</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                placeholder="e.g. A cute baby elephant wearing a crown in a jungle"
                value={config.prompt}
                onChange={(e) => setConfig({...config, prompt: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">AI Model</label>
              <div className="relative">
                <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                  value={config.model}
                  onChange={(e) => setConfig({...config, model: e.target.value})}
                >
                  {models.map(m => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Style Preset</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(STYLE_TEMPLATES) as ColoringStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setConfig({...config, style})}
                    className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      config.style === style 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {STYLE_TEMPLATES[style].icon}
                    <span>{style}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Batch Quantity</label>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{config.count} Page{config.count > 1 ? 's' : ''}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max={isPro ? "20" : "5"} 
                step="1"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={config.count}
                onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                <span>1</span>
                <span>{isPro ? '20 per batch' : '5 (Free Limit)'}</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full kdp-gradient py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-indigo-100 transition-all flex items-center justify-center space-x-2 ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Generating {config.count > 1 ? `(${progress}/${config.count})` : '...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Generate Coloring Page</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-100 kdp-shadow p-6 min-h-[550px] flex flex-col items-center justify-center text-center space-y-6">
            {isGenerating ? (
              <div className="space-y-4 w-full px-12">
                <div className="w-24 h-24 kdp-gradient rounded-full flex items-center justify-center animate-pulse mx-auto shadow-2xl shadow-indigo-200">
                  <ImageIcon className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Drafting your art...</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Using {config.model} line-art model. Stand by.</p>
                </div>
                {config.count > 1 && (
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="kdp-gradient h-full transition-all duration-500" 
                      style={{ width: `${(progress / config.count) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : result.length > 0 ? (
              <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    {result.length} Page{result.length > 1 ? 's' : ''} Generated
                  </h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setResult([])}
                      className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                    >
                      Clear
                    </button>
                    <a 
                      href={result[0]} 
                      download="coloring-page.png" 
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-100"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download {result.length > 1 ? 'All' : 'Image'}</span>
                    </a>
                  </div>
                </div>

                <div className={`grid gap-4 ${result.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {result.map((url, i) => (
                    <div key={i} className="group relative aspect-[17/22] bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-indigo-200">
                      <img src={url} alt="Generated Content" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform shadow-lg"
                        >
                          <ImageIcon className="w-6 h-6" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                  <Grid3X3 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Preview Area</h3>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                  Your clean, {isPro ? 'unlimited' : 'standard'} line-art results will appear here after generation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
