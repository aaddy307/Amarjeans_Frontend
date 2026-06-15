import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, Award, ShieldCheck, Heart } from "lucide-react";
import { useRef } from "react";

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#faf9f6] pt-24 pb-24 overflow-hidden selection:bg-[#d46a4e] selection:text-white">
      
      {/* Hero Section */}
      <section className="relative px-4 lg:px-8 max-w-7xl mx-auto mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto pt-16"
        >
          <span className="text-[#d46a4e] font-bold tracking-widest uppercase mb-6 block">Our Story</span>
          <h1 className="text-6xl md:text-8xl font-black text-[#2d2a26] mb-8 leading-[1.1] tracking-tighter">
            Weaving <span className="font-serif italic font-light text-[#d46a4e]">Passion</span> into Every Thread.
          </h1>
          <p className="text-xl text-[#5a554c] leading-relaxed">
            Founded with a vision to redefine everyday comfort, AMAR JEANS is more than a clothing brand. It's a commitment to quality, authenticity, and the human touch in an automated world.
          </p>
        </motion.div>
      </section>

      {/* The Founder Section */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            style={{ y: y1 }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#d46a4e]/20 mix-blend-multiply z-10" />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000" 
              alt="Founder" 
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#2d2a26] mb-6">Meet Amar Waghmare</h2>
            <h3 className="text-2xl font-serif italic text-[#d46a4e] mb-8">The Visionary Behind the Stitch</h3>
            <div className="space-y-6 text-[#5a554c] text-lg leading-relaxed">
              <p>
                Amar Waghmare started AMAR JEANS with a simple but profound belief: clothes should empower the wearer. Dissatisfied with the fleeting trends of fast fashion, he set out to create pieces that endure—both in style and durability.
              </p>
              <p>
                Every garment that carries the AMAR JEANS label has been scrutinized for perfection. From sourcing the finest organic cotton to partnering with ethical production facilities, Amar's hands-on approach ensures that the brand remains true to its roots.
              </p>
              <div className="bg-[#e5e0d8] p-8 rounded-4xl mt-8">
                <p className="font-serif italic text-2xl text-[#2d2a26] mb-4">"When you put on our jeans, I want you to feel the craftsmanship. I want you to feel unstoppable."</p>
                <p className="font-bold tracking-widest uppercase text-sm text-[#d46a4e]">— Amar Waghmare</p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-[#e5e0d8] space-y-4">
                <h4 className="text-xl font-black text-[#2d2a26]">Visit Us</h4>
                <p className="text-[#5a554c]">
                  <strong>Location:</strong><br/>
                  opp new fire brigade Chinchpada nalambi road amb (w)<br/>
                  chnchpad rood new fire brigade opp titwala road ambernath w, Ambarnath 421501
                </p>
                <p className="text-[#5a554c]">
                  <strong>Phone:</strong> +91 9834557990 / +91 8149987987
                </p>
                <p className="text-[#5a554c]">
                  <strong>Instagram:</strong> <a href="https://www.instagram.com/amarjeans990/" target="_blank" rel="noreferrer" className="text-[#d46a4e] hover:underline">@amarjeans990</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-[#2d2a26] mb-4">Our Core Values</h2>
          <p className="text-[#5a554c] text-xl max-w-2xl mx-auto">The principles that guide every cut, stitch, and wash.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Leaf, title: "Organic Materials", desc: "We source only the finest sustainable cotton and eco-friendly dyes to minimize our footprint." },
            { icon: Award, title: "Master Craftsmanship", desc: "Our tailors are artisans. Every seam is reinforced, and every fit is tested rigorously." },
            { icon: Heart, title: "Human Centric", desc: "Fair wages, safe working conditions, and a focus on community upliftment are non-negotiable." }
          ].map((val, i) => (
            <motion.div 
              key={val.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white p-10 rounded-4xl border border-[#e5e0d8] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
            >
              <div className="w-16 h-16 bg-[#d46a4e]/10 rounded-2xl flex items-center justify-center text-[#d46a4e] mb-6 group-hover:scale-110 transition-transform">
                <val.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#2d2a26] mb-4">{val.title}</h3>
              <p className="text-[#5a554c] leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
