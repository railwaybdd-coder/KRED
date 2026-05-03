import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      className="mt-32"
      style={{
        background: 'oklch(0.93 0.02 80 / 40%)',
        borderTop: '1px solid oklch(0.88 0.014 75)',
      }}
    >
      <div className="container-prose py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Branding — 2 cols */}
          <div className="md:col-span-2">
            <p className="font-display text-4xl font-700" style={{ color: 'oklch(0.22 0.018 60)', letterSpacing: '-0.02em' }}>
              KRED
            </p>
            <p className="mt-3 text-sm leading-relaxed max-w-xs" style={{ color: 'oklch(0.22 0.018 60 / 60%)' }}>
              Solution d'équipement par paiement 60–40 pour la communauté
              subsaharienne au Maroc.
            </p>
          </div>

          {/* Boutique */}
          <div>
            <p className="eyebrow mb-4">Boutique</p>
            <div className="flex flex-col gap-2.5">
              {[
                { to: '/catalogue', label: 'Catalogue' },
                { to: '/comment-ca-marche', label: 'Comment ça marche' },
                { to: '/contact', label: 'Commander' },
              ].map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm transition-opacity"
                  style={{ color: 'oklch(0.22 0.018 60 / 60%)' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-4">Contact</p>
            <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'oklch(0.22 0.018 60 / 60%)' }}>
              <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer"
                className="hover:opacity-100 transition-opacity">
                WhatsApp
              </a>
              <p>hello@kred.ma</p>
              <p>Rabat · Salé · Témara</p>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderTop: '1px solid oklch(0.88 0.014 75)',
            color: 'oklch(0.22 0.018 60 / 40%)',
          }}
        >
          <p>© {new Date().getFullYear()} KRED — Tous droits réservés</p>
          <p>Conçu au Maroc — pour la communauté subsaharienne et au-delà.</p>
        </div>
      </div>
    </footer>
  )
}
