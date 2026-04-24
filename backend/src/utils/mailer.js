// El transporter y su validación viven en config/mailer.js.
// Este módulo expone las funciones de envío de emails que usa el resto de la app.
import transporter from '../config/mailer.js';

const isDev = process.env.NODE_ENV === 'development';

// ---------------------------------------------------------------------------
// sendMail — función base reutilizable
// ---------------------------------------------------------------------------
export async function sendMail({ to, subject, text, html, from }) {
  try {
    const info = await transporter.sendMail({
      from: from || `"Kiendamas Turismo" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ [Mailer] Email enviado a ${to} | messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    const details = {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    };
    if (isDev) details.stack = error.stack;
    console.error('❌ [Mailer] Error enviando email:', details);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// sendRegistrationMail — bienvenida al registrarse
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// sendPasswordRecoveryMail — enlace de recuperación de contraseña
// ---------------------------------------------------------------------------
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

export default transporter;
