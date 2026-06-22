import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TarpsProps {
  lang: string;
  t: (key: string) => any;
}

export const Tarps = ({ lang, t }: TarpsProps) => {
  const [currentImg, setCurrentImg] = useState(0);

  // High-end Unsplash images designed perfectly for the premium visual theme.
  // The user can replace any of the IDs with their Google Drive IDs in the direct format:
  // "https://lh3.googleusercontent.com/d/[ID]" if they wish to override them.
  const tarpsList = [
    {
      id: "01",
      title: {
        pt: "Lona para Toldos - FOSCO",
        en: "Matte Awning Tarp",
        es: "Lona para Toldos - MATE"
      },
      text: {
        pt: "As lonas foscas para toldos oferecem um acabamento moderno e sofisticado para fachadas comerciais ou residenciais, livre de reflexos excessivos. Excelente durabilidade e alta resistência, com proteção robusta contra os raios UV e desbotamento precoce.",
        en: "Matte canvas for awnings offers a modern and sophisticated finish for commercial or residential facades, free of excess reflections. Outstanding durability and high strength with robust shield against UV rays and fading.",
        es: "Las lonas mate para toldos ofrecen un acabado moderno y sofisticado para fachadas comerciales y residenciales, libre de reflejos excesivos. Excelente durabilidad y alta resistencia, con una protección robusta contra rayos UV."
      },
      img: "https://lh3.googleusercontent.com/d/1mYfWsoptUqtvEFiVf1OPVKpxYZmH9gnG"
    },
    {
      id: "02",
      title: {
        pt: "Lona para Toldos - BRILHO",
        en: "Glossy Awning Tarp",
        es: "Lona para Toldos - BRILLO"
      },
      text: {
        pt: "Com acabamento em alto brilho que facilita o escoamento de água e sujeiras, esta lona destaca intensamente as cores sob a luz solar. Ideal para coberturas vivas, chamativas e de facílima conservação.",
        en: "Featuring an ultra-glossy finish that facilitates instant water and dirt shedding, this cover intensely highlights vibrant colors under direct sunlight. Ideal for eye-catching facades and extremely simple maintenance.",
        es: "Con un acabado de alto brillo que facilita el flujo de agua y suciedad, esta lona resalta intensamente los colores bajo la luz solar. Ideal para coberturas vivas, llamativas y de fácil mantenimiento."
      },
      img: "https://lh3.googleusercontent.com/d/1BObxiz65Iyib2G-AFS3vktxzadnVw7dk"
    },
    {
      id: "03",
      title: {
        pt: "Lonas para Toldos - Translúcida LW",
        en: "Translucent LW Awning Tarp",
        es: "Lona para Toldos - Translúcida LW"
      },
      text: {
        pt: "Desenvolvida com foco em leveza estrutural (Lightweight) e uma translucidez inteligente. Ela permite a passagem suave de luz natural filtrando os raios calorosos, garantindo bem-estar térmico excepcional.",
        en: "Specially developed focusing on lightweight structural load and smart moderate translucency. It allows smooth passage of natural filtered daylight, reducing heat build-up while keeping comfort high.",
        es: "Desarrollada con un enfoque en la ligereza estructural (LW) y una translucidez inteligente. Permite el paso suave de la luz natural filtrando el calor excesivo, garantizando un confort térmico ideal."
      },
      img: "https://lh3.googleusercontent.com/d/1A1l8PxKnVLpux_nVS6pUqngHBso7o-2T"
    },
    {
      id: "04",
      title: {
        pt: "Lona Translúcida",
        en: "Translucent Architectural Tarp",
        es: "Lona Translúcida"
      },
      text: {
        pt: "Projetada para criar espaços modernos com transmissão homogênea de claridade. Perfeita para eventos que utilizam retroiluminação interna (backlight) à noite, valorizando a arquitetura das coberturas.",
        en: "Engineered to create modern filled spaces with homogeneous light transmission. Ideal for events that employ backlighting from inside at night, adding immense aesthetic value to the overhead structure.",
        es: "Diseñada para crear espacios modernos con transmisión homogénea de luz. Perfecta para eventos que utilizan retroiluminación interna (backlight) por la noche, valorizando la arquitectura del toldo."
      },
      img: "https://lh3.googleusercontent.com/d/1QG5avNunjLR6SATF-eQCpR6WtMkhbDp4"
    },
    {
      id: "05",
      title: {
        pt: "Lonas para Caminhão",
        en: "Heavy-Duty Truck Tarps",
        es: "Lonas para Camión"
      },
      text: {
        pt: "Lona vulcanizada de alto desempenho com reforço de poliéster para amarração e contenção extrema. Resistente a poeiras, sol abrasivo, fortes chuvas de estrada e tração constante, mantendo a integridade da carga.",
        en: "High-performance vulcanized cover with heavy-duty polyester core for extreme tie-down security. Unrivaled resilience against dust, abrasive sun, heavy highway weather, and continuous tension.",
        es: "Lona vulcanizada de alto rendimiento con refuerzo de poliéster para trincado y protección extrema. Resistente al polvo, sol fuerte, lluvias en carretera y tensión constante, cuidando la carga de punta a punta."
      },
      img: "https://lh3.googleusercontent.com/d/1sxRviewAupnTydk9Tg38lRJzcHFowyq2"
    },
    {
      id: "06",
      title: {
        pt: "Capas para Piscinas",
        en: "Protective Swimming Pool Covers",
        es: "Capas para Piscinas"
      },
      text: {
        pt: "Excelente barreira com proteção química e mecânica. Evita acúmulo de sujeiras, esvaziamento por evaporação e protege pets ou crianças contra quedas acidentais com fixadores perimetrais reforçados.",
        en: "Premium chemical and physical shield. Prevents accumulation of debris, halts evaporation loss, and reinforces security for children or pets against accidental entry utilizing robust peripheral fasteners.",
        es: "Excelente barrera de protección química y física. Evita la acumulación de suciedad, detiene la evaporación del agua y protege a niños o mascotas con fijaciones reforzadas en todo el perímetro."
      },
      img: "https://lh3.googleusercontent.com/d/1xc4dLsOUHk1VwUM7YP5oQn6nUZd49Hg4"
    }
  ];

  const currentItem = tarpsList[currentImg];

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % tarpsList.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + tarpsList.length) % tarpsList.length);

  // Determine current language key
  const langKey = (lang === 'en' || lang === 'es') ? lang : 'pt';

  return (
    <section id="tarps" className="py-32 bg-surface relative overflow-hidden border-b border-border-variant">
      {/* Background static design elements matching template's architectural style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-brand-blue rounded-full filter blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-brand-red rounded-full filter blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[2px] bg-brand-red"></div>
              <span className="text-brand-red font-mono text-xs tracking-[0.4em] uppercase">
                {lang === 'pt' ? 'Catálogo Exclusivo' : (lang === 'en' ? 'Exclusive Catalog' : 'Catálogo Exclusivo')}
              </span>
            </div>
            <h2 className="text-5xl md:text-9xl leading-none italic font-normal tracking-tight text-on-surface">
              {lang === 'pt' ? 'TIPOS DE LONAS' : (lang === 'en' ? 'TYPES OF TARPS' : 'TIPOS DE LONAS')}
            </h2>
          </div>
        </div>

        {/* content grid (flipped: Photo on left, text on right) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          
          {/* Left: Visual (Image on Left) */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex justify-center">
            <div className="relative w-full aspect-[3/4] max-w-[500px] lg:max-w-[550px] rounded-sm overflow-hidden border border-border-variant bg-brand-blue-deep/20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={currentItem.img}
                  alt={currentItem.title[langKey]}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Overlay with radial glow */}
              <div className="absolute inset-0 bg-gradient-to-l from-surface/30 to-transparent"></div>
              
              {/* Pagination/Counter Indicator */}
              <div className="absolute top-8 left-8 bg-surface/80 backdrop-blur-md px-4 py-2 border border-border-variant rounded-sm font-mono text-xs text-on-surface">
                {currentItem.id} / 0{tarpsList.length}
              </div>

              {/* Slider Controls */}
              <div className="absolute bottom-10 left-10 flex gap-4 z-10">
                <button onClick={prevImg} className="w-16 h-16 bg-surface/80 backdrop-blur-md border border-border-variant flex items-center justify-center hover:bg-brand-red hover:text-white hover:border-brand-red transition-all cursor-pointer">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImg} className="w-16 h-16 bg-surface/80 backdrop-blur-md border border-border-variant flex items-center justify-center hover:bg-brand-red hover:text-white hover:border-brand-red transition-all cursor-pointer">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Info (Text on Right) */}
          <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
            <div className="space-y-8">
              <div className="w-8 h-[2px] bg-brand-red"></div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h3 className="text-4xl italic text-brand-red font-bold tracking-tight">
                    {currentItem.title[langKey]}
                  </h3>
                  <p className="text-on-surface/70 text-lg leading-relaxed font-light">
                    {currentItem.text[langKey]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
