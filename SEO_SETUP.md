# 🚀 SEO Setup Instructies voor Koubyte

## ✅ Wat is al geïmplementeerd

### 1. **Metadata & OpenGraph Tags**
- ✅ Complete metadata in `app/layout.tsx`
- ✅ OpenGraph tags voor social media sharing
- ✅ Twitter cards
- ✅ Keywords en descriptions per pagina
- ✅ Canonical URLs

### 2. **Structured Data (Schema.org)**
- ✅ LocalBusiness structured data met echte reviews
- ✅ Dynamische AggregateRating uit database
- ✅ FAQ structured data op `/faq`
- ✅ Breadcrumbs structured data
- ✅ Service catalog in structured data

### 3. **Technical SEO**
- ✅ Dynamische sitemap met services uit database (`/sitemap.xml`)
- ✅ Robots.txt configuratie (`/robots.txt`)
- ✅ Breadcrumbs navigatie op alle pagina's
- ✅ Vercel Analytics geïntegreerd
- ✅ Google Analytics 4 ready (moet nog geconfigureerd worden)

### 4. **Performance**
- ✅ Next.js Image optimization
- ✅ Font optimization met `font-display: swap`
- ✅ Server-side rendering voor snelle loading

---

## 📋 Wat moet je nog doen?

### **STAP 1: Google Analytics 4 Setup**

#### 1.1 Account aanmaken
1. Ga naar [Google Analytics](https://analytics.google.com/)
2. Klik op "Start measuring" of "Account aanmaken"
3. Vul bedrijfsgegevens in:
   - Account naam: **Koubyte**
   - Property naam: **Koubyte Website**
   - Tijdzone: **Belgium (GMT+1)**
   - Valuta: **Euro (EUR)**
4. Accepteer de voorwaarden

#### 1.2 Data Stream aanmaken
1. Selecteer **Web** als platform
2. Vul in:
   - Website URL: `https://koubyte.be`
   - Stream naam: **Koubyte Website**
3. Klik op "Create stream"

#### 1.3 Measurement ID toevoegen aan Vercel
1. Kopieer je **Measurement ID** (bijv. `G-XXXXXXXXXX`)
2. Ga naar [Vercel Dashboard](https://vercel.com/dashboard)
3. Selecteer je **Koubyte** project
4. Ga naar **Settings** → **Environment Variables**
5. Voeg een nieuwe variabele toe:
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX` (jouw Measurement ID)
   - Environments: **Production, Preview, Development** (alle 3 aanvinken)
6. Klik op **Save**
7. **Redeploy** je project (Settings → Deployments → laatste deployment → drie puntjes → Redeploy)

#### 1.4 Verificatie
- Na 24-48 uur zie je data in je Google Analytics dashboard
- Ga naar **Reports** → **Real-time** om direct bezoekers te zien

---

### **STAP 2: Google Search Console Setup**

#### 2.1 Property toevoegen
1. Ga naar [Google Search Console](https://search.google.com/search-console)
2. Klik op **Add property**
3. Selecteer **Domain** property type
4. Vul in: `koubyte.be`
5. Klik op **Continue**

#### 2.2 Domein verificatie via DNS
Google geeft je een TXT record. Voeg deze toe bij je domain registrar:

**Als je domein bij Hostinger is:**
1. Log in bij [Hostinger](https://www.hostinger.com/)
2. Ga naar **Domains** → **koubyte.be** → **DNS / Name Servers**
3. Voeg een nieuwe **TXT record** toe:
   - Type: `TXT`
   - Name: `@` (of leeg laten)
   - Content: (de verificatie string van Google, bijv. `google-site-verification=xyz123abc456...`)
   - TTL: `3600`
4. Klik op **Add Record**
5. Ga terug naar Search Console en klik op **Verify**

⏰ **LET OP:** DNS wijzigingen kunnen 1-24 uur duren om door te voeren.

#### 2.3 Sitemap indienen
1. Ga in Search Console naar **Sitemaps** (linker menu)
2. Voer in: `https://koubyte.be/sitemap.xml`
3. Klik op **Submit**

Google begint nu automatisch je site te crawlen!

#### 2.4 Belangrijke instellingen controleren
- **URL Inspection**: Test hoe Google je homepage ziet
- **Coverage**: Controleer of alle pagina's geïndexeerd zijn
- **Performance**: Zie welke zoekwoorden traffic genereren
- **Core Web Vitals**: Check je snelheidsscores

---

### **STAP 3: Bing Webmaster Tools (Optioneel maar aanbevolen)**

#### 3.1 Account aanmaken
1. Ga naar [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Log in met je Microsoft account
3. Klik op **Add a site**
4. Voer in: `https://koubyte.be`

#### 3.2 Importeer van Google Search Console
- Als je Google Search Console hebt, klik op **Import from Google Search Console**
- Dit importeert automatisch je sitemap en verificatie

**OF handmatig:**
1. Voeg een nieuwe **meta tag** toe aan je site
2. Ga naar Vercel → Settings → Environment Variables
3. Voeg een nieuwe variabele toe:
   - Name: `NEXT_PUBLIC_BING_VERIFICATION`
   - Value: (de verificatie code van Bing)
4. Update `app/layout.tsx` metadata met:
   ```typescript
   verification: {
     other: {
       'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
     },
   }
   ```

#### 3.3 Sitemap indienen
1. Ga naar **Sitemaps**
2. Voer in: `https://koubyte.be/sitemap.xml`
3. Klik op **Submit**

---

### **STAP 4: Social Media & Business Listings**

#### 4.1 Google Business Profile (Google Maps)
1. Ga naar [Google Business](https://www.google.com/business/)
2. Klik op **Manage now**
3. Vul bedrijfsgegevens in:
   - Bedrijfsnaam: **Koubyte**
   - Categorie: **Computer reparatieservice** of **IT-dienstverlening**
   - Adres: (indien van toepassing)
   - Telefoonnummer: `+32 484 52 26 62`
   - Website: `https://koubyte.be`
4. Verificatie via postkaart of telefoon
5. Voeg foto's, openingstijden en diensten toe

**Voordelen:**
- Verschijnen in Google Maps
- Lokale zoekresultaten verbeteren
- Reviews op Google

#### 4.2 Social Media Profiles
Update de links in `app/layout.tsx` structured data met je echte accounts:

```typescript
sameAs: [
  'https://facebook.com/KoubyteIT',  // Update met jouw echte Facebook
  'https://instagram.com/KoubyteIT', // Update met jouw echte Instagram
  'https://linkedin.com/company/Koubyte', // Update met jouw echte LinkedIn
],
```

#### 4.3 Business Listings
Registreer je bedrijf op:
- **Trustpilot** - voor reviews
- **Yelp Belgium** - extra zichtbaarheid
- **Facebook Business Page** - social media aanwezigheid
- **LinkedIn Company Page** - professionele aanwezigheid

---

### **STAP 5: Content & Keywords Strategie**

#### 5.1 Focus Keywords voor Koubyte
Belangrijkste keywords waar je op moet ranken:

**Primaire keywords:**
- Computer reparatie België
- IT-diensten Vlaanderen
- Laptop reparatie
- PC onderhoud
- Netwerk installatie
- Virus verwijderen

**Lokale keywords:**
- Computer hulp [jouw stad]
- IT-service [jouw regio]
- Hardware reparatie [jouw provincie]

#### 5.2 Content Aanbevelingen
Maak blogposts over:
- "5 Tekenen dat je computer een virus heeft"
- "Hoe vaak moet je je computer laten onderhouden?"
- "SSD vs HDD: Wat is het verschil?"
- "WiFi problemen oplossen: Complete gids"
- "Windows 11 installeren: Stap voor stap"

➡️ **BELANGRIJK:** Upload blogposts in `app/blog/` directory

#### 5.3 Review Strategie
- Vraag tevreden klanten om een review na elke job
- Link naar `/review` pagina in je email signature
- Reageer op alle reviews (positief én negatief)
- Gebruik echte reviews in je marketing

---

### **STAP 6: Performance Monitoring**

#### 6.1 Google PageSpeed Insights
Test je site regelmatig:
1. Ga naar [PageSpeed Insights](https://pagespeed.web.dev/)
2. Voer in: `https://koubyte.be`
3. Analyseer de scores voor Mobile en Desktop
4. Target: **90+ score** voor beide

#### 6.2 Core Web Vitals (Google Search Console)
Monitor deze metrics:
- **LCP (Largest Contentful Paint)**: < 2.5 seconden ✅
- **FID (First Input Delay)**: < 100 ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅

#### 6.3 Vercel Analytics
- Ga naar [Vercel Dashboard](https://vercel.com/) → Koubyte project → **Analytics**
- Bekijk real-time bezoekersdata
- Monitor conversies en bouncerates

---

## 🎯 SEO Checklist - Quick Start

Doe deze stappen **vandaag**:
- [ ] Google Analytics 4 account aanmaken
- [ ] GA4 Measurement ID toevoegen aan Vercel
- [ ] Google Search Console account aanmaken
- [ ] Sitemap indienen in Search Console
- [ ] Google Business Profile aanmaken
- [ ] Social media profiles updaten in code

Doe deze stappen **deze week**:
- [ ] Domein verificatie in Search Console
- [ ] Bing Webmaster Tools setup
- [ ] Trustpilot account aanmaken
- [ ] Eerste blogpost schrijven

Doe deze stappen **deze maand**:
- [ ] 5 blogposts publiceren
- [ ] 10+ reviews verzamelen
- [ ] Social media accounts actief maken
- [ ] Performance optimalisatie (target 90+ score)

---

## 📊 Verwachte Resultaten

**Week 1-2:**
- Google begint je site te crawlen
- Eerste indexeringen verschijnen
- Analytics data stroomt binnen

**Maand 1:**
- 20-50 organische bezoekers per week
- Eerste rankings voor long-tail keywords
- Local search aanwezigheid

**Maand 3:**
- 100-200 organische bezoekers per week
- Rankings voor primaire keywords
- Top 10 posities voor lokale zoekwoorden

**Maand 6+:**
- 300-500+ organische bezoekers per week
- Stabiele top 5 posities
- Consistente leads uit Google

---

## 🆘 Support & Vragen

Als je vastloopt bij een stap, check deze resources:
- [Google Analytics Help](https://support.google.com/analytics)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Next.js SEO Docs](https://nextjs.org/learn/seo/introduction-to-seo)
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)

---

## 🔧 Technische Opmerkingen

### Image Optimization
Alle images op de site worden automatisch geoptimaliseerd door Next.js. Voor beste resultaten:
- Upload images in **WebP** formaat
- Gebruik **alt tags** voor alle images
- Zet **width** en **height** properties

### Structured Data Testen
Test je structured data:
1. Ga naar [Rich Results Test](https://search.google.com/test/rich-results)
2. Voer in: `https://koubyte.be`
3. Controleer of alle structured data correct is

### Sitemap Monitoring
Je sitemap is dynamisch en update automatisch bij nieuwe:
- Services (uit database)
- Blog posts
- Statische pagina's

Check regelmatig: `https://koubyte.be/sitemap.xml`

---

**Succes met je SEO! 🚀**

*Laatste update: 30 oktober 2024*

