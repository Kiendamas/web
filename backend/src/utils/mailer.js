import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Validar configuración
const requiredEnvVars = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('⚠️ Variables de entorno faltantes para el mailer:', missingVars.join(', '));
} else {
  console.log('✅ Configuración de email cargada correctamente');
  console.log('📧 Email configurado:', process.env.MAIL_USER);
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: process.env.MAIL_PORT === '465', // true para puerto 465, false para otros
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  debug: process.env.NODE_ENV === 'development', // Activar debug en desarrollo
  logger: process.env.NODE_ENV === 'development', // Logging en desarrollo
});

// Verificar conexión al iniciar
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Error en la configuración del servidor de email:', error.message);
  } else {
    console.log('✅ Servidor de email listo para enviar mensajes');
  }
});

export async function sendMail({ to, subject, text, html, from }) {
  try {
    const info = await transporter.sendMail({
      from: from || `"Kiendamas Turismo" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    
    console.log('✅ Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
    throw error;
  }
}

export async function sendRegistrationMail(to) {
  return sendMail({
    to,
    subject: 'Registro exitoso',
    text: '¡Bienvenido! Tu registro fue exitoso.',
  });
}

export async function sendPasswordRecoveryMail(to, token) {
  const recoveryUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  return sendMail({
    to,
    subject: 'Recuperación de contraseña',
    text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: ${recoveryUrl}`,
    html: `<p>Para recuperar tu contraseña, haz clic en el siguiente enlace:</p><a href="${recoveryUrl}">${recoveryUrl}</a>`
  });
}

export default transporter;
