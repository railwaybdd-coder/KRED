import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase.js'

export function useCommandes() {
  return useQuery({
    queryKey: ['commandes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commandes')
        .select(`
          *,
          client:clients(id, nom, prenom, telephone, whatsapp),
          produit:produits(id, nom, photos)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAjouterCommande() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ client_id, produit_id, prix_total, date_livraison, date_echeance, notes }) => {
      const acompte       = Math.round(prix_total * 0.6)
      const reste_a_payer = prix_total - acompte

      // INSERT sans .select() → évite le SELECT bloqué par RLS
      const { error } = await supabase
        .from('commandes')
        .insert([{ client_id, produit_id, prix_total, acompte, reste_a_payer, date_livraison, date_echeance, notes }])

      if (error) throw new Error(error.message ?? 'Erreur lors de la création de la commande.')
      return { client_id, produit_id, prix_total, acompte, reste_a_payer }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['commandes'] }),
  })
}

export function useChangerStatut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, statut }) => {
      const { error } = await supabase.from('commandes').update({ statut }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['commandes'] }),
  })
}

export function useSupprimerCommande() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('commandes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['commandes'] }),
  })
}
