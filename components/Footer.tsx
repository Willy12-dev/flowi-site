import { Heart, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-3">
              <img src="/images/LOGOOOO.png" alt="Flowi" className="w-36" />
            </div>
            <p className="text-muted text-sm max-w-xs">
              Premium web design, app development, and business automation for ambitious brands.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="/about" className="text-sm text-muted hover:text-foreground transition-colors">About</a>
              <a href="/portfolio" className="text-sm text-muted hover:text-foreground transition-colors">Portfolio</a>
              <a href="/services/ai-chatbots" className="text-sm text-muted hover:text-foreground transition-colors">AI Chatbots</a>
              <a href="/services/ai-video" className="text-sm text-muted hover:text-foreground transition-colors">AI Video</a>
              <a href="/#pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
              <a href="/#contact" className="text-sm text-muted hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Get In Touch</h4>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/254714257688" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" /> +254 714 257688
              </a>
              <a href="mailto:flowigroup@gmail.com" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" /> flowigroup@gmail.com
              </a>
              <a href="mailto:willyautomations@gmail.com" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" /> willyautomations@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex items-center justify-center gap-1 text-muted text-sm">
          <span>&copy; {new Date().getFullYear()} Flowi. Built with</span>
          <Heart className="w-3.5 h-3.5 text-blue fill-blue" />
        </div>
      </div>
    </footer>
  );
}
