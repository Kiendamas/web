import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const MAIL_TRANSPORT = (() => {
  if (process.env.MAIL_TRANSPORT) {
    return process.env.MAIL_TRANSPORT.toLowerCase();
  }
  if (process.env.RESEND_API_KEY) {
    return 'resend';
  }
  if (process.env.BREVO_API_KEY) {
    return 'brevo';
  }
  return 'smtp';
})();

// Soporta MAIL_* (preferido) y SMTP_* (legacy)
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

// Resend en modo prueba solo permite enviar al email de la cuenta registrada.
export function getContactInbox() {
  if (process.env.CONTACT_INBOX) {
    return process.env.CONTACT_INBOX;
  }
  if (MAIL_TRANSPORT === 'resend') {
    return getMailEnv('USER') || 'kiendamasturismo@gmail.com';
  }
  return 'consultas.kiendamas@gmail.com';
}

const mailConfig = getMailConfig();
const smtpFields = ['host', 'port', 'user', 'pass'];
const missingSmtpFields = smtpFields.filter(
  (field) => !mailConfig[field] || Number.isNaN(mailConfig.port)
);

if (MAIL_TRANSPORT === 'resend') {
  if (!process.env.RESEND_API_KEY) {
    console.error('⚠️  [Mailer] MAIL_TRANSPORT=resend pero falta RESEND_API_KEY.');
  } else {
    const from = process.env.MAIL_FROM || 'Kiendamas Turismo <onboarding@resend.dev>';
    console.log(`✅ [Mailer] Transporte Resend API | remitente: ${from}`);
  }
} else if (MAIL_TRANSPORT === 'brevo') {
  if (!process.env.BREVO_API_KEY) {
    console.error('⚠️  [Mailer] MAIL_TRANSPORT=brevo pero falta BREVO_API_KEY.');
  } else if (!getMailEnv('USER')) {
    console.error('⚠️  [Mailer] MAIL_TRANSPORT=brevo pero falta MAIL_USER (remitente verificado).');
  } else {
    console.log(`✅ [Mailer] Transporte Brevo API | remitente: ${getMailEnv('USER')}`);
  }
} else if (missingSmtpFields.length > 0) {
  console.error(
    `⚠️  [Mailer] Configuración SMTP incompleta (${missingSmtpFields.join(', ')}).\n` +
      '   Definí MAIL_HOST, MAIL_PORT, MAIL_USER y MAIL_PASS.\n' +
      '   En producción con timeout SMTP, usá MAIL_TRANSPORT=resend + RESEND_API_KEY (sin SMS).'
  );
} else {
  console.log(
    `✅ [Mailer] Transporte SMTP | ${mailConfig.host}:${mailConfig.port} | usuario: ${mailConfig.user}`
  );
  if (process.env.RENDER) {
    console.warn(
      '⚠️  [Mailer] Render bloquea SMTP saliente. En producción usá RESEND_API_KEY o BREVO_API_KEY.'
    );
  }
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
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    ...(process.env.MAIL_FORCE_IPV4 === 'true' && { family: 4 }),
    tls: {
      rejectUnauthorized: true,
    },
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });
}

export function getTransporter() {
  if (MAIL_TRANSPORT !== 'smtp') {
    throw new Error(
      `[Mailer] MAIL_TRANSPORT=${MAIL_TRANSPORT}. Usá sendMail() en lugar del transporter SMTP.`
    );
  }

  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

function verifySmtpConnection() {
  if (MAIL_TRANSPORT !== 'smtp' || missingSmtpFields.length > 0) {
    return;
  }

  getTransporter().verify((error) => {
    if (error) {
      const hint =
        error.message?.includes('timeout') || error.code === 'ETIMEDOUT'
          ? ' Muchos hosts cloud bloquean SMTP (587/465). Usá MAIL_TRANSPORT=resend + RESEND_API_KEY.'
          : '';
      console.error(`❌ [Mailer] Error verificando conexión SMTP: ${error.message}.${hint}`);
    } else {
      console.log('✅ [Mailer] Servidor SMTP listo para enviar mensajes');
    }
  });
}

verifySmtpConnection();

export default getTransporter;
