import { Link } from 'react-router-dom'
import {
  Zap,
  ChevronRight,
  Package,
  Truck,
  Calendar,
  BadgeCheck,
  Info
} from 'lucide-react'

const CATS = {
  mobilier:       'Mobilier',
  electromenager: 'Électroménager',
  electronique:   'Électronique',
}

const ETATS = {
  neuf:               { label: 'Neuf',    bg: '#d1fae5', color: '#065f46' },
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
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid #e8e2d9',
        width: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        boxSizing: 'border-box', // Sécurité pour le padding
      }}
    >
      {/* ── PHOTO ── */}
      <div style={{
        position: 'relative',
        aspectRatio: '4/3',
        background: '#f5f2ed',
        overflow: 'hidden',
      }}>
        {produit.photos?.[0]
          ? <img
              src={produit.photos[0]}
              alt={produit.nom}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={32} color="#c5bdb3" strokeWidth={1.5} />
            </div>
        }

        {/* Badges sur image - Ajout de flexWrap pour éviter le débordement */}
        <div style={{
          position: 'absolute', top: 10, left: 10, right: 10,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6
        }}>
          {etat && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.65rem', fontWeight: 700,
              background: etat.bg, color: etat.color,
              padding: '4px 10px', borderRadius: 99,
              whiteSpace: 'nowrap'
            }}>
              <BadgeCheck size={10} strokeWidth={2.5} />
              {etat.label}
            </span>
          )}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: '0.6rem', fontWeight: 800,
            background: 'rgba(26, 22, 18, 0.9)', color: '#facc15',
            padding: '4px 10px', borderRadius: 99,
            backdropFilter: 'blur(4px)',
            whiteSpace: 'nowrap'
          }}>
            <Zap size={10} fill="#facc15" strokeWidth={0} />
            48H
          </span>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
        
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: '0.6rem', fontWeight: 700, color: '#9c8f7a',
            textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {cat}
          </p>
          <h3 style={{
            fontWeight: 600, fontSize: '1rem', color: '#1a1612',
            lineHeight: 1.2, margin: 0, height: '2.4em', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
          }}>
            {produit.nom}
          </h3>
        </div>

        {/* Prix Total Discret - Ajout de flexWrap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
           <span style={{ fontSize: '0.75rem', color: '#9c8f7a' }}>Prix total :</span>
           <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1612', textDecoration: 'underline decoration-dotted #ccc' }}>
             {produit.prix_vente} DH
           </span>
        </div>

        {/* ── MISE EN AVANT DU PAIEMENT ── */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: 12,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          minWidth: 0
        }}>
          {/* Bloc Livraison - Ajout de flexWrap pour les petits écrans */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 'fit-content' }}>
              <span style={{ 
                display: 'flex', alignItems: 'center', gap: 4, 
                fontSize: '0.65rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' 
              }}>
                <Truck size={12} /> À la livraison
              </span>
              <span style={{ fontSize: '0.6rem', color: '#d97706' }}>Payez 60%</span>
            </div>
            <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309', lineHeight: 1 }}>
                {acompte}
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b45309', marginLeft: 2 }}>DH</span>
            </div>
          </div>

          <div style={{ height: '1px', background: '#fde68a', width: '100%' }} />

          {/* Bloc J+30 - Ajout de flexWrap */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ 
              display: 'flex', alignItems: 'center', gap: 4, 
              fontSize: '0.7rem', fontWeight: 600, color: '#6b5e4a' 
            }}>
              <Calendar size={12} /> Reste après 30j
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1612', marginLeft: 'auto' }}>
              {reste} <small style={{ fontSize: '0.6rem' }}>DH</small>
            </span>
          </div>
        </div>

        {/* Bouton Action */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#1a1612', color: '#fff',
            borderRadius: 12, padding: '12px 8px', // Padding latéral ajouté
            fontSize: '0.85rem', fontWeight: 700,
            marginTop: '4px',
            textAlign: 'center'
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>Commander</span> <ChevronRight size={16} />
        </div>

      </div>
    </Link>
  )
}