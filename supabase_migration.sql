-- ═══════════════════════════════════════════════════════════
--  KRED — Migration complète
--  À exécuter dans Supabase > SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Table documents_clients
CREATE TABLE IF NOT EXISTS public.documents_clients (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  nom              text NOT NULL,
  type             text NOT NULL DEFAULT 'autre',
  url              text NOT NULL,
  chemin_stockage  text,
  taille_octets    bigint,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_docs_client ON public.documents_clients(client_id);

ALTER TABLE public.documents_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_select_docs" ON public.documents_clients
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_insert_docs" ON public.documents_clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_docs" ON public.documents_clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- 2. Colonne notes sur clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS notes text;

-- ═══════════════════════════════════════════════════════════
--  POLICIES BUCKET STORAGE "documents"
--  Supabase > Storage utilise la table storage.objects
-- ═══════════════════════════════════════════════════════════

-- Lecture publique (pour afficher les URLs)
CREATE POLICY "documents_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

-- Upload uniquement pour les admins authentifiés
CREATE POLICY "documents_authenticated_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

-- Suppression uniquement pour les admins authentifiés
CREATE POLICY "documents_authenticated_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

-- ═══════════════════════════════════════════════════════════
