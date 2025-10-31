import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Download factuur voor order (gebruiker die order heeft geplaatst of admin)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Haal order op
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            service: true,
          },
        },
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 })
    }

    // Check toegang: gebruiker moet eigen order zijn of admin zijn
    if (session.user.role !== 'admin' && session.user.id !== order.userId) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    // Genereer HTML factuur
    const invoiceHtml = generateInvoiceHTML(order)

    // Return HTML (kan later naar PDF geconverteerd worden met een library zoals puppeteer)
    return new NextResponse(invoiceHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="factuur-${order.orderNumber}.html"`,
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Fout bij genereren factuur' }, { status: 500 })
  }
}

function generateInvoiceHTML(order: any) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const subtotal = order.totalAmount
  const discount = order.discountAmount || 0
  const total = order.finalAmount || order.totalAmount

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factuur ${order.orderNumber} - Koubyte</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #f5f5f5;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #2563eb;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .invoice-number {
      font-size: 18px;
      color: #666;
    }
    .company-info {
      margin-bottom: 30px;
    }
    .company-info h3 {
      color: #2563eb;
      margin-bottom: 10px;
      font-size: 20px;
    }
    .customer-info {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .customer-info h3 {
      color: #2563eb;
      margin-bottom: 15px;
      font-size: 18px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #2563eb;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 20px;
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .totals-row.total {
      font-size: 20px;
      font-weight: bold;
      border-top: 2px solid #2563eb;
      padding-top: 15px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <div class="logo">Koubyte</div>
        <div style="margin-top: 10px; color: #666;">
          IT-diensten<br>
          info@koubyte.be<br>
          +32 484 52 26 62
        </div>
      </div>
      <div class="invoice-info">
        <div class="invoice-title">FACTUUR</div>
        <div class="invoice-number">${order.orderNumber}</div>
        <div style="margin-top: 20px; color: #666;">
          Datum: ${orderDate}
        </div>
      </div>
    </div>

    <div class="customer-info">
      <h3>Factuuradres</h3>
      <div>
        <strong>${order.customerName}</strong><br>
        ${order.customerEmail}<br>
        ${order.customerPhone || ''}<br>
        ${order.street ? `${order.street} ${order.houseNumber || ''}` : ''}<br>
        ${order.postalCode || ''} ${order.city || ''}<br>
        ${order.country || 'België'}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Dienst</th>
          <th class="text-right">Aantal</th>
          <th class="text-right">Prijs</th>
          <th class="text-right">Totaal</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item: any) => `
          <tr>
            <td>${item.serviceName}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">€${item.price.toFixed(2).replace('.', ',')}</td>
            <td class="text-right">€${(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotaal:</span>
        <span>€${subtotal.toFixed(2).replace('.', ',')}</span>
      </div>
      ${discount > 0 ? `
        <div class="totals-row">
          <span>Korting:</span>
          <span>-€${discount.toFixed(2).replace('.', ',')}</span>
        </div>
      ` : ''}
      <div class="totals-row total">
        <span>Totaal:</span>
        <span>€${total.toFixed(2).replace('.', ',')}</span>
      </div>
      ${order.paymentStatus === 'paid' ? `
        <div style="margin-top: 15px; color: #10b981; font-weight: bold;">
          ✓ Betaald
        </div>
      ` : ''}
    </div>

    ${order.notes ? `
      <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px;">
        <strong>Opmerkingen:</strong><br>
        ${order.notes}
      </div>
    ` : ''}

    <div class="footer">
      <p>Bedankt voor uw bestelling!</p>
      <p style="margin-top: 10px;">
        Koubyte IT-diensten | info@koubyte.be | www.koubyte.be
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

