export default function CRM() {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#0f172a', fontSize: '2rem' }}>📋 CRM - Clínica Premium</h1>
          <a href="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>← Volver a la Landing</a>
        </div>

        {leads.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No hay leads registrados aún. Los pacientes aparecerán aquí cuando completen el formulario.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leads.map((lead, idx) => (
              <div key={idx} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '700', color: '#0f172a' }}>{lead.name}</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{lead.phone}</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{lead.email}</p>
                </div>
                <div>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600' }}>
                    {lead.treatment}
                  </span>
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(lead.timestamp).toLocaleString('es-CL')}</p>
                </div>
                <div>
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600' }}>
                    Nuevo Lead
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
