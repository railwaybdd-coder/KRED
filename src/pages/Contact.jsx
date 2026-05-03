import { useState } from 'react'
import { useProduits } from '../hooks/useProduits.js'
import { useAjouterCommande } from '../hooks/useCommandes.js'
import { useAjouterClient } from '../hooks/useClients.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { Check, MessageCircle, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const formVide = { nom: '', prenom: '', telephone: '', whatsapp: '', adresse: '', ville: 'Rabat', produit_id: '', notes: '' }

export default function Contact() {
  const [form, setForm]       = useState(formVide)
  const [envoye, setEnvoye]   = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: produits }    = useProduits()
  const ajouterClient         = useAjouterClient()
  const ajouterCommande       = useAjouterCommande()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.produit_id) return toast.error('Sélectionne un produit')
    setLoading(true)
    try {
      const client = await ajouterClient.mutateAsync({
        nom: form.nom, prenom: form.prenom,
        telephone: form.telephone,
        whatsapp: form.whatsapp || form.telephone,
        adresse: form.adresse, ville: form.ville,
      })
      const produit = produits?.find(p => p.id === form.produit_id)
      if (!produit) throw new Error('Produit introuvable')
      await ajouterCommande.mutateAsync({ client_id: client.id, produit_id: form.produit_id, prix_total: produit.prix_vente, notes: form.notes })
      setEnvoye(true)
    } catch (err) {
      toast.error(err.message || 'Erreur')
    }
    setLoading(false)
  }

  if (envoye) return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.975 0.012 85)' }}>
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div
          className="kred-card text-center"
          style={{ maxWidth: '440px', width: '100%', padding: '3rem 2.5rem' }}
        >
          <div
            style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'oklch(0.62 0.14 45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <Check size={26} color="#fff" strokeWidth={2.5} />
          </div>
          <h2 className="font-display font-700 mb-2" style={{ fontSize: '2rem', color: 'oklch(0.22 0.018 60)', letterSpacing: '-0.02em' }}>
            Merci.
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'oklch(0.22 0.018 60 / 55%)', lineHeight: 1.7 }}>
            Votre message est arrivé. On vous écrit sous 24 h.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.975 0.012 85)' }}>
      <Navbar />

      <main className="container-prose py-16 flex-1">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Gauche */}
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">Contact</p>
            <h1 className="font-display font-700 mb-4" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', letterSpacing: '-0.025em', color: 'oklch(0.22 0.018 60)', lineHeight: 1.05 }}>
              Parlons-en.
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'oklch(0.22 0.018 60 / 55%)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '380px' }}>
              Une question sur un produit, sur le paiement ou sur la livraison ? On est là.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: MessageCircle, label: '+212 6 00 00 00 00', sub: 'Réponse sous 1 h' },
                { icon: Mail,          label: 'hello@kred.ma',      sub: 'Email' },
                { icon: MapPin,        label: 'Rabat · Salé · Témara', sub: 'Zone de livraison' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'oklch(0.62 0.14 45 / 10%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <c.icon size={16} style={{ color: 'oklch(0.62 0.14 45)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'oklch(0.22 0.018 60)' }}>{c.label}</p>
                    <p style={{ fontSize: '0.72rem', color: 'oklch(0.22 0.018 60 / 45%)' }}>{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire droite */}
          <div className="md:col-span-7">
            <form onSubmit={handleSubmit} className="kred-card" style={{ padding: '2.5rem' }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="eyebrow mb-1.5">Prénom *</label>
                  <input className="kred-input" required placeholder="Mamadou" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
                </div>
                <div>
                  <label className="eyebrow mb-1.5">Nom *</label>
                  <input className="kred-input" required placeholder="Diallo" value={form.nom} onChange={e => set('nom', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="eyebrow mb-1.5">Téléphone *</label>
                  <input className="kred-input" required type="tel" placeholder="06 XX XX XX XX" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
                </div>
                <div>
                  <label className="eyebrow mb-1.5">WhatsApp</label>
                  <input className="kred-input" type="tel" placeholder="Si différent" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <label className="eyebrow mb-1.5">Produit souhaité *</label>
                <select className="kred-input" required value={form.produit_id} onChange={e => set('produit_id', e.target.value)}>
                  <option value="">— Choisir —</option>
                  {produits?.map(p => <option key={p.id} value={p.id}>{p.nom} — {p.prix_vente} DH</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="eyebrow mb-1.5">Adresse *</label>
                <input className="kred-input" required placeholder="N° rue, quartier…" value={form.adresse} onChange={e => set('adresse', e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="eyebrow mb-1.5">Ville *</label>
                <select className="kred-input" value={form.ville} onChange={e => set('ville', e.target.value)}>
                  <option value="Rabat">Rabat</option>
                  <option value="Salé">Salé</option>
                  <option value="Témara">Témara</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="eyebrow mb-1.5">Message</label>
                <textarea className="kred-input" rows={3} style={{ resize: 'vertical' }} placeholder="Questions, disponibilités…" value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? 'oklch(0.88 0.014 75)' : 'oklch(0.22 0.018 60)',
                  color: loading ? 'oklch(0.22 0.018 60 / 35%)' : 'oklch(0.975 0.012 85)',
                  border: 'none', borderRadius: '9999px', padding: '1rem',
                  fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = 'oklch(0.32 0.06 155)')}
                onMouseLeave={e => !loading && (e.currentTarget.style.background = 'oklch(0.22 0.018 60)')}
              >
                {loading ? 'Envoi…' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
