"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, ArrowUpRight,
  Droplets, ScanEye, FlaskConical, Leaf,
  Github, Twitter, Linkedin, Facebook,
  Sprout,
} from "lucide-react";
import Logo from "./Logo";

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Home",       href: "/" },
  { label: "About Us",   href: "/aboutUs" },
  { label: "Services",   href: "/services" },
  { label: "Contact Us", href: "/contactUs" },
];

const SERVICES = [
  { label: "Smart Irrigation Systems",      href: "/services#irrigation", icon: Droplets },
  { label: "Drone & AI Crop Monitoring",    href: "/services#drone",      icon: ScanEye },
  { label: "Precision Soil Analysis",       href: "/services#soil",       icon: FlaskConical },
  { label: "Sustainable Farming Solutions", href: "/services#sustainable",icon: Leaf },
];

const CONTACT = [
  { icon: Mail,   label: "info@smartagriculture.com", href: "mailto:info@smartagriculture.com" },
  { icon: Phone,  label: "(123) 456-7890",            href: "tel:+11234567890" },
  { icon: MapPin, label: "123 Health St, Med City",   href: "https://maps.google.com" },
];

const SOCIALS = [
  { icon: Twitter,  href: "https://twitter.com",  label: "Twitter"  },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github,   href: "https://github.com",   label: "GitHub"   },
];

// ─── Animated link ────────────────────────────────────────────────────────────

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
    >
      <motion.span
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1"
      >
        {children}
        <ArrowUpRight
          size={12}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </motion.span>
    </Link>
  );
}

// ─── Service link with icon ───────────────────────────────────────────────────

function ServiceLink({ href, label, Icon }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0
          bg-white/5 border border-white/10
          group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors duration-200"
      >
        <Icon size={13} className="text-white/40 group-hover:text-primary transition-colors duration-200" />
      </motion.div>
      <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
        {label}
      </motion.span>
    </Link>
  );
}

// ─── Contact item ─────────────────────────────────────────────────────────────

function ContactItem({ href, label, Icon }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className="group flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 280 }}
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5
          bg-white/5 border border-white/10
          group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors duration-200"
      >
        <Icon size={13} className="text-white/40 group-hover:text-primary transition-colors duration-200" />
      </motion.div>
      <span className="leading-relaxed">{label}</span>
    </Link>
  );
}

// ─── Social button ────────────────────────────────────────────────────────────

function SocialBtn({ href, label, icon: Icon }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="w-9 h-9 rounded-xl flex items-center justify-center
        bg-white/5 border border-white/10
        hover:bg-primary/20 hover:border-primary/30
        text-white/40 hover:text-primary transition-colors duration-200"
    >
      <Icon size={15} />
    </motion.a>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-extrabold tracking-widest uppercase text-white/70">
        {children}
      </h4>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-2 h-px w-8 bg-primary origin-left"
      />
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

const Footer = () => {
  return (
    <footer className="relative bg-gray-950 text-white overflow-hidden">

      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="sm:col-span-2 lg:col-span-1"
          >
           
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="relative w-28 h-10"
              >
                <Logo></Logo>
              </motion.div>
            

            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              We integrate AI, IoT sensors, drones, and precision farming solutions
              to help farmers achieve higher yields, reduced costs, and sustainable growth.
            </p>

            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <SocialBtn key={s.label} {...s} />
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading>Quick Links</SectionHeading>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading>Our Services</SectionHeading>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <ServiceLink href={s.href} label={s.label} Icon={s.icon} />
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading>Contact Info</SectionHeading>
            <ul className="space-y-3">
              {CONTACT.map((c) => (
                <li key={c.label}>
                  <ContactItem href={c.href} label={c.label} Icon={c.icon} />
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xs text-white/30 flex items-center gap-1.5"
          >
            <Sprout size={12} className="text-primary/60" />
            &copy; {new Date().getFullYear()} Smart Agriculture. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;