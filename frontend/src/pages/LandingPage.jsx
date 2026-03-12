import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiFolder, FiSearch, FiMoon, FiLock, FiCloud, FiChevronDown, FiCheck, FiArrowRight, FiStar, FiZap, FiMenu, FiX } from 'react-icons/fi';

// ─── Intersection Observer Hook ───
function useInView(options = {}) {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsInView(true);
        }, { threshold: 0.15, ...options });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, isInView];
}

// ─── Feature Card ───
function FeatureCard({ icon: Icon, title, description, color, index }) {
    const [ref, isInView] = useInView();
    const [mousePos, setMousePos] = useState(null);
    const [rect, setRect] = useState(null);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (cardRef.current) {
            setRect(cardRef.current.getBoundingClientRect());
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const glowColors = {
        amber: 'from-amber-500',
        blue: 'from-blue-500',
        purple: 'from-purple-500',
        green: 'from-emerald-500',
        rose: 'from-rose-500',
        cyan: 'from-cyan-500',
    };
    const proximityColors = {
        amber: 'rgba(245, 158, 11, 0.1)',
        blue: 'rgba(59, 130, 246, 0.1)',
        purple: 'rgba(168, 85, 247, 0.1)',
        green: 'rgba(16, 185, 129, 0.1)',
        rose: 'rgba(244, 63, 94, 0.1)',
        cyan: 'rgba(6, 182, 212, 0.1)',
    };
    const iconColors = {
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    };
    return (
        <div
            ref={(el) => { ref.current = el; cardRef.current = el; }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
            className={`relative group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.06] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Proximity glow */}
            {mousePos && rect && (
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${proximityColors[color]}, transparent 50%)`
                    }}
                />
            )}
            {/* Bottom glow */}
            <div className={`absolute -bottom-4 left-0 right-0 h-20 bg-gradient-to-t ${glowColors[color]} to-transparent opacity-0 blur-2xl group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />
            <div className={`absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-${color === 'amber' ? 'amber' : color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : color === 'green' ? 'emerald' : color === 'rose' ? 'rose' : 'cyan'}-400 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`} />

            <div className={`relative z-10 w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${iconColors[color]}`}>
                <Icon size={22} />
            </div>
            <h3 className="relative z-10 text-white font-semibold text-lg mb-2">{title}</h3>
            <p className="relative z-10 text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

// ─── FAQ Item ───
function FAQItem({ question, answer, index }) {
    const [isOpen, setIsOpen] = useState(false);
    const [ref, isInView] = useInView();
    const [mousePos, setMousePos] = useState(null);
    const [rect, setRect] = useState(null);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (cardRef.current) {
            setRect(cardRef.current.getBoundingClientRect());
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div
            ref={(el) => { ref.current = el; cardRef.current = el; }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
            className={`relative border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-white/20 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${isOpen ? 'bg-white/[0.05]' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            {/* Proximity glow */}
            {mousePos && rect && (
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(245, 158, 11, 0.08), transparent 50%)`
                    }}
                />
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-10 w-full flex items-center justify-between p-5 text-left"
            >
                <span className="text-white font-medium pr-4">{question}</span>
                <FiChevronDown className={`text-amber-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
            </button>
            <div className={`relative z-10 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5 px-5' : 'max-h-0'}`}>
                <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}

// ─── Pricing Card ───
function PricingCard({ name, price, features, highlighted, buttonText, isWaitlist, index }) {
    const [ref, isInView] = useInView();
    const [mousePos, setMousePos] = useState(null);
    const [rect, setRect] = useState(null);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (cardRef.current) {
            setRect(cardRef.current.getBoundingClientRect());
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div
            ref={(el) => { ref.current = el; cardRef.current = el; }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
            className={`relative group rounded-2xl border p-6 flex flex-col overflow-hidden transition-all duration-500 hover:border-white/20 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${highlighted ? 'border-amber-500/40 bg-white/[0.06] scale-[1.02]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}
            style={{ transitionDelay: `${index * 120}ms` }}
        >
            {/* Proximity glow */}
            {mousePos && rect && (
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${highlighted ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)'}, transparent 50%)`
                    }}
                />
            )}
            {highlighted && (
                <>
                    <div className="absolute -bottom-6 left-0 right-0 h-24 bg-gradient-to-t from-amber-500 to-transparent opacity-20 blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-[5%] right-[5%] h-[2px] bg-amber-400 opacity-60 pointer-events-none" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                </>
            )}
            <h3 className="relative z-10 text-white font-semibold text-lg mb-1">{name}</h3>
            <div className="relative z-10 mb-4">
                <span className="text-3xl font-bold text-white">{price}</span>
                {price !== 'Free' && <span className="text-gray-500 text-sm">/month</span>}
            </div>
            <ul className="relative z-10 flex-1 space-y-3 mb-6">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <FiCheck className={`mt-0.5 shrink-0 ${highlighted ? 'text-amber-400' : 'text-gray-600'}`} size={16} />
                        {f}
                    </li>
                ))}
            </ul>
            <Link
                to={isWaitlist ? "#" : "/signup"}
                className={`relative z-10 w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${highlighted ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
            >
                {buttonText || 'Get Started'}
            </Link>
        </div>
    );
}

// ─── Step Card (How It Works) ───
function StepCard({ num, title, desc, index }) {
    const [ref, isInView] = useInView();
    const [mousePos, setMousePos] = useState(null);
    const [rect, setRect] = useState(null);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (cardRef.current) {
            setRect(cardRef.current.getBoundingClientRect());
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div
            ref={(el) => { ref.current = el; cardRef.current = el; }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
            className={`relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.06] ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {mousePos && rect && (
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(245, 158, 11, 0.08), transparent 50%)`
                    }}
                />
            )}
            <div className="relative z-10 w-12 h-12 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                {num}
            </div>
            <div className="relative z-10">
                <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

// ─── Mockup Note Card (with per-card proximity glow) ───
function MockupNoteCard({ title, content, color, glowColor, mousePos }) {
    const cardRef = useRef(null);
    const [rect, setRect] = useState(null);

    useEffect(() => {
        if (cardRef.current) setRect(cardRef.current.getBoundingClientRect());
    }, []);

    // Update rect on mouse move for accuracy
    const handleMouseEnter = () => {
        if (cardRef.current) setRect(cardRef.current.getBoundingClientRect());
    };

    return (
        <div ref={cardRef} onMouseEnter={handleMouseEnter} className="relative rounded-xl border border-white/10 bg-[#0f0f0f] p-4 overflow-hidden group hover:border-white/20 hover:bg-[#161616] transition-all duration-300">
            {mousePos && rect && (
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(200px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${glowColor}, transparent 50%)`
                    }}
                />
            )}
            <div className={`absolute -bottom-3 left-0 right-0 h-12 bg-gradient-to-t ${color} to-transparent opacity-40 group-hover:opacity-70 blur-xl transition-opacity duration-300 pointer-events-none`} />
            <div className="relative z-10">
                <h4 className="text-xs font-semibold text-white mb-1 truncate">{title}</h4>
                <p className="text-[10px] text-gray-500 truncate">{content}</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// ─── LANDING PAGE ───
// ═══════════════════════════════════════════
export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mousePos, setMousePos] = useState(null);
    const [mockupRect, setMockupRect] = useState(null);
    const mockupRef = useRef(null);

    const handleMockupMouseMove = (e) => {
        if (mockupRef.current) {
            const rect = mockupRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX, y: e.clientY });
            setMockupRect(rect);
        }
    };

    const features = [
        { icon: FiFileText, title: 'Rich Text Notes', description: 'Create, edit, and organize your thoughts with a powerful note editor. Your ideas, captured beautifully.', color: 'amber' },
        { icon: FiFolder, title: 'Smart Folders', description: 'Organize your notes into color-coded folders. Keep related ideas grouped and easily accessible.', color: 'blue' },
        { icon: FiSearch, title: 'Instant Search', description: 'Find any note in milliseconds. Powerful search that filters through all your content instantly.', color: 'purple' },
        { icon: FiMoon, title: 'Dark & Light Mode', description: 'A stunning glassmorphic interface that adapts to your preference. Beautiful in every lighting.', color: 'green' },
        { icon: FiLock, title: 'Secure & Private', description: 'Enterprise-grade authentication with row-level security. Your notes belong to you, always.', color: 'rose' },
        { icon: FiCloud, title: 'Cloud Synced', description: 'Access your notes from any device, anywhere. Everything stays in sync automatically.', color: 'cyan' },
    ];

    const steps = [
        { num: '01', title: 'Create Your Account', desc: 'Sign up in seconds with just your email. No credit card required to get started.' },
        { num: '02', title: 'Start Writing', desc: 'Create your first note or folder. Our intuitive editor makes capturing ideas effortless.' },
        { num: '03', title: 'Stay Organized', desc: 'Use folders, search, and filters to keep everything in order. Your personal knowledge base, always ready.' },
    ];

    const faqs = [
        { q: 'Is NoteFlow free to use?', a: 'Yes! NoteFlow offers a generous free plan that includes unlimited notes, folders, and cloud sync. Premium features are available on paid plans.' },
        { q: 'How secure are my notes?', a: 'We use Supabase with enterprise-grade encryption and row-level security. Your notes are encrypted and only accessible by you.' },
        { q: 'Can I access my notes offline?', a: 'Currently NoteFlow works best with an internet connection. Offline support is on our roadmap and coming soon.' },
        { q: 'Can I switch between dark and light mode?', a: 'Absolutely! NoteFlow features a beautiful glassmorphic design in both dark and light modes. Switch anytime from the sidebar.' },
        { q: 'How do I organize my notes?', a: 'Create color-coded folders to group related notes. Use search to quickly find anything. Pin important notes to keep them at the top.' },
    ];

    const pricing = [
        { name: 'Beta Access', price: 'Free', features: ['Unlimited notes', 'Unlimited folders', 'Cloud sync', 'Dark & Light mode', 'Community support'], highlighted: true, buttonText: 'Get Started Free' },
        { name: 'Pro (Coming Soon)', price: '$9', features: ['Everything in Beta', 'Advanced search filters', 'Export to PDF', 'Priority support', 'Team collaboration'], highlighted: false, buttonText: 'Join Waitlist', isWaitlist: true },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

            {/* ┌─────────────────────────────────────┐ */}
            {/* │         NAVIGATION BAR              │ */}
            {/* └─────────────────────────────────────┘ */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300 tracking-wide">
                        NoteFlow
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
                        <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
                        <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">Log In</Link>
                        <Link to="/signup" className="text-sm bg-amber-500 text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-amber-400 transition-colors shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)]">
                            Get Started
                        </Link>
                    </div>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-gray-950/95 backdrop-blur-xl p-6 space-y-4">
                        <a href="#features" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <a href="#pricing" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#faq" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <Link to="/login" className="block text-center text-gray-300 hover:text-white py-2">Log In</Link>
                            <Link to="/signup" className="block text-center bg-amber-500 text-black font-semibold py-2.5 rounded-xl">Get Started</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ┌─────────────────────────────────────┐ */}
            {/* │            HERO SECTION             │ */}
            {/* └─────────────────────────────────────┘ */}
            <section className="relative pt-32 pb-20 px-6">
                {/* Background ambient glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-6 border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 rounded-full">
                        <FiZap size={14} />
                        <span>Beautifully Designed. Powerfully Simple.</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                        Organize Your Thoughts,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">
                            Amplify Your Ideas
                        </span>
                    </h1>

                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        A beautifully crafted note-taking app with glassmorphic design, smart folders, and cloud sync.
                        Your thoughts deserve a premium home.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 bg-amber-500 text-black font-semibold px-8 py-3 rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.6)] text-sm"
                        >
                            Get Started Free <FiArrowRight size={16} />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-all text-sm"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* App Preview Mockup */}
                <div className="max-w-5xl mx-auto mt-16 relative" ref={mockupRef} onMouseMove={handleMockupMouseMove} onMouseLeave={() => setMousePos(null)}>
                    <div className="absolute -inset-4 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />
                    <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                        {/* Title bar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            <span className="text-xs text-gray-500 ml-3">noteflow.app</span>
                        </div>
                        {/* Simulated dashboard */}
                        <div className="flex h-[350px] md:h-[450px]">
                            {/* Sidebar mock */}
                            <div className="w-52 border-r border-white/10 bg-white/[0.02] p-4 hidden md:block">
                                <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300 mb-6">NoteFlow</div>
                                <div className="space-y-2">
                                    {['All Notes', 'Favorites', 'Archive', 'Trash'].map((item, i) => (
                                        <div key={i} className={`text-xs px-3 py-2 rounded-lg ${i === 0 ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{item}</div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <div className="text-xs text-gray-500 mb-2">Folders</div>
                                    {[{ name: 'Work', color: 'bg-blue-400' }, { name: 'Personal', color: 'bg-purple-400' }, { name: 'Ideas', color: 'bg-amber-400' }].map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400 px-3 py-1.5">
                                            <div className={`w-2 h-2 rounded-full ${f.color}`} />
                                            {f.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Content area mock */}
                            <div className="flex-1 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">MY NOTES</div>
                                    <div className="w-48 h-8 rounded-lg bg-white/5 border border-white/10" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        { title: 'Project Ideas', color: 'from-amber-600', glowColor: 'rgba(245, 158, 11, 0.15)', content: 'Brainstorming session notes...' },
                                        { title: 'Meeting Notes', color: 'from-blue-600', glowColor: 'rgba(59, 130, 246, 0.15)', content: 'Q1 review action items...' },
                                        { title: 'Reading List', color: 'from-purple-600', glowColor: 'rgba(168, 85, 247, 0.15)', content: 'Books to read this month...' },
                                        { title: 'Travel Plans', color: 'from-emerald-600', glowColor: 'rgba(16, 185, 129, 0.15)', content: 'Weekend trip itinerary...' },
                                        { title: 'Recipes', color: 'from-rose-600', glowColor: 'rgba(244, 63, 94, 0.15)', content: 'Pasta carbonara recipe...' },
                                        { title: 'Goals 2025', color: 'from-cyan-600', glowColor: 'rgba(6, 182, 212, 0.15)', content: 'Fitness and career goals...' },
                                    ].map((note, i) => (
                                        <MockupNoteCard key={i} title={note.title} content={note.content} color={note.color} glowColor={note.glowColor} mousePos={mousePos} />
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ┌─────────────────────────────────────┐ */}
            {/* │          FEATURES SECTION           │ */}
            {/* └─────────────────────────────────────┘ */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-amber-400 text-sm font-medium flex items-center justify-center gap-2 mb-4">
                            <FiStar size={14} /> Features
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            Powerful Features for{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">Modern Note-Taking</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Everything you need to capture, organize, and access your thoughts — designed with obsessive attention to detail.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <FeatureCard key={i} index={i} icon={f.icon} title={f.title} description={f.description} color={f.color} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ┌─────────────────────────────────────┐ */}
            {/* │        HOW IT WORKS SECTION         │ */}
            {/* └─────────────────────────────────────┘ */}
            <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-amber-400 text-sm font-medium flex items-center justify-center gap-2 mb-4">
                            <FiZap size={14} /> How It Works
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            Get Started in{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">Three Steps</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            From sign-up to fully organized notes in under a minute.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {steps.map((step, i) => (
                            <StepCard key={i} index={i} num={step.num} title={step.title} desc={step.desc} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ┌─────────────────────────────────────┐ */}
            {/* │          PRICING SECTION            │ */}
            {/* └─────────────────────────────────────┘ */}
            <section id="pricing" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-amber-400 text-sm font-medium flex items-center justify-center gap-2 mb-4">
                            <FiStar size={14} /> Pricing
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            100% Free{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">While in Beta</span>
                        </h2>
                        <p className="text-gray-400">Enjoy full premium features for free during our beta period.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-6">
                        {pricing.map((p, i) => (
                            <PricingCard key={i} index={i} name={p.name} price={p.price} features={p.features} highlighted={p.highlighted} buttonText={p.buttonText} isWaitlist={p.isWaitlist} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ┌─────────────────────────────────────┐ */}
            {/* │           FAQ SECTION               │ */}
            {/* └─────────────────────────────────────┘ */}
            <section id="faq" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-amber-400 text-sm font-medium flex items-center justify-center gap-2 mb-4">
                            <FiStar size={14} /> FAQ
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            Frequently Asked{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">Questions</span>
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} index={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ┌─────────────────────────────────────┐ */}
            {/* │           CTA SECTION               │ */}
            {/* └─────────────────────────────────────┘ */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-xl pointer-events-none" />
                    <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-12 md:p-16 text-center overflow-hidden">
                        <div className="absolute -bottom-8 left-0 right-0 h-32 bg-gradient-to-t from-amber-500 to-transparent opacity-10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40 pointer-events-none" />

                        <span className="text-amber-400 text-sm font-medium mb-4 block">✨ Start Today</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            Ready to Transform Your{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">Note-Taking?</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto mb-8">
                            Experience the future of productivity powered by beautiful design that transforms the way you work.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 bg-amber-500 text-black font-semibold px-8 py-3 rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] text-sm"
                        >
                            Start Free Trial <FiArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ┌─────────────────────────────────────┐ */}
            {/* │             FOOTER                  │ */}
            {/* └─────────────────────────────────────┘ */}
            <footer className="border-t border-white/10 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
                            NoteFlow
                        </div>
                        <div className="flex items-center gap-8 text-sm text-gray-500">
                            <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
                            <a href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</a>
                            <a href="#faq" className="hover:text-gray-300 transition-colors">FAQ</a>
                            <Link to="/login" className="hover:text-gray-300 transition-colors">Log In</Link>
                        </div>
                    </div>
                    <div className="text-center mt-8 pt-8 border-t border-white/5 text-sm text-gray-600">
                        © {new Date().getFullYear()} NoteFlow. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
