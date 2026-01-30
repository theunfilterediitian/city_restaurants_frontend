import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import {
  MapPin,
  Utensils,
  ShoppingBag,
  Clock,
  CheckCircle, // Add this for open status
  XCircle, // Add this for closed status
  X,
  Plus,
  Minus,
  ShoppingBasket,
  IceCream,
  Coffee,
  Pizza,
  Drumstick,
  Salad,
  GlassWater,
  CupSoda,
  Sandwich,
  ChefHat,
  Leaf,
  Beef,
} from "lucide-react";

/* ================= CART STATE ================= */

function useCartState() {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.sizeLabel === item.sizeLabel
      );

      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });
  };

  const updateQty = (productId, sizeLabel, qty) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.sizeLabel === sizeLabel
            ? { ...i, qty }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const clear = () => setItems([]);

  return { items, addItem, updateQty, clear };
}

/* ================= CATEGORY ICON MAPPING ================= */

const CATEGORY_ICONS = {
  dessert: IceCream,
  sweets: IceCream,
  icecream: IceCream,
  cake: IceCream,
  drinks: Coffee,
  beverage: Coffee,
  coffee: Coffee,
  tea: Coffee,
  main: Pizza,
  "main course": Pizza,
  mains: Pizza,
  starter: Drumstick,
  appetizer: Drumstick,
  "side dish": Salad,
  sides: Salad,
  salad: Salad,
  soup: Salad,
  juice: GlassWater,
  smoothie: GlassWater,
  shake: CupSoda,
  mocktail: CupSoda,
  fastfood: Sandwich,
  burger: Sandwich,
  sandwich: Sandwich,
  special: ChefHat,
  signature: ChefHat,
  recommended: ChefHat,
};

const DEFAULT_ICON = ChefHat;

function getCategoryIcon(categoryName) {
  const lowerName = categoryName.toLowerCase();

  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lowerName.includes(key) || lowerName === key) {
      return icon;
    }
  }

  if (lowerName.includes('dessert') || lowerName.includes('sweet')) return IceCream;
  if (lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('coffee') || lowerName.includes('tea')) return Coffee;
  if (lowerName.includes('main') || lowerName.includes('meal')) return Pizza;
  if (lowerName.includes('starter') || lowerName.includes('appetizer')) return Drumstick;
  if (lowerName.includes('side') || lowerName.includes('salad') || lowerName.includes('soup')) return Salad;
  if (lowerName.includes('juice') || lowerName.includes('smoothie')) return GlassWater;
  if (lowerName.includes('shake') || lowerName.includes('mocktail')) return CupSoda;
  if (lowerName.includes('fast') || lowerName.includes('burger') || lowerName.includes('sandwich')) return Sandwich;

  return DEFAULT_ICON;
}

/* ================= MAIN PAGE ================= */

export default function PublicRestaurantView() {
  const { country, state, city, identifier } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [vegFilter, setVegFilter] = useState("all"); // "all", "veg", "nonveg"

  const cart = useCartState();

  useEffect(() => {
    const load = async () => {
      const res = await api.getPublicRestaurantProfile(
        country,
        state,
        city,
        identifier
      );
      setData(res.data);
      setLoading(false);
    };
    load();
  }, [country, state, city, identifier]);

  if (loading) return <LoadingScreen />;
  if (!data?.restaurant) return <NotFound />;

  const { restaurant, products } = data;

  // Extract all unique categories from products with counts
  const categoryCounts = {};
  products.forEach(product => {
    product.categories?.forEach(cat => {
      if (!categoryCounts[cat.name]) {
        categoryCounts[cat.name] = 0;
      }
      categoryCounts[cat.name]++;
    });
  });
  // Calculate category counts based on current veg filter
  const getFilteredCategoryCount = (categoryName) => {
    return products.filter(product => {
      // Apply current veg filter
      let passesVegFilter = true;
      if (vegFilter === "veg") {
        passesVegFilter = product.veg === true;
      } else if (vegFilter === "nonveg") {
        passesVegFilter = product.veg === false;
      }

      // Check if product belongs to this category
      const hasCategory = product.categories?.some(cat => cat.name === categoryName);

      return passesVegFilter && hasCategory;
    }).length;
  };
  // Sort categories by count (descending) - use filtered counts for sorting
  const allCategories = Object.keys(categoryCounts)
    .sort((a, b) => getFilteredCategoryCount(b) - getFilteredCategoryCount(a))
    .slice(0, 8);

  // Filter products based on selected categories AND veg filter
  const filteredProducts = products.filter(product => {
    // Apply veg filter
    let passesVegFilter = true;
    if (vegFilter === "veg") {
      passesVegFilter = product.veg === true;
    } else if (vegFilter === "nonveg") {
      passesVegFilter = product.veg === false;
    }

    // Apply category filter
    let passesCategoryFilter = true;
    if (selectedCategories.length > 0) {
      passesCategoryFilter = product.categories?.some(cat =>
        selectedCategories.includes(cat.name)
      );
    }

    return passesVegFilter && passesCategoryFilter;
  });

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setVegFilter("all");
  };
  // console.log(p);
  // Count products for each veg type
  const vegCount = products.filter(p => p.veg === true).length;
  const nonvegCount = products.filter(p => p.veg === false).length;

  // Determine if restaurant is open
  const isOpen = true; // Replace with actual logic based on restaurant.opening_hours
  const StatusIcon = isOpen ? CheckCircle : XCircle;
  const openStatusColor = isOpen ? "text-emerald-600" : "text-rose-600";
  const openStatusBgColor = isOpen ? "bg-emerald-50" : "bg-rose-50";
  const openStatusBorderColor = isOpen ? "border-emerald-200" : "border-rose-200";
  const statusIconColor = isOpen ? "text-emerald-500" : "text-rose-500";

  console.log(products);
  return (

    <div className="min-h-screen bg-[#FAFAFA] pb-44 font-sans">
      {/* HEADER */}
      <header className="bg-white px-6 py-10 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* LOGO AND NAME ROW */}
          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
            {/* LOGO */}
            <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center shrink-0">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={`${restaurant.name} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black text-amber-600">
                  {restaurant.name.charAt(0)}
                </span>
              )}
            </div>

            {/* NAME AND TYPE */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tightest">{restaurant.name}</h1>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${openStatusBorderColor} ${openStatusBgColor} ${openStatusColor} flex items-center gap-2 shadow-sm`}>
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                  {isOpen ? "Open Now" : "Currently Closed"}
                </div>
              </div>
              {restaurant.type && (
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Utensils size={16} className="text-amber-500" /> {restaurant.type}
                </p>
              )}
            </div>
          </div>

          {/* ADDRESS ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 group hover:border-amber-200 transition-all cursor-pointer">
              <MapPin size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-slate-700">{restaurant.location}</p>
              </div>
            </div>

          </div>
        </div>
      </header>
      {/* STICKY FILTERS SECTION */}
      <div className="sticky top-0 z-[40] glass backdrop-blur-xl border-b border-slate-200/50 py-4 px-4 md:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Digital Menu</h3>
            {(selectedCategories.length > 0 || vegFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-full transition-all"
              >
                <X size={14} /> Reset Filters
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Dietary Preference Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-[1.5rem] w-full lg:w-fit shrink-0 border border-slate-200/50">
              {[
                { id: 'all', label: 'All', icon: <ChefHat size={14} /> },
                { id: 'veg', label: 'Veg', icon: <Leaf size={14} /> },
                { id: 'nonveg', label: 'Non-Veg', icon: <Beef size={14} /> }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setVegFilter(btn.id)}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${vegFilter === btn.id
                    ? "bg-white text-slate-900 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08)] scale-[1.02]"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    }`}
                >
                  {btn.icon} <span>{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Category Filter Bar */}
            <div className="flex-1 min-w-0 w-full flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x no-scrollbar">
              <button
                onClick={() => setSelectedCategories([])}
                className={`flex-shrink-0 snap-start h-12 px-6 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-widest flex items-center gap-2 ${selectedCategories.length === 0
                  ? "border-amber-600 bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                  : "border-slate-100 bg-white text-slate-400 hover:border-amber-200 hover:text-amber-600"
                  }`}
              >
                <Utensils size={14} /> All Collections
              </button>

              {allCategories.map(category => {
                const isSelected = selectedCategories.includes(category);
                const itemCount = getFilteredCategoryCount(category);

                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`flex-shrink-0 snap-start h-12 px-6 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-widest flex items-center gap-2 relative ${isSelected
                      ? "border-amber-600 bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                      : "border-slate-100 bg-white text-slate-400 hover:border-amber-200 hover:text-amber-600"
                      }`}
                  >
                    {category}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"}`}>
                      {itemCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const itemsInCart = cart.items.filter(i => i.productId === p.id);
            const totalQty = itemsInCart.reduce((s, i) => s + i.qty, 0);
            const firstInCart = itemsInCart[0];

            return (
              <div
                key={p.id}
                className="card-premium group relative bg-white flex flex-col h-full hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-700"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative h-[280px] overflow-hidden rounded-b-[3.5rem] shadow-sm">
                  <div className="h-full bg-slate-50 overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0].image_url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        alt={p.name}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-200">
                        <Utensils size={64} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Overlays */}
                  <div className="absolute top-6 left-6 flex flex-col gap-3">
                    <div className={`h-11 w-11 rounded-2xl glass shadow-xl flex items-center justify-center border-white/40 ${p.veg ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {p.veg ? <Leaf size={22} fill="currentColor" fillOpacity={0.15} /> : <Beef size={22} fill="currentColor" fillOpacity={0.15} />}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6">
                    <span className="glass px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-xl border-white/40">
                      {p.categories?.[0]?.name || 'Specialty'}
                    </span>
                  </div>
                </div>

                {/* INFO & ACTION */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-black text-2xl text-slate-900 tracking-tightest leading-none group-hover:text-amber-600 transition-colors uppercase italic italic-none">
                        {p.name}
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{p.sizes?.[0]?.size_label || 'Standard'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 tracking-tighter shrink-0">₹{p.sizes?.[0]?.price || 0}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed h-[44px]">
                    {p.description || "A masterfully crafted signature dish prepared with handpicked ingredients for an unparalleled dining experience."}
                  </p>

                  <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
                    {totalQty === 0 ? (
                      <button
                        onClick={() => setModalItem(p)}
                        className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-amber-600 hover:shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                      >
                        <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                        Add Selection
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 p-1.5 rounded-2xl animate-fadeIn">
                        <button
                          onClick={() => {
                            if (p.sizes?.length === 1) {
                              cart.updateQty(p.id, p.sizes[0].size_label, firstInCart.qty - 1);
                            } else {
                              // Ambiguous decrement if multiple sizes -> but let's just decrement the first visible one in cart
                              cart.updateQty(p.id, firstInCart.sizeLabel, firstInCart.qty - 1);
                            }
                          }}
                          className="h-11 w-11 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm transition-all active:scale-90"
                        >
                          <Minus size={20} />
                        </button>

                        <div className="flex flex-col items-center">
                          <span className="font-black text-lg text-slate-900 leading-none">{totalQty}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">In Cart</span>
                        </div>

                        <button
                          onClick={() => {
                            if (p.sizes?.length === 1) {
                              cart.updateQty(p.id, p.sizes[0].size_label, firstInCart.qty + 1);
                            } else {
                              // Adding more of a multi-size usually requires choice, but Zomato adds the last one.
                              // For safety, open modal
                              setModalItem(p);
                            }
                          }}
                          className="h-11 w-11 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-90"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 scale-110 shadow-inner">
              <Search size={56} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Cuisine Search Nil</h3>
            <p className="text-slate-500 font-bold mt-3 max-w-sm uppercase tracking-widest text-[11px]">No matching flavors detected in our current inventory.</p>
            <button
              onClick={clearFilters}
              className="mt-12 btn-primary px-10"
            >
              Reset Culinary Parameters
            </button>
          </div>
        )}
      </main>

      {/* ADD ITEM MODAL */}
      {modalItem && (
        <AddItemModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onAdd={cart.addItem}
        />
      )}

      {/* FLOAT CART ACTION */}
      {cart.items.length > 0 && (
        <>
          <button
            onClick={() => setCartOpen(true)}
            className="fixed bottom-8 right-8 z-[100] group active:scale-90 transition-all"
          >
            <div className="relative h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-900/40 border-2 border-slate-800 transition-colors group-hover:bg-amber-600 group-hover:border-amber-500">
              <ShoppingBasket className="text-white" size={32} />
              <div className="absolute -top-3 -right-3 h-8 w-8 bg-amber-500 text-slate-900 border-4 border-white rounded-full flex items-center justify-center font-black text-xs shadow-lg animate-bounce">
                {cart.items.reduce((s, i) => s + i.qty, 0)}
              </div>
            </div>
          </button>

          {cartOpen && (
            <CartModal cart={cart} onClose={() => setCartOpen(false)} />
          )}
        </>
      )}
    </div>
  );
}

/* ================= ADD ITEM MODAL ================= */

function AddItemModal({ item, onClose, onAdd }) {
  // Initialize quantities: if only one size, start with 1. If multiple, start with 0 for all or 1 for first.
  // UX Best Practice: If they click "Add Selection", they likely want at least one.
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    item.sizes.forEach((s, idx) => {
      initial[s.id] = idx === 0 ? 1 : 0;
    });
    return initial;
  });

  const handleUpdateQty = (sizeId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [sizeId]: Math.max(0, prev[sizeId] + delta)
    }));
  };

  const totalAmount = item.sizes.reduce((sum, s) => sum + (s.price * (quantities[s.id] || 0)), 0);
  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center animate-fadeIn px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-t-[3.5rem] md:rounded-[4rem] p-6 md:p-12 shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-amber-50 rounded-full translate-x-1/2 -translate-y-1/2" />

        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 shrink-0">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl glass ${item.veg ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.veg ? <Leaf size={18} fill="currentColor" fillOpacity={0.1} /> : <Beef size={18} fill="currentColor" fillOpacity={0.1} />}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customize your selection</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tightest leading-none mb-4">{item.name}</h2>
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md">{item.description}</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-90">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          {/* Size List */}
          <div className="flex-1 overflow-y-auto pr-2 mb-8 space-y-4 no-scrollbar">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-3">
              Available Portions <div className="h-px flex-1 bg-slate-100" />
            </h4>

            {item.sizes.map((s) => {
              const qty = quantities[s.id] || 0;
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-500 ${qty > 0
                    ? "border-amber-500 bg-amber-50/30 shadow-lg shadow-amber-500/5"
                    : "border-slate-50 hover:border-slate-200 bg-slate-50/20"
                    }`}
                >
                  <div className="flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${qty > 0 ? 'text-amber-600' : 'text-slate-400'}`}>Preference</p>
                    <p className="font-bold text-xl text-slate-900 mt-1">{s.size_label}</p>
                    <p className="font-black text-amber-600 mt-1">₹{s.price}</p>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 scale-100 md:scale-110">
                    <button
                      onClick={() => handleUpdateQty(s.id, -1)}
                      className={`h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center transition-all ${qty > 0 ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white shadow-sm' : 'text-slate-200 cursor-not-allowed'
                        }`}
                      disabled={qty === 0}
                    >
                      <Minus size={18} />
                    </button>

                    <span className={`w-8 text-center font-black text-xl md:text-2xl transition-all ${qty > 0 ? 'text-slate-900' : 'text-slate-200'}`}>
                      {qty}
                    </span>

                    <button
                      onClick={() => handleUpdateQty(s.id, 1)}
                      className="h-9 w-9 md:h-10 md:w-10 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-90"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Summary */}
          <div className="pt-8 border-t border-slate-50 shrink-0">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Value</p>
                <p className="text-4xl font-black text-slate-900 tracking-tightest mt-2">₹{totalAmount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Portions</p>
                <p className="text-2xl font-black text-amber-600 mt-2">{totalItems}</p>
              </div>
            </div>

            <button
              disabled={totalItems === 0}
              onClick={() => {
                item.sizes.forEach(s => {
                  if (quantities[s.id] > 0) {
                    onAdd({
                      productId: item.id,
                      name: item.name,
                      image: item.images?.[0]?.image_url,
                      sizeLabel: s.size_label,
                      price: s.price,
                      qty: quantities[s.id],
                    });
                  }
                });
                onClose();
              }}
              className="w-full btn-primary h-20 rounded-[2rem] text-sm tracking-widest uppercase disabled:opacity-30 disabled:grayscale transition-all"
            >
              Add Selection to Cart — ₹{totalAmount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CART MODAL ================= */

function CartModal({ cart, onClose }) {
  const total = cart.items.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  return (
    <div className="fixed inset-0 z-[150] flex justify-end animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white shadow-2xl animate-slide-left flex flex-col h-full">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Review your selections</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {cart.items.length > 0 ? (
            cart.items.map((i) => (
              <div
                key={i.productId + i.sizeLabel}
                className="flex gap-6 group"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                  {i.image ? (
                    <img
                      src={i.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={i.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-900 truncate leading-tight">{i.name}</h3>
                    <p className="font-black text-slate-900 tracking-tighter shrink-0">₹{i.price * i.qty}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-amber-50 text-amber-600 rounded-md">
                      {i.sizeLabel}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">@ ₹{i.price}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-full p-1 border border-slate-100">
                      <button
                        onClick={() => cart.updateQty(i.productId, i.sizeLabel, i.qty - 1)}
                        className="h-7 w-7 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm transition-all active:scale-90"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-black text-sm text-slate-800 w-4 text-center">{i.qty}</span>
                      <button
                        onClick={() => cart.updateQty(i.productId, i.sizeLabel, i.qty + 1)}
                        className="h-7 w-7 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 shadow-sm transition-all active:scale-90"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => cart.updateQty(i.productId, i.sizeLabel, 0)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6">
                <ShoppingBasket size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-[200px]">Discover the flavors from our menu and start your journey.</p>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.items.length > 0 && (
          <div className="p-8 bg-slate-50/50 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">₹{total}</p>
              </div>
              <button
                onClick={cart.clear}
                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <button className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm">
              Proceed to Checkout
            </button>
            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2">
              <Clock size={12} /> Est. Delivery 25-35 mins
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= UTILS ================= */

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading…
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Not Found
    </div>
  );
}