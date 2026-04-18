import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
  AnimatePresence, 
  useMotionValue, 
  useSpring 
} from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  ArrowUpRight,
  Send,
  Menu,
  X,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet marker icon fix
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Translations ---

type Language = 'pt' | 'en' | 'es';

const translations = {
  pt: {
    nav: { brand: 'A Marca', custom: 'Personalizadas', resistance: 'Resistência', products: 'Produtos', gallery: 'Galeria', quote: 'Orçamento' },
    hero: { tagLine: 'cobriu, protegeu, resolveu!', title1: 'Soluções em lona', title2: 'com agilidade e resistência!', sub: 'Loja completa com soluções ultra-rápidas em lonas de alta resistência.', explore: 'EXPLORAR PRODUTOS', whatsapp: 'NOSSO WHATSAPP' },
    specs: { s1Title: 'BLINDAGEM EXPRESS', s1Desc: 'Lonas de alta densidade com tratamento anti-chamas e proteção UV. Projetadas para suportar o rigor das estradas.', s2Title: 'AGILIDADE MÁXIMA', s2Desc: 'Sistema de entrega e instalação ultra-rápido. Sua carga ou evento protegidos em tempo recorde.', s3Title: 'LOGÍSTICA INTEGRADA', s3Desc: 'Soluções pensadas para o transporte e armazenagem. Leveza e resistência em um só produto.' },
    about: { tag: 'CONFIANÇA E VELOCIDADE', title: 'AGILIDADE', titleAccent: 'EXTREMA.', desc: 'Há mais de uma década redefinindo padrões para ter sempre a entrega mais rápida do mercado de lonas. Loja com grande variedade de produtos de lona para diferentes usos e custos-benefícios que melhor se enquadra para sua necessidade.', p1: 'PROTEÇÃO', p1Sub: 'Resistência UV máxima', p2: 'EXPRESS', p2Sub: 'Entrega e montagem recorde', p3: 'QUALIDADE', p3Sub: 'Materiais premium', p4: 'VERSÁTIL', p4Sub: 'Aplicações infinitas', label: 'Express Grade A' },
    products: { tag: 'Catálogo de Produtos 2024', title: 'SOLUÇÕES', titleAccent: 'PERSONALIZADAS.', datasheet: 'GALERIA', p1Title: 'LONAS', p1Desc: 'Lona totalmente blackout, com excelente isolamento térmico e toque macio. Produzida por vulcanização em rádio frequência, dispensando costuras com linhas convencionais, o que evita rasgos e infiltrações ao longo do uso.\n\nDisponível em mais de uma dúzia de cores lisas, com opção de personalização em impressão digital, ideal para fortalecer a presença da sua marca em qualquer ambiente.', p2Title: 'GALPÃO INDUSTRIAL', p2Desc: 'Solução definitiva para logística e estocagem de grãos. Vãos livres monumentais que permitem a manobra de maquinário pesado com total segurança.', p3Title: 'SANFONADA ELITE', p3Desc: 'Mobilidade sem sacrifício de robustez. Sistema de articulação pantográfica em alumínio estrutural. Montagem tática em menos de 120 segundos.' },
    custom: { tag: 'Soluções Sob Medida', title: 'LONAS', titleAccent: 'SOB MEDIDA.', desc: 'Sua necessidade é única, nossa agilidade também. Desenvolvemos lonas sob medida com branding exclusivo, dimensões específicas e acabamentos premium para atender as demandas mais urgentes.', l1: 'Impressão Digital Ultra-Rápida', l2: 'Cores Vibrantes e Duradouras', l3: 'Acabamento Reforçado em Solda Eletrônica', l4: 'Logística Expressa para todo Brasil', cta: 'SOLICITAR ORÇAMENTO' },
    contact: { tag: 'ENTRE EM CONTATO', title: 'VAMOS', titleAccent: 'LÁ!', desc: 'Nossa central de atendimento está disponível para consultoria técnica imediata. Projetos customizados com entrega expressa.', lName: 'nome', lWhatsApp: 'WhatsApp', lCategory: 'Categoria', lMessage: 'Mensagem', lAddress: 'ENDEREÇO', pName: 'Nome ou Empresa', pWhatsApp: 'Telefone / WhatsApp', pMessage: 'Digite sua mensagem, em casos de dúvidas... entre em contato diretamente pelo nosso WhatsApp!', op1: 'Lonas em Geral', op2: 'Lona de Caminhão', op3: 'Capa piscina', op4: 'Tenda Sanfonada/Piramidal', op5: 'Outros', cta: 'ENVIAR' },
    gallery: { tag: 'NOSSOS PROJETOS', title: 'GALERIA DE', titleAccent: 'FOTOS.', counter: 'Item' },
    footer: { desc: 'Líder nacional em soluções rápidas de cobertura. Tecnologia e agilidade para proteção de ativos em tempo recorde.', nav: 'Navegação', social: 'Social', rights: 'TODOS OS DIREITOS RESERVADOS.', privacy: 'PRIVACIDADE', terms: 'TERMOS', email: 'SEU MELHOR E-MAIL', p4: 'Lonas Leves' }
  },
  en: {
    nav: { brand: 'Brand', custom: 'Custom', resistance: 'Durability', products: 'Products', gallery: 'Gallery', quote: 'Quote' },
    hero: { tagLine: 'covered, protected, resolved!', title1: 'Tarp Solutions', title2: 'with speed and strength!', sub: 'Complete store with ultra-fast solutions in high-resistance tarps.', explore: 'EXPLORE PRODUCTS', whatsapp: 'OUR WHATSAPP' },
    specs: { s1Title: 'EXPRESS SHIELDING', s1Desc: 'High-density tarps with fire-retardant and UV protection. Designed to withstand road conditions.', s2Title: 'MAXIMUM SPEED', s2Desc: 'Ultra-fast delivery and installation system. Your cargo or event protected in record time.', s3Title: 'INTEGRATED LOGISTICS', s3Desc: 'Solutions designed for transport and storage. Lightness and strength in one product.' },
    about: { tag: 'TRUST AND SPEED', title: 'EXTREME', titleAccent: 'AGILITY.', desc: 'For over a decade redefining standards to always have the fastest delivery in the tarp market. Wide variety of products for different uses.', p1: 'PROTECTION', p1Sub: 'Maximum UV resistance', p2: 'EXPRESS', p2Sub: 'Record delivery & assembly', p3: 'QUALITY', p3Sub: 'Premium materials', p4: 'VERSATILE', p4Sub: 'Infinite applications', label: 'Express Grade A' },
    products: { tag: 'Product Catalog 2024', title: 'CUSTOM', titleAccent: 'SOLUTIONS.', datasheet: 'GALLERY', p1Title: 'TARPS', p1Desc: 'Full blackout tarp, with excellent thermal insulation and soft touch. Produced by radio frequency vulcanization, avoiding conventional seams.', p2Title: 'INDUSTRIAL WAREHOUSE', p2Desc: 'Ultimate solution for logistics and grain storage. Large spans for heavy machinery maneuvering.', p3Title: 'ELITE FOLDABLE', p3Desc: 'Mobility without sacrificing robustness. Aluminum structural system. Tactical assembly in 120s.' },
    custom: { tag: 'Custom Solutions', title: 'TAILOR-MADE', titleAccent: 'TARPS.', desc: 'Your need is unique, our speed too. We develop custom tarps with exclusive branding to meet urgent demands.', l1: 'Ultra-Fast Digital Printing', l2: 'Vibrant and Durable Colors', l3: 'Electronic Welding Reinforcement', l4: 'Express Logistics nationwide', cta: 'REQUEST QUOTE' },
    contact: { tag: 'GET IN TOUCH', title: 'LET\'S', titleAccent: 'GO!', desc: 'Our technical support is available for immediate consultation. Custom projects with express delivery.', lName: 'name', lWhatsApp: 'WhatsApp', lCategory: 'Category', lMessage: 'Message', lAddress: 'ADDRESS', pName: 'Name or Company', pWhatsApp: 'Phone / WhatsApp', pMessage: 'Enter your message, in case of questions... contact us directly via WhatsApp!', op1: 'General Tarps', op2: 'Truck Tarp', op3: 'Pool Cover', op4: 'Foldable/Pyramidal Tent', op5: 'Others', cta: 'SEND' },
    gallery: { tag: 'OUR PROJECTS', title: 'PHOTO', titleAccent: 'GALLERY.', counter: 'Item' },
    footer: { desc: 'National leader in fast coverage solutions. Technology and speed for asset protection in record time.', nav: 'Navigation', social: 'Social', rights: 'ALL RIGHTS RESERVED.', privacy: 'PRIVACY POLICY', terms: 'TERMS OF SERVICE', email: 'YOUR BEST EMAIL', p4: 'Lightweight Tarps' }
  },
  es: {
    nav: { brand: 'La Marca', custom: 'Personalizadas', resistance: 'Resistencia', products: 'Productos', gallery: 'Galería', quote: 'Presupuesto' },
    hero: { tagLine: '¡cubrió, protegió, resolvió!', title1: 'Soluciones en lona', title2: '¡con agilidad y resistencia!', sub: 'Tienda completa con soluciones ultrarrápidas en lonas de alta resistencia.', explore: 'EXPLORAR PRODUCTOS', whatsapp: 'NUESTRO WHATSAPP' },
    specs: { s1Title: 'BLINDAJE EXPRESS', s1Desc: 'Lonas de alta densidad con tratamiento ignífugo y protección UV. Diseñadas para el rigor de las carreteras.', s2Title: 'MÁXIMA AGILIDAD', s2Desc: 'Sistema de entrega e instalación ultrarrápido. Su carga o evento protegidos en tiempo récord.', s3Title: 'LOGÍSTICA INTEGRADA', s3Desc: 'Soluciones pensadas para el transporte y almacenaje. Ligereza y resistencia en un solo producto.' },
    about: { tag: 'CONFIANZA Y VELOCIDÁ', title: 'AGILIDAD', titleAccent: 'EXTREMA.', desc: 'Hace más de una década redefiniendo estándares para la entrega más rápida del mercado. Gran variedad de productos para diferentes usos.', p1: 'PROTECCIÓN', p1Sub: 'Máxima resistencia UV', p2: 'EXPRESS', p2Sub: 'Entrega y montaje récord', p3: 'CALIDAD', p3Sub: 'Materiales premium', p4: 'VERSÁTIL', p4Sub: 'Aplikaciones infinitas', label: 'Express Grade A' },
    products: { tag: 'Catálogo de Productos 2024', title: 'SOLUCIONES', titleAccent: 'PERSONALIZADAS.', datasheet: 'GALERÍA', p1Title: 'LONAS', p1Desc: 'Lona totalmente blackout, con excelente aislamiento térmico y tacto suave. Producida por vulcanización, sin costuras convencionales.', p2Title: 'GALPÓN INDUSTRIAL', p2Desc: 'Solución definitiva para logística y almacenamiento de granos. Vãos libres para maniobra de maquinaria pesada.', p3Title: 'PLEGABLE ELITE', p3Desc: 'Movilidad sin sacrificar robustez. Sistema de aluminio estructural. Montaje táctico en 120 segundos.' },
    custom: { tag: 'Soluciones a Medida', title: 'LONAS', titleAccent: 'A MEDIDA.', desc: 'Su necesidad es única, nuestra agilidad también. Desarrollamos lonas a medida con branding exclusivo.', l1: 'Impresión Digital Ultrarrápida', l2: 'Colores Vibrantes y Duraderos', l3: 'Refuerzo de Soldadura Electrónica', l4: 'Logística Expresa a todo el país', cta: 'SOLICITAR PRESUPUESTO' },
    contact: { tag: 'CONTACTO', title: '¡VAMOS', titleAccent: 'ALLÁ!', desc: 'Nuestro centro de atención está disponible para consultoría técnica inmediata.', lName: 'nombre', lWhatsApp: 'WhatsApp', lCategory: 'Categoría', lMessage: 'Mensaje', lAddress: 'DIRECCIÓN', pName: 'Nombre o Empresa', pWhatsApp: 'Teléfono / WhatsApp', pMessage: 'Escriba su mensaje, en caso de dudas... ¡contáctenos directamente por nuestro WhatsApp!', op1: 'Lonas en General', op2: 'Lona de Camión', op3: 'Cubierta para Piscina', op4: 'Carpa Plegable/Piramidal', op5: 'Otros', cta: 'ENVIAR' },
    gallery: { tag: 'NUESTROS PROYECTOS', title: 'GALERÍA DE', titleAccent: 'FOTOS.', counter: 'Item' },
    footer: { desc: 'Líder nacional en soluciones rápidas de cobertura. Tecnología y agilidade para protección en tiempo récord.', nav: 'Navegación', social: 'Social', rights: 'TODOS LOS DERECHOS RESERVADOS.', privacy: 'PRIVACIDAD', terms: 'TÉRMINOS', email: 'TU MEJOR E-MAIL', p4: 'Lonas Ligeras' }
  }
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => any;
}>({ lang: 'pt', setLang: () => {}, t: (k) => k });

const useTranslation = () => useContext(LanguageContext);

// --- Helper Components ---

const VelocityFlash = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-0 left-0 w-1/2 h-full opacity-0 animate-velocity-flash bg-gradient-to-r from-transparent via-current to-transparent"></div>
  </div>
);

const TiltContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const Navbar = ({ isDarkMode, toggleTheme, setPage }: { isDarkMode: boolean, toggleTheme: () => void, setPage: (p: string) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.brand'), href: '#about' },
    { name: t('nav.custom'), href: '#custom' },
    { name: t('nav.resistance'), href: '#specs' },
    { name: t('nav.products'), href: '#products' },
    { name: t('nav.gallery'), href: '#gallery', action: () => setPage('gallery') },
  ];

  const languages = [
    { code: 'pt', flag: 'https://flagcdn.com/w40/br.png', alt: 'Português' },
    { code: 'en', flag: 'https://flagcdn.com/w40/us.png', alt: 'English' },
    { code: 'es', flag: 'https://flagcdn.com/w40/es.png', alt: 'Español' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-surface/95 backdrop-blur-xl py-3 border-b border-border-variant' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => {
            e.preventDefault();
            setPage('home');
            window.location.hash = '#home';
          }}
          className="flex items-center gap-3 group"
        >
          <img 
            src="https://drive.google.com/uc?export=view&id=1j3HnLNl20kKnyXWZ-57awTh-WWrnphos" 
            alt="Lonas Express Logo" 
            className={`h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-500 ${isDarkMode ? 'brightness-0 invert' : ''}`}
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => {
                if (link.action) {
                  link.action();
                } else {
                  window.location.hash = link.href;
                }
              }}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:text-brand-red transition-colors relative group ${isDarkMode ? 'text-white/70' : 'text-on-surface/70'}`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full"></span>
            </button>
          ))}
          
          <div className="flex items-center gap-3 border-l border-border-variant pl-8">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as Language)}
                className={`w-6 h-4 overflow-hidden rounded-[2px] transition-all duration-300 transform ${lang === l.code ? 'scale-125 ring-2 ring-brand-red ring-offset-2 ring-offset-surface' : 'opacity-40 hover:opacity-100 hover:scale-110'}`}
              >
                <img src={l.flag} alt={l.alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-on-surface'}`}
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a 
              href="#contact" 
              className="bg-brand-blue hover:bg-blue-800 px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 active:translate-y-0 text-white"
            >
              {t('nav.quote')}
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <div className="flex items-center gap-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code as Language);
                }}
                className={`w-5 h-3 overflow-hidden rounded-[1px] ${lang === l.code ? 'ring-1 ring-brand-red scale-110' : 'opacity-30'}`}
              >
                <img src={l.flag} alt={l.alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-on-surface'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className={`${isDarkMode ? 'text-white' : 'text-on-surface'} p-2`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-40 p-10 flex flex-col justify-center space-y-8 md:hidden ${isDarkMode ? 'bg-surface' : 'bg-surface'}`}
          >
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (link.action) {
                    link.action();
                  } else {
                    window.location.hash = link.href;
                  }
                }}
                className={`text-4xl text-left font-display uppercase tracking-widest hover:text-brand-red transition-colors ${isDarkMode ? 'text-white' : 'text-on-surface'}`}
              >
                {link.name}
              </button>
            ))}
            <a 
              href="#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-brand-blue text-center py-5 rounded-sm font-display text-xl uppercase tracking-widest text-white"
            >
              {t('nav.quote')}
            </a>
            <button onClick={() => setIsMobileMenuOpen(false)} className={`absolute top-10 right-10 ${isDarkMode ? 'text-on-surface/40' : 'text-on-surface/40'}`}>
              <X size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 400]);
  const yText = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const { t } = useTranslation();

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-surface">
      <VelocityFlash />
      <motion.div style={{ y: yBg, scale }} className="absolute inset-0 z-0">
        <img 
          src="https://media.istockphoto.com/id/2268542385/pt/foto/cargo-truck-transporting-goods-on-highway-in-brazil.jpg?s=2048x2048&w=is&k=20&c=Cd-Ur6nBmeOHbtm52F9BXSrs4Q0Dz42Q5LTKiCVU_W4=" 
          alt="Caminhão com Lona Lonas Express" 
          className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/40 to-surface"></div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
  style={{ y: yText, opacity }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center pt-32"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-brand-red"></div>
            <span className="text-brand-red font-mono text-xs tracking-[0.5em] uppercase">
              {t('hero.tagLine')}
            </span>
            <div className="h-[1px] w-12 bg-brand-red"></div>
          </div>
          
          <h1 className="text-4xl md:text-8xl leading-tight mb-12 font-display italic uppercase">
            {t('hero.title1')} <br /> <span className="text-brand-blue">{t('hero.title2')}</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-on-surface/60 text-lg md:text-2xl mb-14 font-light leading-relaxed tracking-wide">
            {t('hero.sub')}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="#products" 
              className="group bg-brand-red text-white px-12 py-4 rounded-sm font-bold text-sm tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-blue transition-all duration-500 w-64"
            >
              {t('hero.explore')} <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <a 
              href="https://wa.me/554333375008" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-12 py-4 rounded-sm font-bold text-sm tracking-[0.2em] border border-border-variant hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 flex items-center justify-center w-64"
            >
              <span className="group-hover:opacity-0 transition-opacity duration-300">{t('hero.whatsapp')}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-6 h-6 fill-current text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none grid-lines opacity-20"></div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, index }: any) => {
  return (
    <TiltContainer className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        className="glass-panel p-10 rounded-sm h-full group hover:border-brand-red/30 transition-all duration-500 flex flex-col"
      >
        <div className="w-16 h-16 bg-surface-variant rounded-sm flex items-center justify-center mb-8 group-hover:bg-brand-red group-hover:text-white transition-all duration-500">
          <Icon size={32} />
        </div>
        <h3 className="text-3xl mb-4 tracking-wider">{title}</h3>
        <p className="text-on-surface/50 leading-relaxed font-light text-sm tracking-wide flex-grow">
          {description}
        </p>
        <div className="mt-8 pt-8 border-t border-border-variant opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-brand-red font-mono text-[10px] tracking-[0.3em] uppercase">Lona tecnológica v3.0</span>
        </div>
      </motion.div>
    </TiltContainer>
  );
};

const About = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-32 relative overflow-hidden halftone-bg">
      <VelocityFlash />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[2px] bg-brand-red"></div>
              <span className="text-brand-red font-mono text-xs tracking-[0.4em] uppercase">{t('about.tag')}</span>
            </div>
            
            <h2 className="text-4xl md:text-8xl mb-10 leading-none italic">
              {t('about.title')} <br /> <span className="text-brand-blue">{t('about.titleAccent')}</span>
            </h2>
            
            <p className="text-on-surface/50 text-xl mb-12 leading-relaxed font-light">
              {t('about.desc')}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-10">
              {[
                { icon: Shield, title: t('about.p1'), desc: t('about.p1Sub') },
                { icon: Zap, title: t('about.p2'), desc: t('about.p2Sub') },
                { icon: CheckCircle2, title: t('about.p3'), desc: t('about.p3Sub') },
                { icon: Layers, title: t('about.p4'), desc: t('about.p4Sub') },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-brand-red mt-1">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="font-display text-xl tracking-widest mb-1 italic">{item.title}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-on-surface/30">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <TiltContainer>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square"
            >
              <div className="absolute -inset-10 bg-brand-red/5 blur-[120px] rounded-full"></div>
              <div className="relative h-full rounded-sm overflow-hidden border border-border-variant group">
                <img 
                  src="https://images.unsplash.com/photo-1586864387917-f539b1684bb0?q=80&w=800" 
                  alt="Lonas de Vinil Express" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-10 right-10 flex flex-col items-end">
                  <div className="text-7xl font-display leading-none italic">01</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-red">{t('about.label')}</div>
                </div>
              </div>
            </motion.div>
          </TiltContainer>
        </div>
      </div>
    </section>
  );
};

const Products = ({ onGalleryClick }: { onGalleryClick?: () => void }) => {
  const [activeTab, setActiveTab] = useState('piramidal');
  const [currentImg, setCurrentImg] = useState(0);
  const { t, lang } = useTranslation();

  const productData: any = {
    piramidal: {
      id: "01",
      title: t('products.p1Title'),
      description: t('products.p1Desc'),
      specs: lang === 'pt' ? ["Vãos de 3m a 20m", "Lona TD1000 Blackout", "Carga de Vento: 80km/h"] : (lang === 'en' ? ["3m to 20m spans", "TD1000 Blackout Tarp", "Wind Load: 80km/h"] : ["Vanos de 3m a 20m", "Lona TD1000 Blackout", "Carga de Viento: 80km/h"]),
      images: [
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800',
        'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800'
      ]
    },
    galpao: {
      id: "02",
      title: t('products.p2Title'),
      description: t('products.p2Desc'),
      specs: lang === 'pt' ? ["Pé-direito até 10m", "Lona Térmica", "Fundação Simplificada"] : (lang === 'en' ? ["Ceiling up to 10m", "Thermal Tarp", "Simplified Foundation"] : ["Altura hasta 10m", "Lona Térmica", "Fundación Simplificada"]),
      images: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
        'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800'
      ]
    },
    sanfonada: {
      id: "03",
      title: t('products.p3Title'),
      description: t('products.p3Desc'),
      specs: lang === 'pt' ? ["Alumínio Anodizado", "Tecido Impermeável", "Case de Proteção"] : (lang === 'en' ? ["Anodized Aluminum", "Waterproof Fabric", "Protection Case"] : ["Aluminio Anodizado", "Tejido Impermeable", "Estuche de Protección"]),
      images: [
        'https://images.unsplash.com/photo-1505373633572-2d1f5060e642?q=80&w=800',
        'https://images.unsplash.com/photo-1565615833231-e8c91a38a012?q=80&w=800'
      ]
    }
  };

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % productData[activeTab].images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + productData[activeTab].images.length) % productData[activeTab].images.length);

  useEffect(() => {
    setCurrentImg(0);
  }, [activeTab]);

  return (
    <section id="products" className="py-32 bg-brand-blue-deep relative overflow-hidden">
      <VelocityFlash />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[2px] bg-brand-red"></div>
            </div>
            <h2 className="text-5xl md:text-9xl leading-none italic">{t('products.title')} <br /> <span className="text-brand-blue">{t('products.titleAccent')}</span></h2>
          </div>
          <div className="flex gap-4 mb-4">
            {Object.keys(productData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-14 h-14 rounded-full border flex items-center justify-center font-display text-xl transition-all duration-500 italic ${activeTab === key ? 'bg-brand-red border-brand-red text-white' : 'border-border-variant hover:border-on-surface/30'}`}
              >
                {productData[key].id}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Left: Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-8 h-[2px] bg-brand-red mb-6"></div>
                <h3 className="text-4xl mb-8 tracking-wider italic">{productData[activeTab].title}</h3>
                <p className="text-on-surface/50 text-lg mb-12 leading-relaxed font-light">
                  {productData[activeTab].description}
                </p>
                
                <div className="space-y-6 mb-12">
                  {productData[activeTab].specs.map((spec: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-2 h-2 bg-brand-red group-hover:scale-150 transition-transform"></div>
                      <span className="text-xs font-mono uppercase tracking-widest text-on-surface/80">{spec}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onGalleryClick}
                  className="group bg-white text-black px-10 py-5 rounded-sm font-bold text-xs tracking-[0.3em] hover:bg-brand-red hover:text-white transition-all flex items-center gap-4"
                >
                  {t('products.datasheet')} <ArrowUpRight size={18} />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Visual */}
          <div className="lg:col-span-7">
            <div className="relative h-[600px] rounded-sm overflow-hidden border border-border-variant">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activeTab}-${currentImg}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  src={productData[activeTab].images[currentImg]}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-r from-surface/40 to-transparent"></div>
              
              <div className="absolute bottom-10 right-10 flex gap-4">
                <button onClick={prevImg} className="w-16 h-16 bg-surface/80 backdrop-blur-md border border-border-variant flex items-center justify-center hover:bg-brand-red hover:text-white transition-all">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImg} className="w-16 h-16 bg-surface/80 backdrop-blur-md border border-border-variant flex items-center justify-center hover:bg-brand-red hover:text-white transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CustomTents = () => {
  const { t } = useTranslation();
  return (
    <section id="custom" className="py-32 bg-surface relative overflow-hidden">
      <VelocityFlash />
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <TiltContainer>
              <div className="relative aspect-video rounded-sm overflow-hidden border border-border-variant group">
                <img 
                  src="https://images.unsplash.com/photo-1565615833231-e8c91a38a012?q=80&w=1200" 
                  alt="Lona Personalizada Evento" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-red/20 mix-blend-multiply"></div>
                <div className="absolute bottom-6 left-6 bg-brand-red px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white">
                  Projeto Especial #LX-99
                </div>
              </div>
            </TiltContainer>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[2px] bg-brand-red"></div>
              <span className="text-brand-red font-mono text-xs tracking-[0.4em] uppercase">{t('custom.tag')}</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl mb-10 leading-none italic">
              {t('custom.title')} <br /> <span className="text-brand-blue">{t('custom.titleAccent')}</span>
            </h2>
            
            <p className="text-on-surface/50 text-xl mb-12 leading-relaxed font-light">
              {t('custom.desc')}
            </p>
            
            <ul className="space-y-6 mb-12">
              {[
                t('custom.l1'),
                t('custom.l2'),
                t('custom.l3'),
                t('custom.l4')
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>
                  <span className="text-sm tracking-widest uppercase text-on-surface/70">{item}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href="#contact" 
              className="inline-block border-b-2 border-brand-red pb-2 text-brand-red font-bold text-sm tracking-[0.3em] hover:text-on-surface hover:border-on-surface transition-all"
            >
              {t('custom.cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  const position: [number, number] = [-23.2925, -51.1966];
  
  return (
    <section className="h-[500px] w-full relative border-y border-border-variant bg-brand-blue-deep">
      <div className="absolute inset-0 grayscale invert brightness-75 contrast-125 opacity-40 hover:opacity-80 hover:grayscale-0 hover:invert-0 hover:brightness-100 transition-all duration-1000 z-0">
        <MapContainer 
          center={position} 
          zoom={16} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="p-2">
                <h4 className="text-brand-blue-deep font-bold mb-1">Lonas Express</h4>
                <p className="text-xs text-brand-blue-deep">Av. Tiradentes, 4000 - Londrina, PR</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      {/* Overlays for styling */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brand-blue-deep to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-brand-blue-deep to-transparent z-10 pointer-events-none"></div>
      
      {/* Label Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center">
        <div className="bg-brand-red p-4 rounded-full shadow-2xl animate-pulse">
           <MapPin size={32} className="text-white" />
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { t } = useTranslation();
  return (
    <section id="contact" className="py-32 bg-surface relative overflow-hidden">
      <VelocityFlash />
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[2px] bg-brand-red"></div>
              <span className="text-brand-red font-mono text-xs tracking-[0.4em] uppercase">{t('contact.tag')}</span>
            </div>
            <h2 className="text-5xl md:text-9xl mb-10 leading-none italic text-brand-blue">{t('contact.title')} <br /> <span className="text-brand-red">{t('contact.titleAccent')}</span></h2>
            <p className="text-on-surface/40 text-xl mb-16 leading-relaxed font-light max-w-md">
              {t('contact.desc')}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-12">
              {[
                { icon: Phone, label: "WhatsApp", value: "(43) 3337-5008" },
                { icon: Mail, label: "E-mail", value: "londrina.lonasexpress@gmail.com" },
                { 
                  icon: MapPin, 
                  label: t('contact.lAddress'), 
                  value: "Av. Tiradentes, 4000 - Jardim Rosicler, Londrina - PR, 86072-000",
                  link: "https://www.google.com/maps/search/?api=1&query=Av.+Tiradentes,+4000+-+Jardim+Rosicler,+Londrina+-+PR,+86072-000"
                },
                { 
                  icon: Instagram, 
                  label: "Instagram", 
                  value: "@lonasexpress.com.br",
                  link: "https://www.instagram.com/lonasexpress.com.br/"
                },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group cursor-pointer"
                  onClick={() => item.link && window.open(item.link, '_blank')}
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-on-surface/20 mb-3 group-hover:text-brand-red transition-all pl-[40px] group-hover:translate-x-2">{item.label}</div>
                  <div className="flex items-center gap-4 text-lg font-semibold tracking-wider group-hover:translate-x-2 transition-transform">
                    <item.icon size={24} className="text-brand-red shrink-0" />
                    <span className="leading-tight">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <TiltContainer className="lg:pt-64">
            <div className="glass-panel p-12 rounded-sm relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Layers size={80} />
              </div>
              
              <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-on-surface/30">{t('contact.lName')}</label>
                    <input type="text" className="w-full bg-on-surface/5 border-b border-border-variant px-0 py-4 focus:outline-none focus:border-brand-red transition-colors font-light text-sm" placeholder={t('contact.pName')} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-on-surface/30">{t('contact.lWhatsApp')}</label>
                    <input type="text" className="w-full bg-on-surface/5 border-b border-border-variant px-0 py-4 focus:outline-none focus:border-brand-red transition-colors font-light text-sm" placeholder={t('contact.pWhatsApp')} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-on-surface/30">{t('contact.lCategory')}</label>
                  <select className="w-full bg-transparent border-b border-border-variant px-0 py-4 focus:outline-none focus:border-brand-red transition-colors font-light text-sm appearance-none cursor-pointer">
                    <option className="bg-surface">{t('contact.op1')}</option>
                    <option className="bg-surface">{t('contact.op2')}</option>
                    <option className="bg-surface">{t('contact.op3')}</option>
                    <option className="bg-surface">{t('contact.op4')}</option>
                    <option className="bg-surface">{t('contact.op5')}</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-on-surface/30">{t('contact.lMessage')}</label>
                  <textarea rows={4} className="w-full bg-on-surface/5 border-b border-border-variant px-0 py-4 focus:outline-none focus:border-brand-red transition-colors font-light text-sm resize-none" placeholder={t('contact.pMessage')}></textarea>
                </div>
                
                <button className="w-full bg-brand-red text-white py-6 rounded-sm font-bold text-xs tracking-[0.4em] hover:bg-brand-blue transition-all shadow-2xl shadow-brand-red/20 flex items-center justify-center gap-4 group relative overflow-hidden">
                  <span className="group-hover:translate-y-[-200%] transition-transform duration-500 block">{t('contact.cta')}</span>
                  <div className="absolute inset-0 flex items-center justify-center translate-y-[200%] group-hover:translate-y-0 transition-transform duration-500">
                    <Send size={24} />
                  </div>
                </button>
              </form>
            </div>
          </TiltContainer>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const isDarkMode = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');

  return (
    <footer className="bg-surface border-t border-border-variant py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="https://drive.google.com/uc?export=view&id=1j3HnLNl20kKnyXWZ-57awTh-WWrnphos" 
                alt="Lonas Express Logo" 
                className={`h-10 w-auto object-contain ${isDarkMode ? 'brightness-0 invert' : ''}`}
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-on-surface/30 text-sm leading-relaxed font-light tracking-wide">
              {t('footer.desc')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-brand-red mb-8">{t('footer.nav')}</div>
              <ul className="space-y-4 text-sm font-light text-on-surface/50">
                <li><a href="#about" className="hover:text-on-surface transition-colors">{t('nav.brand')}</a></li>
                <li><a href="#custom" className="hover:text-on-surface transition-colors">{t('nav.custom')}</a></li>
                <li><a href="#specs" className="hover:text-on-surface transition-colors">{t('nav.resistance')}</a></li>
                <li><a href="#products" className="hover:text-on-surface transition-colors">{t('nav.products')}</a></li>
                <li><a href="#contact" className="hover:text-on-surface transition-colors">{t('nav.quote')}</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-brand-red mb-8">{t('footer.social')}</div>
              <ul className="space-y-4 text-sm font-light text-on-surface/50">
                <li><a href="#" className="hover:text-on-surface transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-on-surface transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-on-surface transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-border-variant flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-on-surface/20">
            © {new Date().getFullYear()} LONAS EXPRESS - WWW.LONASEXPRESS.COM.BR - {t('footer.rights')}
          </div>
          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-[0.3em] text-on-surface/20">
            <a href="#" className="hover:text-on-surface transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-on-surface transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};


const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1586528116311-ad863c17d1ff?q=80&w=1200",
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200",
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200",
    "https://images.unsplash.com/photo-1494412574643-ff11b865c1c3?q=80&w=1200",
    "https://images.unsplash.com/photo-1580674271209-40b48e15320d?q=80&w=1200"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="gallery" className="pt-40 pb-32 min-h-screen bg-surface relative overflow-hidden">
      <VelocityFlash />
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <div className="w-8 h-[2px] bg-brand-red"></div>
          <span className="text-brand-red font-mono text-xs tracking-[0.4em] uppercase">{t('gallery.tag')}</span>
          <div className="w-8 h-[2px] bg-brand-red"></div>
        </div>

        <h2 className="text-6xl md:text-8xl mb-20 leading-none italic text-center">
          {t('gallery.title')} <span className="text-brand-blue">{t('gallery.titleAccent')}</span>
        </h2>

        {/* Main Slider */}
        <div className="relative group max-w-5xl mx-auto aspect-video rounded-sm overflow-hidden border border-border-variant">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>

          {/* Controls */}
          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/80 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-brand-red transition-all group-hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/80 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-brand-red transition-all group-hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.3em] bg-surface/80 backdrop-blur-md px-4 py-2 rounded-sm border border-border-variant uppercase">
             {t('gallery.counter')} {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-12 flex justify-center gap-4 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-24 aspect-video rounded-sm overflow-hidden border-2 transition-all p-0.5 ${currentIndex === i ? 'border-brand-red scale-110' : 'border-border-variant opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
            >
              <img src={img} className="w-full h-full object-cover rounded-[1px]" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none grid-lines opacity-10"></div>
    </section>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      if (value) value = value[k];
    }
    return value || key;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#gallery') {
        setCurrentPage('gallery');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="min-h-screen selection:bg-brand-red selection:text-white overflow-x-hidden transition-colors duration-300 bg-surface">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} setPage={setCurrentPage} />
        
        {currentPage === 'home' ? (
          <>
            <Hero />
            
            <section id="specs" className="py-32 bg-brand-blue-deep relative z-10 border-y border-border-variant overflow-hidden">
              <VelocityFlash />
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-10">
                  <FeatureCard 
                    index={0}
                    icon={Shield}
                    title={t('specs.s1Title')}
                    description={t('specs.s1Desc')}
                  />
                  <FeatureCard 
                    index={1}
                    icon={Zap}
                    title={t('specs.s2Title')}
                    description={t('specs.s2Desc')}
                  />
                  <FeatureCard 
                    index={2}
                    icon={Truck}
                    title={t('specs.s3Title')}
                    description={t('specs.s3Desc')}
                  />
                </div>
              </div>
            </section>

            <About />
            <CustomTents />
            <Products onGalleryClick={() => setCurrentPage('gallery')} />
            <Contact />
            <MapSection />
          </>
        ) : (
          <Gallery />
        )}
        
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}
