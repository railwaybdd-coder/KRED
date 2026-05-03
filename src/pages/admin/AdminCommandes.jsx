import { useCommandes, useChangerStatut, useSupprimerCommande } from '../../hooks/useCommandes.js'
import toast from 'react-hot-toast'
import { MessageCircle, Trash2, Clock, AlertTriangle, CheckCircle2, Timer } from 'lucide-react'

const STATUTS = {
  en_attente: { label: 'En attente',   color: 'bg-yellow-100 text-yellow-700' },
  valide:     { label: 'Validée',      color: 'bg-blue-100 text-blue-700' },
  livre:      { label: 'Livrée',       color: 'bg-green-100 text-green-700' },
  solde:      { label: 'Soldée',       color: 'bg-gray-100 text-gray-600' },
  incident:   { label: '⚠️ Incident',  color: 'bg-red-100 text-red-700' },
}

function badge(statut) {
  const s = STATUTS[statut] ?? { label: statut, color: 'bg-gray-100 text-gray-600' }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
}

/** Calcule les jours restants depuis la date de livraison (date_livraison) + 30 jours */
function getEcheanceInfo(commande) {
  // On compte 30j à partir de date_livraison si dispo, sinon created_at
  const base = commande.date_livraison || commande.created_at
  if (!base) return null

  const echeance = new Date(base)
  echeance.setDate(echeance.getDate() + 30)
  const now = new Date()
  const diffMs = echeance - now
  const joursRestants = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  return {
    joursRestants,
    echeance,
    depasse: joursRestants < 0,
    urgent: joursRestants >= 0 && joursRestants <= 5,
    ok: joursRestants > 5,
  }
}

function CompteurEcheance({ commande }) {
  // Seulement pour les commandes livrées (en attente du 2e paiement)
  if (!['livre'].includes(commande.statut)) return null

  const info = getEcheanceInfo(commande)
  if (!info) return null

  if (info.depasse) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#fef2f2', border: '1.5px solid #fca5a5',
        borderRadius: 10, padding: '7px 11px',
        marginTop: 10,
      }}>
        <AlertTriangle size={15} color="#ef4444" />
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>
            ⚠️ ÉCHÉANCE DÉPASSÉE
          </p>
          <p style={{ fontSize: '0.62rem', color: '#ef4444', marginTop: 2 }}>
            {Math.abs(info.joursRestants)} jour{Math.abs(info.joursRestants) > 1 ? 's' : ''} de retard · Reste: <strong>{commande.reste_a_payer} DH</strong>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', background: '#dc2626', color: '#fff', fontWeight: 900, fontSize: '1.1rem', borderRadius: 8, padding: '3px 10px', lineHeight: 1 }}>
          J+{Math.abs(info.joursRestants)}
        </div>
      </div>
    )
  }

  if (info.urgent) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#fff7ed', border: '1.5px solid #fdba74',
        borderRadius: 10, padding: '7px 11px',
        marginTop: 10,
      }}>
        <Timer size={15} color="#f97316" />
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ea580c', lineHeight: 1 }}>
            Échéance proche
          </p>
          <p style={{ fontSize: '0.62rem', color: '#f97316', marginTop: 2 }}>
            Reste: <strong>{commande.reste_a_payer} DH</strong> · Dû le {info.echeance.toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div style={{ marginLeft: 'auto', background: '#f97316', color: '#fff', fontWeight: 900, fontSize: '1.1rem', borderRadius: 8, padding: '3px 10px', lineHeight: 1 }}>
          {info.joursRestants}j
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: '#f0fdf4', border: '1px solid #bbf7d0',
      borderRadius: 10, padding: '7px 11px',
      marginTop: 10,
    }}>
      <Clock size={14} color="#16a34a" />
      <p style={{ fontSize: '0.62rem', color: '#15803d' }}>
        <strong>{info.joursRestants} jours</strong> avant l'échéance · {commande.reste_a_payer} DH restants
      </p>
      <div style={{ marginLeft: 'auto', background: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '0.85rem', borderRadius: 8, padding: '3px 10px', lineHeight: 1 }}>
        {info.joursRestants}j
      </div>
    </div>
  )
}

export default function AdminCommandes() {
  const { data: commandes = [], isLoading } = useCommandes()
  const changerStatut     = useChangerStatut()
  const supprimerCommande = useSupprimerCommande()

  // Comptes alertes
  const nbDepasses = commandes.filter(c => {
    if (c.statut !== 'livre') return false
    const info = getEcheanceInfo(c)
    return info?.depasse
  }).length

  const nbUrgents = commandes.filter(c => {
    if (c.statut !== 'livre') return false
    const info = getEcheanceInfo(c)
    return info?.urgent
  }).length

  async function handleStatut(id, statut) {
    try {
      await changerStatut.mutateAsync({ id, statut })
      toast.success('Statut mis à jour')
    } catch (err) {
      toast.error(err.message ?? 'Erreur')
    }
  }

  async function handleSupprimer(id) {
    if (!confirm('Supprimer cette commande ?')) return
    try {
      await supprimerCommande.mutateAsync(id)
      toast.success('Commande supprimée')
    } catch (err) {
      toast.error(err.message ?? 'Erreur')
    }
  }

  if (isLoading) return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Commandes</h1>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-gray-50" />)}
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Commandes
          <span className="ml-2 text-base font-medium text-gray-400">({commandes.length})</span>
        </h1>
      </div>

      {/* Alertes globales */}
      {(nbDepasses > 0 || nbUrgents > 0) && (
        <div className="mb-5 space-y-2">
          {nbDepasses > 0 && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} color="#dc2626" />
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>
                {nbDepasses} commande{nbDepasses > 1 ? 's' : ''} en retard de paiement — action requise
              </p>
            </div>
          )}
          {nbUrgents > 0 && (
            <div style={{ background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Timer size={16} color="#f97316" />
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ea580c' }}>
                {nbUrgents} échéance{nbUrgents > 1 ? 's' : ''} dans moins de 5 jours
              </p>
            </div>
          )}
        </div>
      )}

      {commandes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🛒</p>
          <p>Aucune commande pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commandes.map(c => {
            const client  = c.client
            const produit = c.produit
            const wa      = client?.whatsapp || client?.telephone
            const info    = getEcheanceInfo(c)
            const isDepasse = c.statut === 'livre' && info?.depasse

            const msgWA = encodeURIComponent(
              `Bonjour ${client?.prenom}, votre commande KRED (${produit?.nom}) est confirmée. Acompte: ${c.acompte} DH à la livraison.`
            )
            const msgWA_relance = encodeURIComponent(
              `Bonjour ${client?.prenom}, votre deuxième versement de ${c.reste_a_payer} DH est arrivé à échéance. Merci de régulariser au plus vite. — KRED`
            )

            return (
              <div key={c.id} className="card" style={{
                borderLeft: isDepasse ? '3px solid #ef4444' : info?.urgent ? '3px solid #f97316' : '1px solid #e5e7eb',
                borderRadius: 14,
              }}>
                <div className="flex flex-wrap items-start gap-4">
                  {/* Photo */}
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {produit?.photos?.[0]
                      ? <img src={produit.photos[0]} alt={produit.nom} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    }
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{client?.prenom} {client?.nom}</p>
                      {badge(c.statut)}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{produit?.nom}</p>
                    <div className="flex flex-wrap gap-4 mt-1.5 text-sm">
                      <span className="text-gray-500">Total: <strong className="text-gray-800">{c.prix_total} DH</strong></span>
                      <span className="text-orange-500">Acompte: <strong>{c.acompte} DH</strong></span>
                      <span className="text-gray-500">Reste: <strong className="text-gray-800">{c.reste_a_payer} DH</strong></span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Créée le {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      {c.date_livraison && ` · Livrée le ${new Date(c.date_livraison).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <select
                      value={c.statut}
                      onChange={e => handleStatut(c.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                    >
                      {Object.entries(STATUTS).map(([v, { label }]) => (
                        <option key={v} value={v}>{label}</option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      {wa && (
                        <a
                          href={`https://wa.me/${wa.replace(/\D/g, '')}?text=${isDepasse ? msgWA_relance : msgWA}`}
                          target="_blank" rel="noreferrer"
                          className="flex-1 bg-green-500 text-white text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 hover:bg-green-600"
                          title={isDepasse ? 'Envoyer relance de paiement' : 'Envoyer confirmation'}
                        >
                          <MessageCircle size={12} /> {isDepasse ? 'Relancer' : 'WA'}
                        </a>
                      )}
                      <button onClick={() => handleSupprimer(c.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compte à rebours */}
                <CompteurEcheance commande={c} />

                {c.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 italic">📝 {c.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
