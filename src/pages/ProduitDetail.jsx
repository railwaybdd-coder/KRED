import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck, Truck, Clock, RotateCcw } from 'lucide-react'
import { useProduit } from '../hooks/useProduits.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const ETATS = {
  neuf:              '✨ Neuf',
  occasion_bon:      '👍 Bon état',
  occasion_tres_bon: '⭐ Très bon état',
}

const GARANTIES = [
  { icon: ShieldCheck, label: 'Produit vérifié par nos experts' },
  { icon: Truck,       label: 'Livraison sous 48 h' },
  { icon: Clock,       label: 'Garantie technique incluse' },
  { icon: RotateCcw,   label: 'Annulation gratuite avant livraison' },
]

export default function ProduitDetail() {
  const { id }  = useParams()
  const navigate = useNavigate()
  const { data: produit, isLoading, error } = useProduit(id)
  const [photoIdx, setPhotoIdx] = useState(0)

  if (isLoading) return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.975 0.012 85)' }}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '2px solid oklch(0.88 0.014 75)',
          borderTopColor: 'oklch(0.62 0.14 45)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    </div>
  )

  if (error || !produit) return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.975 0.012 85)' }}>
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4" style={{ color: 'oklch(0.22 0.018 60 / 45%)' }}>
        <p style={{ fontSize: '3rem' }}>😕</p>
        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Produit introuvable</p>
        <Link to="/catalogue" style={{ color: 'oklch(0.62 0.14 45)', fontWeight: 600, fontSize: '0.875rem' }}>
          ← Retour au catalogue
        </Link>
      </div>
    </div>
  )

  const photos  = produit.photos?.length ? produit.photos : []
  const acompte = Math.round(produit.prix_vente * 0.6)
  const reste   = produit.prix_vente - acompte

  const prev = () => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)
  const next = () => setPhotoIdx(i => (i + 1) % photos.length)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.975 0.012 85)' }}>
      <Navbar />

      <main className="container-prose py-12 flex-1">
        {/* Retour */}
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-1.5 mb-8"
          style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'oklch(0.22 0.018 60 / 50%)' }}
        >
          <ArrowLeft size={13} /> Retour au catalogue
        </Link>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Galerie — 7/12 */}
          <div className="md:col-span-7">
            <div
              style={{
                aspectRatio: '4/5',
                background: 'oklch(0.93 0.02 80)',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1rem',
              }}
            >
              {photos.length > 0 ? (
                <>
                  <img
                    src={photos[photoIdx]}
                    alt={produit.nom}
                    className="w-full h-full object-cover"
                    style={{ transition: 'opacity 0.3s' }}
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        style={{
                          position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'oklch(0.975 0.012 85 / 85%)', backdropFilter: 'blur(6px)',
                          border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 2px 8px oklch(0.22 0.018 60 / 10%)',
                        }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={next}
                        style={{
                          position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'oklch(0.975 0.012 85 / 85%)', backdropFilter: 'blur(6px)',
                          border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 2px 8px oklch(0.22 0.018 60 / 10%)',
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                        {photos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPhotoIdx(i)}
                            style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              background: i === photoIdx ? 'oklch(0.975 0.012 85)' : 'oklch(0.975 0.012 85 / 50%)',
                              border: 'none', cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '5rem', color: 'oklch(0.22 0.018 60 / 15%)' }}>📦</div>
              )}
            </div>

            {photos.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {photos.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setPhotoIdx(i)}
                    style={{
                      width: '64px', height: '64px', borderRadius: '0.625rem',
                      overflow: 'hidden',
                      border: i === photoIdx ? '2px solid oklch(0.62 0.14 45)' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos — 5/12 sticky */}
          <div className="md:col-span-5 md:sticky" style={{ top: '6rem', alignSelf: 'start' }}>
            {/* En-tête */}
            <p className="eyebrow mb-2">{produit.categorie}</p>
            <h1
              className="font-display font-700 mb-2"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.02em', color: 'oklch(0.22 0.018 60)', lineHeight: 1.1 }}
            >
              {produit.nom}
            </h1>
            {produit.etat && (
              <p style={{ fontSize: '0.8rem', color: 'oklch(0.22 0.018 60 / 50%)', marginBottom: '1.5rem' }}>
                {ETATS[produit.etat] ?? produit.etat}
              </p>
            )}

            {/* Carte prix */}
            <div className="kred-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <div
                className="flex items-center justify-between pb-4 mb-4 hairline"
              >
                <span style={{ fontSize: '0.75rem', color: 'oklch(0.22 0.018 60 / 50%)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Prix total
                </span>
                <span
                  className="font-display font-700"
                  style={{ fontSize: '2rem', color: 'oklch(0.22 0.018 60)', letterSpacing: '-0.02em' }}
                >
                  {produit.prix_vente} DH
                </span>
              </div>

              {/* Module 60/40 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div
                  style={{
                    background: 'oklch(0.62 0.14 45 / 8%)',
                    border: '1px solid oklch(0.62 0.14 45 / 20%)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'oklch(0.62 0.14 45)',
                      color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    1
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'oklch(0.22 0.018 60 / 50%)', marginBottom: '0.25rem' }}>Aujourd'hui</p>
                  <p
                    className="font-display font-700"
                    style={{ fontSize: '1.4rem', color: 'oklch(0.62 0.14 45)', letterSpacing: '-0.02em' }}
                  >
                    {acompte} DH
                  </p>
                  <p style={{ fontSize: '0.6rem', color: 'oklch(0.62 0.14 45 / 70%)', marginTop: '0.25rem' }}>À la livraison · 60 %</p>
                </div>

                <div
                  style={{
                    background: 'oklch(0.94 0.014 80)',
                    border: '1px solid oklch(0.88 0.014 75)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'oklch(0.22 0.018 60)',
                      color: 'oklch(0.975 0.012 85)', fontSize: '0.7rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    2
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'oklch(0.22 0.018 60 / 50%)', marginBottom: '0.25rem' }}>Dans 30 j</p>
                  <p
                    className="font-display font-700"
                    style={{ fontSize: '1.4rem', color: 'oklch(0.22 0.018 60)', letterSpacing: '-0.02em' }}
                  >
                    {reste} DH
                  </p>
                  <p style={{ fontSize: '0.6rem', color: 'oklch(0.22 0.018 60 / 45%)', marginTop: '0.25rem' }}>Solde · 40 %</p>
                </div>
              </div>

              {/* Barre duale */}
              <div className="bar-dual mb-1.5" />
              <div className="flex justify-between" style={{ fontSize: '0.6rem', color: 'oklch(0.22 0.018 60 / 40%)' }}>
                <span>60 %</span><span>40 %</span>
              </div>

              {/* CTA Réserver */}
              <button
                onClick={() => navigate(`/checkout/${produit.id}`)}
                className="w-full mt-5"
                style={{
                  background: 'oklch(0.22 0.018 60)',
                  color: 'oklch(0.975 0.012 85)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '1rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'oklch(0.32 0.06 155)'}
                onMouseLeave={e => e.currentTarget.style.background = 'oklch(0.22 0.018 60)'}
              >
                Réserver maintenant
              </button>
              <p style={{ fontSize: '0.7rem', color: 'oklch(0.22 0.018 60 / 40%)', textAlign: 'center', marginTop: '0.75rem' }}>
                Sans carte · Validation WhatsApp en 5 min · 0 intérêt
              </p>
            </div>

            {/* Garanties */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {GARANTIES.map(g => (
                <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <g.icon size={15} style={{ color: 'oklch(0.62 0.14 45)', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.8rem', color: 'oklch(0.22 0.018 60 / 60%)' }}>{g.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* À propos */}
        {produit.description && (
          <div className="mt-20 hairline pt-16 grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <p className="eyebrow mb-2">Description</p>
              <h2
                className="font-display font-700"
                style={{ fontSize: '1.75rem', letterSpacing: '-0.02em', color: 'oklch(0.22 0.018 60)' }}
              >
                À propos de ce produit
              </h2>
            </div>
            <div className="md:col-span-8">
              <p style={{ fontSize: '0.95rem', color: 'oklch(0.22 0.018 60 / 60%)', lineHeight: 1.75 }}>
                {produit.description}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
