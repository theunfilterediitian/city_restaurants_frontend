import { useEffect, useMemo, useRef } from "react";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { useProductStore } from "../store/useProductStore";
import { QRCodeCanvas } from "qrcode.react";
import {
  Mail, MapPin, Utensils, ShieldCheck, Globe, Building2,
  Package, CheckCircle2, Leaf, Coffee, Flame, Wifi,
  QrCode, ImageIcon, FileJson, FileText, Download, ExternalLink
} from "lucide-react";

export default function RestaurantDashboard() {
  const { fetchRestaurantById, selectedRestaurant } = useRestaurantStore();
  const { products, fetchProducts } = useProductStore();
  const qrRef = useRef(null);

  useEffect(() => {
    const restaurantId = Number(localStorage.getItem("restaurant_id"));
    if (!restaurantId) return;
    fetchRestaurantById(restaurantId);
    fetchProducts(restaurantId);
  }, [fetchRestaurantById, fetchProducts]);

  // Generate the stats for the dashboard
  const stats = useMemo(() => {
    return {
      total: products.length,
      available: products.filter(p => p.available).length,
      veg: products.filter(p => p.veg).length,
      iced: products.filter(p => p.iced).length,
      categories: new Set(products.flatMap(p => p.categories.map(c => c.name))).size
    };
  }, [products]);

  const qrFileName = useMemo(() => {
    if (!selectedRestaurant) return "menu-qr";

    const emailPrefix = selectedRestaurant.email?.split("@")[0];
    return (
      emailPrefix ||
      selectedRestaurant.slug ||
      selectedRestaurant.name?.replace(/\s+/g, "-").toLowerCase() ||
      "menu-qr"
    );
  }, [selectedRestaurant]);


  // Construct the Public URL for the QR Code
  const publicUrl = useMemo(() => {
    if (!selectedRestaurant) return "";
    const base = window.location.origin;
    const { country_code, state_code, city_code, email } = selectedRestaurant;
    const identifier = email.split("@")[0]
    return `${base}/${country_code}/${state_code}/${city_code}/${identifier}`;
  }, [selectedRestaurant]);

  // Download Handler for different formats
  const downloadQR = (format) => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    if (format === 'pdf') {
      const dataUrl = canvas.toDataURL("image/png");
      const windowContent = `
        <!DOCTYPE html>
        <html>
          <head><title>Print Menu QR</title></head>
          <body style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
            <h1 style="margin-bottom:20px;">${selectedRestaurant.name}</h1>
            <img src="${dataUrl}" style="width:400px; border: 1px solid #eee; padding: 20px; border-radius: 20px;">
            <p style="margin-top:20px; color:#666;">Scan to view our digital menu</p>
          </body>
        </html>`;
      const printWin = window.open('', '', 'width=800,height=800');
      printWin.document.open();
      printWin.document.write(windowContent);
      printWin.document.close();
      setTimeout(() => { printWin.print(); }, 500);
    } else {
      const url = canvas.toDataURL(`image/${format === 'jpeg' ? 'jpeg' : 'png'}`);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${qrFileName}-qr.${format}`;
      link.click();
    }
  };

  if (!selectedRestaurant) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 antialiased pb-24">

      {/* 1. RESTAURANT PROFILE CARD */}
      <section className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
              {selectedRestaurant.logo_url ? (
                <img src={selectedRestaurant.logo_url} alt="logo" className="object-cover w-full h-full" />
              ) : (
                <Building2 size={24} className="text-slate-300 md:size-32" />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{selectedRestaurant.name}</h1>
                {selectedRestaurant.pure_veg && (
                  <ShieldCheck size={16} className="text-emerald-500 md:size-18" fill="currentColor" fillOpacity={0.1} />
                )}
              </div>
              <p className="text-slate-500 text-xs md:text-sm font-medium flex items-center justify-center md:justify-start gap-2 mt-0.5 md:mt-1 capitalize">
                <Utensils size={12} className="text-slate-400 md:size-14" /> {selectedRestaurant.type} Specialist
              </p>
            </div>

            <div className="px-3 py-1.5 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100">
              <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase block leading-none mb-0.5 md:mb-1">Store ID</span>
              <span className="font-mono text-xs md:text-sm font-bold text-slate-600">#{selectedRestaurant.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-slate-50">
            <InfoItem icon={<Mail size={14} />} label="Email" value={selectedRestaurant.email} />
            <InfoItem icon={<MapPin size={14} />} label="Location" value={selectedRestaurant.location} />
            <InfoItem icon={<Globe size={14} />} label="Region" value={`${selectedRestaurant.city_code}, ${selectedRestaurant.state_code}`} />
            <InfoItem icon={<Building2 size={14} />} label="City" value={selectedRestaurant.city_code} />
          </div>
        </div>
      </section>

      {/* 2. LIVE STATUS BANNER */}
      <div className="bg-amber-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-amber-100">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-9 w-9 md:h-10 md:w-10 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
            <Wifi size={18} className="animate-pulse md:size-20" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs md:text-sm">Restaurant is Live</h4>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] md:text-xs text-amber-100 truncate max-w-[180px] sm:max-w-none">
                {publicUrl}
              </p>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-amber-200"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
        <div className="px-2.5 py-1 bg-white/20 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-wider self-end sm:self-center">
          Operational
        </div>
      </div>

      {/* 3. STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={<Package size={18} />} label="Items" value={stats.total} />
        <StatCard icon={<CheckCircle2 size={18} />} label="Active" value={stats.available} color="text-emerald-500" />
        <StatCard icon={<Leaf size={18} />} label="Veg" value={stats.veg} color="text-green-500" />
        <StatCard icon={<Coffee size={18} />} label="Cats" value={stats.categories} color="text-orange-500" />
      </div>

      {/* 4. COMPOSITION BREAKDOWN */}
      <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
          <Flame size={14} className="text-orange-500 md:size-16" /> Menu Health Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <ProgressItem label="Non-Veg Content" value={stats.total - stats.veg} total={stats.total} color="bg-rose-500" />
          <ProgressItem label="Cold/Iced Items" value={stats.iced} total={stats.total} color="bg-sky-400" />
          <ProgressItem label="Hidden Items" value={stats.total - stats.available} total={stats.total} color="bg-slate-300" />
        </div>
      </div>

      {/* 5. QR CODE SECTION */}
      <section className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">

          <div className="space-y-3 md:space-y-4 flex flex-col items-center w-full md:w-auto">
            <div ref={qrRef} className="p-4 md:p-6 bg-white rounded-[2rem] md:rounded-[2.5rem] border-4 border-slate-50 shadow-xl shadow-slate-200/50 w-full max-w-[280px] md:max-w-none flex justify-center">
              <div className="scale-[0.65] xs:scale-75 sm:scale-90 md:scale-100 origin-center">
                <QRCodeCanvas
                  key={selectedRestaurant.logo_url}
                  value={publicUrl}
                  size={300}
                  level="H"
                  imageSettings={
                    selectedRestaurant.logo_url
                      ? {
                        src: selectedRestaurant.logo_url,
                        height: 60,
                        width: 60,
                        excavate: true,
                        crossOrigin: "anonymous"
                      }
                      : undefined
                  }
                />
              </div>
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scan to preview</p>
          </div>

          <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-2 md:gap-3">
                <QrCode className="text-amber-600 size-5 md:size-6" /> Menu QR Code
              </h3>
              <p className="text-slate-500 text-xs md:text-sm mt-1 md:mt-2 font-medium">
                Download and print this QR code for your tables or storefront.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <DownloadButton onClick={() => downloadQR('png')} icon={<ImageIcon size={16} />} label="PNG" />
              <DownloadButton onClick={() => downloadQR('jpeg')} icon={<FileJson size={16} />} label="JPG" />
              <DownloadButton onClick={() => downloadQR('pdf')} icon={<FileText size={16} />} label="PDF" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// HELPERS (Local to this file)

function DownloadButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all group"
    >
      <div className="text-slate-400 group-hover:text-amber-600 transition-colors mb-1.5 md:mb-2">{icon}</div>
      <span className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-widest">{label}</span>
    </button>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-0.5 md:mb-1">{label}</p>
        <p className="text-xs font-semibold text-slate-700 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color = "text-amber-500" }) {
  return (
    <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:border-amber-100 transition-colors">
      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
        <div className={`${color} size-4 md:size-5`}>{icon}</div>
        <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{label}</span>
      </div>
      <div className="text-lg md:text-2xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function ProgressItem({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1.5 md:space-y-2">
      <div className="flex justify-between items-center text-[10px] md:text-[11px] font-bold">
        <span className="text-slate-500 uppercase">{label}</span>
        <span className="text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="h-8 w-8 border-2 border-slate-200 border-t-amber-600 rounded-full animate-spin"></div>
    </div>
  );
}