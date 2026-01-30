import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import {
    ArrowLeft, Save, Trash2, Image as ImageIcon,
    X, Loader2, Check,
    Plus, Search
} from "lucide-react";
import { useCategoryStore } from "../store/useCategoryStore";

export default function AddProduct() {
    const { rest_id, product_id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!product_id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState("");

    // Image handling removed as per request

    const { categories, fetchCategories } = useCategoryStore();

    const [formData, setFormData] = useState({
        name: "",
        veg: true,
        remark: "",
        available: true,
        iced: false,
        description: "",
        category_ids: [], // Stores IDs of selected categories
        sizes: [{ size_label: "Regular", price: "" }],
    });

    useEffect(() => {
        fetchCategories(rest_id);
        if (isEditMode) {
            loadProductData();
        }
    }, [product_id, rest_id]);



    const loadProductData = async () => {
        try {
            const res = await api.getProductDetails(product_id);
            const { images, categories: productCats, ...data } = res.data;

            // Map existing categories to just IDs for the formData
            const category_ids = productCats ? productCats.map(c => c.id) : [];

            setFormData({ ...data, category_ids });
        } catch (err) {
            setError("Failed to load product details.");
        } finally {
            setFetching(false);
        }
    };

    // --- Category Toggle Logic ---
    const toggleCategory = (catId) => {
        setFormData(prev => {
            const isSelected = prev.category_ids.includes(catId);
            return {
                ...prev,
                category_ids: isSelected
                    ? prev.category_ids.filter(id => id !== catId)
                    : [...prev.category_ids, catId]
            };
        });
    };

    // --- Image Logic removed ---

    // --- Dynamic Sizes Logic ---
    const updateSize = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index][field] = value;
        setFormData({ ...formData, sizes: newSizes });
    };

    const addSizeRow = () => setFormData({
        ...formData,
        sizes: [...formData.sizes, { size_label: "", price: "" }]
    });

    // --- Submit Sequence (Multipart/Form-Data) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = new FormData();

            // Clean up sizes and ensure price is a number
            const cleanedFormData = {
                ...formData,
                sizes: formData.sizes
                    .filter(s => s.size_label.trim() !== "" && s.price !== "")
                    .map(s => ({ ...s, price: parseFloat(s.price) }))
            };

            // Backend expects "product" as a JSON string
            data.append("product", JSON.stringify(cleanedFormData));



            // Image data appending removed

            if (isEditMode) {
                await api.updateProductDetails(product_id, data);
            } else {
                await api.createProduct(rest_id, data);
            }

            navigate(`/restaurant/${rest_id}/menu`);
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center animate-pulse">Loading product...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back to Menu
            </button>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-4">
                            {isEditMode ? "Edit Dish" : "Add New Dish"}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                                <input required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Veg/Non-Veg</label>
                                <select className="w-full px-4 py-2.5 border rounded-xl bg-white"
                                    value={formData.veg} onChange={(e) => setFormData({ ...formData, veg: e.target.value === 'true' })}>
                                    <option value="true">🟢 Vegetarian</option>
                                    <option value="false">🔴 Non-Vegetarian</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                <input className="w-full px-4 py-2.5 border rounded-xl outline-none"
                                    value={formData.remark || ""} onChange={(e) => setFormData({ ...formData, remark: e.target.value })} />
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 
                                            ${formData.category_ids.includes(cat.id)
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"}`}
                                    >
                                        {formData.category_ids.includes(cat.id) && <Check size={14} />}
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea rows="3" className="w-full px-4 py-2.5 border rounded-xl outline-none"
                                value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        {/* Sizes & Pricing */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Sizes & Pricing*</label>
                            {formData.sizes.map((s, i) => (
                                <div key={i} className="flex gap-3">
                                    <input required placeholder="Size (e.g. Regular)" className="flex-1 px-4 py-2 border rounded-xl"
                                        value={s.size_label} onChange={(e) => updateSize(i, 'size_label', e.target.value)} />
                                    <input required type="number" placeholder="Price" className="w-32 px-4 py-2 border rounded-xl"
                                        value={s.price} onChange={(e) => updateSize(i, 'price', e.target.value)} />
                                    {formData.sizes.length > 1 && (
                                        <button type="button" onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter((_, idx) => idx !== i) })} className="text-red-500 p-2"><Trash2 size={18} /></button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addSizeRow} className="text-indigo-600 text-sm font-bold flex items-center gap-1">+ Add Size Option</button>
                        </div>
                    </div>
                </div>

                {/* Right: Images & Save */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Media</h3>
                        <p className="text-xs text-gray-500 italic">Images are managed via categories.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700">Available for Order</span>
                            <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} className="w-5 h-5 accent-indigo-600" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700">Served Cold/Iced</span>
                            <input type="checkbox" checked={formData.iced} onChange={(e) => setFormData({ ...formData, iced: e.target.checked })} className="w-5 h-5 accent-indigo-600" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {loading ? "Processing..." : (isEditMode ? "Update Product" : "Create Product")}
                        </button>
                        {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
                    </div>
                </div>
            </form>


        </div>
    );
}