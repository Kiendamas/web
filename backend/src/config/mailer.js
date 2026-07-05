import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Soporta MAIL_* (preferido) y SMTP_* (legacy / .env.example anterior)
export function getMailEnv(name) {
  return process.env[`MAIL_${name}`] || process.env[`SMTP_${name}`] || '';
}

export function getMailConfig() {
  return {
    host: getMailEnv('HOST'),
    port: Number(getMailEnv('PORT')),
    user: getMailEnv('USER'),
    pass: getMailEnv('PASS'),
  };
}

const mailConfig = getMailConfig();
const missingFields = ['host', 'port', 'user', 'pass'].filter(
  (field) => !mailConfig[field] || Number.isNaN(mailConfig.port)
);

if (missingFields.length > 0) {
  console.error(
    `⚠️  [Mailer] Configuración SMTP incompleta (${missingFields.join(', ')}).\n` +
      '   Definí MAIL_HOST, MAIL_PORT, MAIL_USER y MAIL_PASS (o SMTP_* equivalentes).\n' +
      '   El envío de emails no funcionará hasta que estén configuradas.'
  );
} else {
  console.log(`✅ [Mailer] Configuración SMTP cargada | usuario: ${mailConfig.user}`);
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

let transporter = null;

function createTransporter() {
  const { host, port, user, pass } = getMailConfig();

  if (!host || !port || !user || !pass || Number.isNaN(port)) {
    throw new Error(
      '[Mailer] Configuración SMTP incompleta. Revisá MAIL_HOST, MAIL_PORT, MAIL_USER y MAIL_PASS.'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: true,
    },
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });
}

export function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

if (missingFields.length === 0) {
  getTransporter().verify((error) => {
    if (error) {
      console.error('❌ [Mailer] Error verificando conexión SMTP:', error.message);
    } else {
      console.log('✅ [Mailer] Servidor SMTP listo para enviar mensajes');
    }
  });
}

export default getTransporter;
