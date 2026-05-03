import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, Sparkles, ChevronRight, Zap, MessageCircle } from 'lucide-react'
import { useProduits } from '../hooks/useProduits.js'
import CarteProduit from '../components/CarteProduit.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const MARQUEE_ITEMS = ['Vérifié experts','Livraison 48h','0 frais dossier','WhatsApp sous 2h','0% intérêt','Paiement 2×','Rabat · Salé · Témara']

const CATEGORIES = [
  { label: 'Mobilier',        emoji: '🛋️',  filtre: 'mobilier' },
  { label: 'Électroménager',  emoji: '🧺',  filtre: 'electromenager' },
  { label: 'Électronique',    emoji: '📱',  filtre: 'electronique' },
  { label: 'Tout voir',       emoji: '→',   filtre: null },
]

const SQUELETTE = [...Array(6)].map((_, i) => (
  <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #ede9e0' }}>
    <div style={{ aspectRatio: '4/3', background: '#f5f2ec', animation: 'pulse 1.8s ease-in-out infinite' }} />
    <div style={{ padding: '11px 12px 12px' }}>
      <div style={{ height: 9, background: '#f5f2ec', borderRadius: 4, width: '40%', marginBottom: 5, animation: 'pulse 1.8s ease-in-out infinite' }} />
      <div style={{ height: 13, background: '#f5f2ec', borderRadius: 4, marginBottom: 4, animation: 'pulse 1.8s ease-in-out infinite' }} />
      <div style={{ height: 50, background: '#fff8ee', borderRadius: 9, border: '1.5px solid #e8c97e', marginTop: 8, animation: 'pulse 1.8s ease-in-out infinite' }} />
    </div>
  </div>
))

export default function Accueil() {
  const { data: produits, isLoading } = useProduits()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf8f5' }}>
      <Navbar />

      {/* ── HERO COMPACT style marketplace ── */}
      <section style={{ background: '#1a1612', padding: '0.75rem 1rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Message promo principal */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: '#f59e0b', color: '#1a1612',
                fontSize: '0.6rem', fontWeight: 900,
                padding: '3px 8px', borderRadius: 5,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                flexShrink: 0,
              }}>
                <Zap size={9} fill="#1a1612" /> KRED
              </span>
              <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(0.85rem, 3vw, 1.1rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                Payez en <span style={{ color: '#f59e0b' }}>2 fois</span> · 0% intérêt
              </p>
            </div>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
              60% à la livraison · 40% à 30 jours · Rabat, Salé, Témara
            </p>
          </div>

          {/* Stats mini */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { v: '48h', l: 'Livraison' },
              { v: '0 DH', l: 'Frais' },
            ].map(s => (
              <div key={s.l} style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 8, padding: '5px 10px',
                minWidth: 52,
              }}>
                <div style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '0.85rem', color: '#f59e0b', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link to="/catalogue" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: '#f59e0b', color: '#1a1612',
            fontWeight: 800, fontSize: '0.78rem',
            padding: '0.55rem 1.1rem', borderRadius: 9,
            textDecoration: 'none', flexShrink: 0,
            whiteSpace: 'nowrap',
          }}>
            Voir le catalogue <ChevronRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap" style={{ borderBottom: '1px solid #ede9e0', background: '#f5f2ec', padding: '0.5rem 0' }}>
        <div className="marquee-inner">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', paddingInline: '1rem', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9c8f7a' }}>
              {item} <span style={{ color: '#b45309' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── RACCOURCIS CATÉGORIES ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ede9e0', padding: '0.6rem 1rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              to={cat.filtre ? `/catalogue?categorie=${cat.filtre}` : '/catalogue'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#faf8f5', border: '1px solid #ede9e0',
                borderRadius: 20, padding: '5px 12px',
                fontSize: '0.72rem', fontWeight: 600,
                color: '#1a1612', textDecoration: 'none',
                whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbf0' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ede9e0'; e.currentTarget.style.background = '#faf8f5' }}
            >
              <span>{cat.emoji}</span> {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── PRODUITS ── */}
      <section style={{ padding: '1.25rem 1rem 2.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9c8f7a', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 2 }}>Disponible maintenant</p>
              <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 700, color: '#1a1612', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Nos produits
              </h2>
            </div>
            <Link to="/catalogue" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 700, color: '#b45309', textDecoration: 'none' }}>
              Tout voir <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{SQUELETTE}</div>
          ) : !produits?.length ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9c8f7a' }}>
              <p style={{ fontSize: '2.5rem' }}>📦</p>
              <p style={{ fontWeight: 600, marginTop: '0.75rem' }}>Aucun produit disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {produits.slice(0, 6).map(p => <CarteProduit key={p.id} produit={p} />)}
            </div>
          )}

          {produits?.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/catalogue" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid #1a1612', color: '#1a1612', fontWeight: 700, fontSize: '0.82rem', padding: '0.7rem 1.75rem', borderRadius: 12, textDecoration: 'none' }}>
                Voir tous les produits <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── PROMESSE 3 colonnes ── */}
      <section style={{ background: '#f5f2ec', borderTop: '1px solid #ede9e0', borderBottom: '1px solid #ede9e0', padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { icon: Sparkles, t: 'Produits vérifiés', d: 'Testés avant publication.' },
            { icon: ShieldCheck, t: 'Zéro frais cachés', d: '60% livraison, 40% à 30 jours.' },
            { icon: Truck, t: 'Livraison 48h', d: 'Directement chez vous.' },
          ].map(p => (
            <div key={p.t} style={{ background: '#fff', borderRadius: 14, padding: '1rem', border: '1px solid #ede9e0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(180,83,9,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <p.icon size={17} color="#b45309" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '0.9rem', color: '#1a1612' }}>{p.t}</p>
                <p style={{ fontSize: '0.75rem', color: '#6b5e4a', lineHeight: 1.4, marginTop: 1 }}>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ background: '#1a1612', borderRadius: 16, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                Une question ? On répond <span style={{ color: '#f59e0b' }}>sous 2h.</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>WhatsApp · Lun–Sam · 9h–19h</p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: '0.82rem', padding: '0.6rem 1.2rem', borderRadius: 10, textDecoration: 'none' }}>
                <MessageCircle size={14} /> WhatsApp
              </a>
              <Link to="/catalogue" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f59e0b', color: '#1a1612', fontWeight: 800, fontSize: '0.82rem', padding: '0.6rem 1.2rem', borderRadius: 10, textDecoration: 'none' }}>
                Catalogue <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
