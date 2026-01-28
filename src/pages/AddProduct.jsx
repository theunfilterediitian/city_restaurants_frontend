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

    // Image handling state
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [showGallery, setShowGallery] = useState(false);
    const [galleryAssets, setGalleryAssets] = useState([]);
    const [selectedFromGallery, setSelectedFromGallery] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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
        gallery_image_urls: []
    });

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            loadProductData();
        }
    }, [product_id]);

    useEffect(() => {
        if (showGallery) {
            api.getMediaGallery().then(res => setGalleryAssets(res.data));
        }
    }, [showGallery]);

    const loadProductData = async () => {
        try {
            const res = await api.getProductDetails(product_id);
            const { images, categories: productCats, ...data } = res.data;

            // Map existing categories to just IDs for the formData
            const category_ids = productCats ? productCats.map(c => c.id) : [];

            setFormData({ ...data, category_ids, gallery_image_urls: [] });
            setExistingImages(images || []);
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

    // --- Image Logic ---
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...newFiles]);
        e.target.value = "";
    };

    const removeNewFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const toggleGallerySelection = (url) => {
        setSelectedFromGallery(prev =>
            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
        );
    };

    const confirmGallerySelection = () => {
        setFormData(prev => ({
            ...prev,
            gallery_image_urls: [...prev.gallery_image_urls, ...selectedFromGallery]
        }));
        setSelectedFromGallery([]);
        setShowGallery(false);
    };

    const removeGalleryImage = (url) => {
        setFormData(prev => ({
            ...prev,
            gallery_image_urls: prev.gallery_image_urls.filter(u => u !== url)
        }));
    };

    const removeExistingImage = async (imageId) => {
        if (!window.confirm("Delete this image permanently?")) return;
        try {
            // Ensure this endpoint exists in your backend
            await api.deleteProductImage(imageId);
            setExistingImages(existingImages.filter(img => img.id !== imageId));
        } catch (err) {
            setError("Could not delete image.");
        }
    };

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

            // Backend expects "product" as a JSON string
            data.append("product", JSON.stringify(formData));

            // Backend expects "images" as a list of files
            selectedFiles.forEach((file) => {
                data.append("images", file);
            });

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

                        <div className="space-y-3">
                            <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all">
                                <ImageIcon className="text-gray-400 mb-2" size={28} />
                                <span className="text-xs font-semibold text-gray-500">Upload Photos</span>
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowGallery(true)}
                                className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Choose from Gallery
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                            {/* Existing Images */}
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border">
                                    <img src={img.image_url} className="object-cover w-full h-full" alt="Product" />
                                    <div className="absolute top-0 left-0 bg-indigo-600 text-[10px] text-white px-1.5 py-0.5 rounded-br-lg">SAVED</div>
                                    <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* Gallery Selections */}
                            {formData.gallery_image_urls.map((url, i) => (
                                <div key={`gal-${i}`} className="relative group aspect-square rounded-xl overflow-hidden border border-indigo-200">
                                    <img src={url} className="object-cover w-full h-full" alt="Gallery" />
                                    <div className="absolute top-0 left-0 bg-indigo-500 text-[10px] text-white px-1.5 py-0.5 rounded-br-lg uppercase">Gallery</div>
                                    <button type="button" onClick={() => removeGalleryImage(url)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* New Previews */}
                            {selectedFiles.map((file, i) => (
                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-emerald-400">
                                    <img src={URL.createObjectURL(file)} className="object-cover w-full h-full" alt="Preview" />
                                    <div className="absolute top-0 left-0 bg-emerald-500 text-[10px] text-white px-1.5 py-0.5 rounded-br-lg">NEW</div>
                                    <button type="button" onClick={() => removeNewFile(i)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
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

            {/* Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <header className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 line-tight">Select from Gallery</h3>
                                <p className="text-slate-500 text-sm font-medium">Click images to select</p>
                            </div>

                            <div className="flex-1 max-w-md mx-8 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search gallery..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                />
                            </div>

                            <button onClick={() => setShowGallery(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-auto p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {galleryAssets
                                    .filter(asset => asset.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((asset) => (
                                        <div
                                            key={asset.id}
                                            onClick={() => toggleGallerySelection(asset.image_url)}
                                            className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedFromGallery.includes(asset.image_url) ? "border-indigo-600 shadow-lg" : "border-transparent"
                                                }`}
                                        >
                                            <img src={asset.image_url} className="w-full h-full object-cover" alt={asset.label} />
                                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors" />
                                            {selectedFromGallery.includes(asset.image_url) && (
                                                <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full">
                                                    <Check size={14} />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                                <p className="text-[10px] font-bold text-white truncate">{asset.label}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <footer className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                            <button onClick={() => setShowGallery(false)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 transition">Cancel</button>
                            <button
                                onClick={confirmGallerySelection}
                                disabled={selectedFromGallery.length === 0}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                Confirm Selection ({selectedFromGallery.length})
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}