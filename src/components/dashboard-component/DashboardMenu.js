"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, Briefcase, NotepadText, Contact, TableProperties, Users, Mails, Images  } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'

function Icon({ name }) {
  switch (name) {
    case 'dashboard':
      return (
        <LayoutDashboard className="w-5 h-5" />
      )
    case 'projects':
      return (
        <Briefcase className="w-5 h-5" />
      )
    case 'blog':
      return (
        <NotepadText className="w-5 h-5" />
      )
    case 'Contact':
      return (
        <Contact  className="w-5 h-5" />
      )
    case 'Quote Requests':
    return (
      <TableProperties className="w-5 h-5" />
    )
    case 'Users':
    return (
      <Users className="w-5 h-5" />
    )
    case 'Newsletter':
    return (
      <Mails className="w-5 h-5" />
    )
    case 'Newsletter':
    return (
      <Mails className="w-5 h-5" />
    )
    case 'Gallery':
    return (
      <Images className="w-5 h-5" />
    )
    default:
      return null
  }
}

export default function DashboardMenu({ collapsed, mobileOpen = false, onClose = () => {} }) {
  const { user } = useAuth();
  const pathname = usePathname() || ''
  
  // Define menu items with role requirements
  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['admin', 'customer', 'staff-member'] },
    { href: '/dashboard/order', label: 'Orders', icon: 'dashboard', roles: ['admin', 'staff-member'] },
    {
      href: '/dashboard/products',
      label: 'Products',
      icon: 'projects',
      roles: ['admin', 'staff-member'],
      children: [
        { href: '/dashboard/add-product', label: 'Add Product', roles: ['admin', 'staff-member'] },
        { href: '/dashboard/all-product', label: 'All Products', roles: ['admin', 'staff-member'] },
        { href: '/dashboard/all-category', label: 'Product Categories', roles: ['admin'] },
        { href: '/dashboard/add-shipment-location', label: 'Add Shipment Location', roles: ['admin'] },
        { href: '/dashboard/all-shipment-location', label: 'All Shipment Locations', roles: ['admin'] }
      ]
    },
    {
      href: '/dashboard/coupon',
      label: 'Coupons',
      icon: 'projects',
      roles: ['admin', 'staff-member'],
      children: [
        { href: '/dashboard/add-coupon', label: 'Add Coupon', roles: ['admin'] },
        { href: '/dashboard/coupon', label: 'All Coupons', roles: ['admin', 'staff-member'] },
      ]
    },
    { href: '/dashboard/training-registration', label: 'Training Registration', icon: 'dashboard', roles: ['admin', 'staff-member'] },
    {
      href: '/dashboard/blog',
      label: 'Blog',
      icon: 'blog',
      roles: ['admin', 'staff-member'],
      children: [
        { href: '/dashboard/add-blog', label: 'Add Blog', roles: ['admin'] },
        { href: '/dashboard/manage-blog', label: 'Manage Blogs', roles: ['admin', 'staff-member'] }
      ]
    },
    {
      href: '/dashboard/projects',
      label: 'Projects',
      icon: 'projects',
      roles: ['admin', 'staff-member'],
      children: [
        { href: '/dashboard/add-projects', label: 'Add Project', roles: ['admin', 'staff-member'] },
        { href: '/dashboard/all-projects', label: 'All Projects', roles: ['admin', 'staff-member'] }
      ]
    },
    { href: '/dashboard/contact-form-responses', label: 'Contact Form Responses', icon: 'Contact', roles: ['admin', 'staff-member'] },
    { href: '/dashboard/quote-requests', label: 'Quote Requests', icon: 'Quote Requests', roles: ['admin', 'staff-member'] },
    {
      href: '/dashboard/users',
      label: 'Manage Users',
      icon: 'Users',
      roles: ['admin'],
      children: [
        { href: '/dashboard/all-users', label: 'All Users', roles: ['admin'] },
        { href: '/dashboard/add-user', label: 'Add User', roles: ['admin'] },
        { href: '/dashboard/change-user-password', label: 'Change User Password', roles: ['admin'] }
      ]
    },
    {
      href: '/dashboard/all-newsletter',
      label: 'Newsletter Management',
      icon: 'Newsletter',
      roles: ['admin', 'staff-member'],
      children: [
        { href: '/dashboard/send-newsletter', label: 'Send Newsletter', roles: ['admin', 'staff-member'] },
        { href: '/dashboard/all-newsletters', label: 'All Newsletters', roles: ['admin', 'staff-member'] },
        { href: '/dashboard/subscribers', label: 'Subscribers', roles: ['admin'] },
      ]
    },
    {
      href: '/dashboard/gallery',
      label: 'Gallery Management',
      icon: 'Gallery',
      roles: ['admin', 'staff-member'],
      children: [
        { href: '/dashboard/add-gallery', label: 'Add Gallery', roles: ['admin'] },
        { href: '/dashboard/all-gallery', label: 'All Gallery', roles: ['admin', 'staff-member'] },
      ]
    },
    { href: '/dashboard/track-order', label: 'Track Your Orders', icon: 'dashboard', roles: ['customer'] },
    { href: '/dashboard/my-profile', label: 'Profile', icon: 'dashboard', roles: ['admin', 'customer', 'staff-member'] },
  ]

  // Helper function to check if user has access to item
  const hasAccess = (itemRoles) => {
    if (!itemRoles) return true; // No role restriction
    return itemRoles.includes(user?.role);
  }

  const [openKey, setOpenKey] = useState(null)

  function toggleSub(key) {
    setOpenKey(prev => (prev === key ? null : key))
  }

  // Desktop / large screens: persistent sidebar
  const desktopNav = (
    <nav className={`hidden md:flex h-full bg-[#7b3306] border-r border-gray-100 ${collapsed ? 'w-16' : 'w-75'} transition-width duration-200`} aria-label="Dashboard navigation">
      <div className="h-full overflow-y-auto py-6 px-2">
        <ul className="space-y-1">
          {items.map(i => {
            // Check if user has access to this item
            if (!hasAccess(i.roles)) return null;

            const active = pathname === i.href || pathname.startsWith(i.href + '/')
            const hasChildren = Array.isArray(i.children) && i.children.length > 0
            const isOpen = openKey === i.href
            // Filter children based on access
            const visibleChildren = hasChildren ? i.children.filter(c => hasAccess(c.roles)) : [];

            return (
              <li key={i.href}>
                {visibleChildren.length > 0 ? (
                  <div>
                    <button
                      onClick={() => toggleSub(i.href)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md ${active ? 'bg-indigo-50 text-[#7b3306]' : 'text-white hover:bg-white/20'}`}
                    >
                      <span className="flex justify-start items-center gap-2">
                        <span className="shrink-0"> <Icon name={i.icon} /> </span>
                        {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{i.label}</span>}
                      </span>
                      {!collapsed && (
                        <svg className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l6 4-6 4V6z" />
                        </svg>
                      )}
                    </button>

                    {/* Submenu (desktop) */}
                    {!collapsed && isOpen && (
                      <ul className="mt-1 space-y-1 pl-10">
                        {visibleChildren.map(c => (
                          <li key={c.href}>
                            <Link href={c.href} className={`block px-3 py-2 rounded-md text-sm ${pathname === c.href ? 'bg-indigo-50 text-[#7b3306]' : 'text-white hover:bg-white/20'}`}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link href={i.href} className={`flex items-center gap-3 px-3 py-2 rounded-md ${active ? 'bg-indigo-50 text-[#7b3306]' : 'text-white hover:bg-white/20'}`}>
                    <span className="shrink-0"> <Icon name={i.icon} /> </span>
                    {!collapsed && <span className="text-sm font-medium">{i.label}</span>}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )

  // Mobile overlay nav: only visible when mobileOpen is true
  const mobileNav = mobileOpen ? (
    <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <nav className="relative z-50 h-full w-70 bg-[#7b3306] border-r border-gray-100">
        <div className="h-full overflow-y-auto py-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex flex-col items-center gap-3 bg-white p-0 pb-2 rounded-md">
              <Image src="/images/resinlogo.png" alt="Resin by saidat Logo" width={170} height={50} className="w-35 block rounded-md" />
            </Link>
            <button aria-label="Close menu" onClick={onClose} className="p-2 rounded-md text-white hover:bg-gray-100">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="space-y-1">
              {items.map(i => {
                // Check if user has access to this item
                if (!hasAccess(i.roles)) return null;

                const active = pathname === i.href || pathname.startsWith(i.href + '/')
                const hasChildren = Array.isArray(i.children) && i.children.length > 0
                const isOpen = openKey === i.href
                // Filter children based on access
                const visibleChildren = hasChildren ? i.children.filter(c => hasAccess(c.roles)) : [];

                return (
                  <li key={i.href}>
                    {visibleChildren.length > 0 ? (
                      <div>
                        <button onClick={() => toggleSub(i.href)} className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md ${active ? 'bg-indigo-50 text-blue-800' : 'text-white hover:bg-blue-900'}`}>
                          <span className="flex items-center gap-3">
                            <span className="shrink-0 text-white"> <Icon name={i.icon} /> </span>
                            <span className="text-sm font-medium">{i.label}</span>
                          </span>
                          <svg className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l6 4-6 4V6z" />
                          </svg>
                        </button>

                        {/* Mobile submenu accordion */}
                        {isOpen && (
                          <ul className="mt-1 space-y-1 pl-6">
                            {visibleChildren.map(c => (
                              <li key={c.href}>
                                <Link href={c.href} onClick={onClose} className={`block px-3 py-2 rounded-md text-sm ${pathname === c.href ? 'bg-indigo-50 text-indigo-600' : 'text-white hover:bg-blue-900'}`}>
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link href={i.href} onClick={onClose} className={`flex items-center gap-3 px-3 py-2 rounded-md ${active ? 'bg-indigo-50 text-indigo-600' : 'text-white hover:bg-blue-900'}`}>
                        <span className="shrink-0 text-white"> <Icon name={i.icon} /> </span>
                        <span className="text-sm font-medium">{i.label}</span>
                      </Link>
                    )}
                  </li>
                )
              })}
          </ul>
        </div>
      </nav>
    </div>
  ) : null

  return (
    <>
      {desktopNav}
      {mobileNav}
    </>
  )
}
