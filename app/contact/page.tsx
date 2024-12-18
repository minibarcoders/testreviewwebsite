'use client';

import { useState, useEffect } from 'react';
import { useAnalytics } from 'app/hooks/useAnalytics';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const { trackEvent } = useAnalytics();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    trackEvent('contact_form_view');
  }, [trackEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      // Track form submission attempt
      trackEvent('contact_form_submit', {
        name_length: formData.name.length,
        message_length: formData.message.length
      });

      // Here you would typically send the data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Track successful submission
      trackEvent('contact_form_success', {});
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      
      // Track submission error
      trackEvent('contact_form_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600">
            Have a question or suggestion? We'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500 
                       transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500 
                       transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500 
                       transition-colors duration-200"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium 
                       hover:bg-indigo-500 transition-colors duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <span className="text-sm text-emerald-600">
                Message sent successfully!
              </span>
            )}

            {status === 'error' && (
              <span className="text-sm text-rose-600">
                Failed to send message. Please try again.
              </span>
            )}
          </div>
        </form>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Email Us</h2>
              <p className="text-slate-600">
                For general inquiries: contact@fixedorcustom.com
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Follow Us</h2>
              <div className="flex gap-4">
                <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors duration-200">
                  Twitter
                </a>
                <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors duration-200">
                  LinkedIn
                </a>
                <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors duration-200">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}