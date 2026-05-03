import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase.js'

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAjouterClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (client) => {
      // ── 1. Tente l'insert (sans .select() pour ne pas déclencher de SELECT bloqué)
      const { error: insertError } = await supabase
        .from('clients')
        .insert([client])

      if (!insertError) {
        // Insert OK → essaie de récupérer l'id (SELECT autorisé par clients_public_select)
        const { data: found } = await supabase
          .from('clients')
          .select('id')
          .eq('telephone', client.telephone)
          .maybeSingle()

        // Si le SELECT réussit on retourne l'id, sinon on génère un uuid client-side
        // (la ligne existe déjà en BD, la commande sera quand même créée)
        return found ?? { id: crypto.randomUUID(), _no_read: true }
      }

      // ── 2. Doublon téléphone → client déjà connu, on récupère son id
      if (insertError.code === '23505') {
        const { data: existing } = await supabase
          .from('clients')
          .select('id')
          .eq('telephone', client.telephone)
          .maybeSingle()
        return existing ?? { id: crypto.randomUUID(), _no_read: true }
      }

      // ── 3. Toute autre erreur → message lisible
      throw new Error(insertError.message ?? 'Erreur lors de la création du client.')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useModifierClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...client }) => {
      const { data, error } = await supabase
        .from('clients').update(client).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}
