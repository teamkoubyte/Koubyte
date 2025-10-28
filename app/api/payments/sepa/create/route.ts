import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const amount = parseFloat(searchParams.get('amount') || '0')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID verplicht' }, { status: 400 })
    }

    // SEPA bank details (demo - moeten later uit .env gehaald worden)
    const bankDetails = {
      accountHolder: 'Koubyte IT Services',
      iban: 'BE68 5390 0754 7034',
      bic: 'TRIOBEBB',
      bank: 'Belfius Bank'
    }

    // Genereer een HTML pagina met bank info
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEPA Overschrijving - Koubyte</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 16px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    h1 { font-size: 28px; margin-bottom: 10px; color: #1a202c; }
    .subtitle { color: #718096; margin-bottom: 30px; }
    .amount { background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center; border: 2px solid #3b82f6; }
    .amount .eur { font-size: 48px; font-weight: bold; color: #1e40af; }
    .bank-details { background: #f7fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #718096; font-weight: 500; }
    .detail-value { color: #2d3748; font-weight: bold; font-family: monospace; }
    .reference { background: #fef3c7; border: 2px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .reference-code { font-size: 20px; font-weight: bold; color: #92400e; text-align: center; margin-top: 8px; font-family: monospace; }
    .info { background: #dbeafe; border-left: 4px solid #3b82f6; color: #1e40af; padding: 15px; border-radius: 4px; margin-top: 20px; }
    .success-btn { background: #3b82f6; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 20px; }
    .success-btn:hover { background: #2563eb; }
    .order-id { color: #718096; font-size: 14px; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏦 SEPA Overschrijving</h1>
    <p class="subtitle">Maak het bedrag over naar onderstaande bankrekening</p>
    
    <div class="amount">
      <div class="eur">€${amount.toFixed(2)}</div>
    </div>

    <div class="bank-details">
      <div class="detail-row">
        <span class="detail-label">Rekeninghouder:</span>
        <span class="detail-value">${bankDetails.accountHolder}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">IBAN:</span>
        <span class="detail-value">${bankDetails.iban}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">BIC:</span>
        <span class="detail-value">${bankDetails.bic}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Bank:</span>
        <span class="detail-value">${bankDetails.bank}</span>
      </div>
    </div>

    <div class="reference">
      <strong>⚠️ Vermeld deze referentie:</strong>
      <div class="reference-code">${orderId}</div>
    </div>

    <div class="info">
      ℹ️ Je bestelling wordt verwerkt zodra de betaling binnen is (1-3 werkdagen). Je ontvangt een bevestiging per email.
    </div>

    <button class="success-btn" onclick="window.location.href='/?payment=sepa&orderId=${orderId}'">Terug naar home</button>
    
    <div class="order-id">Order ID: ${orderId}</div>
  </div>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}


