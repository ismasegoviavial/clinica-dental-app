import { useState, useEffect } from 'react'
import './index.css'
import Questionnaire from './components/Questionnaire'
import CRM from './components/CRM'
import AIChat from './components/AIChat'
import AdminDashboard from './components/AdminDashboard'

const DEFAULT_HEADLINES = [
  { text: 'Suficiente de ocultar tu sonrisa. Empieza a lucirla hoy mismo.' },
  { text: 'De no sonreír, a ser el alma de la fiesta en 15 días.' },
  { text: 'Salvemos tu diente antes de que sea demasiado tarde.' },
  { text: '¿Y si pudieras volver a masticar sin dolor?' }
]

const IMPLANTES_HEADLINES = [
  { text: 'Recupera la confianza y vuelve a sonreír sin miedos.' },
  { text: 'Implantes dentales premium: la inversión definitiva en ti mismo.' },
  { text: 'Vuelve a comer lo que amas con dientes fijos y seguros.' }
]

const ENDODONCIA_HEADLINES = [
  { text: 'Alivio inmediato del dolor dental. Recupera tu tranquilidad.' },
  { text: 'Tratamiento de conducto con tecnología moderna: cero estrés.' },
  { text: 'No dejes que el dolor arruine tu día. Salva tu diente hoy.' }
]

const BLANQUEAMIENTO_HEADLINES = [
  { text: 'Sonríe con confianza. Dientes más blancos en una sola sesión.' },
  { text: 'Blanqueamiento láser rápido, seguro y sin sensibilidad.' },
  { text: 'El toque final que tu rostro necesita para brillar.' }
]

function App() {
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [view, setView] = useState('landing')
  const [headlines, setHeadlines] = useState(DEFAULT_HEADLINES)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const campaign = params.get('campaign')
    if (campaign === 'endodoncia') setHeadlines(ENDODONCIA_HEADLINES)
    else if (campaign === 'implantes') setHeadlines(IMPLANTES_HEADLINES)
    else if (campaign === 'blanqueamiento') setHeadlines(BLANQUEAMIENTO_HEADLINES)
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#crm') setView('crm');
      else if (hash === '#admin') setView('admin');
      else setView('landing');
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (view !== 'landing') return
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [view, headlines])

  if (view === 'crm') return <CRM />
  if (view === 'admin') return <AdminDashboard />

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--surface)', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.2rem' }}>Clínica Premium</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Av. Providencia 1234 • Especialistas en Estética y Rehabilitación</p>
          </div>
          <nav>
            <a href="tel:+56912345678" style={{ color: 'var(--success)', fontWeight: '600', textDecoration: 'none' }}>+56 9 1234 5678</a>
          </nav>
        </div>
      </header>

      <div style={{ backgroundColor: '#e0f2fe', width: '100%', padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="container animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 key={headlineIndex} style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', minHeight: '100px' }}>
            {headlines[headlineIndex]?.text || ''}
          </h2>
        </div>
      </div>

      <main className="container" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <section style={{ maxWidth: '800px', textAlign: 'center', marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Tratamientos de Vanguardia</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Utilizamos tecnología 3D y materiales biocompatibles para asegurar resultados duraderos y naturales.
            Nuestro enfoque mínimamente invasivo reduce el dolor y acelera tu recuperación.
          </p>
        </section>

        <section style={{ width: '100%', maxWidth: '700px', marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>¿Te gustaría saber si tú calificas?</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>Responde estas breves preguntas y descúbrelo.</p>
          </div>
          <Questionnaire />
        </section>

        <section style={{ width: '100%', maxWidth: '800px', textAlign: 'center', marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem' }}>Lo que dicen nuestros pacientes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', fontStyle: 'italic' }}>
              "El blanqueamiento fue súper rápido y sin sensibilidad. 100% recomendados."
              <strong style={{ fontStyle: 'normal', display: 'block', marginTop: '0.5rem' }}>- Camila A.</strong>
            </div>
            <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', fontStyle: 'italic' }}>
              "Me aterraban los dentistas, pero aquí no sentí nada. Me cambiaron la vida."
              <strong style={{ fontStyle: 'normal', display: 'block', marginTop: '0.5rem' }}>- Roberto M.</strong>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>© 2026 Clínica Premium. Todos los derechos reservados.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Volver Arriba
          </button>
        </div>
      </footer>

      <AIChat />
    </div>
  )
}

export default App
