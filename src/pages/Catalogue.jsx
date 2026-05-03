import { useState, useMemo } from 'react'
import {
  Search,
  X,
  ChevronRight,
  Zap,
  LayoutGrid,
  Sofa,
  WashingMachine,
  Smartphone,
  Package,
  Truck,
  CircleDollarSign,
  BadgeCheck,
} from 'lucide-react'
import { useProduits } from '../hooks/useProduits.js'
import CarteProduit from '../components/CarteProduit.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const CATEGORIES = [
  { value: null,             label: 'Tout',          Icon: LayoutGrid    },
  { value: 'mobilier',       label: 'Mobilier',       Icon: Sofa          },
  { value: 'electromenager', label: 'Électroménager', Icon: WashingMachine },
  { value: 'electronique',   label: 'Électronique',   Icon: Smartphone    },
]

const TRIS = [
  { value: 'default',   label: 'Par défaut' },
  { value: 'prix_asc',  label: 'Prix croissant' },
  { value: 'prix_desc', label: 'Prix décroissant' },
  { value: 'acompte',   label: 'Acompte le plus bas' },
]

const SQUELETTE = [...Array(8)].map((_, i) => (
  <div key={i} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #ede9e0' }}>
    <div style={{ aspectRatio: '1/1', background: '#f5f2ec', animation: 'pulse 1.8s ease-in-out infinite' }} />
    <div style={{ padding: '10px 11px 11px' }}>
      <div style={{ height: 9, background: '#f5f2ec', borderRadius: 4, width: '40%', marginBottom: 5, animation: 'pulse 1.8s ease-in-out infinite' }} />
      <div style={{ height: 13, background: '#f5f2ec', borderRadius: 4, marginBottom: 4, animation: 'pulse 1.8s ease-in-out infinite' }} />
      <div style={{ height: 50, background: '#fff8ee', borderRadius: 9, border: '1.5px solid #e8c97e', marginTop: 8, animation: 'pulse 1.8s ease-in-out infinite' }} />
    </div>
  </div>
))

export default function Catalogue() {
  const [categorie, setCategorie] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [tri, setTri] = useState('default')

  const { data: produits, isLoading } = useProduits(categorie)

  const filtres = useMemo(() => {
    let list = produits ?? []
    if (recherche.trim()) {
      const q = recherche.toLowerCase()
      list = list.filter(p => p.nom.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q))
    }
    switch (tri) {
      case 'prix_asc':  return [...list].sort((a, b) => a.prix_vente - b.prix_vente)
      case 'prix_desc': return [...list].sort((a, b) => b.prix_vente - a.prix_vente)
      case 'acompte':   return [...list].sort((a, b) => Math.round(a.prix_vente * 0.6) - Math.round(b.prix_vente * 0.6))
      default:          return list
    }
  }, [produits, recherche, tri])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf8f5' }}>
      <Navbar />

      {/* ── HEADER ── */}
      <div style={{ background: '#1a1612', padding: '1.5rem 1.25rem 1.25rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.5rem' }}>
            <Zap size={12} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Livraison 48h · Paiement 2×
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Catalogue{' '}
              {!isLoading && <span style={{ fontSize: '0.5em', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>({filtres.length})</span>}
            </h1>
            {/* Barre de recherche */}
            <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c8f7a' }} />
              <input
                type="text"
                placeholder="Chercher…"
                value={recherche}
                onChange={e => setRecherche(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '0.6rem 2.25rem', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
              {recherche && (
                <button onClick={() => setRecherche('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9c8f7a', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTRES STICKY ── */}
      <div style={{ position: 'sticky', top: 64, zIndex: 30, background: 'rgba(250,248,245,0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #ede9e0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0.6rem 1rem', display: 'flex', gap: '0.4rem', overflowX: 'auto', alignItems: 'center', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const active = categorie === cat.value
            return (
              <button
                key={cat.label}
                onClick={() => setCategorie(cat.value)}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                  padding: '0.35rem 0.875rem', borderRadius: 9999,
                  fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                  border: active ? '1.5px solid #1a1612' : '1.5px solid #e0d9ce',
                  background: active ? '#1a1612' : 'transparent',
                  color: active ? '#fff' : '#6b5e4a',
                  transition: 'all 0.15s',
                }}
              >
                <cat.Icon size={13} strokeWidth={1.8} />
                {cat.label}
              </button>
            )
          })}
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <select
              value={tri}
              onChange={e => setTri(e.target.value)}
              style={{ border: '1.5px solid #e0d9ce', borderRadius: 8, padding: '0.35rem 0.7rem', fontSize: '0.72rem', fontWeight: 600, color: '#6b5e4a', background: 'transparent', cursor: 'pointer', outline: 'none' }}
            >
              {TRIS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── GRILLE ── */}
      <main style={{ flex: 1, padding: '1.25rem 1rem 3rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{SQUELETTE}</div>
          ) : filtres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9c8f7a' }}>
              <Search size={40} strokeWidth={1.2} style={{ margin: '0 auto 0.75rem', opacity: 0.35 }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: '#1a1612' }}>Aucun produit trouvé</p>
              <button onClick={() => { setRecherche(''); setCategorie(null) }} style={{ marginTop: '1.25rem', padding: '0.6rem 1.5rem', borderRadius: 12, background: '#1a1612', color: '#fff', border: 'none', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                Voir tout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filtres.map(p => <CarteProduit key={p.id} produit={p} />)}
            </div>
          )}
        </div>
      </main>

      {/* ── Bandeau bas ── */}
      <div style={{ background: '#1a1612', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center', alignItems: 'center' }}>
          {[
            { Icon: BadgeCheck,       label: 'Produits vérifiés' },
            { Icon: Truck,            label: 'Livraison 48h' },
            { Icon: CircleDollarSign, label: 'Paiement 2× · 0%' },
            { Icon: Package,          label: '0 frais dossier' },
          ].map(({ Icon, label }) => (
            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
              <Icon size={13} color="rgba(245,158,11,0.8)" strokeWidth={1.8} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
