import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase.js'
import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [
        { count: nbProduits },
        { count: nbClients },
        { data: commandes },
      ] = await Promise.all([
        supabase.from('produits').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('commandes').select('prix_total, acompte, statut'),
      ])

      const totalCA        = commandes?.reduce((s, c) => s + (c.prix_total ?? 0), 0) ?? 0
      const totalEncaisse  = commandes?.reduce((s, c) => ['livre','solde'].includes(c.statut) ? s + (c.acompte ?? 0) : s, 0) ?? 0
      const enAttente      = commandes?.filter(c => c.statut === 'en_attente').length ?? 0
      const incidents      = commandes?.filter(c => c.statut === 'incident').length ?? 0
      const livres         = commandes?.filter(c => c.statut === 'livre').length ?? 0

      return {
        nbProduits: nbProduits ?? 0,
        nbClients:  nbClients ?? 0,
        nbCommandes: commandes?.length ?? 0,
        totalCA,
        totalEncaisse,
        enAttente,
        incidents,
        livres,
      }
    },
  })

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Tableau de bord</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-12 bg-gray-100 rounded-xl mb-3" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Tableau de bord</h1>

      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Produits actifs" value={stats.nbProduits} icon={Package} color="bg-blue-500" />
        <StatCard label="Commandes"       value={stats.nbCommandes} icon={ShoppingCart} color="bg-purple-500" />
        <StatCard label="Clients"         value={stats.nbClients} icon={Users} color="bg-green-500" />
        <StatCard label="En attente"      value={stats.enAttente} icon={Clock} color="bg-yellow-500" />
      </div>

      {/* Finances */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <p className="text-orange-100 text-sm mb-1 flex items-center gap-2">
            <TrendingUp size={16} /> Total encaissé (acomptes livrés)
          </p>
          <p className="text-4xl font-extrabold">{stats.totalEncaisse.toLocaleString()} DH</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
            <TrendingUp size={16} /> Chiffre d'affaires total
          </p>
          <p className="text-4xl font-extrabold text-gray-900">{stats.totalCA.toLocaleString()} DH</p>
        </div>
      </div>

      {/* Statuts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-gray-900">{stats.livres}</p>
          <p className="text-sm text-gray-500">Livrées</p>
        </div>
        <div className="card text-center">
          <Clock size={24} className="text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-gray-900">{stats.enAttente}</p>
          <p className="text-sm text-gray-500">En attente</p>
        </div>
        <div className="card text-center">
          <AlertTriangle size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-gray-900">{stats.incidents}</p>
          <p className="text-sm text-gray-500">Incidents</p>
        </div>
      </div>
    </div>
  )
}
