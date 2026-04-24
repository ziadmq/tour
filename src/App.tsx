/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ChevronLeft, 
  Phone, 
  User as UserIcon, 
  CheckCircle2, 
  X,
  XCircle,
  Check,
  Menu,
  Facebook,
  Instagram,
  Twitter,
  Compass,
  ArrowRight,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  PhoneCall,
  FileText,
  Printer,
  Download,
  MessageCircle
} from 'lucide-react';
import { bookingService, authService, auth, tripService } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// --- Types ---
interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

interface Trip {
  id: string;
  title: string;
  destination: string;
  description: string;
  price: string;
  duration: string;
  startDate: string;
  groupSize: string;
  image: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  gallery: string[];
}

// --- Shared Components ---

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      <div className="absolute inset-0 bg-brand-secondary rounded-2xl rotate-12 transition-transform hover:rotate-45 duration-700" />
      <div className="absolute inset-0 bg-brand-primary rounded-2xl -rotate-6 transition-transform hover:rotate-12 duration-700 shadow-xl" />
      <Compass className="relative z-10 text-brand-secondary" size={size === 'lg' ? 40 : 28} />
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${scrolled ? 'mt-4' : 'mt-0'}`}>
      <div className={`max-w-7xl mx-auto flex justify-between items-center px-6 py-3 rounded-2xl transition-all duration-500 ${scrolled ? 'glass-nav shadow-premium' : 'bg-transparent'}`}>
        <Link to="/" className="flex items-center gap-3">
          <Logo size="sm" />
          <h1 className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-500 ${scrolled ? 'text-brand-primary' : 'text-white'}`}>جولات الشام</h1>
        </Link>
        
        <div className={`hidden md:flex items-center gap-10 font-bold text-sm tracking-wide transition-colors duration-500 ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
          <Link to="/" className="hover:text-brand-secondary transition-colors relative group">
            الرئيسية
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary transition-all group-hover:w-full" />
          </Link>
          <a href="/#trips" className="hover:text-brand-secondary transition-colors relative group">
            الرحلات
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary transition-all group-hover:w-full" />
          </a>
          <a href="/#about" className="hover:text-brand-secondary transition-colors relative group">
            من نحن
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary transition-all group-hover:w-full" />
          </a>
          <a href="tel:+962796664214" className={`px-6 py-2.5 rounded-xl font-black transition-all btn-modern shadow-lg ${scrolled ? 'bg-brand-primary text-white hover:bg-slate-800' : 'bg-brand-secondary text-brand-primary hover:bg-white'}`}>اتصل بنا</a>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-xl transition-all ${scrolled ? 'text-brand-primary' : 'text-white'}`}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-6 right-6 bg-white rounded-3xl p-8 shadow-premium border border-slate-100 flex flex-col gap-6 font-bold text-lg"
          >
            <Link onClick={() => setMobileMenuOpen(false)} to="/" className="text-slate-600">الرئيسية</Link>
            <a onClick={() => setMobileMenuOpen(false)} href="/#trips" className="text-slate-600">الرحلات</a>
            <a onClick={() => setMobileMenuOpen(false)} href="/#about" className="text-slate-600">من نحن</a>
            <a href="tel:+962796664214" className="w-full py-4 bg-brand-primary text-white rounded-2xl text-center">اتصل بنا</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-brand-primary text-slate-400 py-24 px-6 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10 text-right">
      <div className="space-y-8 col-span-1 md:col-span-1">
        <div className="flex items-center gap-4 justify-end">
          <h2 className="text-3xl font-black text-white font-serif tracking-tight">جولات الشام</h2>
          <Logo size="sm" />
        </div>
        <p className="font-medium leading-relaxed text-lg">
          رحلاتك البرية الفاخرة بين عمان ودمشق. نحن نهتم بكل تفاصيل مغامرتك.
        </p>
        <div className="flex gap-4 justify-end">
          {[Phone, Instagram, Facebook, Twitter].map((Icon, i) => (
            <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-secondary hover:text-brand-primary transition-all duration-300">
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
      
      <div className="space-y-8">
        <h4 className="text-white font-black text-xl font-serif">روابط سريعة</h4>
        <ul className="space-y-4 font-bold">
          <li><Link to="/" className="hover:text-brand-secondary transition-colors">الرئيسية</Link></li>
          <li><a href="/#trips" className="hover:text-brand-secondary transition-colors">أحدث الرحلات</a></li>
          <li><a href="/#about" className="hover:text-brand-secondary transition-colors">من نحن</a></li>
          <li><Link to="/login-admin" className="hover:text-brand-secondary transition-colors">لوحة الإدارة</Link></li>
        </ul>
      </div>

      <div className="space-y-8">
        <h4 className="text-white font-black text-xl font-serif">خدماتنا</h4>
        <ul className="space-y-4 font-bold">
          <li className="hover:text-brand-secondary transition-colors cursor-pointer text-sm">نقل VIP خاص</li>
          <li className="hover:text-brand-secondary transition-colors cursor-pointer text-sm">رحلات عائلية</li>
          <li className="hover:text-brand-secondary transition-colors cursor-pointer text-sm">تخليص معاملات الحدود</li>
          <li className="hover:text-brand-secondary transition-colors cursor-pointer text-sm">تنظيم فعاليات</li>
        </ul>
      </div>

      <div className="space-y-8">
        <h4 className="text-white font-black text-xl font-serif">تواصل معنا</h4>
        <div className="space-y-4 font-bold">
          <div className="flex items-center gap-4 justify-end">
            <p className="text-sm">عمان، العبدلي - البوليفارد</p>
            <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center text-brand-secondary">
              <MapPin size={18} />
            </div>
          </div>
          <div className="flex items-center gap-4 justify-end">
            <p className="text-sm" dir="ltr">+962 79 666 4214</p>
            <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center text-brand-secondary">
              <Phone size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row-reverse justify-between items-center gap-6 text-sm font-bold opacity-60">
      <p>© 2026 جولات الشام. جميع الحقوق محفوظة.</p>
      <p>صمم بكل شغف لمستقبل السياحة البرية.</p>
    </div>
  </footer>
);

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => (
  <motion.div 
    whileHover={{ y: -16, scale: 1.02 }}
    className="glass-card rounded-[2.5rem] overflow-hidden transition-all duration-700 flex flex-col h-full"
  >
    <div className="relative h-72 overflow-hidden">
      <img 
        src={trip.image} 
        alt={trip.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-6 right-6 bg-brand-secondary text-brand-primary px-5 py-2 rounded-2xl text-sm font-black shadow-2xl backdrop-blur-md">
        {trip.price}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent flex flex-col justify-end p-8">
        <span className="text-brand-secondary text-xs font-black uppercase tracking-[0.2em] mb-2">{trip.destination}</span>
        <h3 className="text-white text-3xl font-black drop-shadow-md font-serif leading-tight">{trip.title}</h3>
      </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
        {trip.description}
      </p>
      
      <div className="mt-auto flex items-center justify-between py-6 border-y border-slate-100 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
          <Clock size={14} className="text-brand-secondary" />
          <span>{trip.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
          <Calendar size={14} className="text-brand-secondary" />
          <span>{trip.startDate}</span>
        </div>
      </div>
      
      <Link 
        to={`/trip/${trip.id}`}
        className="w-full py-5 bg-brand-primary text-white font-black rounded-2xl hover:bg-brand-secondary hover:text-brand-primary transition-all flex items-center justify-center gap-3 shadow-xl btn-modern"
      >
        تفاصيل المغامرة
        <ChevronLeft size={20} />
      </Link>
    </div>
  </motion.div>
);

// --- Pages ---

const HomePage = () => {
  const location = useLocation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const firestoreTrips = await tripService.getAllTrips();
        setTrips(firestoreTrips as any || []);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();

    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <header id="hero" className="relative h-screen flex items-center justify-center pt-20 overflow-hidden bg-brand-primary">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 modern-gradient bg-cover bg-center bg-no-repeat transition-transform duration-[30s] ease-linear hover:scale-110" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1920&h=1080')" }}
        />
        <div className="relative z-10 text-center px-6 max-w-5xl space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-6 py-2 bg-brand-secondary/10 backdrop-blur-2xl rounded-full text-brand-secondary font-black text-xs tracking-[0.3em] uppercase mb-8 border border-brand-secondary/30">
              Luxury Travel Experiences
            </span>
            <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl font-serif">
              عمـان <span className="text-brand-secondary font-light italic">إلى</span> دمشق
            </h1>
            <p className="text-xl md:text-3xl text-white/80 max-w-2xl mx-auto font-medium mt-12 leading-relaxed backdrop-blur-sm p-4 rounded-3xl">
               رحلات برية فاخرة تعيد كتابة مفهوم السفر بين عاصمتين من أعرق مدن العالم.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <a href="#trips" className="px-12 py-6 bg-brand-secondary text-brand-primary font-black text-lg rounded-2xl hover:bg-white transition-all shadow-[0_20px_50px_rgba(245,158,11,0.3)] flex items-center gap-4 group btn-modern">
              اكتشف مغامرتك
              <ChevronLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
            </a>
            <button className="px-12 py-6 bg-white/5 backdrop-blur-md text-white font-black text-lg rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
              قصتنا
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-8 h-12 border-2 border-white/20 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-brand-secondary rounded-full animate-scroll" />
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Compass size={40} />, title: 'تخطيط احترافي', desc: 'نحن الرواد في تنظيم الرحلات العصرية بين عمان ودمشق بأعلى معايير الجودة العالمية.' },
            { icon: <Users size={40} />, title: 'تجربة شخصية', desc: 'نهتم بأدق التفاصيل لضمان راحة وخصوصية عائلتك خلال الرحلة بأسلوب VIP عالي المستوى.' },
            { icon: <ShieldCheck size={40} />, title: 'أمان وثقة', desc: 'أنظمة حجز ذكية وسياسات مرنة تضمن لك راحة البال من لحظة الحجز وحتى الوصول.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-10 glass-card rounded-[3rem] space-y-8 group hover:-translate-y-4 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-brand-secondary/10 rounded-[2rem] flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-brand-primary transition-all duration-700">
                {feature.icon}
              </div>
              <h3 className="text-3xl font-black text-brand-primary font-serif">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trips Section */}
      <section id="trips" className="py-32 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/50 rounded-full blur-[120px] -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-brand-primary tracking-tighter">رحلاتنا المميزة</h2>
            <p className="text-brand-muted text-xl max-w-2xl mx-auto font-medium">وجهات مختارة بعناية تجمع بين الحداثة والأصالة في ربيع 2026</p>
            <div className="w-20 h-2 bg-brand-secondary mx-auto rounded-full mt-8 shadow-lg shadow-blue-500/40" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="animate-spin text-brand-secondary" size={48} />
              </div>
            ) : trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24 relative">
          <div className="absolute -left-20 top-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[100px]" />
          
          <div className="md:w-1/2 space-y-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-brand-secondary font-black tracking-[0.3em] uppercase text-sm">Beyond Boundaries</span>
              <h2 className="text-6xl md:text-8xl font-black text-brand-primary leading-[1] font-serif tracking-tighter">رؤية عصرية للتنقل السياحي</h2>
            </motion.div>
            
            <div className="space-y-8 text-slate-500 text-xl leading-relaxed font-medium">
              <p>
                في "جولات الشام"، نسعى لإعادة تعريف مفهوم السياحة البرية. نحن ندمج التكنولوجيا الحديثة مع قيم الضيافة العريقة لتقديم تجربة لا تضاهى.
              </p>
              <p>
                رسالتنا هي بناء جسور من السعادة والرفاهية لعملائنا في الأردن وسوريا، مع الالتزام الكامل بالأمان والتميز في كل ميل نقطعه.
              </p>
            </div>

            <div className="flex flex-wrap gap-12 py-10 border-t border-slate-100">
              {[
                { val: '+5k', label: 'مسافر سعيد' },
                { val: '+300', label: 'رحلة ناجحة' },
                { val: '100%', label: 'ثقة وأمان' }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-5xl font-black text-brand-primary font-serif">{stat.val}</p>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative"
          >
            <div className="aspect-[4/5] bg-slate-50 rounded-[4rem] -rotate-6 absolute inset-0 -z-10 border border-slate-100 shadow-inner" />
            <div className="aspect-[4/5] bg-brand-secondary/10 rounded-[4rem] rotate-3 absolute inset-0 -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1583094943719-756616239105?auto=format&fit=crop&q=80&w=900&h=1100" 
              alt="Experience Damascus" 
              className="rounded-[4rem] shadow-premium object-cover w-full aspect-[4/5] relative z-10 hover:rotate-2 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

const TourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'form' | 'success'>('details');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [activeTab, setActiveTab] = useState<'itinerary' | 'highlights' | 'gallery'>('itinerary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const t = await tripService.getTripById(id);
        if (t) {
          setTrip(t as any);
        }
      } catch (err) {
        console.error("Error fetching trip:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading && !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-brand-secondary" size={48} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-brand-primary">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black">الرحلة غير موجودة</h2>
          <button onClick={() => navigate('/')} className="text-brand-secondary font-bold hover:underline">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await bookingService.createBooking({
        tripId: trip.id,
        tripTitle: trip.title,
        customerName: formData.name,
        customerPhone: formData.phone
      });
      setStep('success');
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError('عذراً، حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-20 px-6 max-w-7xl mx-auto"
    >
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 text-slate-400 font-bold mb-12 hover:text-brand-secondary transition-all group"
      >
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        العودة لاستكشاف الرحلات
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-20">
          {/* Header Section */}
          <section className="space-y-10">
            <div className="space-y-4">
              <span className="text-brand-secondary font-black tracking-[0.3em] uppercase text-xs">Premium Voyage</span>
              <h1 className="text-6xl md:text-8xl font-black text-brand-primary leading-[1] tracking-tighter font-serif">{trip.title}</h1>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: <MapPin size={20} />, label: trip.destination },
                { icon: <Clock size={20} />, label: trip.duration },
                { icon: <Calendar size={20} />, label: trip.startDate },
                { icon: <Users size={20} />, label: `مجموعات ${trip.groupSize}` }
              ].map((info, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white px-6 py-4 rounded-[2rem] shadow-premium border border-white/40">
                  <span className="text-brand-secondary">{info.icon}</span>
                  <span className="font-bold text-brand-primary text-lg">{info.label}</span>
                </div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[4rem] overflow-hidden shadow-premium relative group aspect-[16/9]"
            >
              <img 
                src={trip.image} 
                alt={trip.title} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-8 right-8 bg-brand-secondary text-brand-primary px-12 py-5 rounded-[2.5rem] font-black shadow-2xl text-3xl font-serif">
                {trip.price}
              </div>
            </motion.div>
          </section>

          {/* Description Section */}
          <section className="space-y-8 relative">
            <div className="absolute -right-12 top-0 w-2 h-full bg-brand-secondary/20 rounded-full" />
            <h2 className="text-4xl font-black text-brand-primary font-serif">قصة الرحلة</h2>
            <p className="text-slate-500 text-2xl font-medium leading-[1.8]">
              {trip.description}
            </p>
          </section>

          {/* Tabs Section */}
          <section className="space-y-12">
            <div className="flex p-2 bg-slate-100 rounded-[2.5rem] w-fit">
              {[
                { id: 'itinerary', label: 'المسار' },
                { id: 'highlights', label: 'المميزات' },
                { id: 'gallery', label: 'المعرض' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-10 py-4 rounded-[2rem] font-black text-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-brand-primary shadow-premium' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-2">
              <AnimatePresence mode="wait">
                {activeTab === 'itinerary' && (
                  <motion.div 
                    key="itinerary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                    {trip.itinerary.map((day, idx) => (
                      <div key={idx} className="relative pr-20 pb-16 last:pb-0 border-r-2 border-slate-100 last:border-0">
                        <div className="absolute top-0 -right-[33px] w-16 h-16 bg-brand-primary rounded-[1.5rem] flex items-center justify-center text-brand-secondary font-black text-2xl shadow-premium rotate-12">
                          {day.day}
                        </div>
                        <h3 className="text-3xl font-black text-brand-primary mb-8 font-serif">{day.title}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {day.activities.map((act, i) => (
                              <div key={i} className="flex items-center gap-5 p-6 glass-card rounded-[2rem] group hover:border-brand-secondary transition-all">
                                <div className="w-4 h-4 rounded-full bg-brand-secondary group-hover:scale-150 transition-transform" />
                                <span className="text-slate-700 font-bold text-lg">{act}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'highlights' && (
                  <motion.div 
                    key="highlights"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-16"
                  >
                    <div className="space-y-8">
                      <h3 className="text-3xl font-black text-brand-primary flex items-center gap-4 font-serif">
                        <CheckCircle2 size={32} className="text-brand-accent" />
                        رحلتنا تشمل
                      </h3>
                      <ul className="space-y-4">
                        {trip.includes.map((item, i) => (
                          <li key={i} className="flex items-center gap-4 text-slate-500 font-bold p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-brand-accent transition-all">
                             <Check size={20} className="text-brand-accent" />
                             {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-8">
                      <h3 className="text-3xl font-black text-rose-600 flex items-center gap-4 font-serif">
                        <XCircle size={32} />
                        لا تشمل الرحلة
                      </h3>
                      <ul className="space-y-4">
                        {trip.excludes.map((item, i) => (
                          <li key={i} className="flex items-center gap-4 text-slate-500 font-bold p-6 bg-rose-50/30 rounded-[2rem] border border-rose-100 group hover:border-rose-400 transition-all">
                             <X size={20} className="text-rose-400" />
                             {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div 
                    key="gallery"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  >
                    {trip.gallery.map((img, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="rounded-[2.5rem] h-72 w-full overflow-hidden shadow-premium group relative"
                      >
                        <img 
                          src={img} 
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="text-white" size={40} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Sidebar Booking Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <div className="bg-brand-primary text-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-secondary/20 rounded-full blur-[80px]" />
            
            <AnimatePresence mode="wait">
              {step !== 'success' ? (
                <motion.div 
                  key="form-step"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white tracking-tighter">احجز الآن</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">أدخل بياناتك وسيقوم خبير السفر لدينا بالاتصال بك خلال ساعة واحدة.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-100 text-sm">
                        <AlertCircle className="shrink-0" size={20} />
                        <p>{error}</p>
                      </div>
                    )}
                    <div className="space-y-3">
                      <label className="block text-sm font-black text-slate-400 pr-2 uppercase tracking-widest">الاسم الكامل</label>
                      <div className="relative">
                        <UserIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-secondary" size={24} />
                        <input 
                          required
                          disabled={isSubmitting}
                          type="text" 
                          placeholder="الاسم الثلاثي"
                          className="w-full pr-16 pl-6 py-6 bg-slate-800/50 border border-slate-700 rounded-3xl focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all placeholder:text-slate-600 text-white font-black text-lg disabled:opacity-50"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-black text-slate-400 pr-2 uppercase tracking-widest">رقم التواصل</label>
                      <div className="relative">
                        <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-secondary" size={24} />
                        <input 
                          required
                          disabled={isSubmitting}
                          type="tel" 
                          placeholder="079XXXXXXXX"
                          className="w-full pr-16 pl-6 py-6 bg-slate-800/50 border border-slate-700 rounded-3xl focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary outline-none transition-all placeholder:text-slate-600 text-white font-black text-lg disabled:opacity-50"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-slate-800/80 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex items-center gap-3 text-brand-accent">
                        <CheckCircle2 size={24} />
                        <p className="text-sm font-black uppercase tracking-wider">نظام فليكس للحجز</p>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-bold">
                        طلبك يعد "اهتماماً بالحجز" وليس إلتزاماً مالياً. نحن نعتمد سياسة الدفع التقليدي في المكتب لضمان أعلى درجات الثقة.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 bg-brand-secondary text-white font-black text-2xl rounded-3xl hover:bg-white hover:text-brand-primary hover:scale-[1.02] transition-all shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] flex items-center justify-center gap-4 group disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={28} />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          إرسال الطلب
                          <ArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 space-y-10"
                >
                  <div className="w-32 h-32 bg-brand-secondary text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-12 ring-8 ring-brand-secondary/20">
                    <CheckCircle2 size={72} />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-5xl font-black text-white tracking-tighter">طلبك مكتمل!</h2>
                    <p className="text-xl text-slate-400 leading-relaxed font-medium">
                      شكراً لك يا <span className="text-white font-black">{formData.name}</span>.<br />
                      طلبك لرحلة {trip.title} قيد المعالجة الآن.
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full py-6 bg-white/10 border border-white/20 text-white font-black text-xl rounded-3xl hover:bg-white/20 transition-all"
                  >
                    العودة للتصفح
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const profile = await authService.getCurrentUserProfile(u.uid);
        if (profile?.isAdmin || u.email === 'kafehazyad5@gmail.com') {
          navigate('/admin');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError('عذراً، حدث خطأ أثناء تسجيل الدخول. تأكد من استخدام حساب جوجل المعتمد أو تواصل مع الدعم التقني.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center space-y-8"
      >
        <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="text-brand-primary" size={40} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-brand-primary">لوحة تحكم المسؤول</h2>
          <p className="text-brand-muted font-bold leading-relaxed">يرجى تسجيل الدخول باستخدام حساب جوجل المعتمد للوصول إلى أدوات الإدارة.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border border-red-100">
            {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <img src="https://www.google.com/favicon.ico" className="w-6 h-6 border-none" alt="G" />}
          تسجيل الدخول مع Google
        </button>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'bookings' | 'trips' | 'trip-form' | 'bill'>('bookings');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedTripForBill, setSelectedTripForBill] = useState<any>(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'pending' | 'confirmed' | 'all'>('all');

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      await bookingService.updateBookingStatus(id, status);
      const b = await bookingService.getAllBookings();
      setBookings(b || []);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث حالة الحجز');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحجز نهائياً؟')) return;
    setLoading(true);
    try {
      await bookingService.deleteBooking(id);
      const b = await bookingService.getAllBookings();
      setBookings(b || []);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف الحجز');
    } finally {
      setLoading(false);
    }
  };

  const [tripForm, setTripForm] = useState({
    title: '',
    destination: '',
    description: '',
    price: '',
    duration: '',
    startDate: 'كل جمعة',
    groupSize: '15 - 20 شخص',
    image: 'https://picsum.photos/seed/tour/800/600',
    highlights: [] as string[],
    includes: [] as string[],
    excludes: [] as string[],
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[]
  });
  const [newItem, setNewItem] = useState({ type: 'includes', value: '' });

  // Itinerary helper states
  const [itineraryDayForm, setItineraryDayForm] = useState({ title: '', activities: '' });

  const addItem = (type: 'highlights' | 'includes' | 'excludes' | 'gallery') => {
    if (!newItem.value.trim()) return;
    setTripForm({
      ...tripForm,
      [type]: [...(tripForm[type as keyof typeof tripForm] as string[]), newItem.value]
    });
    setNewItem({ type: 'includes', value: '' });
  };

  const removeItem = (type: 'highlights' | 'includes' | 'excludes' | 'gallery', index: number) => {
    setTripForm({
      ...tripForm,
      [type]: (tripForm[type as keyof typeof tripForm] as string[]).filter((_, i) => i !== index)
    });
  };

  const addItineraryDay = () => {
    if (!itineraryDayForm.title.trim()) return;
    const activities = itineraryDayForm.activities.split('\n').filter(a => a.trim());
    const newDay: ItineraryDay = {
      day: tripForm.itinerary.length + 1,
      title: itineraryDayForm.title,
      activities
    };
    setTripForm({
      ...tripForm,
      itinerary: [...tripForm.itinerary, newDay]
    });
    setItineraryDayForm({ title: '', activities: '' });
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = tripForm.itinerary
      .filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day: i + 1 }));
    setTripForm({ ...tripForm, itinerary: newItinerary });
  };

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const profile = await authService.getCurrentUserProfile(u.uid);
          // RESILIENCE: Check both the profile document AND a hardcoded owner email
          const isOwner = u.email === 'kafehazyad5@gmail.com';
          
          if (profile?.isAdmin || isOwner) {
            setUser(u);
            const [b, t] = await Promise.all([
              bookingService.getAllBookings(),
              tripService.getAllTrips()
            ]);
            setBookings(b || []);
            setTrips(t || []);
          } else {
            alert('عذراً، ليس لديك صلاحيات المسؤول');
            await authService.signOut();
            navigate('/');
          }
        } catch (err) {
          console.error('Error loading admin dashboard:', err);
          alert('حدث خطأ أثناء تحميل بيانات الإدارة. يرجى التأكد من اتصال الإنترنت.');
          await authService.signOut();
          navigate('/login-admin');
        }
      } else {
        navigate('/login-admin');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/');
  };

  const handleTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTrip) {
        await tripService.updateTrip(editingTrip.id, tripForm);
      } else {
        await tripService.createTrip(tripForm);
      }
      const t = await tripService.getAllTrips();
      setTrips(t || []);
      setView('trips');
      setEditingTrip(null);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الرحلة');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرحلة؟')) return;
    setLoading(true);
    try {
      await tripService.deleteTrip(id);
      const t = await tripService.getAllTrips();
      setTrips(t || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = (booking: any) => {
    setSelectedBooking(booking);
    // Find matching trip details if possible
    const trip = trips.find(t => t.id === booking.tripId);
    setSelectedTripForBill(trip);
    setView('bill');
  };

  const sendToWhatsApp = () => {
    if (!selectedBooking) return;
    const cleanPhone = selectedBooking.customerPhone.replace(/[^0-9]/g, '');
    const message = `*فاتورة حجز من جولات الشام* \n\n` +
      `*رقم الطلب:* #${selectedBooking.id.slice(-6).toUpperCase()}\n` +
      `*العميل:* ${selectedBooking.customerName}\n` +
      `*الرحلة:* ${selectedBooking.tripTitle}\n` +
      `*الوجهة:* ${selectedTripForBill?.destination || 'دمشق، سوريا'}\n` +
      `*تاريخ البدء:* ${selectedTripForBill?.startDate || 'سيتم التواصل للتأكيد'}\n` +
      `*المدة:* ${selectedTripForBill?.duration || '...'}\n` +
      `*السعر:* ${selectedTripForBill?.price || 'قيد التحديد'}\n\n` +
      `شكراً لاختياركم جولات الشام!`;
    
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-brand-secondary" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-brand-primary flex items-center gap-4">
              <LayoutDashboard size={40} className="text-brand-secondary" />
              لوحة التحكم
            </h1>
            <p className="text-brand-muted font-bold text-lg">أهلاً بك، {user?.displayName}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black flex items-center gap-3 hover:bg-red-100 transition-all"
            >
              <LogOut size={20} />
              خروج
            </button>
          </div>
        </header>

        {/* Admin Navigation */}
        <div className="flex gap-4 border-b border-slate-200">
          <button 
            onClick={() => setView('bookings')}
            className={`pb-4 px-6 font-black transition-all ${view === 'bookings' ? 'text-brand-secondary border-b-4 border-brand-secondary' : 'text-slate-400'}`}
          >
            طلبات الحجز ({bookings.length})
          </button>
          <button 
            onClick={() => setView('trips')}
            className={`pb-4 px-6 font-black transition-all ${view === 'trips' ? 'text-brand-secondary border-b-4 border-brand-secondary' : 'text-slate-400'}`}
          >
            إدارة الرحلات ({trips.length})
          </button>
        </div>

        {view === 'bookings' && (
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <h3 className="text-xl font-black text-brand-primary">طلبات الحجز</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'pending', label: 'قيد الانتظار' },
                  { id: 'confirmed', label: 'مؤكد' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBookingStatusFilter(tab.id as any)}
                    className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${bookingStatusFilter === tab.id ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-slate-100 text-brand-muted font-black text-sm uppercase tracking-widest">
                    <th className="pb-4 pr-4 text-right">العميل</th>
                    <th className="pb-4 pr-4 text-right">الرحلة</th>
                    <th className="pb-4 pr-4 text-right">رقم الهاتف</th>
                    <th className="pb-4 pr-4 text-right text-center">الحالة</th>
                    <th className="pb-4 pr-4 text-right">التاريخ</th>
                    <th className="pb-4 pr-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings
                    .filter(b => bookingStatusFilter === 'all' || b.status === bookingStatusFilter)
                    .map((b) => (
                    <tr key={b.id} className="group hover:bg-slate-50 transition-all">
                      <td className="py-6 pr-4 font-black text-brand-primary">{b.customerName}</td>
                      <td className="py-6 pr-4 font-bold text-brand-muted">{b.tripTitle}</td>
                      <td className="py-6 pr-4 font-mono ltr text-right">{b.customerPhone}</td>
                      <td className="py-6 pr-4">
                        <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black ${
                            b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {b.status === 'confirmed' ? 'مؤكد' : 'بانتظار التأكيد'}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 pr-4 text-sm text-slate-400 font-bold">
                        {b.createdAt?.toDate ? new Date(b.createdAt.toDate()).toLocaleDateString('ar-JO') : '...'}
                      </td>
                      <td className="py-6 pr-4">
                        <div className="flex justify-center gap-2">
                          <a 
                            href={`tel:${b.customerPhone}`}
                            className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="اتصال"
                          >
                            <PhoneCall size={16} />
                          </a>
                          <button 
                            onClick={() => handleGenerateBill(b)}
                            className="w-9 h-9 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                            title="فاتورة"
                          >
                            <FileText size={16} />
                          </button>
                          {b.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                              className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              title="تأكيد"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteBooking(b.id)}
                            className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'bill' && selectedBooking && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
               <button 
                onClick={() => setView('bookings')}
                className="flex items-center gap-2 text-brand-muted font-bold hover:text-brand-primary transition-colors"
               >
                <ArrowRight size={20} className="rotate-180" />
                العودة للطلبات
               </button>
               <div className="flex gap-3">
                 <button 
                  onClick={sendToWhatsApp}
                  className="px-6 py-2.5 bg-[#25D366] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#128C7E] transition-all shadow-lg"
                 >
                  <MessageCircle size={18} />
                  إرسال واتساب
                 </button>
                 <button 
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                 >
                  <Printer size={18} />
                  طباعة الفاتورة
                 </button>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 print:shadow-none print:border-none print:p-0" id="invoice">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b-4 border-brand-secondary pb-10 mb-10">
                <div className="space-y-2 text-right">
                  <h2 className="text-4xl font-black text-brand-primary">جولات الشام</h2>
                  <p className="text-brand-muted font-bold">عمان، الأردن - بوليفارد العبدلي</p>
                  <p className="text-brand-muted font-bold ltr">+962 79 666 4214</p>
                </div>
                <div className="text-left space-y-2">
                   <div className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-xl mb-4 text-center">فاتورة حجز</div>
                   <p className="text-slate-400 font-bold">رقم الطلب: <span className="text-brand-primary">#{selectedBooking.id.slice(-6).toUpperCase()}</span></p>
                   <p className="text-slate-400 font-bold">التاريخ: <span className="text-brand-primary">{new Date().toLocaleDateString('ar-JO')}</span></p>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                 <div className="space-y-4 text-right">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">بيانات العميل</h4>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-brand-primary">{selectedBooking.customerName}</p>
                      <p className="text-lg font-bold text-slate-500 ltr">{selectedBooking.customerPhone}</p>
                    </div>
                 </div>
                 <div className="space-y-4 text-right">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">حالة الحجز</h4>
                    <div className={`inline-block px-6 py-2 rounded-full font-black text-lg ${
                      selectedBooking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                       {selectedBooking.status === 'confirmed' ? 'مؤكد' : 'بانتظار التأكيد'}
                    </div>
                 </div>
              </div>

              {/* Tour Details */}
              <div className="space-y-6 mb-12">
                 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest text-right">تفاصيل الرحلة</h4>
                 <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
                    <div className="flex justify-between items-center border-b border-white pb-6">
                       <span className="text-2xl font-black text-brand-primary">{selectedBooking.tripTitle}</span>
                       <span className="text-2xl font-black text-brand-secondary">{selectedTripForBill?.price || 'قيد التحديد'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-right">
                       <div className="space-y-1">
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">الوجهة</p>
                         <p className="font-bold text-brand-primary">{selectedTripForBill?.destination || 'سوريا'}</p>
                       </div>
                       <div className="space-y-1">
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">المدة</p>
                         <p className="font-bold text-brand-primary">{selectedTripForBill?.duration || '...'}</p>
                       </div>
                       <div className="space-y-1">
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">تاريخ البدء</p>
                         <p className="font-bold text-brand-primary">{selectedTripForBill?.startDate || 'سيتم التواصل للتأكيد'}</p>
                       </div>
                       <div className="space-y-1">
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">حجم المجموعة</p>
                         <p className="font-bold text-brand-primary">{selectedTripForBill?.groupSize || 'مجموعة خاصة'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Terms */}
              <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4 text-right">
                 <h4 className="font-black text-xl flex items-center gap-2 justify-end">
                    سياسة الدفع والخدمة
                    <AlertCircle size={20} className="text-brand-accent" />
                 </h4>
                 <ul className="space-y-2 text-sm text-slate-300 font-medium">
                    <li>• يعتمد هذا الطلب بعد التواصل المباشر وتأكيد المقاعد مسبقاً.</li>
                    <li>• يتم دفع المبلغ نقداً في المكتب أو عبر التحويل البنكي المعتمد قبل موعد الرحلة بـ 48 ساعة.</li>
                    <li>• تشمل الرحلة كافة الخدمات المذكورة في عرض السعر التفصيلي بموقعنا.</li>
                 </ul>
              </div>

              {/* Footer Invoice */}
              <div className="mt-12 pt-12 border-t border-slate-100 text-center">
                 <p className="text-slate-400 font-bold italic">شكراً لاختياركم جولات الشام - وجهتكم الفاخرة للشرق</p>
                 <div className="flex justify-center gap-6 mt-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                       <ShoppingBag size={20} />
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                       <Compass size={20} />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {view === 'trips' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-brand-primary">الرحلات المتوفرة</h3>
              <button 
                onClick={() => { setView('trip-form'); setEditingTrip(null); }}
                className="px-6 py-3 bg-brand-secondary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-brand-primary transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus size={20} />
                إضافة رحلة جديدة
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => {
                const tourBookings = bookings.filter(b => b.tripId === trip.id);
                const confirmedCount = tourBookings.filter(b => b.status === 'confirmed').length;
                const registeredCount = tourBookings.length;

                return (
                  <div key={trip.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <img src={trip.image} className="w-full h-40 object-cover rounded-3xl" alt={trip.title} referrerPolicy="no-referrer" />
                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-brand-primary">{trip.title}</h4>
                      <p className="text-sm text-slate-400 font-bold">{trip.destination} • {trip.price}</p>
                    </div>

                    {/* Booking Stats */}
                    <div className="grid grid-cols-2 gap-3 pb-2">
                       <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المسجلين</p>
                          <p className="text-xl font-black text-brand-primary">{registeredCount}</p>
                       </div>
                       <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">المؤكدين</p>
                          <p className="text-xl font-black text-emerald-600">{confirmedCount}</p>
                       </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => { setEditingTrip(trip); setTripForm(trip); setView('trip-form'); }}
                        className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Settings size={16} />
                        تعديل
                      </button>
                      <button 
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'trip-form' && (
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-brand-primary">{editingTrip ? 'تعديل رحلة' : 'إضافة رحلة جديدة'}</h3>
              <button onClick={() => setView('trips')} className="text-slate-400 hover:text-brand-primary transition-colors">
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleTripSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">اسم الرحلة</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.title}
                  onChange={e => setTripForm({...tripForm, title: e.target.value})}
                />
              </div>
              <div className="space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">الوجهة</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.destination}
                  onChange={e => setTripForm({...tripForm, destination: e.target.value})}
                />
              </div>
              <div className="col-span-full space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">الوصف</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.description}
                  onChange={e => setTripForm({...tripForm, description: e.target.value})}
                />
              </div>
              <div className="space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">السعر</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.price}
                  onChange={e => setTripForm({...tripForm, price: e.target.value})}
                />
              </div>
              <div className="space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">المدة (أيام/ليالي)</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.duration}
                  onChange={e => setTripForm({...tripForm, duration: e.target.value})}
                />
              </div>
              <div className="space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">تاريخ البدء</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.startDate}
                  onChange={e => setTripForm({...tripForm, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">حجم المجموعة</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.groupSize}
                  onChange={e => setTripForm({...tripForm, groupSize: e.target.value})}
                />
              </div>
              <div className="col-span-full space-y-4 text-right">
                <label className="block text-sm font-black text-slate-400 pr-2">رابط الصورة</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" 
                  value={tripForm.image}
                  onChange={e => setTripForm({...tripForm, image: e.target.value})}
                />
              </div>

              {/* Dynamic Lists */}
              {([
                { id: 'highlights', label: 'أبرز مميزات الرحلة' },
                { id: 'includes', label: 'رحلتنا تشمل' },
                { id: 'excludes', label: 'لا تشمل الرحلة' }
              ] as const).map((section) => (
                <div key={section.id} className="col-span-full space-y-4 text-right bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <label className="block text-xl font-black text-brand-primary pr-2">{section.label}</label>
                  <div className="flex gap-4">
                    <input 
                      className="flex-1 p-5 bg-white border border-slate-200 rounded-2xl font-bold focus:border-brand-secondary outline-none" 
                      placeholder={`أضف بنداً جديداً لـ ${section.label}`}
                      value={newItem.type === section.id ? newItem.value : ''}
                      onChange={e => setNewItem({ type: section.id, value: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(section.id as any))}
                    />
                    <button 
                      type="button" 
                      onClick={() => addItem(section.id as any)}
                      className="px-8 bg-brand-secondary text-white rounded-2xl font-black hover:bg-brand-primary transition-all"
                    >
                      إضافة
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {tripForm[section.id as keyof typeof tripForm]?.map?.((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                        <span className="font-bold text-slate-600">{item}</span>
                        <button type="button" onClick={() => removeItem(section.id as any, idx)} className="text-red-400 hover:text-red-600 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Gallery Section */}
              <div className="col-span-full space-y-4 text-right bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <label className="block text-xl font-black text-brand-primary pr-2">معرض صور الرحلة</label>
                <div className="flex gap-4">
                  <input 
                    className="flex-1 p-5 bg-white border border-slate-200 rounded-2xl font-bold focus:border-brand-secondary outline-none" 
                    placeholder="رابط صورة جديدة"
                    value={newItem.type === 'gallery' ? newItem.value : ''}
                    onChange={e => setNewItem({ type: 'gallery', value: e.target.value })}
                  />
                  <button 
                    type="button" 
                    onClick={() => addItem('gallery')}
                    className="px-8 bg-brand-secondary text-white rounded-2xl font-black hover:bg-brand-primary transition-all"
                  >
                    إضافة صورة
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {tripForm.gallery.map((img, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video shadow-md border border-white">
                      <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      <button 
                        type="button" 
                        onClick={() => removeItem('gallery', idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="col-span-full space-y-6 text-right bg-slate-50 p-8 rounded-3xl border border-slate-100">
                 <label className="block text-2xl font-black text-brand-primary pr-2 border-r-8 border-brand-secondary">الجدول الزمني للرحلة (يوم بيوم)</label>
                 
                 <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-xs font-black text-slate-400">عنوان اليوم</label>
                         <input 
                           className="w-full p-4 bg-slate-50 rounded-xl font-bold border border-slate-100"
                           placeholder="مثال: الاستقبال والوصول..."
                           value={itineraryDayForm.title}
                           onChange={e => setItineraryDayForm({...itineraryDayForm, title: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs font-black text-slate-400">الأنشطة (كل نشاط في سطر)</label>
                         <textarea 
                           className="w-full p-4 bg-slate-50 rounded-xl font-bold border border-slate-100"
                           rows={3}
                           placeholder="زيارة الجامع الأموي&#10;جولة في سوق الحميدية"
                           value={itineraryDayForm.activities}
                           onChange={e => setItineraryDayForm({...itineraryDayForm, activities: e.target.value})}
                         />
                       </div>
                    </div>
                    <button 
                      type="button"
                      onClick={addItineraryDay}
                      className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                    >
                      <Plus size={20} />
                      تثبيت هذا اليوم في الجدول
                    </button>
                 </div>

                 <div className="space-y-4 mt-8">
                    {tripForm.itinerary.map((day, idx) => (
                      <div key={idx} className="flex gap-6 items-start bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                         <div className="w-12 h-12 bg-brand-secondary text-white rounded-xl flex items-center justify-center font-black shrink-0 shadow-lg">
                           {day.day}
                         </div>
                         <div className="flex-1 space-y-2">
                            <h4 className="text-lg font-black text-brand-primary">{day.title}</h4>
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((act, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-slate-100">
                                  {act}
                                </span>
                              ))}
                            </div>
                         </div>
                         <button 
                           type="button" 
                           onClick={() => removeItineraryDay(idx)}
                           className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="col-span-full pt-8">
                <button 
                  type="submit"
                  className="w-full py-6 bg-brand-primary text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4"
                >
                  {editingTrip ? 'تحديث الرحلة' : 'حفظ ونشر الرحلة'}
                  <ArrowRight size={24} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen selection:bg-brand-secondary/30 selection:text-brand-primary bg-slate-50">
        <Navbar />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trip/:id" element={<TourDetailsPage />} />
            <Route path="/login-admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>

        <Footer />
      </div>
    </Router>
  );
}
