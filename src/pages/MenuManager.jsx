import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { Edit3, Plus, ImageOff, Search, Loader2, ChevronRight } from 'lucide-react';

export default function MenuManager() {
  const navigate = useNavigate();
  const { rest_id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { products, fetchProducts, toggleAvailability, isLoading } = useProductStore();

  useEffect(() => {
    if (rest_id) fetchProducts(rest_id);
  }, [rest_id, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.categories?.some(cat => cat.name.toLowerCase().includes(term))
    );
  }, [products, searchTerm]);

  return (
    <div className="flex flex-col gap-4 md:gap-6 pb-20">
      {/* Header Section */}
      <div className="bg-white rounded-[1.5rem] md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Menu Items</h2>
            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Global Catalog Management</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 flex-1 lg:max-w-2xl">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-600 transition-colors">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Find a dish..."
                className="block w-full pl-11 pr-4 py-3 md:py-3 border border-gray-100 rounded-xl md:rounded-2xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all text-sm font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => navigate(`/restaurant/${rest_id}/menu/add`)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 md:py-3 rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-200 active:scale-95 whitespace-nowrap justify-center"
            >
              <Plus size={18} strokeWidth={3} /> Add New
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-[1.5rem] p-20 flex flex-col items-center justify-center gap-4 border border-gray-100">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin" strokeWidth={3} />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Syncing Menu...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[1.5rem] p-16 text-center border border-gray-100">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-gray-50 rounded-full text-gray-300">
              <Search size={40} />
            </div>
          </div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
            {searchTerm ? `No results for "${searchTerm}"` : 'Your menu is empty'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md hover:border-indigo-100">
              {/* Card Header: Image & Basic Info */}
              <div className="p-4 flex gap-4">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-inner">
                  {p.images?.[0]?.image_url || p.image_url ? (
                    <img
                      src={p.images?.[0]?.image_url || p.image_url}
                      alt={p.name}
                      className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-[10px] text-gray-300 font-black uppercase">
                      <ImageOff size={20} strokeWidth={2} className="mb-1" />
                      <span>Missing</span>
                    </div>
                  )}
                  {/* Veg Indicator */}
                  <div className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${p.veg ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm md:text-base leading-tight truncate">
                        {p.name}
                      </h3>
                      <div className={`text-[9px] font-black uppercase tracking-tight ${p.available ? 'text-amber-500' : 'text-gray-400'}`}>
                        {p.available ? 'Active' : 'Hidden'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAvailability(p.id, p.available)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-sm ${p.available ? 'bg-amber-500' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${p.available ? 'translate-x-[1.25rem]' : 'translate-x-1'}`} />
                      </button>
                      <button
                        onClick={() => navigate(`/restaurant/${rest_id}/menu/edit/${p.id}`)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                      >
                        <Edit3 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 line-clamp-1 mt-1 font-medium italic">
                    {p.description || p.remark || 'No description provided'}
                  </p>

                  <div className="mt-auto pt-2 flex flex-wrap gap-1">
                    {p.categories?.length > 0 ? (
                      p.categories.map(cat => (
                        <span key={cat.id} className="text-[8px] font-black px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded-md uppercase border border-gray-100">
                          {cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-300 text-[8px] uppercase font-black tracking-tighter">Main</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-50">
                <div className="space-y-1.5">
                  {p.sizes?.length > 0 ? (
                    p.sizes.slice(0, 3).map((s) => (
                      <div key={s.id} className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500 font-black uppercase tracking-widest">{s.size_label}</span>
                        <span className="font-black text-amber-600 tracking-tight">₹{s.price}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] font-black uppercase text-red-500">No Pricing</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}