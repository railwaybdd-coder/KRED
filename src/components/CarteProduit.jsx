import { Link } from 'react-router-dom'
import { Zap, ChevronRight } from 'lucide-react'

const CATS = {
  mobilier:       'Mobilier',
  electromenager: 'Électroménager',
  electronique:   'Électronique',
}

const ETATS = {
  neuf:              { label: 'Neuf',     bg: '#d1fae5', color: '#065f46' },
  occasion_tres_bon: { label: 'Très bon', bg: '#dbeafe', color: '#1e3a8a' },
  occasion_bon:      { label: 'Bon état', bg: '#fef9c3', color: '#854d0e' },
}

export default function CarteProduit({ produit }) {
  const acompte = Math.round(produit.prix_vente * 0.6)
  const reste   = produit.prix_vente - acompte
  const etat    = ETATS[produit.etat]
  const cat     = CATS[produit.categorie] ?? produit.categorie

  return (
    <Link
      to={`/produit/${produit.id}`}
      className="kred-card-v2"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e8e2d9' }}
    >

      {/* ── PHOTO ── */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f5f2ed', overflow: 'hidden', flexShrink: 0 }}>
        {produit.photos?.[0]
          ? <img
              src={produit.photos[0]}
              alt={produit.nom}
              loading="lazy"
              className="kred-card-v2-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.8rem', opacity: 0.3 }}>📦</span>
            </div>
        }

        {/* badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'none' }}>
          {etat
            ? <span style={{ fontSize: '0.6rem', fontWeight: 700, background: etat.bg, color: etat.color, padding: '3px 9px', borderRadius: 99, letterSpacing: '0.02em' }}>{etat.label}</span>
            : <span />
          }
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.58rem', fontWeight: 800, background: '#1a1612', color: '#facc15', padding: '3px 8px', borderRadius: 99, letterSpacing: '0.06em' }}>
            <Zap size={7} fill="#facc15" color="#facc15" strokeWidth={3} />48H
          </span>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ padding: '12px 13px 13px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>

        {/* Catégorie + nom */}
        <div>
          <p style={{ fontSize: '0.58rem', fontWeight: 600, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>{cat}</p>
          <p style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 600, fontSize: '0.95rem', color: '#1a1612', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5em',
          }}>{produit.nom}</p>
        </div>

        {/* Prix + tagline */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontFamily: 'var(--font-family-display)', fontWeight: 900, fontSize: '1.55rem', color: '#1a1612', lineHeight: 1 }}>{produit.prix_vente}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9c8f7a' }}>DH</span>
          </div>
          <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#15803d', background: '#dcfce7', padding: '2px 7px', borderRadius: 99 }}>0% intérêt</span>
        </div>

        {/* Paiement en 2× */}
        <div style={{ background: '#faf8f5', border: '1px solid #ede8df', borderRadius: 11, padding: '9px 11px' }}>
          <p style={{ fontSize: '0.56rem', fontWeight: 600, color: '#9c8f7a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Paiement en 2 fois</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* 1er versement */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.54rem', color: '#9c8f7a', marginBottom: 2 }}>À la livraison</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.15rem', color: '#b45309', lineHeight: 1 }}>{acompte}</span>
                <span style={{ fontSize: '0.6rem', color: '#b45309', fontWeight: 600 }}>DH</span>
              </div>
            </div>

            {/* flèche */}
            <div style={{ color: '#d4ccc0', fontSize: '0.7rem' }}>→</div>

            {/* 2e versement */}
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ fontSize: '0.54rem', color: '#9c8f7a', marginBottom: 2 }}>J+30</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.15rem', color: '#1a1612', lineHeight: 1 }}>{reste}</span>
                <span style={{ fontSize: '0.6rem', color: '#6b5e4a', fontWeight: 600 }}>DH</span>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="kred-cta-btn" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: '#1a1612', color: '#fff',
          borderRadius: 11, padding: '11px 0',
          fontSize: '0.75rem', fontWeight: 700,
          letterSpacing: '0.04em',
          transition: 'background 0.15s, transform 0.1s',
          marginTop: 'auto',
          cursor: 'pointer',
        }}>
          Réserver <ChevronRight size={13} strokeWidth={2.5} />
        </div>

      </div>
    </Link>
  )
}
