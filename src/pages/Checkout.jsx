import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Check, ArrowLeft, ChevronRight, ShieldCheck, Clock } from 'lucide-react'
import { useProduit } from '../hooks/useProduits.js'
import { useAjouterClient } from '../hooks/useClients.js'
import { useAjouterCommande } from '../hooks/useCommandes.js'
import Navbar from '../components/Navbar.jsx'

const VILLES = ['Rabat', 'Salé', 'Témara']

export default function Checkout() {
  const { id } = useParams()
  const { data: produit, isLoading } = useProduit(id)
  const ajouterClient   = useAjouterClient()
  const ajouterCommande = useAjouterCommande()

  const [step, setStep]     = useState(0)
  const [done, setDone]     = useState(false)
  const [saving, setSaving] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const [form, setForm] = useState({ nom: '', whatsapp: '', ville: 'Rabat', adresse: '', notes: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const acompte = produit ? Math.round(produit.prix_vente * 0.6) : 0
  const reste   = produit ? produit.prix_vente - acompte : 0

  const waValid    = form.whatsapp.replace(/\D/g, '').length >= 6
  const step0OK    = form.nom.trim().length > 1 && waValid
  const step1OK    = form.adresse.trim().length >= 5

  async function handleConfirm() {
    if (!produit) return
    setSaving(true)
    setErrMsg('')
    try {
      const parts  = form.nom.trim().split(' ')
      const prenom = parts[0]
      const nom    = parts.slice(1).join(' ') || prenom

      const client = await ajouterClient.mutateAsync({
        nom, prenom,
        telephone: form.whatsapp,
        whatsapp:  form.whatsapp,
        adresse:   form.adresse,
        ville:     form.ville,
      })

      await ajouterCommande.mutateAsync({
        client_id:  client.id,
        produit_id: produit.id,
        prix_total: produit.prix_vente,
        notes:      form.notes || null,
      })

      setDone(true)
    } catch (err) {
      setErrMsg(err.message || 'Une erreur est survenue.')
    }
    setSaving(false)
  }

  /* ── Chargement ── */
  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf8f5' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #e0d9ce', borderTopColor: '#b45309', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </div>
  )

  if (!produit) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf8f5' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9c8f7a' }}>Produit introuvable</p>
      </div>
    </div>
  )

  /* ── Succès ── */
  if (done) return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 20, padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Check size={28} color="#fff" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 700, color: '#1a1612', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Réservation confirmée !
          </h2>
          <p style={{ color: '#6b5e4a', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
            Merci <strong>{form.nom.split(' ')[0]}</strong> ! On vous contacte sur WhatsApp <strong>({form.whatsapp})</strong> dans les 2h pour confirmer la livraison.
          </p>

          {/* Récap */}
          <div style={{ background: '#fffbf0', border: '1.5px solid #e8c97e', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', color: '#6b5e4a' }}>{produit.nom}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1612' }}>{produit.prix_vente} DH</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '6px 10px', border: '1px solid #f0e4c0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#9c8f7a', textTransform: 'uppercase', fontWeight: 600 }}>À la livraison</div>
                <div style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.1rem', color: '#b45309' }}>{acompte} DH</div>
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '6px 10px', border: '1px solid #f0e4c0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#9c8f7a', textTransform: 'uppercase', fontWeight: 600 }}>Mois suivant</div>
                <div style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.1rem', color: '#1a1612' }}>{reste} DH</div>
              </div>
            </div>
          </div>

          <Link to="/catalogue" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#b45309', textDecoration: 'underline', textUnderlineOffset: 4 }}>
            Voir d'autres produits →
          </Link>
        </div>
      </div>
    </div>
  )

  /* ── Formulaire ── */
  const inputStyle = {
    width: '100%', border: '1.5px solid #e0d9ce', borderRadius: 10,
    padding: '0.75rem 1rem', fontSize: '1rem', background: '#fff',
    color: '#1a1612', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
    WebkitAppearance: 'none',
  }

  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1a1612', marginBottom: '0.4rem' }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* ── Mini bande produit sticky mobile ── */}
      <div style={{ background: '#1a1612', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'sticky', top: 64, zIndex: 20 }}>
        {produit.photos?.[0] && (
          <img src={produit.photos[0]} alt={produit.nom} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.15)' }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{produit.nom}</p>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>{acompte} DH</span> à la livraison + {reste} DH
          </p>
        </div>
        {/* Stepper compact */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i <= step ? '#f59e0b' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      <main style={{ flex: 1, padding: '1.5rem 1rem 6rem', maxWidth: 540, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Lien retour */}
        <Link to={`/produit/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 600, color: '#9c8f7a', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={13} /> Retour au produit
        </Link>

        {/* Titre étape */}
        <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, color: '#1a1612', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          {step === 0 ? 'Vos coordonnées' : step === 1 ? 'Votre adresse' : 'Confirmez'}
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#9c8f7a', marginBottom: '1.75rem' }}>
          Étape {step + 1} sur 3 · {step === 0 ? 'Pour vous contacter' : step === 1 ? 'Pour livrer votre commande' : 'Vérifiez puis confirmez'}
        </p>

        {/* ── ÉTAPE 0 ── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Votre nom complet *</label>
              <input
                style={inputStyle}
                placeholder="Prénom Nom"
                value={form.nom}
                onChange={e => set('nom', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#b45309'}
                onBlur={e => e.target.style.borderColor = '#e0d9ce'}
              />
            </div>
            <div>
              <label style={labelStyle}>Numéro WhatsApp *</label>
              <input
                style={inputStyle}
                placeholder="06 XX XX XX XX"
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value)}
                type="tel"
                inputMode="tel"
                onFocus={e => e.target.style.borderColor = '#b45309'}
                onBlur={e => e.target.style.borderColor = '#e0d9ce'}
              />
              <p style={{ fontSize: '0.72rem', color: '#9c8f7a', marginTop: '0.3rem' }}>
                N'importe quel indicatif (+212, +33, 06, 07…)
              </p>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 1 ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Ville *</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.ville}
                onChange={e => set('ville', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#b45309'}
                onBlur={e => e.target.style.borderColor = '#e0d9ce'}
              >
                {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Adresse de livraison *</label>
              <textarea
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
                rows={3}
                placeholder="Quartier, rue, numéro, point de repère…"
                value={form.adresse}
                onChange={e => set('adresse', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#b45309'}
                onBlur={e => e.target.style.borderColor = '#e0d9ce'}
              />
            </div>
            <div>
              <label style={labelStyle}>Notes (optionnel)</label>
              <input
                style={inputStyle}
                placeholder="Code d'entrée, étage, instructions…"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#b45309'}
                onBlur={e => e.target.style.borderColor = '#e0d9ce'}
              />
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 — Récap ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* Fiche produit */}
            <div style={{ background: '#fffbf0', border: '1.5px solid #e8c97e', borderRadius: 14, padding: '1rem 1.125rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                Votre commande
              </p>
              <p style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: '1rem', color: '#1a1612', marginBottom: '0.75rem' }}>{produit.nom}</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '8px 10px', border: '1px solid #f0e4c0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: '#9c8f7a', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>À la livraison</div>
                  <div style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.15rem', color: '#b45309' }}>{acompte} DH</div>
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '8px 10px', border: '1px solid #f0e4c0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: '#9c8f7a', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>+30 jours</div>
                  <div style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.15rem', color: '#1a1612' }}>{reste} DH</div>
                </div>
              </div>
            </div>

            {/* Infos livraison */}
            <div style={{ background: '#fff', border: '1px solid #ede9e0', borderRadius: 14, padding: '1rem 1.125rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Nom',      value: form.nom },
                { label: 'WhatsApp', value: form.whatsapp },
                { label: 'Ville',    value: form.ville },
                { label: 'Adresse',  value: form.adresse },
                form.notes && { label: 'Notes', value: form.notes },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #f5f0e8', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#9c8f7a', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1a1612', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Garanties */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { icon: ShieldCheck, text: 'Aucun frais de dossier' },
                { icon: Clock,       text: 'Confirmation WhatsApp sous 2h' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={14} color="#16a34a" />
                  <span style={{ fontSize: '0.78rem', color: '#6b5e4a' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Erreur */}
            {errMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#dc2626' }}>
                ⚠️ {errMsg}
              </div>
            )}
          </div>
        )}

        {/* ── NAVIGATION FIXE EN BAS ── */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #ede9e0', padding: '0.875rem 1.25rem', display: 'flex', gap: '0.75rem', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ padding: '0 1.25rem', height: 52, borderRadius: 12, border: '1.5px solid #e0d9ce', background: 'transparent', fontSize: '0.82rem', fontWeight: 600, color: '#6b5e4a', cursor: 'pointer', flexShrink: 0 }}
            >
              ← Retour
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={() => {
                const ok = step === 0 ? step0OK : step1OK
                if (ok) setStep(s => s + 1)
              }}
              disabled={step === 0 ? !step0OK : !step1OK}
              style={{
                flex: 1, height: 52, borderRadius: 12, border: 'none',
                background: (step === 0 ? step0OK : step1OK) ? '#1a1612' : '#e0d9ce',
                color: (step === 0 ? step0OK : step1OK) ? '#fff' : '#a09080',
                fontSize: '0.9rem', fontWeight: 700, cursor: (step === 0 ? step0OK : step1OK) ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'background 0.2s',
              }}
            >
              Continuer <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={saving}
              style={{
                flex: 1, height: 52, borderRadius: 12, border: 'none',
                background: saving ? '#e0d9ce' : '#b45309',
                color: saving ? '#a09080' : '#fff',
                fontSize: '0.9rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'background 0.2s',
              }}
            >
              {saving ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Check size={16} /> Confirmer la réservation
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
