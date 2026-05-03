import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import toast from 'react-hot-toast'
import { Upload, X, Loader2, Star } from 'lucide-react'

function nomUnique(fichier) {
  const ext = fichier.name.split('.').pop().toLowerCase()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
}

/**
 * Composant d'upload d'images vers Supabase Storage.
 * - valeur  : string[]  — tableau des URLs déjà uploadées
 * - onChange : (urls: string[]) => void
 */
export default function UploadImage({ valeur = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFichiers(e) {
    const fichiers = Array.from(e.target.files)
    if (!fichiers.length) return

    setUploading(true)
    const nouvellesUrls = []

    for (const fichier of fichiers) {
      if (fichier.size > 5 * 1024 * 1024) {
        toast.error(`${fichier.name} dépasse 5 MB — ignoré`)
        continue
      }

      const nom = nomUnique(fichier)

      const { error } = await supabase.storage
        .from('produits-images')
        .upload(nom, fichier, { cacheControl: '3600', upsert: false })

      if (error) {
        toast.error(`Erreur upload : ${fichier.name}`)
        console.error(error)
        continue
      }

      const { data } = supabase.storage.from('produits-images').getPublicUrl(nom)
      nouvellesUrls.push(data.publicUrl)
    }

    if (nouvellesUrls.length) {
      onChange([...valeur, ...nouvellesUrls])
      toast.success(`${nouvellesUrls.length} photo(s) ajoutée(s)`)
    }

    setUploading(false)
    e.target.value = ''
  }

  async function supprimer(url) {
    const nom = url.split('/').pop()
    await supabase.storage.from('produits-images').remove([nom])
    onChange(valeur.filter(u => u !== url))
    toast.success('Photo supprimée')
  }

  return (
    <div>
      {/* Grille des photos uploadées */}
      {valeur.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {valeur.map((url, i) => (
            <div key={url} className="relative aspect-square">
              <img
                src={url}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={() => supprimer(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 shadow cursor-pointer"
              >
                <X size={11} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Star size={9} fill="white" /> principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFichiers}
      />

      {/* Bouton zone de dépôt */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-orange-300 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {uploading ? (
          <>
            <Loader2 size={24} className="text-orange-500 animate-spin" />
            <span className="text-sm text-gray-500">Upload en cours...</span>
          </>
        ) : (
          <>
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Cliquer pour ajouter des photos</span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP — max 5 MB par photo</span>
          </>
        )}
      </button>
    </div>
  )
}
