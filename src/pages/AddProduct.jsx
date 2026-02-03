import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import {
    ArrowLeft, Save, Trash2, Image as ImageIcon,
    X, Loader2, Check, Search, Plus
} from "lucide-react";
import { useCategoryStore } from "../store/useCategoryStore";

export default function AddProduct() {
    const { rest_id, product_id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!product_id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState("");

    // Image gallery state
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryAssets, setGalleryAssets] = useState([]);
    const [selectedGalleryUrls, setSelectedGalleryUrls] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
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
        sizes: [{ size_label: "Regular", price: "" }]
    });

    useEffect(() => {
        fetchCategories();
        fetchGalleryAssets();
        if (isEditMode) {
            loadProductData();
        }
    }, [product_id]);

    const fetchGalleryAssets = async () => {
        try {
            const res = await api.getMediaGallery();
            setGalleryAssets(res.data);
        } catch (err) {
            console.error("Failed to fetch gallery", err);
        }
    };

    const loadProductData = async () => {
        try {
            const res = await api.getProductDetails(product_id);
            const { images, categories: productCats, ...data } = res.data;

            // Map existing categories to just IDs for the formData
            const category_ids = productCats ? productCats.map(c => c.id) : [];

            setFormData({ ...data, category_ids });
            const imgs = images || [];
            setExistingImages(imgs);
            // Also populate selectedGalleryUrls for the gallery modal to show them as selected
            setSelectedGalleryUrls(imgs.map(img => img.image_url));
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

    // --- Gallery Image Logic ---
    const toggleGalleryImage = (imageUrl) => {
        // Only allow one image selection - replace if another is picked, or toggle off if same is picked
        setSelectedGalleryUrls(prev => prev.includes(imageUrl) ? [] : [imageUrl]);
    };

    const addSelectedImagesToProduct = () => {
        setShowGalleryModal(false);
    };

    const removeSelectedImage = (imageUrl) => {
        setSelectedGalleryUrls(selectedGalleryUrls.filter(url => url !== imageUrl));
    };

    const removeExistingImage = async (imageId) => {
        if (!window.confirm("Remove this image from this product?")) return;
        try {
            const deletedImg = existingImages.find(img => img.id === imageId);
            await api.deleteProductImage(imageId);
            setExistingImages(existingImages.filter(img => img.id !== imageId));
            if (deletedImg) {
                setSelectedGalleryUrls(prev => prev.filter(url => url !== deletedImg.image_url));
            }
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

    // --- Submit Sequence (JSON with gallery URLs) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = new FormData();

            // Include gallery image URLs in the product data
            const productData = {
                ...formData,
                gallery_image_urls: selectedGalleryUrls
            };

            // Backend expects "product" as a JSON string
            data.append("product", JSON.stringify(productData));

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

    if (fetching) return <div className="p-10 md:p-20 text-center animate-pulse text-amber-600 font-medium">Loading product...</div>;

    return (
        <div className="max-w-6xl mx-auto p-3 md:p-6 pb-24">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-amber-600 mb-3 md:mb-5 font-medium transition-colors">
                <ArrowLeft size={16} className="mr-1.5" /> Back to Menu
            </button>

            <form onSubmit={handleSubmit} className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8">

                {/* Left: Product Details */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-2xl border border-gray-200 shadow-sm space-y-5 md:space-y-6">
                        <div className="border-b pb-4">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
                                {isEditMode ? "Edit Dish" : "Add New Dish"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Product Name*</label>
                                <input required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm sm:text-base font-semibold"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Veg/Non-Veg</label>
                                <select className="w-full px-4 py-3 border rounded-xl bg-white text-sm font-semibold appearance-none"
                                    value={formData.veg} onChange={(e) => setFormData({ ...formData, veg: e.target.value === 'true' })}>
                                    <option value="true">🟢 Vegetarian</option>
                                    <option value="false">🔴 Non-Vegetarian</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Remark</label>
                                <input className="w-full px-4 py-3 border rounded-xl outline-none text-sm font-semibold"
                                    value={formData.remark || ""} onChange={(e) => setFormData({ ...formData, remark: e.target.value })} />
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5 ml-1">Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 
                                            ${formData.category_ids.includes(cat.id)
                                                ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200"
                                                : "bg-gray-50 border-gray-100 text-gray-500 hover:border-amber-300"}`}
                                    >
                                        {formData.category_ids.includes(cat.id) && <Check size={14} />}
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Description</label>
                            <textarea rows="3" className="w-full px-4 py-3 border rounded-xl outline-none text-sm font-semibold resize-none"
                                value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        {/* Sizes & Pricing */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Sizes & Pricing*</label>
                            <div className="space-y-3">
                                {formData.sizes.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input required placeholder="Size" className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                                value={s.size_label} onChange={(e) => updateSize(i, 'size_label', e.target.value)} />
                                        </div>
                                        <div className="relative w-24 md:w-32">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs pointer-events-none">₹</span>
                                            <input required type="number" placeholder="Price" className="w-full pl-7 pr-3 py-2.5 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                                value={s.price} onChange={(e) => updateSize(i, 'price', e.target.value)} />
                                        </div>
                                        {formData.sizes.length > 1 && (
                                            <button type="button" onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter((_, idx) => idx !== i) })} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addSizeRow} className="text-amber-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 py-2 px-1 hover:text-amber-700 transition-colors">
                                <Plus size={14} /> Add Size Option
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Images & Save */}
                <div className="space-y-4 md:space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Media Store</h3>

                        <button
                            type="button"
                            onClick={() => setShowGalleryModal(true)}
                            className="w-full flex flex-col items-center justify-center p-5 md:p-6 border-2 border-dashed border-amber-100 rounded-2xl bg-amber-50/20 hover:bg-amber-50/50 cursor-pointer transition-all mb-4 group"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <ImageIcon className="text-amber-500" size={24} />
                            </div>
                            <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">Open Gallery</span>
                            <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-tighter">Choose dish image</span>
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            {selectedGalleryUrls.map((url, i) => {
                                const existing = existingImages.find(img => img.image_url === url);
                                return (
                                    <div key={i} className={`relative group aspect-square rounded-[1.25rem] overflow-hidden border-2 ${existing ? 'border-amber-100' : 'border-amber-500 shadow-lg shadow-amber-100/20'}`}>
                                        <img src={url} className="object-cover w-full h-full" alt="Product" />
                                        {existing ? (
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(existing.id)}
                                                className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedImage(url)}
                                                className="absolute top-1.5 right-1.5 p-1.5 bg-gray-900/80 text-white rounded-lg shadow-lg backdrop-blur-sm"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            {selectedGalleryUrls.length === 0 && (
                                <div className="col-span-2 py-10 md:py-12 text-center bg-gray-50/50 rounded-[1.25rem] border-2 border-dashed border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Required Media</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-wider">Visible in Menu</span>
                            <div
                                onClick={() => setFormData({ ...formData, available: !formData.available })}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.available ? 'bg-amber-600' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.available ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-amber-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditMode ? <Check size={18} /> : <Plus size={18} />)}
                            {loading ? "Saving..." : (isEditMode ? "Save Changes" : "Add Product")}
                        </button>
                        {error && <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest">{error}</p>}
                    </div>
                </div>
            </form>

            {/* Gallery Modal */}
            {showGalleryModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] max-w-5xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        {/* Modal Header */}
                        <div className="p-5 md:p-6 pb-2 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Gallery</h2>
                                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Select dish visualization</p>
                            </div>
                            <button
                                onClick={() => setShowGalleryModal(false)}
                                className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-5 md:px-6 py-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="SEARCH ASSETS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all font-black text-[10px] uppercase tracking-widest"
                                />
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div className="p-5 md:p-6 pt-2 overflow-y-auto flex-1">
                            {galleryAssets.filter(asset =>
                                asset.label.toLowerCase().includes(searchTerm.toLowerCase())
                            ).length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <ImageIcon className="text-gray-300" size={32} />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">No visual assets<br />match your search</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {galleryAssets
                                        .filter(asset => asset.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((asset) => {
                                            const isSelected = selectedGalleryUrls.includes(asset.image_url);
                                            return (
                                                <div
                                                    key={asset.id}
                                                    onClick={() => toggleGalleryImage(asset.image_url)}
                                                    className={`relative aspect-square rounded-[1.5rem] overflow-hidden cursor-pointer transition-all ${isSelected
                                                        ? 'ring-4 ring-amber-600 scale-95 shadow-xl shadow-amber-600/20'
                                                        : 'hover:ring-2 hover:ring-gray-200'
                                                        }`}
                                                >
                                                    <img
                                                        src={asset.image_url}
                                                        alt={asset.label}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-amber-600/20 flex items-center justify-center backdrop-blur-[1px]">
                                                            <div className="bg-amber-600 text-white rounded-full p-2.5 shadow-lg">
                                                                <Check size={18} strokeWidth={4} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                                                        <p className="text-white text-[8px] font-black uppercase tracking-widest truncate">{asset.label}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 md:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest order-2 sm:order-1">
                                {selectedGalleryUrls.length} file{selectedGalleryUrls.length !== 1 ? 's' : ''} staged
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
                                <button
                                    onClick={() => setShowGalleryModal(false)}
                                    className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-600 bg-white hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addSelectedImagesToProduct}
                                    className="flex-1 sm:flex-none px-8 py-3 bg-amber-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                                >
                                    <Check size={14} strokeWidth={3} />
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}