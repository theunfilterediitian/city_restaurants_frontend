import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Country, State } from "country-state-city";
import {
  Building2, Users, Globe, ShieldCheck,
  ChevronRight, MapPin, Utensils, Activity,
  PieChart, LayoutGrid, PlusCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await api.getRestaurants(); // Assuming this returns the full list
        setRestaurants(res.data);
      } catch (err) {
        console.error("Admin fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Global Platform Stats
  const adminStats = useMemo(() => {
    return {
      totalOutlets: restaurants.length,
      pureVegOutlets: restaurants.filter(r => r.pure_veg).length,
      uniqueCountries: new Set(restaurants.map(r => r.country_code)).size,
      uniqueCities: new Set(restaurants.map(r => r.city_code)).size,
    };
  }, [restaurants]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 md:space-y-10 pb-24">

      {/* 1. ADMIN HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tightest">Insight Engine</h1>
          <p className="text-slate-500 font-bold mt-1 md:mt-2 uppercase tracking-widest text-[10px] md:text-[11px]">Core Platform Analytics</p>
        </div>
      </header>

      {/* 2. PLATFORM STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon={<Building2 size={20} className="md:size-24" />} label="Outlets" value={adminStats.totalOutlets} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={<ShieldCheck size={20} className="md:size-24" />} label="Pure Veg" value={adminStats.pureVegOutlets} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={<Globe size={20} className="md:size-24" />} label="Countries" value={adminStats.uniqueCountries} color="text-sky-600" bg="bg-sky-50" />
        <StatCard icon={<Activity size={20} className="md:size-24" />} label="Cities" value={adminStats.uniqueCities} color="text-rose-600" bg="bg-rose-50" />
      </div>

      {/* 3. GEOGRAPHICAL REACH */}
      <div className="card-premium p-5 md:p-10">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-amber-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/20 shrink-0">
            <PieChart size={20} className="md:size-24" />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-black text-slate-900">Portfolio Breakdown</h3>
            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Platform Composition</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <ProgressItem
            label="Dietary Focus (Veg Ratio)"
            value={adminStats.pureVegOutlets}
            total={adminStats.totalOutlets}
            color="bg-emerald-500"
          />
          <ProgressItem
            label="Regional Depth Index"
            value={adminStats.uniqueCities}
            total={adminStats.totalOutlets}
            color="bg-amber-500"
          />
        </div>
      </div>

      {/* 4. RESTAURANT DIRECTORY GRID */}
      <section className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-9 w-9 md:h-10 md:w-10 bg-slate-900 text-white rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
              <LayoutGrid size={18} className="md:size-20" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Enterprise Portfolio</h3>
          </div>
          <Link to="/admin/restaurants/new" className="btn-primary py-2 md:py-2.5 px-4 md:px-5 text-xs md:text-sm w-fit">
            <PlusCircle size={16} className="md:size-18" />
            Register New
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {restaurants.map((res) => (
            <Link
              key={res.id}
              to={`/${res.country_code}/${res.state_code}/${res.city_code}/${res.email.split('@')[0]}`}
              className="card-premium group p-5 md:p-8 relative hover:ring-2 hover:ring-amber-500/20 active:scale-[0.98]"
            >
              {/* Status Indicator */}
              <div className="absolute top-5 md:top-8 right-5 md:right-8 flex items-center gap-2">
                <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
              </div>

              <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-500">
                  {res.logo_url ? (
                    <img src={res.logo_url} alt="logo" className="object-cover w-full h-full" />
                  ) : (
                    <Building2 size={24} className="text-slate-300 md:size-28" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-base md:text-lg text-slate-900 truncate group-hover:text-amber-600 transition-colors uppercase tracking-tight">{res.name}</h4>
                  <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">{res.type}</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-5 pt-4 md:pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 md:h-8 md:w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    <MapPin size={14} className="md:size-16" />
                  </div>
                  <p className="text-[11px] md:text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {res.city_code} <span className="text-slate-300 mx-1">/</span> {res.state_code}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1 md:mt-2">
                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-amber-600 uppercase tracking-widest">
                    Explore Experience
                  </div>
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:translate-x-1 transition-all">
                    <ChevronRight size={16} className="md:size-18" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// Reusable Stat Component
function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="card-premium p-4 md:p-8 group hover:-translate-y-1">
      <div className={`h-10 w-10 md:h-12 md:w-12 ${bg} ${color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <div className="text-2xl md:text-4xl font-black text-slate-900 mb-1 md:mb-2 tracking-tighter">{value}</div>
      <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</div>
    </div>
  );
}

// Reusable Progress Component
function ProgressItem({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2 md:space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs md:text-sm font-bold text-slate-900">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2.5 md:h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 md:p-1 border border-slate-100">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-10 w-10 border-4 border-slate-100 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );
}