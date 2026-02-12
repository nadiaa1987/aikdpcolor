
import React from 'react';
import { Check, Zap, Sparkles, Building, Rocket } from 'lucide-react';

const PlanCard = ({ name, price, description, features, highlighted, icon: Icon, color }: any) => (
  <div className={`relative p-8 rounded-3xl border transition-all duration-300 ${
    highlighted 
    ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100 scale-105 z-10' 
    : 'bg-white border-slate-100 kdp-shadow'
  }`}>
    {highlighted && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 kdp-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
        Most Popular
      </div>
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 ${color}`}>
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-1">{name}</h3>
    <div className="flex items-baseline mb-4">
      <span className="text-4xl font-extrabold">$</span>
      <span className="text-5xl font-extrabold tracking-tight">{price}</span>
      <span className="text-slate-400 font-semibold ml-2">/month</span>
    </div>
    <p className="text-slate-500 text-sm mb-8">{description}</p>
    
    <div className="space-y-4 mb-8">
      {features.map((feature: string, i: number) => (
        <div key={i} className="flex items-start space-x-3">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-sm font-medium text-slate-600">{feature}</span>
        </div>
      ))}
    </div>

    <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
      highlighted 
      ? 'kdp-gradient text-white shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95' 
      : 'bg-slate-900 text-white hover:bg-slate-800'
    }`}>
      {price === '0' ? 'Current Plan' : 'Get Started Now'}
    </button>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-black tracking-tight text-slate-900">Simple, Transparent Pricing</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">Scalable solutions for individual creators and professional KDP publishing houses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center px-4">
        <PlanCard 
          name="Hobby"
          price="0"
          description="Perfect for testing the waters of coloring book creation."
          features={[
            "5 Generations / day",
            "Single Page Mode only",
            "Standard Resolution (1024px)",
            "Community Discord Support",
            "Personal Use License"
          ]}
          icon={Zap}
          color="bg-slate-400"
        />
        
        <PlanCard 
          name="Pro Creator"
          price="29"
          description="Everything you need to run a successful KDP business."
          features={[
            "Unlimited Generations",
            "Bulk Generation (Up to 20)",
            "High Res Output (300 DPI)",
            "Full Commercial License",
            "KDP Layout Presets",
            "Priority Processing",
            "ZIP Export Support"
          ]}
          highlighted={true}
          icon={Rocket}
          color="bg-indigo-600"
        />

        <PlanCard 
          name="Publishing"
          price="99"
          description="Advanced tools for high-volume publishing agencies."
          features={[
            "Unlimited Pro Accounts (3)",
            "Batch Processing (Up to 100)",
            "Custom Style Training",
            "API Access for Automation",
            "Dedicated Account Manager",
            "White-label Exports"
          ]}
          icon={Building}
          color="bg-purple-600"
        />
      </div>

      <div className="mt-20 bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-2">
          <h4 className="text-2xl font-bold text-indigo-900 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-indigo-600" />
            Not sure which one to choose?
          </h4>
          <p className="text-indigo-700/70 font-medium">Try our Pro features free for 7 days. No credit card required to start generating.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          Start Free Trial
        </button>
      </div>
    </div>
  );
};

export default Pricing;
