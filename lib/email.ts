import nodemailer from 'nodemailer'

// Check of we in development mode zijn zonder email config
const isDevelopmentWithoutEmail = 
  process.env.NODE_ENV === 'development' && 
  (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD)

// Email transporter configuratie
const transporter = isDevelopmentWithoutEmail 
  ? null 
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true voor SSL (port 465), false voor TLS (port 587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

// Verstuur email voor nieuwe afspraak
export async function sendAppointmentEmail(email: string, data: {
  name: string
  date: string
  time: string
  service: string
}) {
  try {
    if (!transporter) {
      console.log('Email transporter not configured, skipping email')
      return
    }
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.nl',
      to: email,
      subject: 'Afspraak bevestigd - Koubyte',
      html: `
        <h2>Bedankt voor je afspraak, ${data.name}!</h2>
        <p>Je afspraak is aangemaakt:</p>
        <ul>
          <li><strong>Datum:</strong> ${data.date}</li>
          <li><strong>Tijd:</strong> ${data.time}</li>
          <li><strong>Dienst:</strong> ${data.service}</li>
        </ul>
        <p>We nemen zo snel mogelijk contact met je op om de afspraak te bevestigen.</p>
        <p>Met vriendelijke groet,<br>Koubyte IT-diensten</p>
      `,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Verstuur contactformulier email naar admin
export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  try {
    if (!transporter) {
      console.log('Email transporter not configured, skipping email')
      return
    }
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `Contactformulier: ${data.subject}`,
      html: `
        <h2>Nieuw contactformulier bericht</h2>
        <p><strong>Naam:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Telefoon:</strong> ${data.phone}</p>` : ''}
        <p><strong>Onderwerp:</strong> ${data.subject}</p>
        <p><strong>Bericht:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    })
  } catch (error) {
    console.error('Error sending contact email:', error)
    throw error
  }
}

// Verstuur offerte email
export async function sendQuoteEmail(email: string, data: {
  name: string
  service: string
  estimatedPrice?: number
}) {
  try {
    if (!transporter) {
      console.log('Email transporter not configured, skipping email')
      return
    }
    
    const priceText = data.estimatedPrice 
      ? `<p><strong>Geschatte prijs:</strong> €${data.estimatedPrice.toFixed(2)}</p>`
      : '<p>We zullen zo snel mogelijk een offerte opstellen.</p>'
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.nl',
      to: email,
      subject: 'Offerte ontvangen - Koubyte',
      html: `
        <h2>Bedankt voor je offerteaanvraag, ${data.name}!</h2>
        <p>Je hebt een offerte aangevraagd voor: <strong>${data.service}</strong></p>
        ${priceText}
        <p>We nemen zo snel mogelijk contact met je op.</p>
        <p>Met vriendelijke groet,<br>Koubyte IT-diensten</p>
      `,
    })
  } catch (error) {
    console.error('Error sending quote email:', error)
    throw error
  }
}

// Verstuur email verificatie code
export async function sendVerificationEmail(email: string, data: {
  name: string
  verificationCode: string
}) {
  try {
    // In development zonder email config, log naar console
    if (isDevelopmentWithoutEmail) {
      console.log('\n========================================')
      console.log('📧 VERIFICATIE EMAIL (Development Mode)')
      console.log('========================================')
      console.log(`Naar: ${email}`)
      console.log(`Naam: ${data.name}`)
      console.log(`Verificatiecode: ${data.verificationCode}`)
      console.log('========================================\n')
      return
    }

    if (!transporter) {
      throw new Error('Email transporter niet geconfigureerd')
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.nl',
      to: email,
      subject: 'Verifieer je email - Koubyte',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8fafc;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .code-box {
              background: white;
              border: 3px solid #2563eb;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #2563eb;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #64748b;
              font-size: 14px;
            }
            .warning {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">Welkom bij Koubyte!</h1>
          </div>
          <div class="content">
            <h2>Hallo ${data.name},</h2>
            <p>Bedankt voor je registratie bij Koubyte IT-diensten! Om je account te activeren, hebben we een verificatiecode voor je gegenereerd.</p>
            
            <div class="code-box">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">JOUW VERIFICATIECODE</p>
              <div class="code">${data.verificationCode}</div>
            </div>

            <p>Voer deze code in op de verificatie pagina om je account te activeren. Deze code is <strong>15 minuten geldig</strong>.</p>

            <div class="warning">
              <strong>⚠️ Belangrijk:</strong> Deel deze code nooit met anderen. Koubyte zal je nooit om deze code vragen via telefoon of email.
            </div>

            <p>Als je geen account hebt aangemaakt bij Koubyte, kun je deze email negeren.</p>

            <p style="margin-top: 30px;">
              Met vriendelijke groet,<br>
              <strong>Team Koubyte</strong>
            </p>
          </div>
          <div class="footer">
            <p>Koubyte IT-diensten | Professionele IT-oplossingen</p>
            <p style="font-size: 12px;">Deze email is verstuurd naar ${email}</p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

