import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import {
  MapPin,
  Utensils,
  ShoppingBag,
  Clock,
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

  // Sort categories by count (descending)
  const allCategories = Object.keys(categoryCounts)
    .sort((a, b) => categoryCounts[b] - categoryCounts[a])
    .slice(0, 8);

  // Filter products based on selected categories AND veg filter
  const filteredProducts = products.filter(product => {
    // Apply veg filter
    let passesVegFilter = true;
    if (vegFilter === "veg") {
      passesVegFilter = product.is_vegetarian === true;
    } else if (vegFilter === "nonveg") {
      passesVegFilter = product.is_vegetarian === false;
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

  // Count products for each veg type
  const vegCount = products.filter(p => p.is_vegetarian === true).length;
  const nonvegCount = products.filter(p => p.is_vegetarian === false).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* HEADER */}
      <header className="bg-white px-6 py-8 border-b">
        <h1 className="text-4xl font-black">{restaurant.name}</h1>
        <div className="flex gap-4 mt-2 text-slate-500">
          <span className="flex gap-1">
            <Utensils size={16} /> {restaurant.type}
          </span>
          <span className="flex gap-1">
            <MapPin size={16} /> {restaurant.location}
          </span>
          <span className="flex gap-1">
            <Clock size={16} /> Open Now
          </span>
        </div>
      </header>

      {/* VEG/NON-VEG FILTER */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-black">Menu</h2>
          {(selectedCategories.length > 0 || vegFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Veg/Non-Veg Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setVegFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              vegFilter === "all"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <ChefHat size={18} />
            <span className="font-medium">All</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              vegFilter === "all"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setVegFilter("veg")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              vegFilter === "veg"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <Leaf size={18} className="text-green-600" />
            <span className="font-medium">Veg</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              vegFilter === "veg"
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              {vegCount}
            </span>
          </button>

          <button
            onClick={() => setVegFilter("nonveg")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              vegFilter === "nonveg"
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <Beef size={18} className="text-red-600" />
            <span className="font-medium">Non-Veg</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              vegFilter === "nonveg"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              {nonvegCount}
            </span>
          </button>
        </div>

        {/* HORIZONTAL CATEGORY FILTER */}
        <div className="mb-4">
          {/* Category Filter Bar */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategories([])}
              className={`flex flex-col items-center justify-center min-w-[80px] px-4 py-3 rounded-2xl border-2 transition-all ${
                selectedCategories.length === 0
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <ChefHat size={24} />
              <span className="mt-2 text-xs font-bold">All</span>
            </button>

            {allCategories.map(category => {
              const Icon = getCategoryIcon(category);
              const isSelected = selectedCategories.includes(category);
              const itemCount = categoryCounts[category];

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`flex flex-col items-center justify-center min-w-[80px] px-4 py-3 rounded-2xl border-2 transition-all relative ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Icon size={24} />
                  <span className="mt-2 text-xs font-bold text-center truncate max-w-full">
                    {category}
                  </span>
                  <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected 
                      ? "bg-emerald-500 text-white" 
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Filters Indicator */}
          {(selectedCategories.length > 0 || vegFilter !== "all") && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">Filters:</span>
              <div className="flex flex-wrap gap-2">
                {/* Veg/Non-Veg Filter Badge */}
                {vegFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={{
                      backgroundColor: vegFilter === "veg" ? '#dcfce7' : '#fee2e2',
                      color: vegFilter === "veg" ? '#166534' : '#991b1b'
                    }}
                  >
                    {vegFilter === "veg" ? (
                      <>
                        <Leaf size={12} />
                        Veg
                      </>
                    ) : (
                      <>
                        <Beef size={12} />
                        Non-Veg
                      </>
                    )}
                    <button
                      onClick={() => setVegFilter("all")}
                      className="ml-1 hover:opacity-70"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* Category Filter Badges */}
                {selectedCategories.map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                  >
                    {cat}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="hover:text-emerald-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCTS */}
      <main className="px-6 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border p-4 hover:shadow-lg transition"
            >
              {/* PRODUCT IMAGE WITH VEG/NON-VEG INDICATOR */}
              <div className="relative">
                <div className="h-44 bg-slate-100 rounded-xl overflow-hidden">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0].image_url}
                      className="w-full h-full object-cover"
                      alt={p.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag />
                    </div>
                  )}
                </div>
                
                {/* Veg/Non-Veg Dot Indicator */}
                {p.is_vegetarian !== undefined && (
                  <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center ${
                    p.is_vegetarian 
                      ? "bg-green-100 border-2 border-green-500" 
                      : "bg-red-100 border-2 border-red-500"
                  }`}>
                    {p.is_vegetarian ? (
                      <Leaf size={16} className="text-green-600" />
                    ) : (
                      <Beef size={16} className="text-red-600" />
                    )}
                  </div>
                )}
              </div>

              {/* PRODUCT NAME */}
              <h3 className="mt-4 font-black text-lg">{p.name}</h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                {p.description}
              </p>

              {/* CATEGORY TAGS */}
              {p.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {/* PRICE + ADD */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <span className="font-black text-indigo-600 text-lg">
                    ₹{p.sizes?.[0]?.price || 0}
                  </span>
                  {p.is_vegetarian !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.is_vegetarian 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {p.is_vegetarian ? "Veg" : "Non-Veg"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setModalItem(p)}
                  className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold flex gap-2 items-center"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-slate-400 mb-4">No items found for selected filters</div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-medium"
            >
              Show All Items
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

      {/* CART BAR */}
      {cart.items.length > 0 && (
        <>
          <div
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer"
          >
            <ShoppingBasket className="text-white" />
            <span className="absolute -top-2 -right-2 bg-white text-emerald-600 w-7 h-7 rounded-full flex items-center justify-center font-bold">
              {cart.items.reduce((s, i) => s + i.qty, 0)}
            </span>
          </div>

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
  const [size, setSize] = useState(item.sizes?.[0]);
  const [qty, setQty] = useState(1);

  const total = size.price * qty;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        {/* MODAL HEADER WITH VEG/NON-VEG INDICATOR */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black">{item.name}</h2>
          {item.is_vegetarian !== undefined && (
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              item.is_vegetarian 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {item.is_vegetarian ? (
                <>
                  <Leaf size={14} />
                  Vegetarian
                </>
              ) : (
                <>
                  <Beef size={14} />
                  Non-Vegetarian
                </>
              )}
            </span>
          )}
        </div>

        <div className="mt-6 space-y-2">
          {item.sizes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSize(s)}
              className={`w-full p-4 rounded-xl border ${
                size.id === s.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200"
              }`}
            >
              {s.size_label} — ₹{s.price}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4 items-center">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>
              <Minus />
            </button>
            <span className="font-bold text-xl">{qty}</span>
            <button onClick={() => setQty(qty + 1)}>
              <Plus />
            </button>
          </div>
          <span className="font-black text-xl">₹{total}</span>
        </div>

        <button
          onClick={() => {
            onAdd({
              productId: item.id,
              name: item.name,
              image: item.images?.[0]?.image_url,
              sizeLabel: size.size_label,
              price: size.price,
              qty,
            });
            onClose();
          }}
          className="mt-6 w-full py-4 bg-emerald-600 text-white rounded-xl font-bold"
        >
          Add to Cart — ₹{total}
        </button>
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
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
        <h2 className="text-2xl font-black mb-6">Your Cart</h2>

        {cart.items.map((i) => (
          <div
            key={i.productId + i.sizeLabel}
            className="flex gap-4 mb-6"
          >
            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden">
              {i.image ? (
                <img
                  src={i.image}
                  className="w-full h-full object-cover"
                  alt={i.name}
                />
              ) : (
                <ShoppingBag />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold">{i.name}</h3>
                <span className="font-semibold">
                  ₹{i.price * i.qty}
                </span>
              </div>

              <span className="inline-block mt-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">
                {i.sizeLabel}
              </span>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() =>
                    cart.updateQty(
                      i.productId,
                      i.sizeLabel,
                      i.qty - 1
                    )
                  }
                >
                  <Minus />
                </button>
                <span className="font-bold">{i.qty}</span>
                <button
                  onClick={() =>
                    cart.updateQty(
                      i.productId,
                      i.sizeLabel,
                      i.qty + 1
                    )
                  }
                >
                  <Plus />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="font-black text-2xl mt-4">
          Total: ₹{total}
        </div>

        <button
          onClick={cart.clear}
          className="mt-6 w-full py-4 bg-rose-100 text-rose-700 rounded-xl font-bold"
        >
          Clear Cart
        </button>
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