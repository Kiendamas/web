import getTransporter, { getMailEnv, MAIL_TRANSPORT } from '../config/mailer.js';

const isDev = process.env.NODE_ENV === 'development';

function getFromAddress(from) {
  return from || `"Kiendamas Turismo" <${getMailEnv('USER')}>`;
}

function parseSender(from) {
  const value = getFromAddress(from);
  const match = value.match(/^"([^"]+)"\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1], email: match[2] };
  }
  return { name: 'Kiendamas Turismo', email: getMailEnv('USER') };
}

async function sendViaResend({ to, subject, text, html, from, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('[Mailer] RESEND_API_KEY no configurada');
  }

  const fromAddress = from || process.env.MAIL_FROM || 'Kiendamas Turismo <onboarding@resend.dev>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo && { reply_to: replyTo }),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Resend API respondió ${response.status}`);
  }

  console.log(`✅ [Mailer] Email enviado vía Resend a ${to} | id: ${data.id}`);
  return { messageId: data.id, provider: 'resend' };
}

async function sendViaBrevo({ to, subject, text, html, from }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('[Mailer] BREVO_API_KEY no configurada');
  }

  const sender = parseSender(from);
  if (!sender.email) {
    throw new Error('[Mailer] MAIL_USER no configurada (remitente verificado en Brevo)');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Brevo API respondió ${response.status}`);
  }

  console.log(`✅ [Mailer] Email enviado vía Brevo a ${to} | messageId: ${data.messageId}`);
  return { messageId: data.messageId, provider: 'brevo' };
}

async function sendViaSmtp({ to, subject, text, html, from }) {
  const info = await getTransporter().sendMail({
    from: getFromAddress(from),
    to,
    subject,
    text,
    html,
  });

  console.log(`✅ [Mailer] Email enviado vía SMTP a ${to} | messageId: ${info.messageId}`);
  return info;
}

export async function sendMail({ to, subject, text, html, from, replyTo }) {
  try {
    if (MAIL_TRANSPORT === 'resend') {
      return await sendViaResend({ to, subject, text, html, from, replyTo });
    }
    if (MAIL_TRANSPORT === 'brevo') {
      return await sendViaBrevo({ to, subject, text, html, from });
    }
    return await sendViaSmtp({ to, subject, text, html, from });
  } catch (error) {
    const details = {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      transport: MAIL_TRANSPORT,
    };
    if (isDev) details.stack = error.stack;
    console.error('❌ [Mailer] Error enviando email:', details);
    throw error;
  }
}

export async function sendRegistrationMail(to) {
  return sendMail({
    to,
    subject: '¡Registro exitoso! - Kiendamas Turismo',
    text: '¡Bienvenido a Kiendamas Turismo! Tu registro fue exitoso. Ya podés explorar nuestros paquetes turísticos e iniciar sesión.',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>¡Bienvenido a Kiendamas Turismo!</h2>
        <p>Tu registro fue completado con éxito.</p>
        <p>Ya podés explorar nuestros paquetes turísticos e iniciar sesión en la plataforma.</p>
      </div>
    `,
  });
}

export async function sendPasswordRecoveryMail(to, token) {
  const baseUrl =
    process.env.FRONTEND_URL ||
    (isDev ? 'http://localhost:5173' : null);

  if (!baseUrl) {
    throw new Error(
      '[Mailer] FRONTEND_URL no está definida. No se puede construir el enlace de recuperación.'
    );
  }

  const recoveryUrl = `${baseUrl}/reset-password?token=${token}`;

  return sendMail({
    to,
    subject: 'Recuperación de contraseña - Kiendamas Turismo',
    text:
      `Recibiste este email porque solicitaste recuperar tu contraseña.\n\n` +
      `Hacé clic en el siguiente enlace para continuar:\n${recoveryUrl}\n\n` +
      `Si no solicitaste esto, podés ignorar este email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>Recuperación de contraseña</h2>
        <p>Recibiste este email porque solicitaste recuperar tu contraseña.</p>
        <p>
          <a href="${recoveryUrl}"
             style="display:inline-block; padding:10px 20px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none;">
            Restablecer contraseña
          </a>
        </p>
        <p style="color:#6b7280; font-size:0.875rem;">
          O copiá este enlace en tu navegador:<br/>
          <a href="${recoveryUrl}">${recoveryUrl}</a>
        </p>
        <p style="color:#9ca3af; font-size:0.75rem;">
          Si no solicitaste esto, podés ignorar este email.
        </p>
      </div>
    `,
  });
}

export default getTransporter;
