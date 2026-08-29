import React from 'react';
import { 
  Facebook, Twitter, Youtube, Instagram, Linkedin, 
  Mail, Phone, MapPin, Globe, Shield, FileText, HelpCircle, ArrowUp
} from 'lucide-react';
import { WPCategory, WPSettings } from '../types/wordpress';

interface FooterProps {
  categories: WPCategory[];
  settings: WPSettings;
  onNavigate: (route: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  settings,
  onNavigate,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-gray-400 border-t-2 border-[#c00000] mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#c00000] text-white flex items-center justify-center font-serif font-black text-lg rounded-xs">
                D
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-wider">
                DUNYA INTERNATIONAL
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm font-editorial-serif">
              An independent, next-generation global news portal delivering verified reporting, fearless investigative journalism, and deep editorial analysis across South Asia, North America, the UK, Europe, and the Middle East.
            </p>

            <div className="text-xs text-gray-400 space-y-1.5 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>News Bureaus: Islamabad • London • New York</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{settings.contactPhone}</span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-2">
              <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-7 h-7 bg-gray-800 hover:bg-[#002244] text-gray-300 hover:text-white rounded flex items-center justify-center transition">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-7 h-7 bg-gray-800 hover:bg-[#002244] text-gray-300 hover:text-white rounded flex items-center justify-center transition">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-7 h-7 bg-gray-800 hover:bg-[#002244] text-gray-300 hover:text-white rounded flex items-center justify-center transition">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-7 h-7 bg-gray-800 hover:bg-[#002244] text-gray-300 hover:text-white rounded flex items-center justify-center transition">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-7 h-7 bg-gray-800 hover:bg-[#002244] text-gray-300 hover:text-white rounded flex items-center justify-center transition">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: News Sections */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-widest border-b border-gray-800 pb-2 mb-3">
              News Sections
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {categories.slice(0, 7).map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => onNavigate(`category:${cat.slug}`)}
                    className="hover:text-white transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company & Ethics */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-widest border-b border-gray-800 pb-2 mb-3">
              Editorial & Team
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate('page:about-us')} className="hover:text-white transition">About Dunya International</button>
              </li>
              <li>
                <button onClick={() => onNavigate('page:editorial-policy')} className="hover:text-white transition">Editorial Policy & Ethics</button>
              </li>
              <li>
                <button onClick={() => onNavigate('page:our-team')} className="hover:text-white transition">Journalists & Editors</button>
              </li>
              <li>
                <button onClick={() => onNavigate('page:contact-us')} className="hover:text-white transition">Newsroom Tips & Contact</button>
              </li>
              <li>
                <button onClick={() => onNavigate('page:advertise')} className="hover:text-white transition">Commercial & Media Kit</button>
              </li>
              <li>
                <button onClick={() => onNavigate('post:three-generations-of-learning-the-gholam-mustafa-mujtaba-family-legacy')} className="hover:text-amber-300 text-amber-400 font-medium">Family Legacy Special</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & System */}
          <div>
            <h4 className="text-xs font-black uppercase text-white tracking-widest border-b border-gray-800 pb-2 mb-3">
              Governance & CMS
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate('page:privacy-policy')} className="hover:text-white transition">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('page:terms-conditions')} className="hover:text-white transition">Terms of Service</button>
              </li>
              <li>
                <button onClick={() => onNavigate('page:disclaimer')} className="hover:text-white transition">Editorial Disclaimer</button>
              </li>
              <li>
                <button onClick={() => onNavigate('page:support')} className="hover:text-white transition">Reader Support</button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={onOpenAdmin}
                  className="text-amber-400 font-bold hover:text-amber-300 transition flex items-center gap-1 text-xs"
                >
                  <span>→ WordPress Admin Console</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Utility Bar (Matching Professional Polish theme footer bar) */}
        <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>© 2024–2026 Dunya International Media Group. All rights reserved.</span>
            <button onClick={() => onNavigate('page:terms-conditions')} className="hover:text-gray-300">Terms of Service</button>
            <button onClick={() => onNavigate('page:privacy-policy')} className="hover:text-gray-300">Privacy Policy</button>
            <button onClick={() => onNavigate('page:editorial-policy')} className="hover:text-gray-300">Editorial Guidelines</button>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
              <span>Network Operational</span>
            </span>
            <span className="text-gray-400">Edition: Global (EN / UR)</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition bg-gray-800 px-2.5 py-1 rounded"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

