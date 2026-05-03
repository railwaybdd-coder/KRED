import { Link } from 'react-router-dom'
import {
  Zap,
  ChevronRight,
  Package,
  Truck,
  Calendar,
  CircleDollarSign,
  BadgeCheck,
} from 'lucide-react'

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
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid #e8e2d9',
        minWidth: 0,
        width: '100%',
      }}
    >

      {/* ── PHOTO ── */}
      <div style={{
        position: 'relative',
        aspectRatio: '4/3',
        background: '#f5f2ed',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {produit.photos?.[0]
          ? <img
              src={produit.photos[0]}
              alt={produit.nom}
              loading="lazy"
              className="kred-card-v2-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={32} color="#c5bdb3" strokeWidth={1.5} />
            </div>
        }

        {/* badges */}
        <div style={{
          position: 'absolute', top: 7, left: 7, right: 7,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          pointerEvents: 'none',
        }}>
          {etat
            ? <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: '0.58rem', fontWeight: 700,
                background: etat.bg, color: etat.color,
                padding: '3px 7px', borderRadius: 99,
                whiteSpace: 'nowrap',
              }}>
                <BadgeCheck size={8} strokeWidth={2.5} />
                {etat.label}
              </span>
            : <span />
          }
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            fontSize: '0.56rem', fontWeight: 800,
            background: '#1a1612', color: '#facc15',
            padding: '3px 6px', borderRadius: 99,
            whiteSpace: 'nowrap',
          }}>
            <Zap size={7} fill="#facc15" color="#facc15" strokeWidth={0} />
            48H
          </span>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{
        padding: '9px 10px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}>

        {/* Catégorie */}
        <p style={{
          fontSize: '0.52rem', fontWeight: 700, color: '#b45309',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          margin: 0,
        }}>
          {cat}
        </p>

        {/* Nom — 2 lignes max */}
        <p style={{
          fontFamily: 'var(--font-family-display)',
          fontWeight: 600,
          fontSize: 'clamp(0.78rem, 3.5vw, 0.92rem)',
          color: '#1a1612',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.6em',
          wordBreak: 'break-word',
          margin: 0,
        }}>
          {produit.nom}
        </p>

        {/* Prix total + badge 0% */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, minWidth: 0 }}>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 900,
              fontSize: 'clamp(1.05rem, 5vw, 1.45rem)',
              color: '#1a1612',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}>
              {produit.prix_vente}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9c8f7a', flexShrink: 0 }}>DH</span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            fontSize: '0.5rem', fontWeight: 700,
            color: '#15803d', background: '#dcfce7',
            padding: '2px 5px', borderRadius: 99,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <CircleDollarSign size={8} strokeWidth={2} />
            0% intérêt
          </span>
        </div>

        {/* ── Bloc paiement : 2 lignes ── */}
        <div style={{
          background: '#faf8f5',
          border: '1px solid #ede8df',
          borderRadius: 9,
          padding: '6px 8px',
        }}>
          <p style={{
            fontSize: '0.49rem', fontWeight: 700, color: '#9c8f7a',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 5, margin: '0 0 5px',
          }}>
            Paiement en 2 fois
          </p>

          {/* Ligne 1 : livraison */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 3, gap: 4,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: '0.49rem', color: '#9c8f7a',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              <Truck size={8} strokeWidth={2} />
              Livraison
            </span>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: 'clamp(0.78rem, 4vw, 0.95rem)',
              color: '#b45309',
              whiteSpace: 'nowrap',
            }}>
              {acompte}<span style={{ fontSize: '0.52rem', fontWeight: 600, marginLeft: 1 }}>DH</span>
            </span>
          </div>

          {/* Ligne 2 : J+30 */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: '0.49rem', color: '#9c8f7a',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              <Calendar size={8} strokeWidth={2} />
              J+30
            </span>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: 'clamp(0.78rem, 4vw, 0.95rem)',
              color: '#1a1612',
              whiteSpace: 'nowrap',
            }}>
              {reste}<span style={{ fontSize: '0.52rem', fontWeight: 600, color: '#6b5e4a', marginLeft: 1 }}>DH</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div
          className="kred-cta-btn"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            background: '#1a1612', color: '#fff',
            borderRadius: 10, padding: '10px 0',
            fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.04em',
            transition: 'background 0.15s, transform 0.1s',
            marginTop: 'auto',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Réserver <ChevronRight size={12} strokeWidth={2.5} />
        </div>

      </div>
    </Link>
  )
}