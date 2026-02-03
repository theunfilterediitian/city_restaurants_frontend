import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Upload, X, Tag, Image as ImageIcon, Plus, Search, Loader2 } from "lucide-react";

export default function MediaGallery() {
    const [assets, setAssets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]); // Array of { file, label }
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setIsLoading(true);
        try {
            const res = await api.getMediaGallery();
            setAssets(res.data);
        } catch (err) {
            console.error("Failed to fetch gallery", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            label: file.name.split('.')[0].toUpperCase()
        }));
        setFiles([...files, ...newFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const updateLabel = (index, label) => {
        const newFiles = [...files];
        newFiles[index].label = label.toUpperCase();
        setFiles(newFiles);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        const labels = files.map(f => f.label);

        formData.append("labels", JSON.stringify(labels));
        files.forEach(f => {
            formData.append("files", f.file);
        });

        try {
            await api.uploadMediaGallery(formData);
            setFiles([]);
            fetchAssets();
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("ARE YOU SURE? THIS ACTION IS FINAL.")) return;
        try {
            await api.deleteMediaGalleryAsset(id);
            fetchAssets();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="flex flex-col gap-8 md:gap-12 pb-24">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tightest uppercase italic">Asset <span className="text-amber-500 italic-none">Vault</span></h1>
                    <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Centralized Media Registry</p>
                </div>

                <div className="w-full lg:w-96 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="SEARCH REPOSITORY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all font-black text-xs tracking-widest shadow-sm"
                    />
                </div>
            </header>

            {/* Premium Upload Architecture */}
            <div className="bg-slate-900 p-6 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
                    <div className="h-20 w-20 bg-amber-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-amber-500/20 rotate-3">
                        <Upload size={32} className="text-white" strokeWidth={3} />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">Ingest New Content</h3>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Multi-Asset Synchronized Upload</p>
                    </div>

                    <input
                        type="file"
                        id="gallery-upload"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="gallery-upload"
                        className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-amber-500 hover:text-white transition-all active:scale-95 shadow-lg"
                    >
                        Locate Assets
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="mt-12 md:mt-16 space-y-6 relative z-10">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h3 className="font-black text-white uppercase text-xs tracking-widest">Processing Queue ({files.length})</h3>
                            <button onClick={() => setFiles([])} className="text-rose-400 text-[10px] font-black uppercase tracking-widest hover:text-rose-300">Abort All</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                                    <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                        <img src={URL.createObjectURL(item.file)} className="object-cover w-full h-full" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => updateLabel(index, e.target.value)}
                                            placeholder="LABEL_ID"
                                            className="w-full bg-transparent border-b border-white/10 focus:border-amber-500 outline-none font-black text-[11px] text-white p-1 uppercase tracking-widest"
                                        />
                                    </div>
                                    <button onClick={() => removeFile(index)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-xl transition-colors">
                                        <X size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-5 bg-amber-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-amber-600 transition-all disabled:opacity-50 shadow-xl shadow-amber-500/20 active:scale-[0.99] flex items-center justify-center gap-3"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    <Plus size={20} strokeWidth={3} />
                                    Execute Upload Sequence
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Assets Grid Architecture */}
            <div className="space-y-6">
                <header className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Repository Matrix</p>
                </header>

                {isLoading ? (
                    <div className="py-32 flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" strokeWidth={2.5} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Registry...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                        {assets
                            .filter(asset => asset.label.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((asset) => (
                                <div key={asset.id} className="group relative bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-100 transition-all duration-300">
                                    <div className="aspect-square overflow-hidden bg-slate-50 relative">
                                        <img src={asset.image_url} alt={asset.label} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handleDelete(asset.id)}
                                                className="p-3 bg-white text-rose-500 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all"
                                            >
                                                <Trash2 size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white">
                                        <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter">{asset.label}</p>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ID:{asset.id}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
