import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import FlyToCartAnimation from "../components/FlyToCartAnimation";
import {
  MapPin,
  Utensils,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Plus,
  Minus,
  ShoppingBasket,
  ChevronDown,
  ChevronUp,
  Search,
  ChefHat,
  Leaf,
  Filter,
  Star,
  Flame,
  Clock as ClockIcon,
  Image as ImageIcon,
  Hash,
  AlertCircle,
  Menu,
  Phone,
  Instagram,
  Smartphone,
  Info,
  Globe,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


/* ================= CART STATE ================= */
function useCartState() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.sizeLabel === item.sizeLabel
      );

      let newItems;
      if (existing) {
        newItems = prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + item.qty } : i
        );
      } else {
        newItems = [...prev, item];
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateQty = (productId, sizeLabel, qty) => {
    setItems((prev) => {
      const newItems = prev
        .map((i) =>
          i.productId === productId && i.sizeLabel === sizeLabel
            ? { ...i, qty }
            : i
        )
        .filter((i) => i.qty > 0);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeItem = (productId, sizeLabel) => {
    setItems((prev) => {
      const newItems = prev.filter(i => !(i.productId === productId && i.sizeLabel === sizeLabel));
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const clear = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  return { items, addItem, updateQty, removeItem, clear };
}

/* ================= UTILITY COMPONENTS ================= */
const ImageFallback = ({ name, className = "" }) => {
  return (
    <div className={`bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center">
        <QrCode className="text-slate-200" size={className.includes('w-24') ? 32 : 24} />
      </div>
    </div>
  );
};

/* ================= PRODUCT CARD COMPONENT ================= */
const ProductCard = ({ product, cart, onAddTrigger }) => {
  const itemsInCart = cart.items.filter(i => i.productId === product.id);
  const hasImage = product.images?.[0]?.image_url;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-amber-300 transition-all group shadow-sm hover:shadow-md">
      {/* First Row: Name and Image */}
      <div className="flex justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3.5 h-3.5 border-2 ${product.veg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center rounded-sm shrink-0`}>
              <div className={`w-1.5 h-1.5 rounded-full ${product.veg ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg truncate uppercase tracking-tight">
              {product.name}
            </h3>
          </div>

          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-2">
            {product.description || 'Expertly prepared with fresh, premium ingredients for a truly delightful dining experience.'}
          </p>

          <div className="flex items-center gap-2">
            {product.is_popular && (
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                <Flame size={10} className="fill-amber-600" /> Bestseller
              </span>
            )}
          </div>
        </div>

        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm shrink-0 relative">
          {hasImage ? (
            <img
              src={product.images[0].image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <ImageFallback
            name={product.name}
            className={`w-full h-full ${hasImage ? 'hidden' : 'flex'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Options Section */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
        {product.sizes?.map((size, idx) => {
          const cartItem = cart.items.find(i => i.productId === product.id && i.sizeLabel === size.size_label);
          const qty = cartItem?.qty || 0;

          return (
            <div key={size.id || idx} className="flex items-center justify-between group/opt">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover/opt:text-amber-600 transition-colors">
                  {size.size_label}
                </span>
                <span className="text-lg font-black text-slate-900">₹{size.price}</span>
              </div>

              <div className="min-w-[120px] flex justify-end">
                {qty > 0 ? (
                  <div className="flex items-center gap-3 bg-amber-50 px-2 py-1 rounded-xl border border-amber-100 shadow-sm animate-fadeIn">
                    <button
                      onClick={() => cart.updateQty(product.id, size.size_label, qty - 1)}
                      className="w-8 h-8 rounded-full bg-white text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-all border border-amber-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-black text-slate-900 w-6 text-center text-sm">{qty}</span>
                    <button
                      onClick={(e) => {
                        cart.updateQty(product.id, size.size_label, qty + 1);
                        onAddTrigger?.(e);
                      }}
                      className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-200 transition-all hover:bg-amber-700"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      cart.addItem({
                        productId: product.id,
                        name: product.name,
                        price: size.price,
                        sizeLabel: size.size_label,
                        image: product.images?.[0]?.image_url,
                        qty: 1
                      });
                      onAddTrigger?.(e);
                    }}
                    className="h-10 px-6 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-amber-600 transition-all flex items-center gap-2 group/btn active:scale-95"
                  >
                    <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function PublicRestaurantView() {
  const { country, state, city, identifier } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [vegFilter, setVegFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cart = useCartState();
  const flyToCartRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getPublicRestaurantProfile(
          country,
          state,
          city,
          identifier
        );
        setData(res.data);
        setLoading(false);

        // Initialize all categories as expanded
        if (res.data?.products) {
          const categories = {};
          res.data.products.forEach(product => {
            product.categories?.forEach(cat => {
              categories[cat.name] = true;
            });
          });
          setExpandedCategories(categories);
        }
      } catch (err) {
        setLoading(false);
      }
    };
    load();
  }, [country, state, city, identifier]);

  if (loading) return <LoadingScreen />;
  if (!data?.restaurant) return <NotFound />;

  const { restaurant, products } = data;

  // Group products by category
  const categories = {};
  products.forEach(product => {
    product.categories?.forEach(cat => {
      if (!categories[cat.name]) {
        categories[cat.name] = [];
      }
      categories[cat.name].push(product);
    });
  });

  // Filter products
  let filteredProducts = products.filter(product => {
    // Veg filter
    if (vegFilter === "veg" && !product.veg) return false;
    if (vegFilter === "nonveg" && product.veg) return false;

    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const productCategoryNames = product.categories?.map(c => c.name) || [];
      if (!selectedCategories.some(cat => productCategoryNames.includes(cat))) {
        return false;
      }
    }

    return true;
  });

  // Group filtered products by category for display
  const filteredCategories = {};
  filteredProducts.forEach(product => {
    product.categories?.forEach(cat => {
      if (!filteredCategories[cat.name]) {
        filteredCategories[cat.name] = [];
      }
      filteredCategories[cat.name].push(product);
    });
  });

  const scrollToCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: true
    }));
    setTimeout(() => {
      const el = document.getElementById(`category-${categoryName}`);
      if (el) {
        const yOffset = -150; // Account for sticky filters
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset + yOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const expandAllCategories = () => {
    const allExpanded = {};
    Object.keys(categories).forEach(cat => {
      allExpanded[cat] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const collapseAllCategories = () => {
    const allCollapsed = {};
    Object.keys(categories).forEach(cat => {
      allCollapsed[cat] = false;
    });
    setExpandedCategories(allCollapsed);
  };

  const clearFilters = () => {
    setVegFilter("all");
    setSearchQuery("");
    setSelectedCategories([]);
  };

  const toggleCategorySelection = (category) => {
    setSelectedCategories(prev => {
      const isSelecting = !prev.includes(category);
      if (isSelecting) {
        setExpandedCategories(curr => ({ ...curr, [category]: true }));
      }
      return isSelecting
        ? [...prev, category]
        : prev.filter(c => c !== category);
    });
  };

  // Check if restaurant is open
  const isOpen = true;
  const totalCartItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
  const totalCartValue = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <style>{`
        .no-scrollbar::-webkit-scrollbar, .scrollbar-hide::-webkit-scrollbar { display: none; }
        .no-scrollbar, .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* Restaurant Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm bg-white shrink-0">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
                        <span class="text-2xl font-black text-orange-500">${restaurant.name.charAt(0)}</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
                  <span className="text-2xl font-black text-orange-500">{restaurant.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-1 truncate">
                {restaurant.name}
              </h1>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} className="text-amber-500 shrink-0" />
                  <span className="text-sm font-bold truncate uppercase tracking-wide">
                    {restaurant.location || 'Location not specified'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                    <Utensils size={12} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                      {restaurant.type || 'Restaurant'}
                    </span>
                  </div>
                  {restaurant.rating && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-md border border-green-100">
                      <Star size={12} className="text-green-600 fill-green-600" />
                      <span className="text-[10px] font-black text-green-700">{restaurant.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary-light hover:text-primary transition-all border border-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 py-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) {
                      setSelectedCategories([]);
                      expandAllCategories();
                    }
                  }}
                  onFocus={() => {
                    setSelectedCategories([]);
                    expandAllCategories();
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100/80 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all placeholder:text-gray-400 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Veg Toggle */}
            <button
              type="button"
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg border transition-all cursor-pointer group outline-none ${vegFilter === 'veg'
                ? 'bg-green-50 border-green-200 shadow-sm shadow-green-100'
                : 'bg-gray-100/50 border-gray-200 hover:bg-gray-100'
                }`}
              onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
            >
              <span className={`text-[8px] font-black uppercase tracking-tighter mb-0.5 transition-colors ${vegFilter === 'veg' ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                }`}>Veg</span>
              <div
                className={`relative inline-flex h-3.5 w-7 items-center rounded-full transition-colors focus:outline-none ${vegFilter === 'veg' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${vegFilter === 'veg' ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </button>
          </div>

          {/* Premium Categories Scroll Bar */}
          <div className="pb-6">
            <div className="flex-1 min-w-0 w-full flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x no-scrollbar">
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  expandAllCategories();
                }}
                className={`flex-shrink-0 snap-start h-12 px-6 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-widest flex items-center gap-2 ${selectedCategories.length === 0
                  ? "border-amber-600 bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                  : "border-slate-100 bg-white text-slate-400 hover:border-amber-200 hover:text-amber-600"
                  }`}
              >
                <Utensils size={14} /> All            </button>

              {Object.keys(categories).map(category => {
                const isSelected = selectedCategories.includes(category);
                const itemCount = categories[category].length;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      toggleCategorySelection(category);
                      if (!selectedCategories.includes(category)) {
                        scrollToCategory(category);
                      }
                    }}
                    className={`flex-shrink-0 snap-start h-12 px-6 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-widest flex items-center gap-2 relative ${isSelected
                      ? "border-amber-600 bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                      : "border-slate-100 bg-white text-slate-400 hover:border-amber-200 hover:text-amber-600"
                      }`}
                  >
                    {category}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"
                      }`}>
                      {itemCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {Object.keys(filteredCategories).length > 0 ? (
          Object.entries(filteredCategories).map(([category, categoryProducts]) => (
            <div
              key={category}
              id={`category-${category}`}
              className="mb-6 bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <div
                className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50/50 transition-colors group"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-5">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{category}</h2>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{categoryProducts.length} items</p>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-100 transition-all">
                  {expandedCategories[category] ? (
                    <ChevronUp className="text-gray-600 group-hover:text-amber-700" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-600 group-hover:text-amber-700" size={24} />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {expandedCategories[category] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 space-y-4">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cart={cart}
                          onAddTrigger={(e) => flyToCartRef.current?.trigger(e.clientX, e.clientY)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Search className="text-gray-400" size={48} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white">
                <AlertCircle className="text-orange-500" size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No matching dishes found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any dishes matching your criteria. Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Cart FAB */}
      <>
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 animate-bounce-once"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="relative group">
            <div className="w-16 h-16 bg-primary rounded-2xl shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBasket className="text-white" size={28} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-primary shadow-lg">
              <span className="font-bold text-primary text-sm">{totalCartItems}</span>
            </div>
            <div className="absolute -bottom-12 right-0 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              View Cart {totalCartItems > 0 && `• ₹${totalCartValue}`}
            </div>
          </div>
        </button>

        {cartOpen && (
          <CartModal
            cart={cart}
            onClose={() => setCartOpen(false)}
            restaurantName={restaurant.name}
          />
        )}
      </>

      <FlyToCartAnimation ref={flyToCartRef} />

      {/* Info Sidebar */}
      <InfoSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        restaurant={restaurant}
      />
    </div>
  );
}

/* ================= INFO SIDEBAR ================= */
function InfoSidebar({ isOpen, onClose, restaurant }) {
  const brandName = "Indian Restros";
  const playStoreUrl = "#"; // Replace with real Play Store link
  const instagramUrl = "https://instagram.com/indianrestros";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-[300px] bg-white h-full flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Information</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Sidebar Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">

              {/* Restaurant Info Card */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-xl mx-auto group-hover:scale-105 transition-transform duration-500">
                    {restaurant.logo_url ? (
                      <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-light flex items-center justify-center text-primary font-black text-4xl">
                        {restaurant.name?.[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{restaurant.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1 px-4">
                    <MapPin size={12} className="text-primary shrink-0" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{restaurant.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Cuisine</span>
                    <span className="text-[10px] font-black text-gray-700 uppercase">{restaurant.type || 'Dining'}</span>
                  </div>
                  <div className="p-3 bg-green-50/50 rounded-2xl border border-green-100 text-center">
                    <span className="block text-[8px] font-black text-green-400 uppercase tracking-widest mb-1">Status</span>
                    <span className="text-[10px] font-black text-green-600 uppercase">Open Now</span>
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              {restaurant.phone_number && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Connect with us</h4>

                  <div className="space-y-2">
                    <a href={`tel:${restaurant.phone_number}`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary hover:shadow-lg hover:shadow-primary-shadow transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-primary-extraLight flex items-center justify-center text-primary transition-colors border border-primary-light/50">
                        <Phone size={14} />
                      </div>
                      <span className="text-xs font-black text-gray-600 uppercase tracking-wider">{restaurant.phone_number}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Delivery Details */}
              <div className="p-5 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-12 -mt-12" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                      <ShoppingBag size={14} className="text-white" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Home Delivery</h4>
                  </div>
                  <p className="text-xs font-bold text-gray-400 mb-4 leading-relaxed">
                    Order directly and get delivery within <span className="text-white font-black">{restaurant.delivery_radius || '5 KM'}</span> radius.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
                    <ClockIcon size={12} />
                    30-45 Mins
                  </div>
                </div>
              </div>

              {/* Get The App & Social */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-1">
                  <Smartphone className="text-primary" size={16} />
                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">The Experience</h4>
                </div>

                {/* Play Store Card */}
                <a href={playStoreUrl} className="block group">
                  <div className="relative overflow-hidden bg-slate-900 p-5 rounded-[2rem] border border-white/10 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group-hover:shadow-primary-shadow/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                        <img
                          src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg"
                          alt="Google Play"
                          className="w-7 h-7"
                        />
                      </div>
                      <div>
                        <span className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Available on</span>
                        <span className="block text-sm font-black text-white uppercase tracking-tight leading-none">Google Play</span>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Instagram Card */}
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border border-slate-100 hover:border-primary hover:shadow-xl hover:shadow-primary-shadow transition-all group">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100 group-hover:scale-110 transition-transform">
                      <Instagram size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Follow us</span>
                    <span className="block text-sm font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors uppercase">@indianrestros</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex flex-col items-center">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Powered By</div>
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary-shadow">
                    <QrCode className="text-white" size={14} />
                  </div>
                  <span className="text-sm font-black text-gray-900 tracking-tighter uppercase">{brandName}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}



/* ================= CART MODAL ================= */
function CartModal({ cart, onClose, restaurantName }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const total = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
  const deliveryFee = total < 300 ? 40 : 0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white h-full animate-slide-left flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Order</h2>
              <p className="text-sm text-gray-600">{restaurantName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="text-gray-700" size={20} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 scrollbar-hide">
          {cart.items.length > 0 ? (
            <div className="p-6 space-y-4">
              {cart.items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.sizeLabel}`}
                  className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow group animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 group-hover:scale-105 transition-transform duration-500 shadow-inner border border-slate-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full bg-primary/5 flex items-center justify-center">
                                <span class="text-xl font-black text-primary/30">${item.name.charAt(0)}</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                          <span className="text-xl font-black text-primary/30">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-gray-900 truncate leading-tight uppercase text-sm tracking-tight">{item.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-wider">{item.sizeLabel}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className="font-black text-gray-900 text-base group-hover:text-primary transition-colors">
                            {item.qty} × ₹{item.price}
                          </div>
                          <div className="text-[15px] font-black text-slate-400 uppercase tracking-tighter">

                            ₹{item.price * item.qty}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                          <button
                            onClick={() => cart.updateQty(item.productId, item.sizeLabel, item.qty - 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm hover:text-red-600 transition-all active:scale-90"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="font-black text-gray-900 w-10 text-center text-xs">{item.qty}</span>
                          <button
                            onClick={() => cart.updateQty(item.productId, item.sizeLabel, item.qty + 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm hover:text-green-600 transition-all active:scale-90"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>

                        <button
                          onClick={() => cart.removeItem(item.productId, item.sizeLabel)}
                          className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors"
                          title="Remove Item"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

              <div className="w-48 h-48 mb-10 relative">
                <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl rotate-6 animate-pulse opacity-50" />
                <div className="relative w-full h-full bg-white rounded-[3rem] shadow-xl border border-slate-50 flex items-center justify-center -rotate-3 transition-transform hover:rotate-0 duration-500">
                  <div className="relative">
                    <ShoppingBag className="text-slate-100" size={100} strokeWidth={1} />
                    <XCircle className="absolute -top-2 -right-2 text-rose-400 fill-white" size={32} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-w-[280px]">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tightest leading-none bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                  {[
                    "Bhukkad! Cart khali kyun hai?",
                    "Khaali bag leke ghoomoge?",
                    "Pet pooja shuru karein?",
                    "Menu dekhne ke paise nahi hain!",
                    "Wait, dieting chal rahi hai?",
                    "Kitchen band hone wala hai, jaldi!",
                    "Wallet ghar pe bhul gaye kya?",
                    "Itna sasta menu aur cart khali?",
                    "Selection nahi ho raha?",
                    "Shauk sardaar ke, pocket bekaar ke?",
                    "Bura na maano, cart khaali hai!",
                    "Oye! Kuch toh mangao!",
                    "Bas window shopping karoge?",
                    "Kitchen wale bor ho rahe hain!",
                    "Arey bhai bhai bhai, cart khali?",
                    "Dieting kal, aaj kha lo!",
                    "Itna sannata kyun hai cart mein?",
                    "Khane ki khushboo nahi aa rahi?",
                    "Waiter wait kar raha hai, jaldi!",
                    "Kya aapko bhook nahi lagti?",
                    "Cart ko thoda pyar do, bhar dalo!",
                    "Khali cart achha nahi lagta!",
                    "Jaldi mangao, padosi kha jayenge!",
                    "Pet mein chuhe daud rahe hain?",
                    "Selection solid hai, cart khali kyun?"
                  ][Math.floor(Math.random() * 25)]}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                  {[
                    "Kuch to add karo, kitchen wale free baithe hain!",
                    "Sharam karo, itna achha menu aur cart khali?",
                    "Order nahi karoge toh waiter gussa ho jayega!",
                    "Ghar se khana khake aaye ho kya?",
                    "Sirf photos dekhne aaye ho?",
                    "Paisa hai toh kharche karo, kal kisne dekha!",
                    "Ek paneer tikka toh banta hai boss!",
                    "Dessert section check kiya? Gazab hai!",
                    "Order kar do, warna padosi ka bill bharoge!",
                    "Kitchen staff cricket khel raha hai, kaam do!",
                    "Itne mein toh sirf paani milega, add karo!",
                    "Chef ne khaas tumhare liye masala peesa hai!",
                    "Cart khali rakhne ke paise nahi milte!",
                    "Pet khush, tum khush, menu khush!",
                    "Order kar do, bhook zalim cheez hai!",
                    "Gym kal se, aaj toh bas party!",
                    "Menu itna bada, selection itna kam? No way!",
                    "Kitchen se mast khushboo aa rahi hai, check karo!",
                    "2-min maggi nahi, asli khana milega!",
                    "Ek item add karo, cart ko bura lag raha hai!",
                    "Free mein gyan milta hai, menu check karo!",
                    "Chef aaj mood mein hai, mangao toh sahi!",
                    "Bhook lag rahi hai na? Humein toh lag rahi hai!",
                    "Cart bhar do, dil jeet lo!",
                    "Itna sochna kya? Jo pasand hai, add karo!"
                  ][Math.floor(Math.random() * 25)]}
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-10 px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200"
              >
                Start Exploring
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t bg-white p-6 space-y-6">
            {/* Grand Total */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-gray-600 font-bold uppercase tracking-widest text-xs">Grand Total</span>
              <span className="text-2xl font-black text-gray-900">₹{finalTotal}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                className="w-full py-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                onClick={() => alert("Please call the waiter to place this order! (QR Scan Menu)")}
              >
                {[
                  "Bas Itna Hi? Dieting Pe Ho Kya?",
                  "Order Kar Do, Bhook Lagi Hai!",
                  "Kam Bill? Thoda Aur Mangao!",
                  "Waitrer Ko Bulau Ya Khud Aaoge?",
                  "Zindagi Choti Hai, Kuch Aur Add Karo!",
                  "Bas? Party Over? Thoda Aur Add Karo!",
                  "Paise Hain Na? Order Karein?",
                  "Kamaal Hai, Itne Mein Kya Hoga?",
                  "Pet Bharega Itne Mein? Aur Mangao!",
                  "Sahi Hai, Dieting Chalu Hai Shayad!",
                  "Oye, Order toh kar, waiter bura maan jayega!",
                  "Bill dekh ke dar gaye kya? mangao mangao!",
                  "Thoda aur chakh lo, maza aa jayega!",
                  "Bas itne mein hi dher? aur add karo!",
                  "Full plate khao, half mein kya rakha hai!",
                  "Desert bhul gaye? Sahi hai!",
                  "Order kar do, bhook ka sawal hai!",
                  "Chef khush ho jayega thoda aur mangao!",
                  "Itne mein toh sirf starter hota hai!",
                  "Party abhi baaki hai, aur add karo!",
                  "Thoda aur, thoda aur... maza aayega!",
                  "Kha lo jee bhar ke, bill toh bharna hi hai!",
                  "Dieting ko goli maaro, order karo!",
                  "Waiter tumhare liye khada hai, order kar do!",
                  "Cart mast lag raha hai, par thoda adha hai!"
                ][Math.floor(Math.random() * 25)]}
              </button>

              {showClearConfirm ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100 animate-fadeIn">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-tight">Remove all items?</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        cart.clear();
                        setShowClearConfirm(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-4 py-2 bg-white text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= UTILS ================= */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-gray-700 font-medium">Loading delicious menu...</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center max-w-md px-4">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <XCircle className="text-gray-400" size={64} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center border-8 border-white">
            <ChefHat className="text-orange-500" size={24} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Restaurant Not Found</h2>
        <p className="text-gray-600 mb-8">
          The restaurant you're looking for doesn't exist or has been removed from our platform.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}