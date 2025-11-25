"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, Briefcase, NotepadText, Contact, TableProperties, Users, Mails, Images  } from 'lucide-react';

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
  const pathname = usePathname() || ''
  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/dashboard/order', label: 'Orders', icon: 'dashboard' },
    {
      href: '/dashboard/products',
      label: 'Products',
      icon: 'projects',
      children: [
        { href: '/dashboard/add-product', label: 'Add Product' },
        { href: '/dashboard/all-product', label: 'All Products' },
        { href: '/dashboard/all-category', label: 'Product Categories' }
      ]
    },
    {
      href: '/dashboard/coupon',
      label: 'Coupons',
      icon: 'projects',
      children: [
        { href: '/dashboard/add-coupon', label: 'Add Coupon' },
        { href: '/dashboard/coupon', label: 'All Coupons' },
      ]
    },
    { href: '/dashboard/training-registration', label: 'Training Registration', icon: 'dashboard' },
    {
      href: '/dashboard/blog',
      label: 'Blog',
      icon: 'blog',
      children: [
        { href: '/dashboard/add-blog', label: 'Add Blog' },
        { href: '/dashboard/manage-blog', label: 'Manage Blogs' }
      ]
    },
    {
      href: '/dashboard/projects',
      label: 'Projects',
      icon: 'projects',
      children: [
        { href: '/dashboard/add-projects', label: 'Add Project' },
        { href: '/dashboard/all-projects', label: 'All Projects' }
      ]
    },
    { href: '/dashboard/contact-form-responses', label: 'Contact Form Responses', icon: 'Contact' },
    { href: '/dashboard/quote-requests', label: 'Quote Requests', icon: 'Quote Requests' },
    {
      href: '/dashboard/users',
      label: 'Manage Users',
      icon: 'Users',
      children: [
        { href: '/dashboard/all-users', label: 'All Users' },
        { href: '/dashboard/add-user', label: 'Add User' },
        { href: '/dashboard/change-user-password', label: 'Change User Password' }
      ]
    },
    {
      href: '/dashboard/all-newsletter',
      label: 'Newsletter Management',
      icon: 'Newsletter',
      children: [
        { href: '/dashboard/send-newsletter', label: 'Send Newsletter' },
        { href: '/dashboard/all-newsletters', label: 'All Newsletters' },
        { href: '/dashboard/subscribers', label: 'Subscribers' },
      ]
    },
    {
      href: '/dashboard/gallery',
      label: 'Gallery Management',
      icon: 'Gallery',
      children: [
        { href: '/dashboard/add-gallery', label: 'Add Gallery' },
        { href: '/dashboard/all-gallery', label: 'All Gallery' },
      ]
    },
    { href: '/dashboard/my-profile', label: 'Profile', icon: 'dashboard' },
  ]

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
            const active = pathname === i.href || pathname.startsWith(i.href + '/')
            const hasChildren = Array.isArray(i.children) && i.children.length > 0
            const isOpen = openKey === i.href

            return (
              <li key={i.href}>
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleSub(i.href)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md ${active ? 'bg-indigo-50 text-[#7b3306]' : 'text-white hover:bg-blue-800'}`}
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
                        {i.children.map(c => (
                          <li key={c.href}>
                            <Link href={c.href} className={`block px-3 py-2 rounded-md text-sm ${pathname === c.href ? 'bg-indigo-50 text-[#7b3306]' : 'text-white hover:bg-blue-600'}`}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link href={i.href} className={`flex items-center gap-3 px-3 py-2 rounded-md ${active ? 'bg-indigo-50 text-[#7b3306]' : 'text-white hover:bg-blue-800'}`}>
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
                const active = pathname === i.href || pathname.startsWith(i.href + '/')
                const hasChildren = Array.isArray(i.children) && i.children.length > 0
                const isOpen = openKey === i.href

                return (
                  <li key={i.href}>
                    {hasChildren ? (
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
                            {i.children.map(c => (
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
