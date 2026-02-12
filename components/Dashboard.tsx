
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Zap, BookOpen, Download, TrendingUp } from 'lucide-react';
import { UserProfile } from '../types';
import { getHistory } from '../services/storageService';

const mockChartData = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 7 },
  { name: 'Wed', count: 5 },
  { name: 'Thu', count: 12 },
  { name: 'Fri', count: 8 },
  { name: 'Sat', count: 15 },
  { name: 'Sun', count: 10 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 kdp-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-extrabold text-slate-900">{value}</p>
  </div>
);

const Dashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const history = getHistory();
  const recentImages = history.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Seller!</h2>
          <p className="text-slate-500">Here's what's happening with your KDP assets today.</p>
        </div>
        <Link 
          to="/generate" 
          className="kdp-gradient px-6 py-3 rounded-2xl text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200 transition-transform active:scale-95 hover:scale-105"
        >
          <Zap className="w-5 h-5" />
          <span>New Generation</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pages" value={user.totalGenerated} icon={BookOpen} trend="+12%" color="bg-indigo-600" />
        <StatCard title="Credits Left" value={user.plan === 'Pro' ? '∞' : user.generationsRemaining} icon={Zap} color="bg-amber-500" />
        <StatCard title="Storage Used" value="1.2 GB" icon={Download} trend="+5%" color="bg-purple-600" />
        <StatCard title="Active Plan" value={user.plan} icon={TrendingUp} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 kdp-shadow">
          <h3 className="text-xl font-bold mb-6">Generation Activity</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 kdp-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent History</h3>
            <Link to="/history" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentImages.length > 0 ? (
              recentImages.map((img) => (
                <div key={img.id} className="flex items-center space-x-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                    <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{img.prompt}</p>
                    <p className="text-xs text-slate-400">{img.style} • {new Date(img.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">No generations yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
