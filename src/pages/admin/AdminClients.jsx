import { useState, useRef } from 'react'
import { useClients, useModifierClient } from '../../hooks/useClients.js'
import { useDocumentsClient, useUploaderDocument, useSupprimerDocument } from '../../hooks/useDocumentsClient.js'
import toast from 'react-hot-toast'
import {
  MessageCircle, User, ChevronDown, ChevronUp, Upload,
  FileText, Trash2, Eye, X, Pencil, Check, Phone, MapPin, Calendar,
  FolderOpen, FileImage, File,
} from 'lucide-react'

const TYPES_DOC = [
  { value: 'cin',          label: 'CIN / CNI' },
  { value: 'justif_domicile', label: 'Justificatif domicile' },
  { value: 'bulletin_salaire', label: 'Bulletin de salaire' },
  { value: 'contrat',     label: 'Contrat signé' },
  { value: 'autre',       label: 'Autre' },
]

function iconeDoc(url = '') {
  const ext = url.split('.').pop().toLowerCase()
  if (['jpg','jpeg','png','webp','gif'].includes(ext)) return <FileImage size={16} color="#6366f1" />
  if (ext === 'pdf') return <FileText size={16} color="#ef4444" />
  return <File size={16} color="#6b7280" />
}

function formatOctets(n) {
  if (!n) return ''
  if (n < 1024) return `${n} o`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`
}

/* ── Panneau dossier client ── */
function DossierClient({ client }) {
  const { data: documents = [], isLoading } = useDocumentsClient(client.id)
  const uploader   = useUploaderDocument()
  const supprimer  = useSupprimerDocument()
  const fileRef    = useRef()
  const [typeSelectionne, setTypeSelectionne] = useState('cin')
  const [nomDoc, setNomDoc]   = useState('')
  const [upload, setUpload]   = useState(false)

  async function handleFichier(e) {
    const fichier = e.target.files?.[0]
    if (!fichier) return
    try {
      await uploader.mutateAsync({
        clientId: client.id,
        fichier,
        type: typeSelectionne,
        nom: nomDoc || fichier.name,
      })
      toast.success('Document ajouté')
      setNomDoc('')
      e.target.value = ''
      setUpload(false)
    } catch (err) {
      toast.error(err.message ?? 'Erreur upload')
    }
  }

  async function handleSupprimer(doc) {
    if (!confirm(`Supprimer "${doc.nom}" ?`)) return
    try {
      await supprimer.mutateAsync({ id: doc.id, cheminStockage: doc.chemin_stockage, clientId: client.id })
      toast.success('Document supprimé')
    } catch (err) {
      toast.error(err.message ?? 'Erreur')
    }
  }

  return (
    <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 12, paddingTop: 12 }}>
      {/* Header dossier */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 5 }}>
          <FolderOpen size={13} /> Documents ({documents.length})
        </p>
        <button
          onClick={() => setUpload(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
        >
          <Upload size={11} /> Ajouter
        </button>
      </div>

      {/* Formulaire upload */}
      {upload && (
        <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <select
              value={typeSelectionne}
              onChange={e => setTypeSelectionne(e.target.value)}
              style={{ flex: 1, minWidth: 120, fontSize: '0.72rem', border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px', background: '#fff' }}
            >
              {TYPES_DOC.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <input
              type="text"
              placeholder="Nom du document (optionnel)"
              value={nomDoc}
              onChange={e => setNomDoc(e.target.value)}
              style={{ flex: 2, minWidth: 140, fontSize: '0.72rem', border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px' }}
            />
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" onChange={handleFichier} style={{ display: 'none' }} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploader.isPending}
            style={{ width: '100%', border: '2px dashed #d1d5db', borderRadius: 8, padding: '10px', background: '#fff', color: '#6b7280', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Upload size={13} />
            {uploader.isPending ? 'Envoi…' : 'Choisir un fichier (PDF, image, Word)'}
          </button>
        </div>
      )}

      {/* Liste des documents */}
      {isLoading ? (
        <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Chargement…</p>
      ) : documents.length === 0 ? (
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>Aucun document enregistré</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {documents.map(doc => {
            const typeLabel = TYPES_DOC.find(t => t.value === doc.type)?.label ?? doc.type
            return (
              <div key={doc.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: 9, padding: '7px 10px',
              }}>
                {iconeDoc(doc.url)}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.nom}</p>
                  <p style={{ fontSize: '0.6rem', color: '#9ca3af' }}>
                    {typeLabel} · {formatOctets(doc.taille_octets)} · {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <a href={doc.url} target="_blank" rel="noreferrer"
                    style={{ padding: 5, borderRadius: 6, background: '#eff6ff', color: '#3b82f6', display: 'flex' }}
                    title="Voir">
                    <Eye size={13} />
                  </a>
                  <button onClick={() => handleSupprimer(doc)}
                    style={{ padding: 5, borderRadius: 6, background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex' }}
                    title="Supprimer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Carte client expandable ── */
function CarteClient({ client }) {
  const [ouvert, setOuvert] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ prenom: client.prenom, nom: client.nom, telephone: client.telephone, adresse: client.adresse ?? '', ville: client.ville ?? '', notes: client.notes ?? '' })
  const modifier = useModifierClient()
  const wa = client.whatsapp || client.telephone

  async function sauvegarder() {
    try {
      await modifier.mutateAsync({ id: client.id, ...form })
      toast.success('Client mis à jour')
      setEditMode(false)
    } catch (err) {
      toast.error(err.message ?? 'Erreur')
    }
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* En-tête cliquable */}
      <div
        onClick={() => setOuvert(v => !v)}
        style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
      >
        {/* Avatar initiales */}
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #fed7aa, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>
          {(client.prenom?.[0] ?? '?').toUpperCase()}{(client.nom?.[0] ?? '').toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{client.prenom} {client.nom}</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 2 }}>
            <span style={{ fontSize: '0.68rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Phone size={10} /> {client.telephone}
            </span>
            {client.ville && (
              <span style={{ fontSize: '0.68rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={10} /> {client.ville}
              </span>
            )}
            <span style={{ fontSize: '0.68rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={10} /> {new Date(client.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {wa && (
            <a
              href={`https://wa.me/${wa.replace(/\D/g, '')}`}
              target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ background: '#22c55e', color: '#fff', borderRadius: 8, padding: '5px 9px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <MessageCircle size={11} /> WA
            </a>
          )}
          {ouvert ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
        </div>
      </div>

      {/* Panneau étendu */}
      {ouvert && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f9fafb' }}>
          {/* Infos éditables */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 12 }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 5 }}>
              <User size={12} /> Informations
            </p>
            {editMode ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setEditMode(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 7, padding: '4px 9px', fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <X size={11} /> Annuler
                </button>
                <button onClick={sauvegarder} disabled={modifier.isPending} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 7, padding: '4px 9px', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={11} /> Sauvegarder
                </button>
              </div>
            ) : (
              <button onClick={() => setEditMode(true)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 7, padding: '4px 9px', fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#374151' }}>
                <Pencil size={11} /> Modifier
              </button>
            )}
          </div>

          {editMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              {[
                { key: 'prenom', label: 'Prénom' },
                { key: 'nom',    label: 'Nom' },
                { key: 'telephone', label: 'Téléphone' },
                { key: 'ville', label: 'Ville' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.6rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.label}</label>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', fontSize: '0.78rem', border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px', marginTop: 2 }}
                  />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Adresse</label>
                <input
                  value={form.adresse}
                  onChange={e => setForm(p => ({ ...p, adresse: e.target.value }))}
                  style={{ width: '100%', fontSize: '0.78rem', border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px', marginTop: 2 }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes internes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  style={{ width: '100%', fontSize: '0.78rem', border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px', marginTop: 2, resize: 'vertical' }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 8 }}>
              {[
                { label: 'Téléphone', val: client.telephone },
                { label: 'Ville', val: client.ville },
                { label: 'Adresse', val: client.adresse, full: true },
                { label: 'Notes', val: client.notes, full: true },
              ].filter(r => r.val).map(r => (
                <div key={r.label} style={{ gridColumn: r.full ? '1 / -1' : undefined }}>
                  <p style={{ fontSize: '0.58rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.label}</p>
                  <p style={{ fontSize: '0.78rem', color: '#374151', marginTop: 1 }}>{r.val}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dossier documents */}
          <DossierClient client={client} />
        </div>
      )}
    </div>
  )
}

export default function AdminClients() {
  const { data: clients = [], isLoading } = useClients()
  const [recherche, setRecherche] = useState('')

  const filtres = clients.filter(c => {
    const q = recherche.toLowerCase()
    return !q || `${c.prenom} ${c.nom} ${c.telephone} ${c.ville ?? ''}`.toLowerCase().includes(q)
  })

  if (isLoading) return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Clients</h1>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-gray-50" />)}
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Clients
          <span className="ml-2 text-base font-medium text-gray-400">({clients.length})</span>
        </h1>
      </div>

      {/* Recherche */}
      <input
        type="search"
        placeholder="Rechercher par nom, téléphone, ville…"
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
        style={{
          width: '100%', marginBottom: 16,
          fontSize: '0.85rem', border: '1px solid #e5e7eb',
          borderRadius: 10, padding: '9px 14px',
          background: '#fff', outline: 'none',
        }}
      />

      {filtres.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">👤</p>
          <p>{recherche ? 'Aucun client trouvé.' : 'Aucun client enregistré.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtres.map(c => <CarteClient key={c.id} client={c} />)}
        </div>
      )}
    </div>
  )
}
