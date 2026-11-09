import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Button, Input, Textarea } from '../../components/UIComponents';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Reach Out To Us</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
          Contact RV FITNESS
        </h1>
        <p className="text-slate-400 text-sm mt-3">
          Have queries about subscription fees, personal training, or workout timings? Get in touch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Visit Our Gym in Narsobawadi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We welcome you to visit the facility in person for a free equipment walkthrough and body composition screening.
            </p>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 min-w-5 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Gym Address</span>
                  <span>Near Datta Mandir, Narsobawadi, Tal. Shirol, Dist. Kolhapur, Maharashtra 416104</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 min-w-5" />
                <div>
                  <span className="font-bold text-white block">Phone Numbers</span>
                  <span>+91 98230 12345 / +91 94220 54321</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 min-w-5" />
                <div>
                  <span className="font-bold text-white block">Official Email</span>
                  <span>contact@rvfitnessnarsobawadi.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 min-w-5 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Training Hours</span>
                  <span>Monday - Saturday: 5:30 AM – 10:00 PM<br/>Sunday: 6:00 AM – 1:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-2">Send Us an Inquiry</h3>
          <p className="text-xs text-slate-400 mb-6">Leave your details and our team will call you back shortly.</p>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 min-w-6" />
              <div>
                <p className="font-bold text-sm">Thank you for contacting RV FITNESS!</p>
                <p className="text-xs text-slate-300 mt-0.5">Our front desk coordinator will reach out to you within 2 business hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <Input
                label="Your Full Name *"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number *"
                  placeholder="+91 98000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="mahesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                />
              </div>
              <Textarea
                label="Message or Plan Query"
                placeholder="Tell us about your fitness goal (weight loss, muscle gain, personal training)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                required
              />
              <Button type="submit" variant="primary" className="w-full" icon={Send}>
                Submit Inquiry
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
