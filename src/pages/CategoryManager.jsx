import { useEffect, useState, useRef } from 'react';
import { useCategoryStore } from '../store/useCategoryStore';
import { api } from '../services/api';
import {
  Image as ImageIcon, X, Plus, Trash2, Camera, Upload
} from 'lucide-react';

export default function CategoryManager() {
  const { categories, fetchCategories, createCategory, deleteCategory, isLoading } = useCategoryStore();
  const [newName, setNewName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", newName);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createCategory(formData);
      setNewName('');
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error("Failed to create category", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Menu Categories</h2>
        <p className="text-gray-500 text-sm mt-1">Add a name and an optional image for your menu categories.</p>
      </header>

      {/* Simplified Add Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Category Name*</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Desserts, Main Course..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Category Image</label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden group"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Camera size={24} className="text-gray-300 group-hover:text-indigo-400" />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="text-xs font-bold text-red-500 hover:text-red-600"
                  >
                    Remove Image
                  </button>
                )}
                {!imagePreview && (
                  <div className="text-xs text-gray-400">
                    <p className="font-bold">Upload direct</p>
                    <p>PNG, JPG up to 2MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={!newName.trim() || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : <Plus size={20} />}
              {isSubmitting ? 'Saving...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-20 flex justify-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No categories found yet.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="relative aspect-video bg-gray-50">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <ImageIcon size={40} />
                  </div>
                )}
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-md text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  title="Delete Category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">ID: {cat.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}