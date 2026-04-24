import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Validación de variables de entorno
// No detiene la app, pero logea claramente los problemas para facilitar el debug.
// ---------------------------------------------------------------------------
const requiredVars = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
const missingVars = requiredVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(
    `⚠️  [Mailer] Variables de entorno faltantes: ${missingVars.join(', ')}.\n` +
      '   El envío de emails no funcionará hasta que estén configuradas.'
  );
} else {
  console.log(`✅ [Mailer] Configuración SMTP cargada | usuario: ${process.env.MAIL_USER}`);
}

if (!process.env.FRONTEND_URL) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  [Mailer] FRONTEND_URL no está definida. Usando fallback: http://localhost:5173');
  } else {
    console.warn(
      '⚠️  [Mailer] FRONTEND_URL no está definida. ' +
        'Los enlaces de recuperación de contraseña no funcionarán en producción.'
    );
  }
}

// ---------------------------------------------------------------------------
// Transporter
// Diseñado para funcionar con Gmail (App Password) y fácilmente intercambiable
// por Brevo / Resend / SendGrid cambiando solo las variables de entorno.
// ---------------------------------------------------------------------------
const port = Number(process.env.MAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port,
  secure: port === 465, // true → SSL/TLS directo (ej. Gmail 465); false → STARTTLS (ej. Brevo 587)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true, // Rechaza certificados inválidos en producción
  },
  debug: process.env.NODE_ENV === 'development', // Logs detallados solo en desarrollo
  logger: process.env.NODE_ENV === 'development',
});

// Verifica la conexión al arrancar solo cuando la configuración está completa
if (missingVars.length === 0) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ [Mailer] Error verificando conexión SMTP:', error.message);
    } else {
      console.log('✅ [Mailer] Servidor SMTP listo para enviar mensajes');
    }
  });
}

export default transporter;
