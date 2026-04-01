# Footer & Shared Layout Components - Documentation

**Last Updated**: March 2026  
**Component Scope**: Reusable UI Components, Navigation, Layout

---

## Table of Contents

1. [Footer Component](#footer-component)
2. [Navbar Component](#navbar-component)
3. [Dashboard Layout](#dashboard-layout)
4. [Shared Components](#shared-components)
5. [Layout Patterns](#layout-patterns)
6. [Styling & Theming](#styling--theming)

---

## Footer Component

**File**: `src/components/Footer.jsx`

### Overview

The Footer is a global component displayed at the bottom of most pages. It provides navigation links, contact information, and social media integration.

### Features

✅ Responsive 4-column layout on desktop, stacked on mobile  
✅ Animated hover effects with Framer Motion  
✅ Brand colors consistent with domain (green agriculture theme)  
✅ Social media links  
✅ Quick navigation to key pages  
✅ Contact information display  
✅ SEO-friendly structure  

### Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    FOOTER SECTION                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Logo]  Quick Links    Services      Contact Info          │
│  Brand   • About Us     • Dashboard    📞 (123) 456-7890    │
│  Info    • Services     • Marketplace  📧 info@...com        │
│          • FAQ          • Weather     📍 Location            │
│          • Contact      • Planner                            │
│                                                              │
│                              Social Media                    │
│                           [f] [在] [in] [GitHub]            │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│  © 2026 Smart Agriculture. All rights reserved.             │
│  Privacy Policy | Terms of Service                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```jsx
<footer>
│
├─ <div className="grid grid-cols-4 gap-8">  (Desktop)
│  │
│  ├─ Column 1: Brand Info
│  │  ├─ Logo
│  │  ├─ Brand tagline
│  │  └─ Brief description
│  │
│  ├─ Column 2: Quick Links
│  │  ├─ About Us
│  │  ├─ Services
│  │  ├─ FAQ
│  │  └─ Contact
│  │
│  ├─ Column 3: Services
│  │  ├─ Dashboard
│  │  ├─ Marketplace
│  │  ├─ Weather
│  │  └─ Farm Planner
│  │
│  └─ Column 4: Contact & Social
│     ├─ Phone number
│     ├─ Email address
│     ├─ Location
│     └─ Social icons
│
└─ <div className="border-t mt-8 pt-8">
   ├─ Copyright notice
   └─ Legal links
```

### HTML/JSX Code

```jsx
// src/components/Footer.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Github 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'About Us', href: '/aboutUs' },
        { label: 'Services', href: '/services' },
        { label: 'Contact Us', href: '/contactUs' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Dashboard', href: '/dashboard/farmer' },
        { label: 'Marketplace', href: '/crops' },
        { label: 'Weather', href: '/dashboard/farmer/weather' },
        { label: 'Farm Planner', href: '/dashboard/farmer/planner' },
      ],
    },
    {
      title: 'Contact Info',
      contact: true,
      items: [
        { icon: Phone, text: '(123) 456-7890' },
        { icon: Mail, text: 'info@smartagriculture.com' },
        { icon: MapPin, text: 'Dhaka, Bangladesh' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SA</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Smart Agriculture
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empowering farmers with technology and sustainable practices 
              for modern agriculture.
            </p>
          </motion.div>

          {/* Links Columns */}
          {footerSections.slice(0, 2).map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <motion.a
                        className="text-sm text-gray-600 dark:text-gray-400 
                                   hover:text-green-600 dark:hover:text-green-400 
                                   transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {link.label}
                      </motion.a>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info Column */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              {footerSections[2].title}
            </h4>
            <ul className="space-y-3">
              {footerSections[2].items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-4 py-8 border-t border-gray-200 dark:border-gray-800"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 
                           text-gray-600 dark:text-gray-400
                           hover:bg-green-600 hover:text-white
                           transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>© 2026 Smart Agriculture Platform. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy">
                <a className="hover:text-green-600 dark:hover:text-green-400 
                              transition-colors">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms">
                <a className="hover:text-green-600 dark:hover:text-green-400 
                              transition-colors">
                  Terms of Service
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### Customization

**Colors**: Modify the Tailwind classes:
```jsx
// Green theme (current)
className="text-green-600 hover:text-green-400"

// To change theme:
className="text-blue-600 hover:text-blue-400"
className="text-amber-600 hover:text-amber-400"
```

**Sections**: Add or remove columns by editing `footerSections` array

**Social Links**: Update `socialLinks` array with additional platforms

---

## Navbar Component

**File**: `src/components/Navbar.jsx`

### Overview

The Navbar provides top navigation, user authentication buttons, and responsive menu.

### Features

✅ Fixed/sticky positioning option  
✅ Logo and brand name  
✅ Navigation menu (responsive)  
✅ Authentication buttons (Login/Logout)  
✅ Dark mode toggle  
✅ Mobile hamburger menu  
✅ User profile dropdown  

### Component Structure

```jsx
<nav className="bg-white dark:bg-gray-900 shadow">
│
├─ <div className="container mx-auto px-4">
│  │
│  ├─ <div className="flex justify-between items-center">
│  │  │
│  │  ├─ Left: Logo & Brand
│  │  │
│  │  ├─ Center: Navigation Links
│  │  │  ├─ Dashboard
│  │  │  ├─ Services
│  │  │  ├─ News
│  │  │  ├─ About
│  │  │  └─ Contact
│  │  │
│  │  └─ Right: Actions
│  │     ├─ Theme Toggle
│  │     ├─ Login/Logout Button
│  │     └─ User Profile Menu
│  │
│  └─ Mobile Menu (Hamburger)
│     └─ Full menu in drawer
│
└─ </nav>
```

### Key Features

**Login/Logout Button**:
```jsx
{!user ? (
  <Link href="/login">
    <button className="btn btn-primary">Login</button>
  </Link>
) : (
  <button onClick={logout} className="btn btn-ghost">
    Logout
  </button>
)}
```

**Dark Mode Toggle**:
```jsx
<button
  onClick={toggleTheme}
  className="btn btn-ghost btn-circle"
>
  {isDark ? '☀️' : '🌙'}
</button>
```

**Mobile Menu**:
```jsx
<div className="drawer">
  <input type="checkbox" className="drawer-toggle" id="nav-drawer" />
  <div className="drawer-content">
    {/* Desktop menu */}
  </div>
  <div className="drawer-side">
    <label htmlFor="nav-drawer" className="drawer-overlay"></label>
    <ul className="menu p-4 w-80 h-full bg-base-200">
      {/* Mobile menu items */}
    </ul>
  </div>
</div>
```

---

## Dashboard Layout

**File**: `src/app/(dashboard)/layout.js`

### Overview

The Dashboard wrapper provides consistent layout for all dashboard pages with:
- Sidebar navigation
- Header with notifications
- Role-based access control
- Responsive drawer on mobile

### Component Structure

```
<DashboardLayout>
│
├─ <DaisyUI Drawer>
│  │
│  ├─ Trigger: Hamburger menu (mobile)
│  │
│  ├─ Content Area:
│  │  ├─ <Header>
│  │  │  ├─ Logo/Brand
│  │  │  ├─ Title
│  │  │  └─ Actions
│  │  │
│  │  └─ <MainContent>
│  │     └─ {children}
│  │
│  └─ Sidebar (Desktop) or Drawer (Mobile):
│     ├─ User Profile Section
│     │  ├─ Avatar
│     │  ├─ Name
│     │  ├─ Role
│     │  └─ Status indicator
│     │
│     ├─ Navigation Menu
│     │  └─ Role-based links
│     │
│     └─ Settings/Logout
│
└─ <Footer />
```

### HTML Structure

```jsx
// src/app/(dashboard)/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      <input 
        type="checkbox" 
        id="dashboard-drawer" 
        className="drawer-toggle" 
      />
      
      {/* Main Content */}
      <div className="drawer-content">
        {/* Header */}
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-40">
          <div className="flex-none lg:hidden">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <svg>...</svg>
            </label>
          </div>
          <div className="flex-1">
            <Logo />
            <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
          </div>
          <NotificationDropdown />
          <UserProfileDropdown />
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}
```

### Notification Dropdown

```jsx
function NotificationDropdown() {
  const notifications = [
    { id: 1, type: 'order', message: 'New order received', time: '5m ago' },
    { id: 2, type: 'alert', message: 'Weather warning', time: '1h ago' },
    { id: 3, type: 'message', message: 'New message from buyer', time: '2h ago' },
    { id: 4, type: 'reminder', message: 'Fertilizer stock low', time: '3h ago' },
    { id: 5, type: 'update', message: 'New crop recommendations', time: '5h ago' },
  ];

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-circle btn-ghost indicator">
        <span className="indicator-item badge badge-sm badge-error">5</span>
        <Bell />
      </button>
      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64">
        {notifications.slice(0, 5).map((notif) => (
          <li key={notif.id}>
            <a className="py-3">
              <span className="text-sm font-medium">{notif.message}</span>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </a>
          </li>
        ))}
        <li className="border-t">
          <a className="justify-center text-blue-600">View All Notifications</a>
        </li>
      </ul>
    </div>
  );
}
```

### User Profile Dropdown

```jsx
function UserProfileDropdown() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-circle btn-ghost avatar">
        <div className="w-10 rounded-full bg-green-600 text-white flex items-center justify-center">
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
      </button>
      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a>{user.firstName} {user.lastName}</a>
        </li>
        <li>
          <a href="/profile">Profile Settings</a>
        </li>
        <li>
          <a href="/account">Account</a>
        </li>
        <li>
          <a href="/help">Help & Support</a>
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
```

---

## Shared Components

### Logo Component
**File**: `src/components/Logo.jsx`

```jsx
export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">SA</span>
      </div>
      <span className="font-bold text-lg hidden sm:inline">
        Smart Agriculture
      </span>
    </div>
  );
}
```

### Loader Component
**File**: `src/components/Loader.jsx`

```jsx
export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg text-base-300"></div>
    </div>
  );
}
```

### Upload Image Component
**File**: `src/components/UploadImg.jsx`

```jsx
export default function UploadImg({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Upload Image</span>
      </label>
      <div className="drop-zone borders rounded-lg p-8 text-center cursor-pointer 
                      hover:bg-gray-50 border-2 border-dashed border-gray-300">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-primary"
        >
          Choose Image
        </button>
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Layout Patterns

### 1. Two Column Layout (Sidebar + Content)

```jsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* Sidebar - 1 column */}
  <aside className="lg:col-span-1">
    <Sidebar />
  </aside>

  {/* Content - 3 columns */}
  <main className="lg:col-span-3">
    {children}
  </main>
</div>
```

### 2. Card Grid Layout

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {data.map((item) => (
    <motion.div
      key={item.id}
      className="card bg-base-100 shadow-lg"
      whileHover={{ y: -5 }}
    >
      <div className="card-body">
        {/* Card content */}
      </div>
    </motion.div>
  ))}
</div>
```

### 3. Form Layout

```jsx
<form className="space-y-6">
  <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label className="form-control">
      <span className="label-text">Field 1</span>
      <input type="text" className="input input-bordered" />
    </label>
    <label className="form-control">
      <span className="label-text">Field 2</span>
      <input type="text" className="input input-bordered" />
    </label>
  </fieldset>
  
  <div className="form-control">
    <button type="submit" className="btn btn-primary">
      Submit
    </button>
  </div>
</form>
```

### 4. Stats Cards

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    { label: 'Total Crops', value: 25, icon: Leaf },
    { label: 'Total Orders', value: 128, icon: ShoppingCart },
    { label: 'Total Profit', value: '৳1.2M', icon: TrendingUp },
    { label: 'Expenses', value: '৳450K', icon: DollarSign },
  ].map((stat) => (
    <StatCard key={stat.label} {...stat} />
  ))}
</div>
```

---

## Styling & Theming

### Brand Colors

```css
/* Primary Colors */
--color-primary: #2E7D32    /* Green - Agriculture */
--color-primary-light: #E8F5E9
--color-primary-dark: #1B5E20

/* Accent Colors */
--color-accent: #FBC02D      /* Yellow/Gold */
--color-secondary: #8D6E63   /* Brown - Soil */

/* Semantic Colors */
--color-success: #4CAF50
--color-warning: #FF9800
--color-error: #D32F2F
--color-info: #2196F3
```

### Dark Mode

```jsx
// Use DaisyUI's built-in dark mode
<html data-theme="dark">
  {children}
</html>

// OR in component:
const { isDark, toggleTheme } = useTheme();
```

### Responsive Design

```tailwindcss
/* Mobile First */
sm:  640px   /* Small screens */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Large screens */
2xl: 1536px  /* Extra Large */
```

### Animations

```jsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>

// Hover effects
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

---

## Component Documentation Summary

| Component | File | Purpose | Reusable |
|-----------|------|---------|----------|
| Footer | `src/components/Footer.jsx` | Global footer | ✅ Yes |
| Navbar | `src/components/Navbar.jsx` | Top navigation | ✅ Yes |
| Logo | `src/components/Logo.jsx` | Brand logo | ✅ Yes |
| Loader | `src/components/Loader.jsx` | Loading spinner | ✅ Yes |
| UploadImg | `src/components/UploadImg.jsx` | Image upload | ✅ Yes |
| DashboardLayout | `src/app/(dashboard)/layout.js` | Dashboard wrapper | ✅ Yes |

---

## Usage Examples

### Importing in Pages

```jsx
// Page with Footer
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <main>
        {/* Page content */}
      </main>
      <Footer />
    </>
  );
}

// Dashboard page (automatically includes layout)
export default function DashboardPage() {
  // DashboardLayout wraps this automatically
  return (
    <main>
      {/* Content */}
    </main>
  );
}
```

---

## Customization Guide

### Change Footer Brand Name

```jsx
// In Footer.jsx, line 86:
<h3 className="text-lg font-bold">
  Your New Brand Name  {/* Change this */}
</h3>
```

### Add New Navigation Links

```jsx
// In Footer.jsx footerSections:
{
  title: 'Resources',
  links: [
    { label: 'Blog', href: '/blog' },
    { label: 'Guides', href: '/guides' },
    // Add more here
  ],
}
```

### Customize Colors

```jsx
// Change primary color from green to blue:
className="text-green-600"  →  className="text-blue-600"
className="hover:text-green-400"  →  className="hover:text-blue-400"
className="bg-green-600"  →  className="bg-blue-600"
```

---

## Performance Optimization

### Code Splitting
```jsx
// Use dynamic imports for footer on landing pages
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-64 bg-gray-100" />
});
```

### Image Optimization
```jsx
import Image from 'next/image';

<Image
  src="/images/logo.png"
  alt="Logo"
  width={32}
  height={32}
  priority
/>
```

### Memoization
```jsx
const Footer = React.memo(FooterComponent, (prev, next) => {
  return prev.theme === next.theme; // Only rerender if theme changes
});
```

---

**For more details on implementation, check the source files in `src/components/`**

---
