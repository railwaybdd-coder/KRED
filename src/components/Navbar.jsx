import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const liens = [
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/comment-ca-marche', label: 'Comment ça marche' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        background: 'oklch(0.975 0.012 85 / 88%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid oklch(0.88 0.014 75 / 60%)',
      }}
    >
      <div className="container-prose h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="font-display text-2xl font-700 tracking-tight" style={{ color: 'oklch(0.22 0.018 60)' }}>
            KRED
          </span>
          <span className="hidden md:inline eyebrow" style={{ letterSpacing: '0.22em' }}>
            équipez-vous
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {liens.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium transition-opacity"
              style={{
                color: 'oklch(0.22 0.018 60)',
                opacity: pathname === l.to ? 1 : 0.6,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = pathname === l.to ? '1' : '0.6'}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/catalogue" className="pill-dark" style={{ fontSize: '0.7rem' }}>
            Voir le catalogue
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'oklch(0.22 0.018 60)' }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-4 py-4 flex flex-col gap-1"
          style={{
            background: 'oklch(0.975 0.012 85)',
            borderColor: 'oklch(0.88 0.014 75)',
          }}
        >
          {liens.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                color: pathname === l.to ? 'oklch(0.62 0.14 45)' : 'oklch(0.22 0.018 60)',
                background: pathname === l.to ? 'oklch(0.62 0.14 45 / 8%)' : 'transparent',
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/catalogue"
            onClick={() => setOpen(false)}
            className="pill-dark mt-2 justify-center"
          >
            Voir le catalogue
          </Link>
        </div>
      )}
    </nav>
  )
}
