# 🔍 Google Search Console Setup - Stap voor Stap

## Waarom Google Search Console?
- **SEO Monitoring**: Zie hoe Google je site indexeert
- **Search Performance**: Bekijk welke zoektermen je site vinden
- **Indexering**: Dwing Google aan om je site te crawlen en indexeren
- **Problemen Detecteren**: Krijg alerts bij crawl errors of indexing problemen
- **Sitemap Indienen**: Help Google alle pagina's te vinden

---

## 📋 Stap 1: Account Aanmaken

1. Ga naar [Google Search Console](https://search.google.com/search-console)
2. Klik op **"Starten"** of **"Start measuring"**
3. Log in met je Google account (gebruik je werk/bedrijfs Google account)

---

## 📋 Stap 2: Property Toevoegen

Je hebt 2 opties:

### Optie A: Domein Property (Aanbevolen) ✅
- Voegt zowel `www.koubyte.be` als `koubyte.be` toe
- Meest complete verificatie
- **Selecteer**: "Domein" property type
- **Vul in**: `koubyte.be` (zonder www, zonder https)
- Klik op **"Doorgaan"**

### Optie B: URL Prefix Property
- Alleen voor specifieke URL (www of non-www)
- **Selecteer**: "URL-prefix" property type
- **Vul in**: `https://koubyte.be`
- Klik op **"Doorgaan"**

**Aanbeveling**: Gebruik **Optie A (Domein)** als je toegang hebt tot DNS records. Anders gebruik **Optie B**.

---

## 📋 Stap 3: Domein Verifiëren

Google geeft je meerdere verificatie methoden. Kies de makkelijkste voor jou:

### Methode 1: HTML Meta Tag (Makkelijkste) ⭐ Aanbevolen

1. Google toont een meta tag, bijvoorbeeld:
   ```html
   <meta name="google-site-verification" content="abc123XYZ789..." />
   ```

2. **Kopieer alleen de content waarde** (de code na `content="` en voor `"`)

3. Ik voeg deze toe aan `app/layout.tsx`

4. Klik op **"Verifiëren"** in Google Search Console

**Voordelen**: 
- Geen DNS wijzigingen nodig
- Werkt direct na deploy
- Makkelijkste methode

---

### Methode 2: DNS TXT Record (Alternatief)

Als je toegang hebt tot je DNS (bij Hostinger):

1. Google toont een TXT record waarde, bijvoorbeeld:
   ```
   google-site-verification=abc123XYZ789...
   ```

2. Ga naar je DNS provider (bijv. Hostinger)

3. Voeg een **TXT record** toe:
   - **Type**: TXT
   - **Name**: `@` (of leeg voor root domain)
   - **Value**: De hele verificatie string die Google toont
   - **TTL**: 3600 (of default)

4. Wacht 5-30 minuten tot DNS gepropageerd is

5. Klik op **"Verifiëren"** in Google Search Console

**Voordelen**:
- Werkt voor hele domein (zowel www als non-www)
- Permanent (blijft staan)

**Nadelen**:
- Vereist DNS toegang
- Kan 5-30 minuten duren

---

### Methode 3: HTML File Upload

1. Google genereert een HTML bestand (bijv. `google123abc.html`)

2. Download het bestand

3. Upload naar `public/google123abc.html` in je project

4. Deploy naar Vercel

5. Verifieer in Google Search Console

**Voordelen**:
- Eenvoudig als je deployment toegang hebt

**Nadelen**:
- Moet bestand in public folder plaatsen

---

## 📋 Stap 4: Verificatie Code Toevoegen aan Code

**Als je Methode 1 (Meta Tag) gebruikt:**

1. Kopieer de **content waarde** uit de meta tag (bijv. `abc123XYZ789...`)

2. Laat me weten wat de code is, dan voeg ik deze toe aan `app/layout.tsx`

Of voeg zelf toe in `app/layout.tsx` regel 92:

```typescript
verification: {
  google: 'jouw-verificatie-code-hier',  // ← Vervang dit met je echte code
  // Bing Webmaster verificatie
  // other: {
  //   'msvalidate.01': 'jouw-bing-verificatie-code',
  // },
},
```

3. Deploy naar Vercel

4. Terug naar Google Search Console → Klik **"Verifiëren"**

---

## 📋 Stap 5: Sitemap Indienen

Na verificatie:

1. In Google Search Console → **Sitemaps** (linkerkant menu)

2. Vul in: `sitemap.xml` (of `https://koubyte.be/sitemap.xml`)

3. Klik op **"Indienen"**

4. Google begint je sitemap te crawlen (kan enkele dagen duren)

---

## 📋 Stap 6: Eigendom Bevestigen (Alleen voor Domein Property)

Als je **Domein Property** gebruikt, moet je ook een TXT record toevoegen voor permanente verificatie:

1. Google toont een TXT record (ander dan de verificatie code)

2. Voeg deze toe aan je DNS:
   - **Type**: TXT
   - **Name**: `@`
   - **Value**: De TXT record waarde die Google toont

3. Wacht tot DNS gepropageerd is (5-30 minuten)

---

## ✅ Checklist

- [ ] Google Search Console account aangemaakt
- [ ] Property toegevoegd (Domein of URL Prefix)
- [ ] Verificatie methode gekozen
- [ ] Verificatie code toegevoegd aan code (of DNS)
- [ ] Code gedeployed naar Vercel
- [ ] Verificatie succesvol in Google Search Console
- [ ] Sitemap ingediend (`sitemap.xml`)
- [ ] Eigendom bevestigd (bij domein property)

---

## 🆘 Problemen Oplossen

### "Verificatie mislukt"
- Wacht 5-10 minuten na deploy
- Check of meta tag correct in HTML staat (view source van website)
- Check of DNS record correct is (bij DNS methode)
- Probeer andere verificatie methode

### "Sitemap kan niet worden gelezen"
- Check of `https://koubyte.be/sitemap.xml` werkt
- Wacht tot Google de sitemap heeft gecrawld (kan enkele dagen duren)

### "Eigendom niet bevestigd"
- Bij Domein Property: voeg TXT record toe aan DNS
- Wacht tot DNS gepropageerd is

---

## 📊 Wat Nu?

Na verificatie:
- Google begint automatisch je site te crawlen
- Check **Performance** tab voor zoektermen die je site vinden
- Check **Coverage** tab voor indexering status
- Stuur sitemap indien nog niet gedaan

---

**Tip**: Het kan 1-2 weken duren voordat je data ziet in Search Console. Dit is normaal!

