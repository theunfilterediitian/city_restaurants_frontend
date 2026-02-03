import { useEffect, useState, useRef } from 'react';
import { useCategoryStore } from '../store/useCategoryStore';
import { api } from '../services/api';
import {
  Image as ImageIcon, X, Plus, Trash2, Camera, Upload, Loader2
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
    <div className="flex flex-col gap-6 md:gap-8 pb-24">
      <header className="space-y-1">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tightest uppercase italic">Categorization <span className="text-amber-500 italic-none">Engine</span></h2>
        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Master Catalog Architecture</p>
      </header>

      {/* Branded Add Form */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Label</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. PREMIUM DESSERTS"
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all font-bold text-slate-900 placeholder-slate-300"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset</label>
              <div className="flex items-center gap-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all overflow-hidden group shadow-inner bg-slate-50/30"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Preview" />
                  ) : (
                    <Camera size={32} className="text-slate-200 group-hover:text-amber-500 transition-colors" strokeWidth={1.5} />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview ? (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="px-4 py-2 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                  >
                    Clear Asset
                  </button>
                ) : (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase">Direct Upload</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">JPG, PNG / MAX 2MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 md:pt-10 border-t border-slate-50">
            <button
              type="submit"
              disabled={!newName.trim() || isSubmitting}
              className="bg-slate-900 hover:bg-amber-600 disabled:bg-slate-200 text-white px-8 md:px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />
              ) : <Plus size={18} strokeWidth={3} />}
              {isSubmitting ? 'Processing...' : 'Deploy Category'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid Architecture */}
      <header className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Architecture ({categories.length})</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" strokeWidth={2.5} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Schema...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-300 font-black uppercase text-xs tracking-widest italic">Node Registry Empty</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-100 transition-all overflow-hidden flex flex-col">
              <div className="relative aspect-square bg-slate-50">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="w-full py-3 bg-rose-500/90 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={12} strokeWidth={3} /> Delete
                  </button>
                </div>

                <div className="absolute top-4 right-4 h-6 w-6 rounded-lg bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-[10px] font-black text-slate-900">
                  {cat.id}
                </div>
              </div>
              <div className="p-5 md:p-6 text-center">
                <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm md:text-base truncate">{cat.name}</h3>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-[0.2em] mt-1 block leading-none">Category Node</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}