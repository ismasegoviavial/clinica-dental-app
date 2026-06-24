import { useState, useRef, useEffect } from 'react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el asistente con IA de Clínica Premium 🦷. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const norm = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let botResponse = "Para darte información más exacta, por favor completa el cuestionario en esta página y te enviaremos todo por correo.";

      if (norm.includes('precio') || norm.includes('cuanto') || norm.includes('valor')) {
        botResponse = "Los valores dependen de tu diagnóstico inicial. Responde el cuestionario y te entregaremos un presupuesto personalizado con descuento incluido.";
      } else if (norm.includes('hola') || norm.includes('buenos') || norm.includes('buenas')) {
        botResponse = "¡Hola! ¿Estás buscando información sobre blanqueamiento, implantes o endodoncia?";
      } else if (norm.includes('donde') || norm.includes('direccion') || norm.includes('ubicacion')) {
        botResponse = "Estamos en Av. Providencia 1234, a pasos del metro. 📍 Con estacionamiento gratuito.";
      } else if (norm.includes('hora') || norm.includes('agenda') || norm.includes('cita')) {
        botResponse = "Para agendar, completa el cuestionario arriba y al final podrás elegir tu hora directamente. ¡Es muy rápido!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          backgroundColor: 'var(--primary)', color: 'white',
          border: 'none', borderRadius: '50%', width: '60px', height: '60px',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', cursor: 'pointer',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, fontSize: '1.8rem',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)', transition: 'transform 0.2s'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '6rem', right: '2rem',
          width: '350px', height: '500px',
          backgroundColor: 'var(--surface)', borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          zIndex: 1000, border: '1px solid var(--border)'
        }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>🤖</div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Asistente IA</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Responde al instante</p>
            </div>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.75rem 1rem', borderRadius: '16px',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-dark)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                  fontSize: '0.9rem', lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '0.75rem 1rem', borderRadius: '16px', backgroundColor: 'white', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', backgroundColor: 'white' }}>
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, padding: '0.75rem', borderRadius: '999px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
            />
            <button type="submit" disabled={!input.trim()} style={{
              backgroundColor: input.trim() ? 'var(--primary)' : 'var(--border)',
              color: 'white', border: 'none', borderRadius: '50%',
              width: '40px', height: '40px', cursor: input.trim() ? 'pointer' : 'default'
            }}>➤</button>
          </form>
        </div>
      )}
    </>
  );
}
