import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/produits',  label: 'Produits',   icon: Package },
  { to: '/admin/commandes', label: 'Commandes',  icon: ShoppingCart },
  { to: '/admin/clients',   label: 'Clients',    icon: Users },
]

export default function AdminLayout() {
  const navigate        = useNavigate()
  const { user }        = useAuth()
  const [open, setOpen] = useState(false)

  async function deconnecter() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-100">
        <p className="text-2xl font-extrabold text-orange-500">KRED</p>
        <p className="text-xs text-gray-400 mt-1">Administration</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={deconnecter}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 w-full transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile (drawer) */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-white flex flex-col h-full shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar mobile */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Menu size={20} />
          </button>
          <p className="font-extrabold text-orange-500 text-lg">KRED</p>
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
