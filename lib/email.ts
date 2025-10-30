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
  description?: string
}) {
  try {
    // In development zonder email config, log naar console
    if (isDevelopmentWithoutEmail) {
      console.log('\n========================================')
      console.log('📧 APPOINTMENT EMAIL (Development Mode)')
      console.log('========================================')
      console.log(`Naar: ${email}`)
      console.log(`Naam: ${data.name}`)
      console.log(`Datum: ${data.date}`)
      console.log(`Tijd: ${data.time}`)
      console.log(`Dienst: ${data.service}`)
      if (data.description) console.log(`Beschrijving: ${data.description}`)
      console.log('========================================\n')
      return
    }

    if (!transporter) {
      console.log('Email transporter not configured, skipping email')
      return
    }
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.be',
      to: email,
      subject: 'Afspraak bevestigd - Koubyte',
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
            .info-box {
              background: white;
              border-left: 4px solid #2563eb;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: bold;
              color: #64748b;
            }
            .info-value {
              color: #1e40af;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">Afspraak Bevestigd</h1>
          </div>
          <div class="content">
            <h2>Beste ${data.name},</h2>
            <p>Bedankt voor je afspraakaanvraag bij Koubyte IT-diensten! We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op.</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Datum:</span>
                <span class="info-value">${data.date}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tijd:</span>
                <span class="info-value">${data.time}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Dienst:</span>
                <span class="info-value">${data.service}</span>
              </div>
            </div>

            ${data.description ? `
            <div style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Je aanvraag:</strong>
              <p style="margin: 10px 0 0 0; color: #475569;">${data.description}</p>
            </div>
            ` : ''}

            <p>We zullen je binnen 24 uur bevestigen of deze datum en tijd beschikbaar zijn. Als je vragen hebt, kun je altijd contact met ons opnemen.</p>

            <p style="margin-top: 30px;">
              Met vriendelijke groet,<br>
              <strong>Team Koubyte</strong>
            </p>
          </div>
          <div class="footer">
            <p>Koubyte IT-diensten | Professionele IT-oplossingen</p>
            <p style="font-size: 12px;">Email: info@koubyte.be | Website: https://koubyte.be</p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Error sending appointment email:', error)
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
    // In development zonder email config, log naar console
    if (isDevelopmentWithoutEmail) {
      console.log('\n========================================')
      console.log('📧 CONTACT EMAIL (Development Mode)')
      console.log('========================================')
      console.log(`Naar: ${process.env.ADMIN_EMAIL || process.env.SMTP_USER}`)
      console.log(`Van: ${data.name} (${data.email})`)
      console.log(`Telefoon: ${data.phone || 'Niet opgegeven'}`)
      console.log(`Onderwerp: ${data.subject}`)
      console.log(`Bericht: ${data.message}`)
      console.log('========================================\n')
      return
    }

    if (!transporter) {
      console.log('Email transporter not configured, skipping email')
      return
    }
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.be',
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      replyTo: data.email,
      subject: `Nieuw contactformulier: ${data.subject}`,
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
            .info-box {
              background: white;
              border-left: 4px solid #2563eb;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: bold;
              color: #64748b;
              width: 120px;
            }
            .info-value {
              color: #1e40af;
            }
            .message-box {
              background: #f1f5f9;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
              white-space: pre-wrap;
            }
            .reply-button {
              display: inline-block;
              background: #2563eb;
              color: white !important;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">Nieuw Contactformulier Bericht</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Naam:</span>
                <span class="info-value">${data.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value"><a href="mailto:${data.email}">${data.email}</a></span>
              </div>
              ${data.phone ? `
              <div class="info-row">
                <span class="info-label">Telefoon:</span>
                <span class="info-value"><a href="tel:${data.phone}">${data.phone}</a></span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="info-label">Onderwerp:</span>
                <span class="info-value">${data.subject}</span>
              </div>
            </div>

            <div class="message-box">
              ${data.message.replace(/\n/g, '<br>')}
            </div>

            <a href="mailto:${data.email}?subject=Re: ${data.subject}" class="reply-button">Antwoord sturen</a>

            <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
              Dit bericht is ontvangen via het contactformulier op koubyte.be
            </p>
          </div>
          <div class="footer">
            <p>Koubyte IT-diensten | Admin Panel</p>
          </div>
        </body>
        </html>
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

// Verstuur wachtwoord reset email
export async function sendPasswordResetEmail(email: string, data: {
  name: string
  resetToken: string
}) {
  try {
    // In development zonder email config, log naar console
    if (isDevelopmentWithoutEmail) {
      console.log('\n========================================')
      console.log('📧 PASSWORD RESET EMAIL (Development Mode)')
      console.log('========================================')
      console.log(`Naar: ${email}`)
      console.log(`Naam: ${data.name}`)
      console.log(`Reset Link: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${data.resetToken}`)
      console.log('========================================\n')
      return
    }

    if (!transporter) {
      throw new Error('Email transporter niet geconfigureerd')
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://koubyte.be'}/auth/reset-password?token=${data.resetToken}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.be',
      to: email,
      subject: 'Wachtwoord resetten - Koubyte',
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
            .button {
              display: inline-block;
              background: #2563eb;
              color: white !important;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .button:hover {
              background: #1e40af;
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
            .link-fallback {
              background: #e0e7ff;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              word-break: break-all;
              font-size: 12px;
              color: #1e40af;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">Wachtwoord Resetten</h1>
          </div>
          <div class="content">
            <h2>Hallo ${data.name},</h2>
            <p>Je hebt aangevraagd om je wachtwoord te resetten voor je Koubyte account.</p>
            
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Wachtwoord</a>
            </p>

            <p>Of kopieer en plak deze link in je browser:</p>
            <div class="link-fallback">
              ${resetUrl}
            </div>

            <div class="warning">
              <strong>⚠️ Belangrijk:</strong> Deze link is <strong>1 uur geldig</strong> en kan slechts één keer gebruikt worden. Als je deze link niet hebt aangevraagd, kun je deze email negeren.
            </div>

            <p>Als je geen wachtwoord reset hebt aangevraagd, kan je je account veilig negeren. Je huidige wachtwoord blijft geldig.</p>

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
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Verstuur order confirmation email naar klant
export async function sendOrderConfirmationEmail(email: string, data: {
  name: string
  orderNumber: string
  orderDate: string
  items: Array<{
    serviceName: string
    quantity: number
    price: number
  }>
  subtotal: number
  discountAmount?: number
  total: number
  paymentMethod: string
  address?: {
    street: string
    houseNumber: string
    postalCode: string
    city: string
    country: string
  }
}) {
  try {
    // In development zonder email config, log naar console
    if (isDevelopmentWithoutEmail) {
      console.log('\n========================================')
      console.log('📧 ORDER CONFIRMATION EMAIL (Development Mode)')
      console.log('========================================')
      console.log(`Naar: ${email}`)
      console.log(`Naam: ${data.name}`)
      console.log(`Ordernummer: ${data.orderNumber}`)
      console.log(`Totaal: €${data.total.toFixed(2)}`)
      console.log(`Items: ${data.items.length}`)
      console.log('========================================\n')
      return
    }

    if (!transporter) {
      console.log('Email transporter not configured, skipping email')
      return
    }

    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.serviceName}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}x</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">€${item.price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">€${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.be',
      to: email,
      subject: `Bestelling bevestigd - ${data.orderNumber} - Koubyte`,
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
            .order-box {
              background: white;
              border: 2px solid #2563eb;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .order-number {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              margin: 20px 0;
              border-radius: 8px;
              overflow: hidden;
            }
            th {
              background: #f1f5f9;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              color: #475569;
            }
            td {
              padding: 12px;
            }
            .total-row {
              background: #f1f5f9;
              font-weight: bold;
              font-size: 18px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">Bestelling Bevestigd</h1>
          </div>
          <div class="content">
            <h2>Beste ${data.name},</h2>
            <p>Bedankt voor je bestelling bij Koubyte IT-diensten! We hebben je bestelling ontvangen en zullen deze zo snel mogelijk verwerken.</p>
            
            <div class="order-box">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Bestelnummer</p>
              <div class="order-number">${data.orderNumber}</div>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">${data.orderDate}</p>
            </div>

            <h3 style="margin-top: 30px;">Bestelde diensten:</h3>
            <table>
              <thead>
                <tr>
                  <th>Dienst</th>
                  <th style="text-align: center;">Aantal</th>
                  <th style="text-align: right;">Prijs</th>
                  <th style="text-align: right;">Totaal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr>
                  <td colspan="3" style="text-align: right; padding-top: 15px; border-top: 2px solid #e5e7eb;">Subtotaal:</td>
                  <td style="text-align: right; padding-top: 15px; border-top: 2px solid #e5e7eb;">€${data.subtotal.toFixed(2)}</td>
                </tr>
                ${data.discountAmount && data.discountAmount > 0 ? `
                <tr>
                  <td colspan="3" style="text-align: right;">Korting:</td>
                  <td style="text-align: right; color: #10b981;">-€${data.discountAmount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Totaal:</td>
                  <td style="text-align: right; font-size: 20px; color: #2563eb;">€${data.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            ${data.address ? `
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Bezorgadres:</h3>
              <p style="margin: 5px 0;">
                ${data.address.street} ${data.address.houseNumber}<br>
                ${data.address.postalCode} ${data.address.city}<br>
                ${data.address.country}
              </p>
            </div>
            ` : ''}

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <strong>ℹ️ Betaalmethode:</strong> ${data.paymentMethod}<br>
              Je ontvangt een aparte email zodra je betaling is ontvangen.
            </div>

            <p>We houden je op de hoogte over de status van je bestelling. Als je vragen hebt, kun je altijd contact met ons opnemen.</p>

            <p style="margin-top: 30px;">
              Met vriendelijke groet,<br>
              <strong>Team Koubyte</strong>
            </p>
          </div>
          <div class="footer">
            <p>Koubyte IT-diensten | Professionele IT-oplossingen</p>
            <p style="font-size: 12px;">Email: info@koubyte.be | Website: https://koubyte.be</p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw error
  }
}

// Verstuur admin notification email voor nieuwe orders/afspraken
export async function sendAdminNotificationEmail(type: 'order' | 'appointment' | 'contact', data: {
  orderNumber?: string
  customerName: string
  customerEmail: string
  total?: number
  date?: string
  time?: string
  service?: string
  subject?: string
}) {
  try {
    // In development zonder email config, log naar console
    if (isDevelopmentWithoutEmail) {
      console.log('\n========================================')
      console.log('📧 ADMIN NOTIFICATION EMAIL (Development Mode)')
      console.log('========================================')
      console.log(`Type: ${type}`)
      if (data.orderNumber) console.log(`Ordernummer: ${data.orderNumber}`)
      console.log(`Klant: ${data.customerName} (${data.customerEmail})`)
      if (data.total) console.log(`Totaal: €${data.total.toFixed(2)}`)
      console.log('========================================\n')
      return
    }

    if (!transporter) {
      console.log('Email transporter not configured, skipping email')
      return
    }

    const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://koubyte.be'}/admin`
    const typeLabels = {
      order: 'Nieuwe Bestelling',
      appointment: 'Nieuwe Afspraak',
      contact: 'Nieuw Contactformulier'
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'info@koubyte.be',
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `[Koubyte Admin] ${typeLabels[type]}`,
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
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
            .info-box {
              background: white;
              border-left: 4px solid #dc2626;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: bold;
              color: #64748b;
              width: 150px;
            }
            .info-value {
              color: #1e40af;
            }
            .button {
              display: inline-block;
              background: #2563eb;
              color: white !important;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">${typeLabels[type]}</h1>
          </div>
          <div class="content">
            <p>Er is een nieuwe ${type === 'order' ? 'bestelling' : type === 'appointment' ? 'afspraak' : 'contactformulier bericht'} ontvangen:</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Klant:</span>
                <span class="info-value">${data.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></span>
              </div>
              ${data.orderNumber ? `
              <div class="info-row">
                <span class="info-label">Ordernummer:</span>
                <span class="info-value">${data.orderNumber}</span>
              </div>
              ` : ''}
              ${data.total ? `
              <div class="info-row">
                <span class="info-label">Totaal:</span>
                <span class="info-value">€${data.total.toFixed(2)}</span>
              </div>
              ` : ''}
              ${data.date ? `
              <div class="info-row">
                <span class="info-label">Datum:</span>
                <span class="info-value">${data.date}</span>
              </div>
              ` : ''}
              ${data.time ? `
              <div class="info-row">
                <span class="info-label">Tijd:</span>
                <span class="info-value">${data.time}</span>
              </div>
              ` : ''}
              ${data.service ? `
              <div class="info-row">
                <span class="info-label">Dienst:</span>
                <span class="info-value">${data.service}</span>
              </div>
              ` : ''}
              ${data.subject ? `
              <div class="info-row">
                <span class="info-label">Onderwerp:</span>
                <span class="info-value">${data.subject}</span>
              </div>
              ` : ''}
            </div>

            <p style="text-align: center;">
              <a href="${adminUrl}" class="button">Bekijk in Admin Panel</a>
            </p>
          </div>
          <div class="footer">
            <p>Koubyte IT-diensten | Admin Notificatie</p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    throw error
  }
}

