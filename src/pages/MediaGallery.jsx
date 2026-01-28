import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Upload, X, Tag, Image as ImageIcon, Plus, Search } from "lucide-react";

export default function MediaGallery() {
    const [assets, setAssets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]); // Array of { file, label }
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await api.getMediaGallery();
            setAssets(res.data);
        } catch (err) {
            console.error("Failed to fetch gallery", err);
        }
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            label: file.name.split('.')[0]
        }));
        setFiles([...files, ...newFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const updateLabel = (index, label) => {
        const newFiles = [...files];
        newFiles[index].label = label;
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
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.deleteMediaGalleryAsset(id);
            fetchAssets();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Media Gallery</h1>
                    <p className="text-slate-500 font-medium">Global assets available for all products</p>
                </div>

                <div className="w-full md:w-96 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search gallery..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium shadow-sm shadow-slate-100"
                    />
                </div>
            </header>

            {/* Upload Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="flex flex-col items-center gap-4">
                    <input
                        type="file"
                        id="gallery-upload"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="gallery-upload"
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold cursor-pointer hover:bg-indigo-700 transition"
                    >
                        <Upload size={20} /> Select Images
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <h3 className="font-bold text-slate-900">Queue ({files.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {files.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border">
                                        <img src={URL.createObjectURL(item.file)} className="object-cover w-full h-full" />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => updateLabel(index, e.target.value)}
                                            placeholder="Image label"
                                            className="w-full bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none font-medium p-1"
                                        />
                                    </div>
                                    <button onClick={() => removeFile(index)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl">
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition disabled:opacity-50"
                        >
                            {uploading ? "Uploading..." : "Start Upload"}
                        </button>
                    </div>
                )}
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {assets
                    .filter(asset => asset.label.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((asset) => (
                        <div key={asset.id} className="group relative bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                            <div className="aspect-square overflow-hidden bg-slate-50">
                                <img src={asset.image_url} alt={asset.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-4">
                                <p className="text-xs font-bold text-slate-800 truncate">{asset.label}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(asset.id)}
                                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition shadow-sm"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
