import { useState } from 'react';

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'var(--surface)',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    border: '1px solid var(--border)',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    color: 'var(--text-dark)',
    marginBottom: '1rem'
  },
  input: {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  button: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    width: '100%'
  },
  success: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
    fontWeight: '600'
  }
};

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await fetch('/n8n/webhook/paciente-atendido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          status: 'Atendido',
          timestamp: new Date().toISOString()
        })
      });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al conectar con n8n');
    }
    
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
      <h2 style={styles.title}>Panel Clínico (Admin)</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
        Ingresa el correo del paciente que acaba de ser atendido en la clínica. Esto disparará automáticamente la campaña de Fidelización (Reseña, Cuidados, Control 30 días).
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="correo@paciente.cl"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={{...styles.button, backgroundColor: loading ? '#94a3b8' : 'var(--primary)'}}>
          {loading ? 'Procesando...' : 'Marcar como Atendido ✅'}
        </button>
      </form>

      {success && (
        <div style={styles.success}>
          ¡Paciente marcado como atendido! Campaña post-venta iniciada.
        </div>
      )}
    </div>
  );
}
