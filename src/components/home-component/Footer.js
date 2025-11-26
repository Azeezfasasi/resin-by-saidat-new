import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Brand / About */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Resin By Saidat</h3>
          <p className="text-white text-sm leading-relaxed mb-6">
            Empowering creative minds through professional resin art training, expert instruction, and a thriving community of artists.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              className="text-white hover:text-white transition"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="text-white hover:text-white transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="text-white hover:text-white transition"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-white">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/training-register" className="hover:text-white transition">
                Register for Training
              </Link>
            </li>
            <li>
              <Link href="/training-details" className="hover:text-white transition">
                Training Details
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">What We Offer</h4>
          <ul className="space-y-3 text-white">
            <li>Resin Art Training</li>
            <li>Epoxy Techniques</li>
            <li>Jewelry Making</li>
            <li>Mixed Media</li>
            <li>Advanced Courses</li>
            <li>Certification Programs</li>
            <li>Private Workshops</li>
            <li>Community Events</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-4 text-sm text-white">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-white mt-1 shrink-0" />
              <span>
                Lagos, Nigeria
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-white shrink-0" />
              <a href="tel:+2348125925447" className="hover:text-white transition">
                (+234) 8125925447
              </a>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z" fill="currentColor"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z" fill="currentColor"></path> </g></svg>
              <a href="https://wa.me/234815226033" target="_blank" className="hover:text-white transition">
                WhatsApp Us
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-white shrink-0" />
              <a href="mailto:info@resinbysaidat.com" className="hover:text-white transition">
                info@resinbysaidat.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-800 mt-12 pt-6 text-center text-sm text-white">
        © {new Date().getFullYear()} <span className="text-white font-medium">Resin By Saidat</span>. 
        All rights reserved. | Developed by {''}
        <a 
          href="https://wa.me/2348117256646" target="_blank" rel="noopener noreferrer" className="hover:text-white underline"
        >
          Sense Solutions
        </a>
      </div>
    </footer>
  );
}
