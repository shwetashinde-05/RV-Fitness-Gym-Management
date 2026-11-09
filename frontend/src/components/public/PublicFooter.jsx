import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#080A0E] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
                RV
              </div>
              <span className="font-extrabold text-lg text-white tracking-wider">
                RV <span className="text-emerald-400">FITNESS</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Narsobawadi’s premier modern fitness club. Equipped with commercial-grade strength machinery, Olympic free weights, personalized diet charts, and certified body conditioning trainers.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4" /> Commercial Gym SaaS Certified
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About RV FITNESS</Link></li>
              <li><Link to="/facilities" className="hover:text-emerald-400 transition-colors">Gym Facilities & Turf</Link></li>
              <li><Link to="/plans" className="hover:text-emerald-400 transition-colors">Membership Pricing</Link></li>
              <li><Link to="/trainers-public" className="hover:text-emerald-400 transition-colors">Our Certified Coaches</Link></li>
              <li><Link to="/gallery" className="hover:text-emerald-400 transition-colors">Workout Floor Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Location & Contact</Link></li>
            </ul>
          </div>

          {/* Portals Access */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Role Portals</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors font-semibold">Admin SaaS Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors font-semibold">Trainer Coaching Portal</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors font-semibold">Member Fitness Portal</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors font-semibold">New Member Registration</Link></li>
            </ul>
          </div>

          {/* Gym Timings & Address */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Visit Us In Narsobawadi</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 min-w-4 mt-0.5" />
                <span>Near Datta Mandir, Narsobawadi, Tal. Shirol, Dist. Kolhapur, Maharashtra 416104</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 min-w-4" />
                <span>+91 98230 12345 / +91 94220 54321</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 min-w-4" />
                <span>contact@rvfitnessnarsobawadi.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 min-w-4 mt-0.5" />
                <span>Mon-Sat: 5:30 AM - 10:00 PM<br/>Sun: 6:00 AM - 1:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} RV FITNESS, Narsobawadi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern React, Node.js & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
