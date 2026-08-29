import React, { useState } from 'react';
import { WPPage } from '../types/wordpress';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, Award, Users } from 'lucide-react';

interface StaticPageViewProps {
  page: WPPage;
  onNavigate: (route: string) => void;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({
  page,
  onNavigate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'general',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', department: 'general', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const isContact = page.slug === 'contact-us';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 select-text">
      
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 mb-6 flex items-center space-x-2">
        <button onClick={() => onNavigate('home')} className="hover:underline text-[#002B49] dark:text-slate-300 font-semibold">
          Home
        </button>
        <span>/</span>
        <span className="text-slate-400">{page.title}</span>
      </div>

      {/* Page Card */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        
        <header className="border-b border-gray-200 dark:border-slate-800 pb-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D32F2F]">
            DUNYA INTERNATIONAL OFFICIAL
          </span>
          <h1 className="font-editorial-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
              {page.excerpt}
            </p>
          )}
        </header>

        {/* Formatted Content */}
        <div 
          className="editorial-body text-slate-800 dark:text-slate-200 text-sm md:text-base leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* If Contact Page, show interactive Form & Bureau Details */}
        {isContact && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
            <h3 className="font-editorial-sans text-lg font-bold text-slate-900 dark:text-white mb-4">
              Send a Secure Message or News Tip
            </h3>

            {submitted && (
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center space-x-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Thank you. Your message has been routed to the relevant Dunya International editorial desk.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:ring-2 focus:ring-[#002B49]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:ring-2 focus:ring-[#002B49]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Desk / Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  >
                    <option value="general">General Inquiries</option>
                    <option value="tips">Investigative News Tip</option>
                    <option value="press">Press Releases & Media</option>
                    <option value="advertising">Commercial & Advertising</option>
                    <option value="corrections">Correction Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:ring-2 focus:ring-[#002B49]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide detailed information regarding your inquiry..."
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#002B49] text-white px-6 py-2.5 rounded text-xs font-bold hover:bg-[#D32F2F] transition flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
