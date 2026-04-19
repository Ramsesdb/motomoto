import type { Message } from '@/types';

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

export const MOCK_MESSAGES_WA: Message[] = [
  {
    id: 'msg-wa-001',
    conversationId: 'conv-wa-001',
    channelType: 'whatsapp',
    role: 'inbound',
    content: 'Hola, quería consultar sobre el precio del servicio de mantenimiento para mi moto.',
    status: 'read',
    sentAt: '2025-03-17T08:15:00.000Z',
    deliveredAt: '2025-03-17T08:15:05.000Z',
    readAt: '2025-03-17T08:20:00.000Z',
    classification: 'question',
  },
  {
    id: 'msg-wa-002',
    conversationId: 'conv-wa-001',
    channelType: 'whatsapp',
    role: 'outbound',
    content: 'Buen día María, con gusto te ayudo. El servicio de mantenimiento básico tiene un costo de $800 MXN e incluye revisión general.',
    status: 'read',
    sentAt: '2025-03-17T08:22:00.000Z',
    deliveredAt: '2025-03-17T08:22:10.000Z',
    readAt: '2025-03-17T08:25:00.000Z',
  },
  {
    id: 'msg-wa-003',
    conversationId: 'conv-wa-001',
    channelType: 'whatsapp',
    role: 'inbound',
    content: '¿Incluye el cambio de aceite y filtros? Me interesa agendar para esta semana si es posible.',
    status: 'delivered',
    sentAt: '2025-03-17T10:05:00.000Z',
    deliveredAt: '2025-03-17T10:05:08.000Z',
    classification: 'purchase_intent',
    suggestedReply:
      'Sí, el servicio básico incluye cambio de aceite y filtro de aceite. Para agendar esta semana tenemos disponibilidad el miércoles y jueves a partir de las 9 AM. ¿Cuál horario te conviene mejor?',
  },
];

// ─── Instagram ────────────────────────────────────────────────────────────────

export const MOCK_MESSAGES_IG: Message[] = [
  {
    id: 'msg-ig-001',
    conversationId: 'conv-ig-001',
    channelType: 'instagram',
    role: 'inbound',
    content: 'Vi tu publicación sobre las motos nuevas, ¿las tienen disponibles en color rojo?',
    status: 'read',
    sentAt: '2025-03-17T09:00:00.000Z',
    deliveredAt: '2025-03-17T09:00:12.000Z',
    readAt: '2025-03-17T09:10:00.000Z',
    classification: 'question',
  },
  {
    id: 'msg-ig-002',
    conversationId: 'conv-ig-001',
    channelType: 'instagram',
    role: 'inbound',
    content: 'También quisiera saber si tienen financiamiento disponible. Tengo un presupuesto de $20,000.',
    status: 'delivered',
    sentAt: '2025-03-17T09:30:00.000Z',
    deliveredAt: '2025-03-17T09:30:05.000Z',
    classification: 'purchase_intent',
    suggestedReply:
      'Hola Valentina, ¡claro que sí! Contamos con el modelo disponible en rojo y también ofrecemos financiamiento a 12 y 24 meses con tasa preferencial. Con $20,000 de enganche puedes llevarte el modelo que te interesa. ¿Te gustaría recibir más detalles?',
  },
];

// ─── Facebook ─────────────────────────────────────────────────────────────────

export const MOCK_MESSAGES_FB: Message[] = [
  {
    id: 'msg-fb-001',
    conversationId: 'conv-fb-001',
    channelType: 'facebook',
    role: 'inbound',
    content: 'Tuve un problema con mi moto que compré en su tienda. El motor hace un ruido extraño desde ayer.',
    status: 'read',
    sentAt: '2025-03-16T15:00:00.000Z',
    deliveredAt: '2025-03-16T15:00:20.000Z',
    readAt: '2025-03-16T15:30:00.000Z',
    classification: 'complaint',
  },
  {
    id: 'msg-fb-002',
    conversationId: 'conv-fb-001',
    channelType: 'facebook',
    role: 'outbound',
    content: 'Hola Miguel, lamentamos mucho el inconveniente. ¿Podrías describir mejor el ruido? ¿Es al acelerar, al frenar o constante?',
    status: 'read',
    sentAt: '2025-03-16T15:45:00.000Z',
    deliveredAt: '2025-03-16T15:45:10.000Z',
    readAt: '2025-03-16T16:00:00.000Z',
  },
  {
    id: 'msg-fb-003',
    conversationId: 'conv-fb-001',
    channelType: 'facebook',
    role: 'inbound',
    content: 'Es al acelerar, como un golpeteo metálico. La moto tiene solo 3 meses de uso.',
    status: 'read',
    sentAt: '2025-03-16T16:10:00.000Z',
    deliveredAt: '2025-03-16T16:10:05.000Z',
    readAt: '2025-03-16T16:20:00.000Z',
    classification: 'complaint',
    suggestedReply:
      'Gracias por la descripción, Miguel. El golpeteo al acelerar puede indicar un problema con la cadena o los pistones. Al ser una moto de 3 meses está dentro de garantía. Por favor tráela mañana a nuestro taller y la atendemos de inmediato sin costo alguno.',
  },
];

// ─── SMS ──────────────────────────────────────────────────────────────────────

export const MOCK_MESSAGES_SMS: Message[] = [
  {
    id: 'msg-sms-001',
    conversationId: 'conv-sms-001',
    channelType: 'sms',
    role: 'inbound',
    content: 'Hola, me interesa la moto que publicaron en $15,000. ¿Sigue disponible?',
    status: 'read',
    sentAt: '2025-03-17T11:00:00.000Z',
    deliveredAt: '2025-03-17T11:00:03.000Z',
    readAt: '2025-03-17T11:05:00.000Z',
    classification: 'purchase_intent',
  },
  {
    id: 'msg-sms-002',
    conversationId: 'conv-sms-001',
    channelType: 'sms',
    role: 'inbound',
    content: '¿Aceptan permuta con moto usada?',
    status: 'delivered',
    sentAt: '2025-03-17T11:30:00.000Z',
    deliveredAt: '2025-03-17T11:30:02.000Z',
    classification: 'question',
    suggestedReply:
      'Hola Sofía, sí, la moto sigue disponible. Aceptamos permutas con evaluación previa sin costo. ¿Cuál es el modelo y año de tu moto actual para darte una estimación de valor?',
  },
];

// ─── Email ────────────────────────────────────────────────────────────────────

export const MOCK_MESSAGES_EMAIL: Message[] = [
  {
    id: 'msg-email-001',
    conversationId: 'conv-email-001',
    channelType: 'email',
    role: 'inbound',
    content:
      'Buenos días, solicito información sobre los planes corporativos para flota de motocicletas. Somos una empresa de mensajería con 20 unidades en operación.',
    status: 'read',
    sentAt: '2025-03-15T09:00:00.000Z',
    deliveredAt: '2025-03-15T09:00:30.000Z',
    readAt: '2025-03-15T10:00:00.000Z',
    classification: 'purchase_intent',
  },
  {
    id: 'msg-email-002',
    conversationId: 'conv-email-001',
    channelType: 'email',
    role: 'outbound',
    content:
      'Buenos días Diego, gracias por contactarnos. Contamos con planes corporativos especiales para flotas de más de 5 unidades con descuentos de hasta el 18%. Le comparto nuestro catálogo y propuesta de financiamiento para 20 unidades.',
    status: 'read',
    sentAt: '2025-03-15T11:30:00.000Z',
    deliveredAt: '2025-03-15T11:30:15.000Z',
    readAt: '2025-03-15T14:00:00.000Z',
  },
  {
    id: 'msg-email-003',
    conversationId: 'conv-email-001',
    channelType: 'email',
    role: 'inbound',
    content:
      'Muchas gracias por la información. Revisé el catálogo y nos interesa el Modelo Pro Cargo. ¿Podría agendar una reunión para la próxima semana?',
    status: 'read',
    sentAt: '2025-03-16T08:00:00.000Z',
    deliveredAt: '2025-03-16T08:00:20.000Z',
    readAt: '2025-03-16T09:00:00.000Z',
    classification: 'purchase_intent',
    suggestedReply:
      'Excelente elección, Diego. El Modelo Pro Cargo es ideal para flotas de mensajería por su durabilidad y bajo costo de mantenimiento. Tenemos disponibilidad para reunión el lunes 24 o martes 25 de marzo. ¿Cuál horario le conviene?',
  },
];

// ─── Lookup map ───────────────────────────────────────────────────────────────

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-wa-001': MOCK_MESSAGES_WA,
  'conv-ig-001': MOCK_MESSAGES_IG,
  'conv-fb-001': MOCK_MESSAGES_FB,
  'conv-sms-001': MOCK_MESSAGES_SMS,
  'conv-email-001': MOCK_MESSAGES_EMAIL,
};
