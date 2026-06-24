import { useState } from 'react';

const styles = {
  card: {
    backgroundColor: 'var(--surface)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    border: '1px solid var(--border)'
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--border)',
    borderRadius: '9999px',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    transition: 'width 0.3s ease-in-out'
  },
  question: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: 'var(--text-dark)'
  },
  optionBtn: {
    width: '100%',
    padding: '1rem',
    marginBottom: '0.75rem',
    backgroundColor: 'var(--background)',
    border: '2px solid var(--border)',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '500',
    color: 'var(--text-dark)',
    textAlign: 'left',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  }
};

const FLOWS = {
  initial: {
    question: "¿Qué tratamiento te interesa principalmente?",
    options: [
      { text: "Blanqueamiento Dental", nextId: "blanqueamiento_1" },
      { text: "Ortodoncia (Frenillos/Alineadores)", nextId: "ortodoncia_1" },
      { text: "Implantes Dentales", nextId: "implantes_1" },
      { text: "Endodoncia", nextId: "endodoncia_1" }
    ]
  },
  blanqueamiento_1: {
    question: "¿Sufres de sensibilidad dental frecuentemente?",
    options: [
      { text: "Sí, me duelen con cosas frías/calientes", nextId: "blanqueamiento_2" },
      { text: "No, rara vez", nextId: "blanqueamiento_2" },
      { text: "Nunca", nextId: "blanqueamiento_2" }
    ]
  },
  blanqueamiento_2: {
    question: "¿Fumas o tomas mucho café/té?",
    options: [
      { text: "Sí, a diario", nextId: "lead_capture" },
      { text: "A veces", nextId: "lead_capture" },
      { text: "No", nextId: "lead_capture" }
    ]
  },
  ortodoncia_1: {
    question: "¿Has usado ortodoncia (frenillos) en el pasado?",
    options: [
      { text: "Sí, pero se me movieron los dientes", nextId: "ortodoncia_2" },
      { text: "No, nunca", nextId: "ortodoncia_2" }
    ]
  },
  ortodoncia_2: {
    question: "¿Qué tipo de ortodoncia prefieres?",
    options: [
      { text: "Tradicional (Metálicos)", nextId: "lead_capture" },
      { text: "Invisible (Alineadores transparentes)", nextId: "lead_capture" },
      { text: "No estoy seguro, necesito asesoría", nextId: "lead_capture" }
    ]
  },
  implantes_1: {
    question: "¿Cuántos dientes necesitas reemplazar?",
    options: [
      { text: "1 a 2 dientes", nextId: "implantes_2" },
      { text: "3 o más dientes", nextId: "implantes_2" },
      { text: "Toda la dentadura", nextId: "implantes_2" }
    ]
  },
  implantes_2: {
    question: "¿Hace cuánto tiempo perdiste la pieza dental?",
    options: [
      { text: "Menos de 6 meses", nextId: "lead_capture" },
      { text: "Entre 6 meses y 1 año", nextId: "lead_capture" },
      { text: "Más de 1 año", nextId: "lead_capture" }
    ]
  },
  endodoncia_1: {
    question: "¿Tienes dolor al morder o al tomar cosas frías/calientes?",
    options: [
      { text: "Sí, me duele mucho", nextId: "endodoncia_2" },
      { text: "Me dolía antes, pero ahora no", nextId: "endodoncia_2" },
      { text: "No, pero mi dentista me lo recomendó", nextId: "endodoncia_2" }
    ]
  },
  endodoncia_2: {
    question: "¿Cuándo te gustaría comenzar tu tratamiento para aliviar el dolor?",
    options: [
      { text: "Lo antes posible", nextId: "lead_capture" },
      { text: "Esta semana", nextId: "lead_capture" },
      { text: "Solo busco información por ahora", nextId: "lead_capture" }
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const campaign = params.get('campaign');
const urlEmail = params.get('email');

let initialStep = 'initial';
let initialAnswers = {};
let initialFlowState = urlEmail ? 'scheduling' : 'questionnaire';

if (campaign === 'endodoncia') {
  initialStep = 'endodoncia_1';
  initialAnswers = { 'initial': 'Endodoncia' };
} else if (campaign === 'implantes') {
  initialStep = 'implantes_1';
  initialAnswers = { 'initial': 'Implantes Dentales' };
} else if (campaign === 'blanqueamiento') {
  initialStep = 'blanqueamiento_1';
  initialAnswers = { 'initial': 'Blanqueamiento Dental' };
}

const N8N_WEBHOOK_URL = '/n8n/webhook/captura-lead';

export default function Questionnaire({ onTreatmentSelect }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState(initialAnswers);
  const [leadData, setLeadData] = useState({ name: '', phone: '', email: urlEmail || '' });
  const [flowState, setFlowState] = useState(initialFlowState);
  const [bookingData, setBookingData] = useState({ date: '', time: '' });
  const [sending, setSending] = useState(false);

  const progress = flowState !== 'questionnaire' ? 100 : Math.min(((history.length) / 3) * 100, 90);

  const handleOptionClick = (option) => {
    setAnswers({ ...answers, [currentStep]: option.text });

    if (currentStep === 'initial' && onTreatmentSelect) {
      onTreatmentSelect(option.text);
    }

    if (option.nextId === 'lead_capture') {
      setFlowState('lead_capture');
    } else {
      setHistory([...history, currentStep]);
      setCurrentStep(option.nextId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevStep = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentStep(prevStep);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const treatment = answers['initial'] || 'General';
    const payload = {
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      treatment: treatment,
      campaign: campaign || 'directo',
      timestamp: new Date().toISOString(),
      answers: answers
    };

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log('Webhook no disponible:', err);
    }

    setSending(false);
    setFlowState('scheduling');
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const payload = {
      email: leadData.email,
      bookingDate: bookingData.date,
      bookingTime: bookingData.time,
      status: 'Cita Agendada'
    };

    try {
      await fetch('/n8n/webhook/agendamiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log('Webhook de agenda no disponible:', err);
    }

    setSending(false);
    setFlowState('success');
  };

  // ESTADO 4: ÉXITO
  if (flowState === 'success') {
    return (
      <div className="animate-fade-in" style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--success)' }}>✅</div>
          <h3 style={styles.question}>¡Tu cita está confirmada!</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Te esperamos el <strong>{bookingData.date}</strong> a las <strong>{bookingData.time} hrs</strong>.
          </p>
          <p style={{ color: 'var(--text-light)' }}>
            Hemos enviado los detalles y tu cupón de <strong>15% OFF</strong> a tu correo. ¡Nos vemos pronto!
          </p>
        </div>
      </div>
    );
  }

  // ESTADO 3: AGENDAMIENTO
  if (flowState === 'scheduling') {
    return (
      <div className="animate-fade-in" style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <h3 style={styles.question}>Elige tu fecha y hora</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            Simulación de agendamiento. Tu cupón ya fue enviado al correo.
          </p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleScheduleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Fecha:</label>
              <input
                type="date"
                required
                value={bookingData.date}
                onChange={e => setBookingData({...bookingData, date: e.target.value})}
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Hora disponible:</label>
              <select
                required
                value={bookingData.time}
                onChange={e => setBookingData({...bookingData, time: e.target.value})}
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="">Selecciona una hora...</option>
                {['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
                  '12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30',
                  '17:00','17:30','18:00','18:30'].map(t => (
                  <option key={t} value={t}>{t} hrs</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '700', marginTop: '1rem', cursor: 'pointer' }}>
              Confirmar Reserva
            </button>
          </form>
        </div>
      </div>
    );
  }

  const TREATMENT_PRICES = {
    "Blanqueamiento Dental": { original: 150000, discount: 127500 },
    "Ortodoncia (Frenillos/Alineadores)": { original: 400000, discount: 340000 },
    "Implantes Dentales": { original: 850000, discount: 722500 },
    "Endodoncia": { original: 180000, discount: 153000 }
  };

  // ESTADO 2: CAPTURA DE DATOS
  if (flowState === 'lead_capture') {
    const selectedTreatment = answers['initial'];
    const prices = TREATMENT_PRICES[selectedTreatment] || { original: 0, discount: 0 };
    const formatCurrency = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

    return (
      <div className="animate-fade-in" style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={styles.question}>¡Tenemos la solución perfecta para ti!</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Según tus respuestas, eres un excelente candidato. Tu presupuesto referencial:
          </p>

          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '1.1rem', fontWeight: '700' }}>{selectedTreatment}</h4>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.2rem' }}>{formatCurrency(prices.original)}</span>
              <span style={{ fontWeight: '800', color: '#15803d', fontSize: '1.8rem' }}>{formatCurrency(prices.discount)}</span>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#166534', fontSize: '0.85rem', fontWeight: '600' }}>✨ 15% OFF Aplicado</p>
          </div>

          <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            Déjanos tus datos y te enviamos el <strong>Cupón al correo</strong>.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleLeadSubmit}>
            <input
              type="text"
              placeholder="Tu Nombre Completo"
              required
              value={leadData.name}
              onChange={e => setLeadData({...leadData, name: e.target.value})}
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
            <input
              type="tel"
              placeholder="Tu WhatsApp (+569...)"
              required
              value={leadData.phone}
              onChange={e => setLeadData({...leadData, phone: e.target.value})}
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
            <input
              type="email"
              placeholder="Tu Correo Electrónico"
              required
              value={leadData.email}
              onChange={e => setLeadData({...leadData, email: e.target.value})}
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '-0.5rem 0 0 0' }}>
              📧 Te enviaremos tu cupón y recordatorios de cita por correo.
            </p>
            <button
              type="submit"
              disabled={sending}
              style={{ backgroundColor: sending ? '#94a3b8' : 'var(--success)', color: 'white', padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '700', marginTop: '0.5rem', cursor: sending ? 'wait' : 'pointer' }}
            >
              {sending ? 'Enviando cupón... ⏳' : 'Continuar a la Agenda →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ESTADO 1: CUESTIONARIO
  const stepData = FLOWS[currentStep];

  return (
    <div className="animate-fade-in" style={styles.card}>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
      </div>

      {history.length > 0 && (
        <button onClick={handleBack} style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Volver
        </button>
      )}

      <h3 style={styles.question}>{stepData.question}</h3>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {stepData.options.map((option, idx) => (
          <button
            key={idx}
            style={styles.optionBtn}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = '#eff6ff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.backgroundColor = 'var(--background)';
            }}
            onClick={() => handleOptionClick(option)}
          >
            {option.text}
            <span style={{ color: 'var(--text-light)' }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
