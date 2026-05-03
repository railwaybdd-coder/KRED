import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function CommentCaMarche() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.975 0.012 85)' }}>
      <Navbar />

      {/* Hero split */}
      <section className="container-prose py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="eyebrow mb-3">Le modèle KRED</p>
            <h1
              className="font-display font-700"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.025em', color: 'oklch(0.22 0.018 60)', lineHeight: 1.05 }}
            >
              60 % aujourd'hui.{' '}
              <span style={{ color: 'oklch(0.62 0.14 45)' }}>40 %</span>{' '}
              le mois prochain.
            </h1>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'oklch(0.22 0.018 60 / 60%)', lineHeight: 1.75, marginBottom: '1rem' }}>
              KRED est né d'un constat simple : les étudiants et jeunes actifs subsahariens au Maroc ont souvent besoin d'équiper leur logement dès leur arrivée, mais n'ont pas toujours accès au crédit bancaire.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'oklch(0.22 0.018 60 / 60%)', lineHeight: 1.75, marginBottom: '1rem' }}>
              Notre système 60–40 est simple, transparent et sans intérêt. Le bien reste propriété de KRED jusqu'au paiement du solde (réserve de propriété).
            </p>
          </div>
        </div>
      </section>

      {/* 4 étapes */}
      <section style={{ background: 'oklch(0.93 0.02 80 / 40%)', borderTop: '1px solid oklch(0.88 0.014 75)', borderBottom: '1px solid oklch(0.88 0.014 75)', padding: '7rem 0' }}>
        <div className="container-prose">
          <h2 className="font-display font-700 mb-14" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.02em', color: 'oklch(0.22 0.018 60)' }}>
            Quatre étapes, deux paiements.
          </h2>
          <div className="grid-hairline grid md:grid-cols-2 rounded-xl overflow-hidden">
            {[
              { num: '01', titre: 'Choisissez votre pièce', desc: 'Parcourez le catalogue. Mobilier, électroménager, électronique — tout est vérifié.' },
              { num: '02', titre: 'Validez votre dossier', desc: 'Carte de séjour ou attestation scolaire + numéro WhatsApp + adresse de livraison.' },
              { num: '03', titre: 'Recevez en 48 h', desc: 'Le livreur arrive chez vous. Vous réglez 60 % du prix à la remise de l\'article.' },
              { num: '04', titre: 'Réglez le solde à 30 jours', desc: '40 % restants un mois plus tard. Aucun intérêt, aucun frais de dossier.' },
            ].map(e => (
              <div key={e.num} style={{ padding: '2.5rem', background: 'oklch(0.975 0.012 85)' }}>
                <p className="font-display font-700 mb-4" style={{ fontSize: '2.25rem', color: 'oklch(0.62 0.14 45)', letterSpacing: '-0.02em' }}>
                  {e.num}
                </p>
                <p className="font-display font-700 mb-2" style={{ fontSize: '1.15rem', color: 'oklch(0.22 0.018 60)' }}>{e.titre}</p>
                <p style={{ fontSize: '0.85rem', color: 'oklch(0.22 0.018 60 / 55%)', lineHeight: 1.7 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemple */}
      <section className="container-prose py-20">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <p className="eyebrow mb-2">Exemple concret</p>
            <h2 className="font-display font-700" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', color: 'oklch(0.22 0.018 60)' }}>
              Un frigo à 1 200 DH.
            </h2>
          </div>
          <div className="md:col-span-7">
            <div className="kred-card" style={{ padding: '2rem' }}>
              {[
                { label: 'Prix total', val: '1 200 DH', accent: false },
                { label: 'Acompte · À la livraison (60 %)', val: '720 DH', accent: true },
                { label: 'Solde · Mois 1 (40 %)', val: '480 DH', accent: false },
                { label: 'Frais de dossier', val: '0 DH', accent: false },
                { label: 'Intérêts', val: 'Aucun', accent: false },
              ].map(r => (
                <div
                  key={r.label}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid oklch(0.88 0.014 75)' }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'oklch(0.22 0.018 60 / 55%)' }}>{r.label}</span>
                  <span className="font-display font-700" style={{ fontSize: '1.1rem', color: r.accent ? 'oklch(0.62 0.14 45)' : 'oklch(0.22 0.018 60)' }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-prose pb-20">
        <div style={{ background: 'oklch(0.22 0.018 60)', borderRadius: '1.25rem', padding: '5rem 3rem', textAlign: 'center' }}>
          <h2 className="font-display font-700 mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.025em', color: 'oklch(0.975 0.012 85)', lineHeight: 1.1 }}>
            Prêt à vous installer ?
          </h2>
          <Link to="/catalogue" className="pill-clay">Parcourir le catalogue</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
