import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Accueil         from './pages/Accueil.jsx'
import Catalogue       from './pages/Catalogue.jsx'
import ProduitDetail   from './pages/ProduitDetail.jsx'
import Checkout        from './pages/Checkout.jsx'
import Contact         from './pages/Contact.jsx'
import CommentCaMarche from './pages/CommentCaMarche.jsx'
import Login           from './pages/Login.jsx'
import ProtectedRoute  from './components/ProtectedRoute.jsx'

import AdminLayout    from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProduits  from './pages/admin/AdminProduits.jsx'
import AdminCommandes from './pages/admin/AdminCommandes.jsx'
import AdminClients   from './pages/admin/AdminClients.jsx'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'oklch(0.985 0.008 85)',
              color: 'oklch(0.22 0.018 60)',
              border: '1px solid oklch(0.88 0.014 75)',
              borderRadius: '0.75rem',
              fontSize: '0.85rem',
            },
          }}
        />
        <Routes>
          <Route path="/"                    element={<Accueil />} />
          <Route path="/catalogue"           element={<Catalogue />} />
          <Route path="/produit/:id"         element={<ProduitDetail />} />
          <Route path="/checkout/:id"        element={<Checkout />} />
          <Route path="/contact"             element={<Contact />} />
          <Route path="/comment-ca-marche"   element={<CommentCaMarche />} />
          <Route path="/login"               element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index             element={<AdminDashboard />} />
            <Route path="produits"   element={<AdminProduits />} />
            <Route path="commandes"  element={<AdminCommandes />} />
            <Route path="clients"    element={<AdminClients />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
