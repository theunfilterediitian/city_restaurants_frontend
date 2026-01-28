import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import {
  MapPin, Utensils, Globe, ChevronRight,
  Search, Star, Clock, ChefHat, Filter,
  Navigation, Heart, TrendingUp, X
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

  // --- Dynamic Import for country-state-city ---
  const [csc, setCsc] = useState(null);

  useEffect(() => {
    import('country-state-city').then((mod) => {
      setCsc(mod);
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.getRestaurants();
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Click outside to close filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on filter button (it will toggle itself)
      if (filterButtonRef.current && filterButtonRef.current.contains(event.target)) {
        return;
      }

      // Close if clicking outside the filters panel and button
      if (filtersRef.current && !filtersRef.current.contains(event.target) && showFilters) {
        setShowFilters(false);
      }
    };

    // Also close on escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showFilters) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showFilters]);

  const getCountryName = (code) => {
    if (!csc) return code;
    return csc.Country.getCountryByCode(code)?.name || code;
  };

  const getStateName = (sCode, cCode) => {
    if (!csc) return sCode;
    return csc.State.getStateByCodeAndCountry(sCode, cCode)?.name || sCode;
  };

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

    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [restaurants, urlCountry, urlState, urlCity, searchQuery, sortBy]);

  const handleLocationChange = (type, value) => {
    if (value === "") {
      // If clearing a filter, navigate up one level
      if (type === 'country') navigate('/browse');
      if (type === 'state') navigate(`/${urlCountry}`);
      if (type === 'city') navigate(`/${urlCountry}/${urlState}`);
    } else {
      // If selecting a value, navigate to that location
      if (type === 'country') navigate(`/${value}`);
      if (type === 'state') navigate(`/${urlCountry}/${value}`);
      if (type === 'city') navigate(`/${urlCountry}/${urlState}/${value}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-12">

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={16} />
              <Link to="/browse" className="hover:text-white transition-colors">Restaurants</Link>
              {urlCountry && <><ChevronRight size={16} /> <span>{getCountryName(urlCountry)}</span></>}
              {urlState && <><ChevronRight size={16} /> <span>{getStateName(urlState, urlCountry)}</span></>}
              {urlCity && <><ChevronRight size={16} /> <span>{urlCity}</span></>}
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              {urlCity || (urlState ? getStateName(urlState, urlCountry) : "") || (urlCountry ? getCountryName(urlCountry) : "Discover Amazing Restaurants")}
            </h1>
            <p className="text-lg text-white/90">
              {filteredList.length} restaurants found {urlCountry && `in ${getCountryName(urlCountry)}`}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 relative">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search restaurants by name, cuisine, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-0 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Filter Button and Sort */}
            <div className="flex gap-3 relative">
              <button
                ref={filterButtonRef}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all relative ${showFilters
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-indigo-500 hover:shadow-sm"
                  }`}
              >
                <Filter size={18} />
                <span>Filters</span>
                {(urlCountry || urlState || urlCity) && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition-colors"
              >
                <option value="default">Sort by: Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="name">A to Z</option>
              </select>

              {/* Filters Panel - Now positioned relative to the button */}
              {showFilters && (
                <div
                  ref={filtersRef}
                  className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 animate-fadeIn min-w-[320px] lg:min-w-[400px]"
                  style={{
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {/* Connector triangle/arrow */}
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45 border-t border-l border-slate-200"></div>

                  {/* Header with close button */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Filter by Location</h3>
                      <p className="text-sm text-slate-500 mt-1">Select one or more filters</p>
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-slate-500 hover:text-slate-700" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Country Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">Country</label>

                      </div>
                      <select
                        value={urlCountry || ""}
                        onChange={(e) => handleLocationChange('country', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="">All Countries</option>
                        {locationData.countries.map(c => (
                          <option key={c} value={c}>{getCountryName(c)}</option>
                        ))}
                      </select>
                    </div>

                    {/* State Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">
                          <span>State/Region</span>
                          {urlCountry && (
                            <span className="ml-2 text-xs font-normal text-slate-500">
                              ({locationData.states.length} available)
                            </span>
                          )}
                        </label>

                      </div>
                      <select
                        disabled={!urlCountry}
                        value={urlState || ""}
                        onChange={(e) => handleLocationChange('state', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <option value="">All States</option>
                        {locationData.states.map(s => (
                          <option key={s} value={s}>{getStateName(s, urlCountry)}</option>
                        ))}
                      </select>
                    </div>

                    {/* City Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700">
                          <span>City</span>
                          {urlState && (
                            <span className="ml-2 text-xs font-normal text-slate-500">
                              ({locationData.cities.length} available)
                            </span>
                          )}
                        </label>

                      </div>
                      <select
                        disabled={!urlState}
                        value={urlCity || ""}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <option value="">All Cities</option>
                        {locationData.cities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Active Filters</span>
                        {(urlCountry || urlState || urlCity) && (
                          <button
                            onClick={clearFilters}
                            className="text-sm text-rose-600 font-medium hover:text-rose-700"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {urlCountry && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                            <Globe size={14} />
                            {getCountryName(urlCountry)}
                          </span>
                        )}
                        {urlState && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                            <MapPin size={14} />
                            {getStateName(urlState, urlCountry)}
                          </span>
                        )}
                        {urlCity && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                            <Utensils size={14} />
                            {urlCity}
                          </span>
                        )}
                        {!urlCountry && !urlState && !urlCity && (
                          <span className="text-sm text-slate-500 italic">No filters selected yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Apply/Cancel Buttons */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors"
                    >
                      Close Panel
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-2xl font-bold text-slate-900">{filteredList.length}</div>
            <div className="text-sm text-slate-500">Restaurants</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-2xl font-bold text-slate-900">
              {new Set(filteredList.map(r => r.country_code)).size}
            </div>
            <div className="text-sm text-slate-500">Countries</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-2xl font-bold text-slate-900">
              {new Set(filteredList.map(r => r.type)).size}
            </div>
            <div className="text-sm text-slate-500">Cuisine Types</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-2xl font-bold text-slate-900">
              {filteredList.filter(r => r.pure_veg).length}
            </div>
            <div className="text-sm text-slate-500">Pure Veg</div>
          </div>
        </div>

        {/* Restaurant Grid */}
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((restaurant) => {
              const country = restaurant.country_code || "IN";
              const state = restaurant.state_code || "BR";
              const city = restaurant.city_code || "any";
              const identifier = restaurant.email.split("@")[0] || restaurant.name.toLowerCase().replace(/\s+/g, '-');

              return (
                <Link
                  key={restaurant.id}
                  to={`/${country}/${state}/${city}/${identifier}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-indigo-200 hover:-translate-y-1"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <ChefHat size={48} className="text-slate-300" />
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {restaurant.pure_veg && (
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          Pure Veg
                        </div>
                      )}
                      {restaurant.rating && (
                        <div className="bg-white/90 backdrop-blur-sm text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold">
                          <Star size={12} fill="currentColor" />
                          {restaurant.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <button
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle favorite toggle
                        }}
                      >
                        <Heart size={18} className="text-rose-500" />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-2">
                          {restaurant.type}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {restaurant.name}
                        </h3>
                      </div>
                      {restaurant.trending && (
                        <TrendingUp size={20} className="text-emerald-500" />
                      )}
                    </div>

                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {restaurant.description || "Experience delicious cuisine and great service"}
                    </p>

                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <MapPin size={16} className="text-indigo-500" />
                      <span>{restaurant.location || `${restaurant.city_code}, ${getStateName(restaurant.state_code, restaurant.country_code)}`}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Open Now</span>
                      </div>
                      <div className="text-sm font-semibold text-indigo-600 group-hover:underline">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Utensils size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No restaurants found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* View Map Option */}
        {filteredList.length > 0 && (
          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all">
              <Navigation size={18} />
              View on Map
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
      <div className="text-center">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-slate-200 rounded-full" />
          <div className="h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin" />
          <Utensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={20} />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700 tracking-wide">Discovering Amazing Restaurants...</p>
      </div>
    </div>
  );
}