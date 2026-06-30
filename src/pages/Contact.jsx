import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const { data: settings } = trpc.commerce.settings.get.useQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const subject = e.target.elements.subject.value;
    const message = e.target.elements.message.value;

    const whatsappMessage = `*New Inquiry from Contact Form*

*Full Name:* ${name}
*Email:* ${email}
*Subject:* ${subject}

*Message:*
${message}`;

    const supportPhoneRaw = settings?.whatsappNumber || settings?.supportPhone?.split('/')?.[0] || "+91 9834557990";
    const cleanPhone = supportPhoneRaw.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    setTimeout(() => {
      setLoading(false);
      toast.success("Redirecting to WhatsApp...");
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      e.target.reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-black uppercase tracking-tighter text-foreground mb-4">Get in Touch</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground max-w-2xl mx-auto">
            Have questions about our premium collections or an existing order? We're here to help. Reach out to Amar and the team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-background p-8 border border-border">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Contact Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-foreground flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs text-foreground mb-1">Phone & WhatsApp</p>
                    {settings?.supportPhone?.split('/').map((phone, i) => (
                      <p key={i} className="text-muted-foreground text-sm font-bold">{phone.trim()}</p>
                    )) || (
                      <>
                        <p className="text-muted-foreground text-sm font-bold">+91 9834557990</p>
                        <p className="text-muted-foreground text-sm font-bold">+91 8149987987</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-foreground flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs text-foreground mb-1">Email</p>
                    <p className="text-muted-foreground text-sm font-bold">{settings?.supportEmail || "contact@amarjeans.com"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-foreground flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs text-foreground mb-1">Headquarters</p>
                    <p className="text-muted-foreground text-sm font-bold whitespace-pre-line">
                      {settings?.storeAddress || "opp new fire brigade Chinchpada nalambi road amb (w)\nchnchpad rood new fire brigade opp titwala road ambernath w, Ambarnath 421501"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-foreground flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs text-foreground mb-1">Business Hours</p>
                    <p className="text-muted-foreground text-sm font-bold">Mon - Sat: 10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-foreground p-8 text-background">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Message from the Owner</h3>
              <p className="text-background/80 font-bold text-sm leading-relaxed mb-6 italic">"We strive to provide the highest quality fashion with uncompromising standards. Your satisfaction is our priority."</p>
              <p className="font-black uppercase tracking-widest text-sm text-primary">— AMAR WAGHMARE</p>
              <p className="text-xs font-bold text-background/60 mt-1 uppercase tracking-widest">Founder & CEO, AMAR JEANS</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="bg-background p-8 md:p-10 border border-border">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-8">Send us a Message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-foreground">Full Name</label>
                  <input required id="name" type="text" className="w-full px-4 py-4 bg-muted/20 border-2 border-border focus:border-foreground transition-colors outline-none text-foreground font-bold" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-foreground">Email Address</label>
                  <input required id="email" type="email" className="w-full px-4 py-4 bg-muted/20 border-2 border-border focus:border-foreground transition-colors outline-none text-foreground font-bold" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-foreground">Subject</label>
                <input required id="subject" type="text" className="w-full px-4 py-4 bg-muted/20 border-2 border-border focus:border-foreground transition-colors outline-none text-foreground font-bold" placeholder="How can we help?" />
              </div>

              <div className="space-y-2 mb-8">
                <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-foreground">Message</label>
                <textarea required id="message" rows="6" className="w-full px-4 py-4 bg-muted/20 border-2 border-border focus:border-foreground transition-colors outline-none text-foreground font-bold resize-none" placeholder="Your message here..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-foreground text-background font-black uppercase tracking-widest py-5 hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <>Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
