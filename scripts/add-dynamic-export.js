// Script om export const dynamic = 'force-dynamic' toe te voegen aan pagina's die dit nodig hebben
// Dit wordt uitgevoerd als npm script

const fs = require('fs')
const path = require('path')

// Pagina's die dynamisch moeten zijn (gebruiken sessie checks via layout)
const pagesToFix = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/blog/page.tsx',
  'app/blog/[slug]/page.tsx',
  'app/book/page.tsx',
  'app/checkout/page.tsx',
  'app/checkout/success/page.tsx',
  'app/contact/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/privacy/page.tsx',
  'app/diensten/page.tsx',
  'app/diensten/[id]/page.tsx',
  'app/faq/page.tsx',
  'app/pricing/page.tsx',
  'app/privacy/page.tsx',
  'app/quote/page.tsx',
  'app/review/page.tsx',
  'app/review/edit/[id]/page.tsx',
  'app/services/page.tsx',
  'app/terms/page.tsx',
  'app/auth/login/page.tsx',
  'app/auth/register/page.tsx',
  'app/auth/forgot-password/page.tsx',
  'app/auth/reset-password/page.tsx',
  'app/auth/verify/page.tsx',
  'app/admin/page.tsx',
  'app/admin/appointments/page.tsx',
  'app/admin/blog/page.tsx',
  'app/admin/calendar/page.tsx',
  'app/admin/chat/page.tsx',
  'app/admin/discounts/page.tsx',
  'app/admin/messages/page.tsx',
  'app/admin/orders/page.tsx',
  'app/admin/payments/page.tsx',
  'app/admin/quotes/page.tsx',
  'app/admin/reviews/page.tsx',
  'app/admin/services/page.tsx',
  'app/admin/users/page.tsx',
]

const dynamicExport = "export const dynamic = 'force-dynamic'\n"

pagesToFix.forEach(pagePath => {
  const fullPath = path.join(process.cwd(), pagePath)
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  ${pagePath} bestaat niet`)
    return
  }

  const content = fs.readFileSync(fullPath, 'utf8')
  
  // Check of dynamic al bestaat
  if (content.includes('export const dynamic')) {
    console.log(`✓ ${pagePath} heeft al dynamic export`)
    return
  }

  // Zoek waar de export statements zijn
  const lines = content.split('\n')
  let insertIndex = 0
  
  // Zoek eerste export of import na imports
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^export (const|function|async function|default|const metadata)/)) {
      insertIndex = i
      break
    }
    if (lines[i].match(/^import/) && i > insertIndex) {
      insertIndex = i + 1
    }
  }

  // Voeg dynamic export toe
  lines.splice(insertIndex, 0, dynamicExport.trim())
  const newContent = lines.join('\n')
  
  fs.writeFileSync(fullPath, newContent, 'utf8')
  console.log(`✓ ${pagePath} bijgewerkt`)
})

console.log('\n✅ Klaar!')
