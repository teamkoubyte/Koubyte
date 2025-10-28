import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const amount = parseFloat(searchParams.get('amount') || '0')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID verplicht' }, { status: 400 })
    }

    // Crypto wallet addresses (demo - moeten later uit .env gehaald worden)
    const cryptoWallets = {
      bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ethereum: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      usdt: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' // USDT on Ethereum
    }

    const btcRate = 45000 // Dit moet van een API komen
    const ethRate = 2500
    const usdtRate = 1

    // Genereer een HTML pagina met wallet info
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cryptocurrency Betaling - Koubyte</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 16px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    h1 { font-size: 28px; margin-bottom: 10px; color: #1a202c; }
    .subtitle { color: #718096; margin-bottom: 30px; }
    .amount { background: #f7fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
    .amount .eur { font-size: 48px; font-weight: bold; color: #2d3748; }
    .wallet { background: #edf2f7; padding: 20px; border-radius: 12px; margin-bottom: 15px; }
    .wallet h3 { color: #2d3748; margin-bottom: 10px; font-size: 18px; }
    .wallet-address { background: white; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; word-break: break-all; margin-top: 8px; border: 2px solid #cbd5e0; }
    .crypto-amount { color: #667eea; font-weight: bold; font-size: 16px; margin-top: 8px; }
    .warning { background: #fff5f5; border: 2px solid #fc8181; color: #c53030; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .success-btn { background: #48bb78; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 20px; }
    .success-btn:hover { background: #38a169; }
    .order-id { color: #718096; font-size: 14px; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🪙 Betaal met Crypto</h1>
    <p class="subtitle">Kies een wallet en verstuur exact het bedrag</p>
    
    <div class="amount">
      <div class="eur">€${amount.toFixed(2)}</div>
    </div>

    <div class="wallet">
      <h3>₿ Bitcoin (BTC)</h3>
      <div class="crypto-amount">${(amount / btcRate).toFixed(8)} BTC</div>
      <div class="wallet-address">${cryptoWallets.bitcoin}</div>
    </div>

    <div class="wallet">
      <h3>⟠ Ethereum (ETH)</h3>
      <div class="crypto-amount">${(amount / ethRate).toFixed(6)} ETH</div>
      <div class="wallet-address">${cryptoWallets.ethereum}</div>
    </div>

    <div class="wallet">
      <h3>₮ Tether (USDT)</h3>
      <div class="crypto-amount">${amount.toFixed(2)} USDT</div>
      <div class="wallet-address">${cryptoWallets.usdt}</div>
    </div>

    <div class="warning">
      ⚠️ <strong>Belangrijk:</strong> Deze betaling verloopt over 1 uur. Verstuur exact het juiste bedrag naar een van de bovenstaande adressen.
    </div>

    <button class="success-btn" onclick="window.location.href='/?payment=crypto&orderId=${orderId}'">Ik heb betaald</button>
    
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

