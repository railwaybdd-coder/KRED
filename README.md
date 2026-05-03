# KRED — Plateforme e-commerce BNPL

## Stack technique
- **Vite 8** + **React 19** + **React Router 7**
- **Tailwind CSS v4** (config dans `src/index.css`, plus de `tailwind.config.js`)
- **Supabase** (base de données + auth + storage)
- **@tanstack/react-query v5**
- **Vercel** (hébergement)

---

## 🚀 Installation rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier .env (déjà rempli avec tes clés Supabase)
# Le fichier .env est déjà présent dans le projet

# 3. Lancer en développement
npm run dev
```

Ouvre http://localhost:5173 dans ton navigateur.

---

## 🗄️ Configurer Supabase (une seule fois)

1. Va sur **supabase.com** → ton projet → **SQL Editor** → **New query**
2. Colle le contenu de `supabase_setup.sql` 
3. **Remplace `admin@kred.ma`** par ton vrai email admin dans le SQL
4. Clique **Run**

### Créer le bucket Storage
1. Supabase → **Storage** → **New bucket**
2. Nom : `produits-images`
3. **Public bucket : OUI** ← très important
4. File size limit : 5MB
5. Allowed MIME : `image/jpeg, image/png, image/webp`

### Créer le compte admin
1. Supabase → **Authentication** → **Users** → **Add user**
2. Email : ton email (le même que dans le SQL)
3. Mot de passe fort

---

## 📁 Structure du projet

```
src/
├── main.jsx              # Point d'entrée
├── App.jsx               # Routeur principal
├── index.css             # Tailwind v4 + styles globaux
├── lib/
│   └── supabase.js       # Client Supabase
├── context/
│   └── AuthContext.jsx   # Auth state global
├── hooks/
│   ├── useProduits.js    # CRUD produits
│   ├── useCommandes.js   # CRUD commandes
│   └── useClients.js     # CRUD clients
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CarteProduit.jsx
│   ├── UploadImage.jsx   # Upload vers Supabase Storage
│   └── ProtectedRoute.jsx
└── pages/
    ├── Accueil.jsx
    ├── Catalogue.jsx
    ├── ProduitDetail.jsx
    ├── Contact.jsx        # Formulaire commande public
    ├── Login.jsx          # Page admin
    └── admin/
        ├── AdminLayout.jsx
        ├── AdminDashboard.jsx
        ├── AdminProduits.jsx
        ├── AdminCommandes.jsx
        └── AdminClients.jsx
```

---

## 🌐 Déployer sur Vercel

```bash
# 1. Initialiser Git
git init
git add .
git commit -m "initial commit - KRED"

# 2. Pousser sur GitHub (remplacer l'URL par la tienne)
git remote add origin https://github.com/TON_USER/kred.git
git push -u origin main
```

Sur **vercel.com** :
1. New Project → importer le repo GitHub
2. Environment Variables → ajouter :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy !

---

## 📱 Accès admin

- URL : `https://ton-site.vercel.app/login`
- Email : ton email admin Supabase
- Mot de passe : celui que tu as défini

---

## ⚠️ Notes importantes

- **Tailwind v4** : la config est dans `src/index.css` avec `@import "tailwindcss"` — ne pas créer de `tailwind.config.js`
- **postcss.config.js** utilise `@tailwindcss/postcss` — installer avec `npm install -D @tailwindcss/postcss`
- **React Router v7** : même API que v6 avec BrowserRouter + Routes
- Le fichier `.env` est inclus dans le zip pour faciliter le démarrage mais **ne jamais le pousser sur GitHub** (il est dans .gitignore)
