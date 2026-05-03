import { useState } from 'react'
import {
  useAdminProduits, useAjouterProduit, useModifierProduit, useSupprimerProduit
} from '../../hooks/useProduits.js'
import UploadImage from '../../components/UploadImage.jsx'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react'

const FORM_VIDE = {
  nom: '', description: '', prix_vente: '', prix_achat: '',
  categorie: 'mobilier', etat: 'occasion_bon',
  photos: [], disponible: true,
}

const CATS  = { mobilier: 'Mobilier', electromenager: 'Électroménager', electronique: 'Électronique' }
const ETATS = { neuf: 'Neuf', occasion_bon: 'Occasion — bon état', occasion_tres_bon: 'Occasion — très bon état' }

export default function AdminProduits() {
  const { data: produits = [], isLoading } = useAdminProduits()
  const ajouter   = useAjouterProduit()
  const modifier  = useModifierProduit()
  const supprimer = useSupprimerProduit()

  const [modal, setModal]       = useState(false)  // 'ajouter' | 'modifier' | false
  const [form, setForm]         = useState(FORM_VIDE)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function ouvrirAjouter() {
    setForm(FORM_VIDE)
    setEditId(null)
    setModal('form')
  }

  function ouvrirModifier(p) {
    setForm({
      nom: p.nom, description: p.description ?? '',
      prix_vente: p.prix_vente, prix_achat: p.prix_achat ?? '',
      categorie: p.categorie, etat: p.etat,
      photos: p.photos ?? [], disponible: p.disponible,
    })
    setEditId(p.id)
    setModal('form')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      prix_vente: parseInt(form.prix_vente),
      prix_achat: form.prix_achat ? parseInt(form.prix_achat) : null,
    }
    try {
      if (editId) {
        await modifier.mutateAsync({ id: editId, ...payload })
        toast.success('Produit modifié')
      } else {
        await ajouter.mutateAsync(payload)
        toast.success('Produit ajouté')
      }
      setModal(false)
    } catch (err) {
      toast.error(err.message ?? 'Erreur')
    }
    setSaving(false)
  }

  async function handleSupprimer(id) {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await supprimer.mutateAsync(id)
      toast.success('Produit supprimé')
    } catch (err) {
      toast.error(err.message ?? 'Erreur')
    }
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Produits</h1>
        <button onClick={ouvrirAjouter} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-gray-50" />)}
        </div>
      ) : produits.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>Aucun produit. Commencer par en ajouter un !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {produits.map(p => {
            const acompte = Math.round(p.prix_vente * 0.6)
            return (
              <div key={p.id} className="card flex items-center gap-4">
                {/* Photo */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.photos?.[0]
                    ? <img src={p.photos[0]} alt={p.nom} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  }
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{p.nom}</p>
                    {!p.disponible && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Caché</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{CATS[p.categorie]} · {ETATS[p.etat]}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">
                    {p.prix_vente} DH
                    <span className="text-orange-500 ml-1">(acompte: {acompte} DH)</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => ouvrirModifier(p)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleSupprimer(p.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal formulaire */}
      {modal === 'form' && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg mt-8 mb-8 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-extrabold text-lg text-gray-900">
                {editId ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Nom *</label>
                <input value={form.nom} onChange={e => set('nom', e.target.value)}
                  className="input" required placeholder="Ex: Frigo Samsung 200L" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Catégorie *</label>
                  <select value={form.categorie} onChange={e => set('categorie', e.target.value)} className="input">
                    {Object.entries(CATS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">État *</label>
                  <select value={form.etat} onChange={e => set('etat', e.target.value)} className="input">
                    {Object.entries(ETATS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Prix de vente (DH) *</label>
                  <input type="number" min="0" value={form.prix_vente}
                    onChange={e => set('prix_vente', e.target.value)}
                    className="input" required placeholder="1200" />
                  {form.prix_vente && (
                    <p className="text-xs text-orange-500 mt-1">
                      Acompte: {Math.round(parseInt(form.prix_vente || 0) * 0.6)} DH · Reste: {Math.round(parseInt(form.prix_vente || 0) * 0.4)} DH
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">Prix d'achat (DH)</label>
                  <input type="number" min="0" value={form.prix_achat}
                    onChange={e => set('prix_achat', e.target.value)}
                    className="input" placeholder="800" />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  className="input" rows={3} placeholder="État, caractéristiques, détails importants..." />
              </div>

              <div>
                <label className="label">
                  Photos {form.photos.length > 0 && <span className="text-orange-500">({form.photos.length})</span>}
                </label>
                <UploadImage valeur={form.photos} onChange={urls => set('photos', urls)} />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="dispo" checked={form.disponible}
                  onChange={e => set('disponible', e.target.checked)}
                  className="w-4 h-4 accent-orange-500" />
                <label htmlFor="dispo" className="text-sm text-gray-700 cursor-pointer">
                  Visible dans le catalogue
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? 'Enregistrement...' : editId ? 'Modifier' : 'Ajouter le produit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
