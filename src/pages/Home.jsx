import { Link } from "react-router-dom";
import {
    QrCode,
    Smartphone,
    Edit3,
    Zap,
    ChevronRight,
    Star,
    ShieldCheck,
    BarChart3,
    UtensilsCrossed,
    ArrowRight,
    MessageCircle
} from "lucide-react";

export default function Home({ isAuthenticated }) {
    return (
        <div className="min-h-screen bg-white">
            {/* --- NAVIGATION --- */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <QrCode className="text-white" size={20} />
                        </div>
                        <h1 className="font-black text-xl tracking-tighter uppercase italic">
                            INDIAN<span className="text-amber-500">RESTROS</span>
                        </h1>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Features</a>
                        <Link to="/browse" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Explore</Link>
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-primary py-2.5 px-6 text-[10px]">Go to Dashboard</Link>
                        ) : (
                            <Link to="/login" className="btn-primary py-2.5 px-6 text-[10px]">Merchant Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-24 md:pt-30 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50 rounded-bl-[10rem] -z-10 translate-x-1/4" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
                    <div className="space-y-6 md:space-y-10 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-100/50 rounded-full border border-amber-200">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[9px] md:text-[10px] font-black text-amber-700 uppercase tracking-widest">Digitalizing Dining Experiences</span>
                        </div>
                        {/*  */}
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tightest leading-[1.1] md:leading-none italic uppercase">
                            The Future of <br />
                            <span className="text-amber-500 italic-none">Smart Menus.</span>
                        </h1>

                        <p className="text-base md:text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
                            Transform your restaurant with contactless QR menus. Empower your guests to browse while you manage availability in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="btn-primary w-full sm:w-fit h-14 md:h-16 px-8 md:px-10 rounded-2xl flex items-center justify-center gap-3 text-sm">
                                    Management Console <ArrowRight size={18} />
                                </Link>
                            ) : (
                                <a
                                    href="https://wa.me/918543832619?text=Hi!%20I'm%20interested%20in%20registering%20my%20restaurant%20on%20IndianRestros."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full sm:w-fit h-14 md:h-16 px-8 md:px-10 rounded-2xl flex items-center justify-center gap-3 text-sm"
                                >
                                    Register Now <MessageCircle size={18} />
                                </a>
                            )}
                            <Link to="/browse" className="btn-secondary w-full sm:w-fit h-14 md:h-16 px-8 md:px-10 rounded-2xl flex items-center justify-center gap-3 text-sm border-slate-200">
                                Explore Live Menus
                            </Link>
                        </div>

                        <div className="flex items-center gap-8 pt-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                Trusted by <span className="text-slate-900 font-black">500+</span> Premium Outlets
                            </p>
                        </div>
                    </div>

                    <div className="relative animate-fadeIn">
                        <div className="relative z-10 p-4 bg-slate-900 rounded-[3rem] shadow-2xl rotate-2">
                            <div className="bg-white rounded-[2.5rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000"
                                    alt="Product Preview"
                                    className="w-full h-[500px] object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent flex flex-col justify-end p-10">
                                    <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                                        <QrCode size={40} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-white text-3xl font-black italic">SCAN. ORDER. ENJOY.</h3>
                                </div>
                            </div>
                        </div>
                        {/* Decorative rings */}
                        <div className="absolute -top-10 -right-10 h-64 w-64 border-[40px] border-amber-500/10 rounded-full -z-10" />
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {[
                            { label: 'Restaurants Registered', value: '1.2k+' },
                            { label: 'Daily Interactions', value: '45k+' },
                            { label: 'Uptime Reliability', value: '99.9%' },
                            { label: 'Merchant Growth', value: '40%' }
                        ].map((s, idx) => (
                            <div key={idx} className="text-center md:text-left">
                                <p className="text-4xl md:text-5xl font-black text-amber-500 tracking-tighter mb-2 italic">{s.value}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FEATURES --- */}
            <section id="features" className="py-32 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-24">
                        <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4">Core Capabilities</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
                            Engineered for the modern <br /> <span className="text-amber-500 italic-none">Hospitality Industry.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap size={32} />,
                                title: 'Instant Updates',
                                desc: 'Toggle item availability or change prices in real-time. Changes reflect instantly on the guests\' phones.'
                            },
                            {
                                icon: <ShieldCheck size={32} />,
                                title: 'Secure Access',
                                desc: 'Robust partner portal for merchants with enterprise-grade security and role-based access control.'
                            },
                            {
                                icon: <Edit3 size={32} />,
                                title: 'Rich Customization',
                                desc: 'Add multiple sizes, stunning descriptions, and category icons to make your menu stand out.'
                            }
                        ].map((f, idx) => (
                            <div key={idx} className="card-premium p-10 hover:border-amber-500 transition-colors group">
                                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all mb-8">
                                    {f.icon}
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-4 uppercase italic tracking-tight">{f.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/10 -skew-x-12 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <UtensilsCrossed size={64} className="text-amber-500 mb-10" />
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none italic uppercase mb-8">
                                Ready to digitize your <br /> <span className="text-amber-500 italic-none">culinary story?</span>
                            </h2>
                            <p className="text-slate-400 text-lg max-w-xl mb-12">
                                Join hundreds of progressive restaurant owners who have already moved away from paper menus.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                <a
                                    href="https://wa.me/918543832619?text=Hi!%20I'm%20interested%20in%20registering%20my%20restaurant%20on%20IndianRestros."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary h-16 px-12 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={16} /> Register Now
                                </a>
                                <Link to="/browse" className="bg-white/10 hover:bg-white/20 text-white h-16 px-12 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">View Demo</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-20 border-t border-slate-50 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                <QrCode className="text-white" size={16} />
                            </div>
                            <h1 className="font-black text-lg tracking-tighter uppercase italic">
                                INDIAN<span className="text-amber-500">RESTROS</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                            Revolutionizing the hospitality industry with high-end digital menu solutions. Scanned by guests, managed by professionals.
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8">Platform</p>
                        <ul className="space-y-4">
                            <li><Link to="/browse" className="text-sm text-slate-500 hover:text-amber-600 font-bold transition-colors uppercase italic tracking-tight">Explore Outlet</Link></li>
                            <li><a href="#features" className="text-sm text-slate-500 hover:text-amber-600 font-bold transition-colors uppercase italic tracking-tight">Capabilities</a></li>
                            <li><Link to="/login" className="text-sm text-slate-500 hover:text-amber-600 font-bold transition-colors uppercase italic tracking-tight">Onboarding</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8">Connect</p>
                        <ul className="space-y-4">
                            <li><a href="https://instagram.com/indianrestros" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-amber-600 font-bold transition-colors uppercase italic tracking-tight">Instagram</a></li>
                            <li className="text-sm text-slate-500 font-bold uppercase italic tracking-tight">Technical Support</li>
                            <li><a href="tel:+918543832619" className="text-sm text-slate-900 font-black tracking-widest hover:text-amber-600 transition-colors">+91 8543832619</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-50 text-center md:text-left flex flex-col md:flex-row justify-between gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2025 INDIANRESTROS. ALL RIGHTS RESERVED.</p>
                    <div className="flex justify-center gap-8">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Privacy</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
