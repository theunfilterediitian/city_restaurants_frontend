import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
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
  const initials = name
    ? name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    : 'FD';

  const colors = [
    'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600',
    'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600',
    'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600',
    'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600',
    'bg-gradient-to-br from-red-100 to-rose-100 text-red-600',
  ];

  const colorIndex = name
    ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    : 0;

  return (
    <div className={`${colors[colorIndex]} ${className} flex items-center justify-center`}>
      {name ? (
        <>
          <span className="font-bold text-lg">{initials}</span>
          <ImageIcon className="absolute opacity-20" size={24} />
        </>
      ) : (
        <ImageIcon size={24} className="opacity-50" />
      )}
    </div>
  );
};

/* ================= PRODUCT CARD COMPONENT ================= */
const ProductCard = ({ product, cart, onItemClick }) => {
  const itemsInCart = cart.items.filter(i => i.productId === product.id);
  const totalQty = itemsInCart.reduce((s, i) => s + i.qty, 0);
  const hasImage = product.images?.[0]?.image_url;
  const defaultSize = product.sizes?.[0];

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
            {product.sizes?.length > 1 && (
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                {product.sizes.length} Options
              </span>
            )}
          </div>
        </div>

        {hasImage && (
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0 relative">
            <img
              src={product.images[0].image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Second Row: Price and Button */}
      <div className="flex items-center justify-between border-t border-slate-50">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
            <span className="text-xl font-black text-slate-900">₹{defaultSize?.price || 0}</span>
          </div>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            {defaultSize?.size_label || 'Regular'}
          </span>
        </div>

        <div>
          {totalQty > 0 ? (
            <div className="flex items-center gap-3 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              <button
                onClick={() => {
                  if (product.sizes?.length === 1) {
                    cart.updateQty(product.id, product.sizes[0].size_label, totalQty - 1);
                  } else {
                    onItemClick(product);
                  }
                }}
                className="w-8 h-8 rounded-full bg-white text-amber-600 flex items-center justify-center hover:bg-amber-200 transition-colors shadow-sm"
              >
                <Minus size={14} />
              </button>
              <span className="font-black text-slate-900 min-w-[20px] text-center text-sm">{totalQty}</span>
              <button
                onClick={() => {
                  if (product.sizes?.length === 1) {
                    cart.updateQty(product.id, product.sizes[0].size_label, totalQty + 1);
                  } else {
                    onItemClick(product);
                  }
                }}
                className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-200 transition-all hover:bg-amber-700"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onItemClick(product)}
              className="h-10 px-8 bg-amber-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-200 transition-all flex items-center gap-2 group/btn active:scale-95"
            >
              <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function PublicRestaurantView() {
  const { country, state, city, identifier } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [vegFilter, setVegFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);

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
                          onItemClick={setModalItem}
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

      {/* Product Modal */}
      {modalItem && (
        <ProductModal
          item={modalItem}
          cart={cart}
          onClose={() => setModalItem(null)}
        />
      )}
    </div>
  );
}

/* ================= PRODUCT MODAL ================= */
function ProductModal({ item, cart, onClose }) {
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const itemsInCart = cart.items.filter(i =>
    i.productId === item.id && i.sizeLabel === selectedSize?.size_label
  );
  const currentQty = itemsInCart.reduce((sum, i) => sum + i.qty, 0);
  const hasImage = item.images?.[0]?.image_url;

  const handleAddToCart = () => {
    if (selectedSize) {
      cart.addItem({
        productId: item.id,
        name: item.name,
        image: item.images?.[0]?.image_url,
        sizeLabel: selectedSize.size_label,
        price: selectedSize.price,
        qty: quantity,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Product Header */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {hasImage ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={item.images[0].image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                          <span class="text-lg font-bold text-orange-600">${item.name.charAt(0)}</span>
                        </div>
                      `;
                    }}
                  />
                </div>
              ) : (
                <ImageFallback
                  name={item.name}
                  className="w-16 h-16 rounded-xl border border-gray-200"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{item.name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${item.veg
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {item.veg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </div>
                  {item.is_popular && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                      Popular
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="text-gray-700" size={20} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {item.description && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          )}

          {/* Size Selection */}
          {item.sizes?.length > 1 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Choose Size</h3>
              <div className="space-y-3">
                {item.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${selectedSize?.id === size.id
                      ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50'
                      : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
                      }`}
                  >
                    <div>
                      <div className="font-bold text-gray-900">{size.size_label}</div>
                      <div className="text-sm text-gray-500">Portion size details</div>
                    </div>
                    <div className="font-bold text-orange-600 text-lg">₹{size.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center justify-between max-w-xs bg-gray-50 p-4 rounded-2xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <Minus className="text-gray-600" size={20} />
              </button>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{quantity}</div>
                <div className="text-sm text-gray-500">Quantity</div>
              </div>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <Plus className="text-gray-600" size={20} />
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Price per item</span>
              <span className="font-bold text-gray-900">₹{selectedSize?.price || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-orange-600">
                ₹{(selectedSize?.price || 0) * quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t p-6 bg-white">
          {currentQty > 0 ? (
            <div className="flex gap-4">
              <button
                onClick={() => cart.removeItem(item.id, selectedSize?.size_label)}
                className="flex-1 px-6 py-4 border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
              >
                Remove from Cart
              </button>
              <button
                onClick={() => {
                  cart.updateQty(item.id, selectedSize?.size_label, currentQty + quantity);
                  onClose();
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Add {quantity} More
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all active:scale-95"
            >
              Add to Cart • ₹{(selectedSize?.price || 0) * quantity}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= CART MODAL ================= */
function CartModal({ cart, onClose, restaurantName }) {
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
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length > 0 ? (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={`${item.productId}-${item.sizeLabel}`} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-300 bg-white">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-primary-light flex items-center justify-center">
                              <span class="text-sm font-bold text-primary">${item.name.charAt(0)}</span>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-light flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{item.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.sizeLabel}</p>
                      </div>
                      <div className="font-bold text-gray-900 text-lg shrink-0 ml-4">
                        ₹{item.price * item.qty}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border">
                        <button
                          onClick={() => cart.updateQty(item.productId, item.sizeLabel, item.qty - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-gray-900 w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => cart.updateQty(item.productId, item.sizeLabel, item.qty + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 hover:text-green-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => cart.removeItem(item.productId, item.sizeLabel)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-40 h-40 mb-6">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBasket className="text-gray-300" size={80} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {[
                  "Bhukkad! Cart khali kyun hai?",
                  "Khaali bag leke ghoomoge?",
                  "Pet pooja shuru karein?",
                  "Menu dekhne ke paise nahi hain!",
                  "Wait, dieting chal rahi hai?",
                  "Kitchen band hone wala hai, jaldi!"
                ][Math.floor(Math.random() * 6)]}
              </h3>
              <p className="text-gray-600 mb-8">
                {[
                  "Kuch to add karo, kitchen wale free baithe hain!",
                  "Sharam karo, itna achha menu aur cart khali?",
                  "Order nahi karoge toh waiter gussa ho jayega!",
                  "Ghar se khana khake aaye ho kya?",
                  "Sirf photos dekhne aaye ho?",
                  "Paisa hai toh kharche karo, kal kisne dekha!"
                ][Math.floor(Math.random() * 6)]}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                Browse Menu
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
                  "Sahi Hai, Dieting Chalu Hai Shayad!"
                ][Math.floor(Math.random() * 10)]}
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    cart.clear();
                  }
                }}
                className="w-full py-3 border-2 border-gray-200 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Clear Cart
              </button>
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