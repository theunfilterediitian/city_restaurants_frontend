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

                        <button
                            type="button"
                            onClick={() => setShowGalleryModal(true)}
                            className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 rounded-2xl hover:bg-indigo-50 cursor-pointer transition-all mb-4 group"
                        >
                            <ImageIcon className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
                            <span className="text-xs font-semibold text-indigo-600">Select from Gallery</span>
                            <span className="text-[10px] text-gray-400 mt-1">Choose images from media library</span>
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            {selectedGalleryUrls.map((url, i) => {
                                const existing = existingImages.find(img => img.image_url === url);
                                return (
                                    <div key={i} className={`relative group aspect-square rounded-xl overflow-hidden border ${existing ? '' : 'border-emerald-400'}`}>
                                        <img src={url} className="object-cover w-full h-full" alt="Product" />
                                        {existing ? (
                                            <>
                                                <div className="absolute top-0 left-0 bg-indigo-600 text-[10px] text-white px-1.5 py-0.5 rounded-br-lg uppercase font-bold">Saved</div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(existing.id)}
                                                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="absolute top-0 left-0 bg-emerald-500 text-[10px] text-white px-1.5 py-0.5 rounded-br-lg uppercase font-bold">New</div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedImage(url)}
                                                    className="absolute top-1 right-1 p-1.5 bg-black/50 text-white rounded-full shadow-lg"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                            {selectedGalleryUrls.length === 0 && (
                                <div className="col-span-2 py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-xs text-gray-400">No images selected</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700">Available for Order</span>
                            <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} className="w-5 h-5 accent-indigo-600" />
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
            {showGalleryModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Select Image</h2>
                                <p className="text-sm text-gray-500 mt-1">Choose a product image from the media gallery</p>
                            </div>
                            <button
                                onClick={() => setShowGalleryModal(false)}
                                className="p-2 hover:bg-white rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search gallery..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div className="p-6 overflow-y-auto max-h-[50vh]">
                            {galleryAssets.filter(asset =>
                                asset.label.toLowerCase().includes(searchTerm.toLowerCase())
                            ).length === 0 ? (
                                <div className="text-center py-12">
                                    <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 font-medium">No images found</p>
                                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {galleryAssets
                                        .filter(asset => asset.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((asset) => {
                                            const isSelected = selectedGalleryUrls.includes(asset.image_url);
                                            return (
                                                <div
                                                    key={asset.id}
                                                    onClick={() => toggleGalleryImage(asset.image_url)}
                                                    className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all group ${isSelected
                                                        ? 'ring-4 ring-indigo-500 scale-95'
                                                        : 'hover:ring-2 hover:ring-gray-300'
                                                        }`}
                                                >
                                                    <img
                                                        src={asset.image_url}
                                                        alt={asset.label}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                                            <div className="bg-indigo-600 text-white rounded-full p-2">
                                                                <Check size={20} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                                        <p className="text-white text-xs font-bold truncate">{asset.label}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <p className="text-sm text-gray-600 font-medium">
                                {selectedGalleryUrls.length} image{selectedGalleryUrls.length !== 1 ? 's' : ''} selected
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowGalleryModal(false)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addSelectedImagesToProduct}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Check size={18} />
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}