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
  Filter,
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

/* ================= MAIN PAGE ================= */

export default function PublicRestaurantView() {
  const { country, state, city, identifier } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
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
    };
    load();
  }, [country, state, city, identifier]);

  if (loading) return <LoadingScreen />;
  if (!data?.restaurant) return <NotFound />;

  const { restaurant, products } = data;

  // Extract all unique categories from products
  const allCategories = Array.from(
    new Set(
      products.flatMap(p => 
        p.categories?.map(cat => cat.name) || []
      )
    )
  ).sort();

  // Filter products based on selected categories
  const filteredProducts = selectedCategories.length > 0
    ? products.filter(product =>
        product.categories?.some(cat => 
          selectedCategories.includes(cat.name)
        )
      )
    : products;

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setFilterOpen(false);
  };

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

      {/* FILTER BAR */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black">Menu</h2>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl font-medium"
          >
            <Filter size={16} />
            Filter
            {selectedCategories.length > 0 && (
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                {selectedCategories.length}
              </span>
            )}
          </button>
        </div>

        {/* Selected Categories Pills */}
        {selectedCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
              >
                {cat}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="hover:text-emerald-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-slate-600 text-sm font-medium hover:text-slate-900"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* FILTER MODAL */}
      {filterOpen && (
        <div className="fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setFilterOpen(false)} 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Filter by Category</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`w-full p-4 rounded-xl border text-left flex justify-between items-center ${
                    selectedCategories.includes(category)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200"
                  }`}
                >
                  <span className="font-medium">{category}</span>
                  {selectedCategories.includes(category) && (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border border-slate-300 rounded-xl font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <main className="px-6 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border p-4 hover:shadow-lg transition"
            >
              {/* IMAGE */}
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

              {/* NAME */}
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
                <span className="font-black text-indigo-600 text-lg">
                  ₹{p.sizes?.[0]?.price || 0}
                </span>
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
              Clear Filters
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

        <h2 className="text-2xl font-black">{item.name}</h2>

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