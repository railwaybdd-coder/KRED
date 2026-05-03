import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase.js'

/** Nettoie un nom de fichier : supprime espaces, accents et caractères spéciaux */
function sanitiserNomFichier(nom) {
  return nom
    .normalize('NFD')                          // décompose les accents
    .replace(/[\u0300-\u036f]/g, '')           // supprime les diacritiques
    .replace(/[^a-zA-Z0-9._-]/g, '_')          // remplace tout caractère interdit par _
    .replace(/_+/g, '_')                        // fusionne les _ consécutifs
    .replace(/^_|_$/g, '')                      // retire les _ en début/fin
}

/** Liste les documents d'un client */
export function useDocumentsClient(clientId) {
  return useQuery({
    queryKey: ['documents-client', clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents_clients')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

/** Upload un document dans le bucket "documents" */
export function useUploaderDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ clientId, fichier, type, nom }) => {
      // Nom original nettoyé pour le storage
      const nomNettoye = sanitiserNomFichier(fichier.name)
      const path = `${clientId}/${Date.now()}_${nomNettoye}`

      // 1. Upload dans le bucket
      const { error: storageErr } = await supabase.storage
        .from('documents')
        .upload(path, fichier, { upsert: false })
      if (storageErr) throw new Error(`Upload échoué : ${storageErr.message}`)

      // 2. URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(path)

      // 3. Enregistrer en base (on garde le nom original lisible pour l'affichage)
      const { error: dbErr } = await supabase
        .from('documents_clients')
        .insert([{
          client_id: clientId,
          nom: nom || fichier.name,   // nom lisible original
          type,
          url: publicUrl,
          chemin_stockage: path,       // chemin sanitisé
          taille_octets: fichier.size,
        }])
      if (dbErr) throw new Error(dbErr.message)
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['documents-client', variables.clientId] })
    },
  })
}

/** Supprime un document */
export function useSupprimerDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, cheminStockage, clientId }) => {
      if (cheminStockage) {
        await supabase.storage.from('documents').remove([cheminStockage])
      }
      const { error } = await supabase.from('documents_clients').delete().eq('id', id)
      if (error) throw error
      return { clientId }
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['documents-client', result.clientId] })
    },
  })
}
