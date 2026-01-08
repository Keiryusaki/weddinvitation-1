import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Calendar, Clock, Music, Play, Pause, ChevronDown, Instagram, Send, X, ChevronLeft, ChevronRight, Star, Cloud, Map } from 'lucide-react';

// --- ANIMATION HOOK ---
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// --- SUB-COMPONENTS ---
const FadeInSection = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- NEW: COUNTDOWN COMPONENT ---
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
          jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          menit: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          detik: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl min-w-[70px] md:min-w-[90px]">
      <span className="font-serif text-2xl md:text-4xl font-bold text-[#C5A059]">{value}</span>
      <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6F4FA] mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center gap-3 md:gap-6 mt-8">
      <TimeBox value={timeLeft.hari} label="Hari" />
      <TimeBox value={timeLeft.jam} label="Jam" />
      <TimeBox value={timeLeft.menit} label="Menit" />
      <TimeBox value={timeLeft.detik} label="Detik" />
    </div>
  );
};

const FloralDivider = () => (
    <div className="flex justify-center items-center py-8 opacity-60">
        <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 10C130 10 140 0 160 0C180 0 190 10 200 10" stroke="#C5A059" strokeWidth="1"/>
            <path d="M100 10C70 10 60 0 40 0C20 0 10 10 0 10" stroke="#C5A059" strokeWidth="1"/>
            <circle cx="100" cy="10" r="3" fill="#C5A059"/>
        </svg>
    </div>
);

// --- ADVANCED ANIMATED FLORAL DECORATIONS ---
const HangingVine = ({ className, delay = "0s" }) => (
  <svg viewBox="0 0 100 300" className={`absolute pointer-events-none z-0 w-32 md:w-48 opacity-90 origin-top ${className}`} style={{ animationDelay: delay }}>
    <defs>
       <linearGradient id="vineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
         <stop offset="0%" style={{stopColor:"#1A365D", stopOpacity:0.8}} />
         <stop offset="100%" style={{stopColor:"#90CDF4", stopOpacity:0.6}} />
       </linearGradient>
    </defs>
    <g className="animate-swing">
       <path d="M50 0 Q60 50 40 100 T60 200 T40 300" fill="none" stroke="#C5A059" strokeWidth="1.5" />
       <circle cx="40" cy="100" r="8" fill="url(#vineGrad)" className="animate-pulse-slow" />
       <circle cx="60" cy="200" r="6" fill="#FFFFFF" />
       <circle cx="40" cy="280" r="5" fill="#C5A059" />
       <path d="M50 50 Q70 40 60 60" fill="none" stroke="#1A365D" strokeWidth="1" />
       <path d="M40 150 Q20 160 30 140" fill="none" stroke="#1A365D" strokeWidth="1" />
    </g>
  </svg>
);

const CornerBush = ({ className, style }) => (
  <svg 
    viewBox="0 0 300 300" 
    className={`absolute pointer-events-none z-0 w-64 md:w-96 opacity-80 ${className}`} 
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="flowerCenter" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
         <stop offset="0%" style={{stopColor:"#fff", stopOpacity:1}} />
         <stop offset="100%" style={{stopColor:"#90CDF4", stopOpacity:1}} />
      </radialGradient>
    </defs>
    <g className="animate-sway-slow origin-bottom-left">
       <path d="M0 300 Q50 150 150 100" stroke="#C5A059" strokeWidth="1" fill="none" opacity="0.5" />
       <path d="M0 300 Q100 250 200 280" stroke="#1A365D" strokeWidth="2" fill="none" opacity="0.3" />
       <circle cx="150" cy="100" r="10" fill="#C5A059" opacity="0.4" />
    </g>
    <g className="animate-sway-medium origin-bottom-left">
       <g transform="translate(80, 200)">
          <circle cx="0" cy="0" r="25" fill="#90CDF4" opacity="0.8" />
          <circle cx="0" cy="0" r="10" fill="white" />
          <circle cx="0" cy="0" r="5" fill="#C5A059" />
       </g>
       <g transform="translate(180, 250)">
          <circle cx="0" cy="0" r="20" fill="white" opacity="0.9" />
          <circle cx="0" cy="0" r="8" fill="#90CDF4" />
       </g>
       <g transform="translate(50, 260)">
          <circle cx="0" cy="0" r="15" fill="#C5A059" opacity="0.6" />
       </g>
    </g>
    <g className="animate-float">
       <circle cx="100" cy="150" r="3" fill="#C5A059" opacity="0.8" />
       <circle cx="160" cy="180" r="2" fill="white" opacity="0.8" />
       <circle cx="200" cy="220" r="4" fill="#90CDF4" opacity="0.8" />
    </g>
  </svg>
);

// --- MAIN COMPONENT ---
export default function App() {
  // ---------------------------------------------------------
  // 📸 PUSAT KONTROL FOTO
  // ---------------------------------------------------------
  const CUSTOM_IMAGES = {
    groom: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bride: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    coupleHero: "https://cdn.discordapp.com/attachments/1458361573621108837/1458361711592603708/IMG_6944.jpg?ex=695f5caf&is=695e0b2f&hm=9ee36b4824be4242df4a93710d24bdff8435e90770a3d110787a937d76e286ec&",
    cover: "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    story: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    eventBg: "https://cdn.discordapp.com/attachments/1458361573621108837/1458361775438303317/image.png?ex=695f5cbe&is=695e0b3e&hm=f7575424a24e166e34ed8fa575ff25411005bbbb96efeafbf7e6b9a03d699187&",
    footer: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1950&q=80"
  };
  
  // 🔗 LINK GOOGLE MAPS (YANG DIPAKE DI TOMBOL APP)
  const MAP_LINK = "https://maps.app.goo.gl/9nU9HGJEAQKpaAt17";

  const TARGET_DATE = new Date(2026, 9, 20, 8, 0, 0).getTime(); 

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false); // State buat Modal Map
  const audioRef = useRef(null);
  const galleryScrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play()
        .catch(e => {
          console.log("Auto-play blocked:", e);
          setIsPlaying(false);
        });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Play error:", e));
    }
  };

  const scrollGallery = (direction) => {
    if (galleryScrollRef.current) {
        const { current } = galleryScrollRef;
        const scrollAmount = direction === 'left' ? -300 : 300;
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderPetals = () => {
    return Array.from({ length: 20 }).map((_, i) => (
      <div 
        key={i} 
        className="petal absolute bg-gradient-to-br from-white to-[#90CDF4] rounded-tl-xl rounded-br-xl opacity-60"
        style={{
          width: Math.random() * 10 + 8 + 'px',
          height: Math.random() * 10 + 8 + 'px',
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: Math.random() * 10 + 10 + 's' 
        }}
      />
    ));
  };

  const renderFireflies = () => {
     return Array.from({ length: 15 }).map((_, i) => (
       <div
         key={`ff-${i}`}
         className="absolute rounded-full bg-[#C5A059] animate-firefly"
         style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 2 + 's',
            opacity: Math.random() * 0.5 + 0.3
         }}
       />
     ));
  };

  const galleryImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520854221250-85d3b61c8853?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="font-sans text-[#1A365D] bg-[#E6F4FA] min-h-screen relative overflow-hidden">
      <audio 
        ref={audioRef} 
        src="https://ia800905.us.archive.org/19/items/CanonInD_261/CanoninD.mp3" 
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.error("Audio error:", e)}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Great+Vibes&family=Lato:wght@300;400&display=swap');
        .font-serif { font-family: 'Cinzel', serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-body { font-family: 'Lato', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
          50% { transform: translateY(50vh) rotate(180deg) translateX(20px); opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg) translateX(-20px); opacity: 0; }
        }
        .petal { position: fixed; top: -20px; animation: fall linear infinite; z-index: 40; pointer-events: none; }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }
        
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        
        .scale-in { animation: scaleIn 1.5s ease-out forwards; }
        @keyframes scaleIn { from { transform: scale(1.1); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @keyframes sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(3deg); } }
        .animate-sway-slow { animation: sway 6s ease-in-out infinite; }
        .animate-sway-medium { animation: sway 4s ease-in-out infinite reverse; }

        @keyframes swing { 0% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } 100% { transform: rotate(-2deg); } }
        .animate-swing { animation: swing 5s ease-in-out infinite; }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }

        @keyframes firefly { 0% { transform: translate(0, 0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translate(40px, -60px); opacity: 0; } }
        .animate-firefly { animation: firefly 4s ease-in-out infinite alternate; }
        
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* --- MODAL MAP PREVIEW --- */}
      {isMapOpen && (
        <div 
            className="fixed inset-0 z-[80] bg-[#1A365D]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setIsMapOpen(false)}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
            >
                {/* Header Modal */}
                <div className="bg-[#E6F4FA] p-4 flex justify-between items-center border-b border-[#C5A059]/20">
                    <h3 className="font-serif text-[#1A365D] font-bold">Lokasi Acara</h3>
                    <button 
                        onClick={() => setIsMapOpen(false)}
                        className="text-[#1A365D] hover:text-[#C5A059] transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Map Preview (Iframe) */}
                <div className="h-64 md:h-80 w-full relative bg-gray-200">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0" 
                        marginWidth="0" 
                        // UPDATE: Link Embed Baru (Zoom Fixed)
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0039011328813!2d106.4758281!3d-6.521187500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e427451b85d1fbb%3A0x37db98e9be040b07!2sFFHG%2BG8G%2C%20Pangradin%2C%20Kec.%20Jasinga%2C%20Kabupaten%20Bogor%2C%20Jawa%20Barat!5e0!3m2!1sen!2sid!4v1767775572521!5m2!1sen!2sid"
                        title="Map Preview"
                        className="absolute inset-0"
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Action Button */}
                <div className="p-6 text-center">
                    <p className="font-body text-sm text-[#1A365D]/70 mb-4">
                        Lihat rute lengkap menuju lokasi acara melalui Google Maps.
                    </p>
                    <a 
                        href={MAP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A365D] text-white font-serif text-sm tracking-widest rounded-full hover:bg-[#C5A059] transition-all shadow-lg w-full justify-center"
                    >
                        <MapPin size={18} />
                        BUKA DI GOOGLE MAPS
                    </a>
                </div>
            </div>
        </div>
      )}

      {/* --- LIGHTBOX --- */}
      {lightboxImg && (
        <div 
            className="fixed inset-0 z-[70] bg-[#1A365D]/90 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-500"
            onClick={() => setLightboxImg(null)}
        >
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
                <img src={lightboxImg} alt="Preview" className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl border-4 border-white/20" />
                <button className="absolute top-4 right-4 text-white hover:text-[#C5A059] transition" onClick={() => setLightboxImg(null)}>
                    <X size={32} />
                </button>
            </div>
        </div>
      )}

      {/* --- COVER --- */}
      <div 
        className={`fixed inset-0 z-50 bg-[#E6F4FA] flex flex-col items-center justify-center transition-transform duration-[1500ms] cubic-bezier(0.7, 0, 0.3, 1) ${
          isOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
         <HangingVine className="top-0 left-0" />
         <HangingVine className="top-0 right-0 -scale-x-100" delay="1s" />
         <HangingVine className="top-0 left-1/4 scale-75 opacity-60" delay="2s" />
         <HangingVine className="top-0 right-1/4 -scale-x-100 scale-75 opacity-60" delay="3s" />
         <CornerBush className="bottom-0 left-0 -translate-x-10 translate-y-10" />
         <CornerBush className="bottom-0 right-0 translate-x-10 translate-y-10 -scale-x-100" />
         {renderFireflies()}

         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1A365D 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="relative z-10 w-full max-w-md h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-64 h-80 rounded-t-full rounded-b-[200px] overflow-hidden mb-8 border-[6px] border-double border-[#C5A059] shadow-2xl scale-in relative group">
                 <div className="absolute inset-0 bg-[#1A365D]/20 mix-blend-multiply z-10 group-hover:bg-transparent transition duration-700"></div>
                 {/* USE CONFIG PHOTO */}
                 <img src={CUSTOM_IMAGES.cover} className="w-full h-full object-cover" alt="Cover" />
            </div>

            <div className="space-y-4 relative z-20">
                <p className="font-serif tracking-[0.3em] text-xs text-[#1A365D] uppercase animate-pulse-slow">The Wedding Of</p>
                {/* --- UPDATE NAMA: Etin & Aji --- */}
                <h1 className="font-script text-6xl md:text-7xl text-[#1A365D] drop-shadow-sm leading-tight">
                    Etin <span className="text-[#C5A059] text-5xl animate-bounce inline-block">&</span> Aji
                </h1>
                
                <div className="py-6">
                    <button 
                    onClick={handleOpen}
                    className="group relative px-10 py-4 bg-[#1A365D] text-white font-serif text-sm tracking-widest rounded-full overflow-hidden shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-500 scale-100 hover:scale-105"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            BUKA UNDANGAN <Heart size={14} className="fill-current animate-ping" />
                        </span>
                        <div className="absolute inset-0 bg-[#C5A059] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                    </button>
                </div>

                <div className="text-[#1A365D]/70 text-sm font-body">
                    <p>Kepada Yth.</p>
                    <p className="font-bold mt-1 text-[#1A365D]">Bapak/Ibu/Saudara/i</p>
                </div>
            </div>
         </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className={`transition-opacity duration-[1500ms] delay-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        
        {isOpen && (
            <>
                <HangingVine className="fixed top-0 left-0 z-0 pointer-events-none opacity-50 mix-blend-multiply scale-75" />
                <HangingVine className="fixed top-0 right-0 z-0 pointer-events-none opacity-50 mix-blend-multiply -scale-x-100 scale-75" delay="2s" />
                <CornerBush className="fixed bottom-0 left-0 -translate-x-16 translate-y-16 z-0 pointer-events-none opacity-40 mix-blend-multiply scale-75" />
                <CornerBush className="fixed bottom-0 right-0 translate-x-16 translate-y-16 z-0 pointer-events-none opacity-40 mix-blend-multiply -scale-x-100 scale-75" />
                <div className="fixed inset-0 pointer-events-none z-0">{renderFireflies()}</div>
            </>
        )}
        {isOpen && renderPetals()}

        {/* HERO */}
        <section className="min-h-screen relative flex items-center justify-center text-center px-6 py-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
           <div className="max-w-2xl w-full relative z-20">
             <FadeInSection>
                <div className="mb-4">
                    <Star size={16} className="mx-auto text-[#C5A059] mb-4 animate-spin-slow" />
                    <p className="font-serif text-[#1A365D] tracking-[0.2em] text-xs uppercase">Save The Date</p>
                </div>
                
                <div className="relative inline-block my-8">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-[#C5A059]/30 rounded-[50%] animate-spin-slow pointer-events-none"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-dashed border-[#1A365D]/10 rounded-[50%] animate-spin-slow pointer-events-none" style={{animationDirection: 'reverse'}}></div>
                   
                   <div className="w-64 h-80 rounded-[100px] overflow-hidden border-4 border-white shadow-2xl mx-auto relative z-10">
                        {/* USE CONFIG PHOTO */}
                        <img src={CUSTOM_IMAGES.coupleHero} className="w-full h-full object-cover hover:scale-110 transition duration-1000" />
                   </div>
                   
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#E6F4FA] px-8 py-4 rounded-full shadow-lg border border-[#C5A059]/20 z-20 min-w-[200px] animate-float">
                      <div className="flex items-center justify-center gap-4 text-[#1A365D]">
                        <span className="font-serif text-3xl font-bold">20</span>
                        <div className="w-[1px] h-8 bg-[#C5A059]"></div>
                        <div className="text-left leading-none">
                            <span className="block font-serif text-sm uppercase tracking-widest">Okt</span>
                            <span className="block font-body text-xs mt-1">2026</span>
                        </div>
                      </div>
                   </div>
                </div>
                
                {/* --- UPDATE NAMA: Etin & Aji --- */}
                <h1 className="font-script text-6xl md:text-8xl text-[#1A365D] mt-12 mb-4 leading-none">
                    Etin <span className="text-[#C5A059]">&</span> Aji
                </h1>
                <p className="font-body text-[#1A365D]/80 italic font-light">#EtinAjiForever</p>
             </FadeInSection>
           </div>
           
           <div className="absolute bottom-8 animate-bounce text-[#C5A059]">
             <ChevronDown size={20} />
           </div>
        </section>

        {/* QUOTE */}
        <section className="py-24 px-8 text-center bg-white relative">
          <FloralDivider />
          <div className="max-w-2xl mx-auto relative">
             <span className="absolute -top-8 -left-4 text-8xl font-serif text-[#C5A059]/10">“</span>
             <FadeInSection>
                <p className="font-serif text-lg md:text-xl text-[#1A365D] leading-loose italic">
                  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <div className="h-[1px] w-12 bg-[#C5A059]"></div>
                    <p className="font-serif text-sm font-bold tracking-widest text-[#C5A059]">AR-RUM: 21</p>
                    <div className="h-[1px] w-12 bg-[#C5A059]"></div>
                </div>
             </FadeInSection>
          </div>
        </section>

        {/* MEMPELAI (PROFILE SWAPPED) */}
        <section className="py-24 px-6 relative bg-[#E6F4FA]">
          <div className="container mx-auto">
             <FadeInSection>
                {/* --- UPDATE TITLE: BRIDE & GROOM --- */}
                <h2 className="font-serif text-3xl md:text-4xl text-center text-[#1A365D] mb-16 tracking-widest">BRIDE & GROOM</h2>
             </FadeInSection>

             <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20">
                
                {/* 1. Bride (Etin) - NOW FIRST */}
                <FadeInSection delay={100}>
                  <div className="text-center group relative">
                     <div className="w-56 h-72 mx-auto mb-6 rounded-t-full border-b-8 border-[#C5A059]/20 overflow-hidden shadow-xl relative z-10 bg-white p-2">
                         <div className="w-full h-full rounded-t-full overflow-hidden">
                            {/* USE CONFIG PHOTO */}
                            <img src={CUSTOM_IMAGES.bride} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Bride"/>
                         </div>
                     </div>
                     <h3 className="font-serif text-2xl text-[#1A365D] font-bold mb-1">Etin</h3>
                     <p className="font-body text-xs text-[#C5A059] font-bold tracking-widest mb-3 uppercase">The Bride</p>
                     <p className="font-body text-sm text-[#1A365D]/70">Putra Bpk. Joko & Ibu Tina</p>
                     <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <a href="#" className="inline-flex items-center gap-1 text-xs text-[#1A365D] border-b border-[#C5A059] pb-1"><Instagram size={12} /> @etin</a>
                     </div>
                  </div>
                </FadeInSection>

                <FadeInSection delay={200}>
                   <span className="font-script text-6xl text-[#C5A059] opacity-50">&</span>
                </FadeInSection>

                {/* 2. Groom (Aji) - NOW SECOND */}
                <FadeInSection delay={300}>
                  <div className="text-center group relative">
                     <div className="w-56 h-72 mx-auto mb-6 rounded-t-full border-b-8 border-[#C5A059]/20 overflow-hidden shadow-xl relative z-10 bg-white p-2">
                         <div className="w-full h-full rounded-t-full overflow-hidden">
                             {/* USE CONFIG PHOTO */}
                             <img src={CUSTOM_IMAGES.groom} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Groom"/>
                         </div>
                     </div>
                     <h3 className="font-serif text-2xl text-[#1A365D] font-bold mb-1">Aji</h3>
                     <p className="font-body text-xs text-[#C5A059] font-bold tracking-widest mb-3 uppercase">The Groom</p>
                     <p className="font-body text-sm text-[#1A365D]/70">Putra Bpk. Hendra & Ibu Susi</p>
                     <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <a href="#" className="inline-flex items-center gap-1 text-xs text-[#1A365D] border-b border-[#C5A059] pb-1"><Instagram size={12} /> @aji</a>
                     </div>
                  </div>
                </FadeInSection>

             </div>
          </div>
        </section>

        {/* STORY */}
        <section className="py-24 px-8 bg-white relative overflow-hidden">
          <div className="container mx-auto max-w-5xl">
             <FadeInSection>
                <h2 className="font-serif text-3xl text-[#1A365D] tracking-[0.2em] mb-12 text-center">OUR STORY</h2>
                <div className="flex flex-col md:flex-row items-center gap-12">
                   <div className="w-full md:w-1/2">
                      <div className="relative p-2 border border-[#C5A059]/30 rounded-full">
                         <div className="aspect-square rounded-full overflow-hidden shadow-2xl">
                           {/* USE CONFIG PHOTO */}
                           <img 
                            src={CUSTOM_IMAGES.story} 
                            alt="Our Story" 
                            className="w-full h-full object-cover hover:scale-110 transition duration-1000"
                           />
                         </div>
                         <div className="absolute -bottom-4 right-10 bg-white p-3 rounded-full shadow-lg border border-[#C5A059]/20">
                            <Heart size={24} className="fill-[#C5A059] text-[#C5A059]" />
                         </div>
                      </div>
                   </div>
                   <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                      <FloralDivider />
                      <div className="space-y-6 text-[#1A365D]/80 font-body leading-relaxed text-sm md:text-base">
                        <p>
                            <span className="text-4xl float-left mr-2 font-script text-[#C5A059] leading-none">K</span>
                            ami dipertemukan sejak bangku SMK, satu kelas namun tak pernah benar-benar saling menyapa. 
                            Beberapa tahun setelah lulus, semesta kembali mempertemukan kami melalui sebuah DM Story 
                            sederhana yang dikirim Aji kepada Etin.
                        </p>
                        <p>
                            Meski perjalanan ini tidak mudah dan sempat terpisah, Qadarullah Allah menyatukan kembali 
                            langkah kami dengan niat yang lebih baik, hingga terlaksananya acara lamaran pada bulan November. 
                            Insya Allah, pada tanggal 25 Januari 2026, kami akan melangsungkan pernikahan.
                        </p>
                      </div>
                   </div>
                </div>
             </FadeInSection>
          </div>
        </section>

        {/* EVENT DETAILS */}
        <section 
            className="py-24 relative bg-cover bg-fixed bg-center"
            style={{ backgroundImage: `url(${CUSTOM_IMAGES.eventBg})` }}
        >
           <div className="absolute inset-0 bg-[#1A365D]/80 mix-blend-multiply"></div>
           <div className="container mx-auto px-6 relative z-10 max-w-4xl">
              <FadeInSection>
                <div className="text-center mb-16 text-[#E6F4FA]">
                   <h2 className="font-script text-6xl mb-4">Wedding Event</h2>
                   <p className="font-body text-sm opacity-80 tracking-wide">Kami menantikan kehadiran Anda di hari bahagia kami</p>
                   {/* --- INSERT COUNTDOWN HERE --- */}
                   <Countdown targetDate={TARGET_DATE} />
                </div>
              </FadeInSection>
              <div className="grid md:grid-cols-2 gap-6">
                 {/* Akad */}
                 <FadeInSection delay={100}>
                    <div className="glass-card p-8 rounded-xl text-center hover:bg-white/70 transition duration-500 shadow-2xl transform hover:-translate-y-2">
                       <h3 className="font-serif text-3xl text-[#1A365D] mb-6 pb-4 border-b border-[#1A365D]/10">Akad Nikah</h3>
                       <div className="space-y-6 text-[#1A365D]">
                          <div className="flex flex-col items-center gap-1">
                             <Calendar size={20} className="text-[#C5A059] mb-1" />
                             <span className="font-bold text-lg">Minggu, 20 Oktober 2026</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                             <Clock size={20} className="text-[#C5A059] mb-1" />
                             <span>08.00 WIB - Selesai</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                             <MapPin size={20} className="text-[#C5A059] mb-1" />
                             <span className="text-sm px-4">Masjid Raya Jakarta Selatan</span>
                          </div>
                       </div>
                    </div>
                 </FadeInSection>
                 {/* Resepsi */}
                 <FadeInSection delay={300}>
                    <div className="glass-card p-8 rounded-xl text-center hover:bg-white/70 transition duration-500 shadow-2xl transform hover:-translate-y-2">
                       <h3 className="font-serif text-3xl text-[#1A365D] mb-6 pb-4 border-b border-[#1A365D]/10">Resepsi</h3>
                       <div className="space-y-6 text-[#1A365D]">
                          <div className="flex flex-col items-center gap-1">
                             <Calendar size={20} className="text-[#C5A059] mb-1" />
                             <span className="font-bold text-lg">Minggu, 20 Oktober 2026</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                             <Clock size={20} className="text-[#C5A059] mb-1" />
                             <span>11.00 - 13.00 WIB</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                             <MapPin size={20} className="text-[#C5A059] mb-1" />
                             <span className="text-sm px-4">Balai Kartini Hall</span>
                          </div>
                       </div>
                    </div>
                 </FadeInSection>
              </div>
              <div className="mt-16 text-center">
                 {/* UPDATE BUTTON: TRIGGER MAP MODAL */}
                 <button 
                    onClick={() => setIsMapOpen(true)}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#E6F4FA] text-[#1A365D] font-serif uppercase tracking-widest text-xs rounded-sm hover:bg-[#C5A059] hover:text-white transition-all duration-300 shadow-xl border border-white/20"
                 >
                    <MapPin size={18} />
                    Lihat Lokasi (Google Maps)
                 </button>
              </div>
           </div>
        </section>

        {/* GALLERY */}
        <section className="py-24 bg-[#E6F4FA]">
           <div className="container mx-auto max-w-6xl px-4">
              <FadeInSection>
                <div className="text-center mb-12">
                   <h2 className="font-serif text-3xl text-[#1A365D] tracking-[0.2em]">OUR MOMENTS</h2>
                   <div className="w-20 h-[2px] bg-[#C5A059] mx-auto mt-4"></div>
                </div>
              </FadeInSection>
              <div className="relative group">
                 <button onClick={() => scrollGallery('left')} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[#C5A059] hover:text-white p-3 rounded-full shadow-lg text-[#1A365D] transition-all"><ChevronLeft size={20} /></button>
                 <button onClick={() => scrollGallery('right')} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[#C5A059] hover:text-white p-3 rounded-full shadow-lg text-[#1A365D] transition-all"><ChevronRight size={20} /></button>
                 <div ref={galleryScrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-8 px-4">
                    {galleryImages.map((src, idx) => (
                       <div key={idx} className="flex-shrink-0 w-[80vw] md:w-[320px] snap-center cursor-pointer" onClick={() => setLightboxImg(src)}>
                          <div className="h-[450px] w-full rounded-t-[100px] rounded-b-xl overflow-hidden shadow-lg border border-[#C5A059]/20 group/img relative">
                             <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover grayscale-[30%] group-hover/img:grayscale-0 transition duration-700 ease-in-out transform group-hover/img:scale-105" />
                             <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition duration-500"></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* RSVP */}
        <section className="py-24 px-4 md:px-6 bg-white relative">
           <FloralDivider />
           <div className="container mx-auto max-w-lg relative z-10">
              <FadeInSection>
                <div className="bg-[#E6F4FA] p-6 md:p-14 rounded-[2rem] shadow-2xl text-center border border-[#C5A059]/30">
                   <h2 className="font-script text-5xl text-[#1A365D] mb-2">Rsvp</h2>
                   <p className="font-body text-xs text-[#1A365D]/60 uppercase tracking-widest mb-8">Attendance & Wishes</p>
                   <form className="space-y-5 text-left" onSubmit={(e) => e.preventDefault()}>
                      <div><input type="text" className="w-full bg-white border border-[#1A365D]/20 rounded-lg p-4 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition font-body text-sm" placeholder="Nama Lengkap" /></div>
                      <div><textarea rows="4" className="w-full bg-white border border-[#1A365D]/20 rounded-lg p-4 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition font-body text-sm" placeholder="Ucapan & Doa..."></textarea></div>
                      <div><select className="w-full bg-white border border-[#1A365D]/20 rounded-lg p-4 focus:outline-none focus:border-[#C5A059] transition font-body text-sm text-[#1A365D]/80"><option>Saya akan hadir</option><option>Maaf, tidak bisa hadir</option><option>Masih ragu</option></select></div>
                      <button className="w-full bg-[#1A365D] text-white font-serif text-xs font-bold tracking-[0.2em] py-5 rounded-lg hover:bg-[#0f172a] transition shadow-lg mt-4">KIRIM KONFIRMASI</button>
                   </form>
                </div>
              </FadeInSection>
           </div>
        </section>

        {/* APOLOGY */}
        <section className="py-20 px-6 bg-[#E6F4FA]">
           <div className="container mx-auto max-w-3xl text-center">
              <FadeInSection>
                 <Heart className="mx-auto text-[#C5A059] mb-6" size={32} />
                 <p className="font-serif text-[#1A365D] leading-relaxed italic text-sm md:text-base">"Tanpa mengurangi rasa hormat, perkenankan kami menyampaikan undangan ini melalui media digital dikarenakan jarak dan waktu. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami."</p>
              </FadeInSection>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="relative h-screen flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 z-0">
               {/* USE CONFIG PHOTO */}
               <img src={CUSTOM_IMAGES.footer} alt="Footer bg" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#1A365D] via-[#1A365D]/60 to-transparent opacity-90"></div>
            </div>
            <div className="relative z-10 p-6">
                <FadeInSection>
                   <p className="font-serif text-[#E6F4FA] tracking-[0.2em] text-xs uppercase mb-4">Kami yang berbahagia</p>
                   <h2 className="font-script text-7xl md:text-9xl text-[#C5A059] mb-8 drop-shadow-2xl">Terima Kasih</h2>
                   <div className="w-24 h-[1px] bg-[#E6F4FA]/50 mx-auto mb-8"></div>
                   {/* --- UPDATE NAMA: Etin & Aji --- */}
                   <h3 className="font-serif text-3xl md:text-5xl text-white tracking-widest mb-2">Etin & Aji</h3>
                   <p className="text-white/60 text-sm font-body">Beserta Keluarga Besar</p>
                </FadeInSection>
            </div>
            <div className="absolute bottom-4 w-full text-center z-10">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Digital Invitation Template</p>
            </div>
        </footer>

        <div className="fixed bottom-6 right-6 z-40">
            <button 
              onClick={toggleMusic}
              className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border border-[#C5A059] ${isPlaying ? 'bg-[#E6F4FA] text-[#1A365D] animate-spin-slow' : 'bg-[#1A365D] text-[#E6F4FA]'}`}
            >
               {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
        </div>
        
      </div>
    </div>
  );
}