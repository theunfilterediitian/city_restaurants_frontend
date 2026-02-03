import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { Country, State, City } from "country-state-city";
import {
  MapPin, Utensils, Globe, ChevronRight,
  Search, Star, Clock, ChefHat, Filter,
  Navigation, Heart, TrendingUp, X, Store, Leaf
} from "lucide-react";

export default function BrowseRestaurants() {
  const { country: urlCountry, state: urlState, city: urlCity } = useParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const filtersRef = useRef(null);
  const filterButtonRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.getRestaurants();
        let dataToSet = [];
        if (Array.isArray(res.data)) {
          dataToSet = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          dataToSet = res.data.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          dataToSet = res.data.results;
        }
        setRestaurants(dataToSet);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterButtonRef.current && filterButtonRef.current.contains(event.target)) return;
      if (filtersRef.current && !filtersRef.current.contains(event.target) && showFilters) {
        setShowFilters(false);
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showFilters) setShowFilters(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showFilters]);

  const getCountryName = (code) => Country.getCountryByCode(code)?.name || code;
  const getStateName = (sCode, cCode) => State.getStateByCodeAndCountry(sCode, cCode)?.name || sCode;

  const locationData = useMemo(() => {
    const countries = [...new Set(restaurants.map(r => r.country_code).filter(Boolean))];
    const states = restaurants
      .filter(r => !urlCountry || r.country_code === urlCountry)
      .map(r => r.state_code)
      .filter(Boolean);
    const cities = restaurants
      .filter(r => (!urlCountry || r.country_code === urlCountry) && (!urlState || r.state_code === urlState))
      .map(r => r.city_code)
      .filter(Boolean);

    return {
      countries: countries.sort(),
      states: [...new Set(states)].sort(),
      cities: [...new Set(cities)].sort()
    };
  }, [restaurants, urlCountry, urlState]);

  const filteredList = useMemo(() => {
    let filtered = restaurants.filter(r => {
      const matchCountry = !urlCountry || r.country_code === urlCountry;
      const matchState = !urlState || r.state_code === urlState;
      const matchCity = !urlCity || r.city_code === urlCity;
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCountry && matchState && matchCity && matchSearch;
    });

    if (sortBy === "rating") filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [restaurants, urlCountry, urlState, urlCity, searchQuery, sortBy]);

  const handleLocationChange = (type, value) => {
    if (value === "") {
      if (type === 'country') navigate('/browse');
      else if (type === 'state') navigate(`/${urlCountry}`);
      else if (type === 'city') navigate(`/${urlCountry}/${urlState}`);
    } else {
      if (type === 'country') navigate(`/${value}`);
      else if (type === 'state') navigate(`/${urlCountry}/${value}`);
      else if (type === 'city') navigate(`/${urlCountry}/${urlState}/${value}`);
    }
  };

  const clearFilters = () => {
    navigate('/browse');
    setSearchQuery("");
    setSortBy("default");
    setShowFilters(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      {/* Hero Header */}
      <header className="bg-[#0F1115] text-white relative overflow-hidden py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-[10px] font-black text-amber-500 mb-8 uppercase tracking-[0.3em]">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/browse" className="hover:text-white transition-colors text-white">Discovery</Link>
            {urlCountry && <><ChevronRight size={12} /> <span className="text-slate-500">{getCountryName(urlCountry)}</span></>}
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 tracking-tightest leading-none animate-slide-up">
            {urlCity || (urlState ? getStateName(urlState, urlCountry) : "") || (urlCountry ? getCountryName(urlCountry) : "INDIAN RESTROS")}
          </h1>
          <p className="text-xl text-slate-400 font-bold max-w-2xl leading-relaxed uppercase tracking-widest text-xs">
            Exploring {filteredList.length} premium dining experiences ready for your selection.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-4 mb-12 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Search by name, cuisine or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium pl-16 py-5 bg-slate-50/50"
              />
            </div>

            <div className="flex gap-4">
              <button
                ref={filterButtonRef}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all relative ${showFilters ? "btn-primary" : "btn-secondary"}`}
              >
                <Filter size={18} /> Filters
                {(urlCountry || urlState || urlCity) && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full border-4 border-white"></span>
                )}
              </button>

              <div className="relative hidden md:block w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-full appearance-none pl-6 pr-12 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="rating">Sort: High Rating</option>
                  <option value="name">Sort: A-Z</option>
                </select>
                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Filters Overlay Code omitted for brevity in this tool call but restored in implementation */}
          {showFilters && (
            <div ref={filtersRef} className="mt-8 p-10 border-t border-slate-50 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <LocationSelector label="Country" value={urlCountry} options={locationData.countries} onChange={v => handleLocationChange('country', v)} getLabel={getCountryName} icon={<Globe size={18} />} />
                <LocationSelector label="State" value={urlState} options={locationData.states} onChange={v => handleLocationChange('state', v)} getLabel={s => getStateName(s, urlCountry)} disabled={!urlCountry} icon={<MapPin size={18} />} />
                <LocationSelector label="City" value={urlCity} options={locationData.cities} onChange={v => handleLocationChange('city', v)} disabled={!urlState} icon={<Navigation size={18} />} />
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={clearFilters} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Wipe All Filters</button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Insights Bar */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <InsightCard value={filteredList.length} label="Total Outlets" icon={<Store size={18} />} />
          <InsightCard value={new Set(filteredList.map(r => r.country_code)).size} label="Global Territories" icon={<Globe size={18} />} />
          <InsightCard value={new Set(filteredList.map(r => r.type)).size} label="Cuisine Types" icon={<ChefHat size={18} />} />
          <InsightCard value={filteredList.filter(r => r.pure_veg).length} label="Pure Vegetarian" icon={<Leaf size={18} />} />
        </div> */}

        {/* Restaurant Portfolio Grid */}
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredList.map((restaurant) => {
              const country = restaurant.country_code || "IN";
              const state = restaurant.state_code || "BR";
              const city = restaurant.city_code || "any";
              const identifier = restaurant.email.split("@")[0];

              return (
                <Link key={restaurant.id} to={`/${country}/${state}/${city}/${identifier}`} className="card-premium group hover:ring-4 hover:ring-amber-500/10 active:scale-[0.99] transition-all">
                  <div className="relative h-64 overflow-hidden">
                    {restaurant.logo_url ? (
                      <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><Utensils size={48} /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-6 left-6">
                      {restaurant.pure_veg && <span className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-xl flex items-center gap-2"><Leaf size={12} /> Pure Veg</span>}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-2xl text-slate-900 tracking-tightest group-hover:text-amber-600 transition-colors">{restaurant.name}</h4>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">{restaurant.type}</p>
                      </div>
                      {restaurant.rating && (
                        <div className="bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-100 text-amber-600 font-black text-sm shadow-sm">
                          <Star size={14} fill="currentColor" /> {restaurant.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400"><MapPin size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{restaurant.city_code}</span></div>
                      <ChevronRight size={20} className="text-amber-500 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-slate-50 mx-auto rounded-full flex items-center justify-center text-slate-200 mb-8"><Search size={48} /></div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Portfolio Empty</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">No matching experiences found in this territory</p>
            <button onClick={clearFilters} className="mt-10 btn-primary px-10">Reset Discovery Engine</button>
          </div>
        )}
      </main>
    </div>
  );
}

function InsightCard({ value, label, icon }) {
  return (
    <div className="card-premium p-8 flex flex-col items-center group hover:bg-slate-900 transition-all duration-500">
      <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">{icon}</div>
      <div className="text-3xl font-black text-slate-900 group-hover:text-white transition-all mb-1">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{label}</div>
    </div>
  );
}

function LocationSelector({ label, value, options, onChange, getLabel, disabled, icon }) {
  return (
    <div className={`space-y-4 ${disabled ? "opacity-30 grayscale" : ""}`}>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">{icon} {label}</label>
      <div className="relative group">
        <select value={value || ""} onChange={e => onChange(e.target.value)} disabled={disabled} className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all appearance-none cursor-pointer">
          <option value="">All {label}s</option>
          {options.map(o => <option key={o} value={o}>{getLabel ? getLabel(o) : o}</option>)}
        </select>
        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={16} />
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
      <div className="text-center">
        <div className="h-20 w-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-8 shadow-2xl shadow-amber-500/20" />
        <h2 className="text-white font-black uppercase tracking-[0.4em] text-xs">Initializing Portfolio</h2>
      </div>
    </div>
  );
}