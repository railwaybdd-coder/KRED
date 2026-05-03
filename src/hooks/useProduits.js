import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase.js'

/* ── Catalogue public ─────────────────────────────── */
export function useProduits(categorie = null) {
  return useQuery({
    queryKey: ['produits', categorie],
    queryFn: async () => {
      let q = supabase
        .from('produits')
        .select('*')
        .eq('disponible', true)
        .order('created_at', { ascending: false })
      if (categorie) q = q.eq('categorie', categorie)
      const { data, error } = await q
      if (error) throw error
      return data ?? []
    },
  })
}

export function useProduit(id) {
  return useQuery({
    queryKey: ['produit', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
  })
}

/* ── Admin : tous les produits ───────────────────── */
export function useAdminProduits() {
  return useQuery({
    queryKey: ['admin-produits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

/* ── Mutations ───────────────────────────────────── */
export function useAjouterProduit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (produit) => {
      const { data, error } = await supabase
        .from('produits').insert([produit]).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['produits'] })
      qc.invalidateQueries({ queryKey: ['admin-produits'] })
    },
  })
}

export function useModifierProduit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...produit }) => {
      const { data, error } = await supabase
        .from('produits').update(produit).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['produits'] })
      qc.invalidateQueries({ queryKey: ['admin-produits'] })
    },
  })
}

export function useSupprimerProduit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('produits').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['produits'] })
      qc.invalidateQueries({ queryKey: ['admin-produits'] })
    },
  })
}
