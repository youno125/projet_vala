const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const Stagiaire = require('../models/Stagiaire')
const Score = require('../models/Score')

exports.genererAttestation = async (req, res) => {
  try {
    const { stagiaire_id } = req.params

    const stagiaire = await Stagiaire.findOne({ user_id: stagiaire_id })
      .populate('user_id', 'nom prenom email')
      .populate('tuteur_id', 'nom prenom')

    if (!stagiaire) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' })
    }

    const dernierScore = await Score.findOne({ stagiaire_id }).sort({ date: -1 })

    const dateDebut = new Date(stagiaire.date_debut).toLocaleDateString('fr-FR')
    const dateFin = new Date(stagiaire.date_fin).toLocaleDateString('fr-FR')
    const dateAujourdhui = new Date().toLocaleDateString('fr-FR')

    // Logo en base64
    const logoPath = path.join(__dirname, '../logo.png')
    const logoBase64 = fs.readFileSync(logoPath).toString('base64')
    const logoSrc = `data:image/png;base64,${logoBase64}`

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      background: #fff;
      color: #1a1a1a;
      padding: 40px 50px;
      font-size: 13px;
    }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #1a3bdb;
      margin-bottom: 30px;
    }
    .logo { height: 160px; }
    .company-info {
      text-align: right;
      font-size: 11px;
      color: #555;
      line-height: 1.7;
    }

    /* TITLE */
    .title-section { text-align: center; margin-bottom: 25px; }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #1a3bdb;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .title-line {
      width: 80px;
      height: 3px;
      background: #1a3bdb;
      margin: 0 auto;
    }

    /* INTRO */
    .intro {
      margin-bottom: 20px;
      line-height: 1.8;
      text-align: justify;
    }
    .highlight { font-weight: bold; color: #1a3bdb; }

    /* INFO TABLE */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .info-table tr { border-bottom: 1px solid #e5e7eb; }
    .info-table tr:last-child { border-bottom: none; }
    .info-table td {
      padding: 8px 12px;
      font-size: 12px;
    }
    .info-table td:first-child {
      color: #666;
      width: 40%;
      background: #f8faff;
    }
    .info-table td:last-child { font-weight: 600; }

    /* SCORE */
    .score-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .score-label { font-size: 12px; color: #555; }
    .score-value { font-size: 28px; font-weight: bold; color: #1a3bdb; }
    .score-badge {
      background: #dcfce7;
      color: #166534;
      padding: 3px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
    }

    /* CONCLUSION */
    .conclusion {
      margin-bottom: 30px;
      line-height: 1.8;
      text-align: justify;
    }

    /* SIGNATURE */
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      gap: 20px;
    }
    .sig-block { text-align: center; flex: 1; }
    .sig-title {
      font-size: 11px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }
    .sig-name {
      font-size: 11px;
      color: #555;
      margin-bottom: 60px;
    }
    .sig-line {
      border-top: 1px solid #333;
      padding-top: 6px;
      font-size: 10px;
      color: #888;
    }
    .cachet-box {
      border: 2px dashed #bbb;
      border-radius: 8px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bbb;
      font-size: 11px;
      margin-bottom: 6px;
    }

    /* FOOTER */
    .footer {
      margin-top: 25px;
      text-align: center;
      font-size: 10px;
      color: #aaa;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <img src="${logoSrc}" class="logo" alt="VALA Logo" />
    <div class="company-info">
      Immeuble Safwa, Boulevard Hassan 1er, 2ème étage N°6<br>
      Dakhla – Agadir 80000, Maroc<br>
      Tél : 00 212 528 21 3045<br>
      S.A.R.L | RC : Agadir
    </div>
  </div>

  <!-- TITLE -->
  <div class="title-section">
    <div class="title">Attestation de Stage</div>
    <div class="title-line"></div>
  </div>

  <!-- INTRO -->
  <div class="intro">
    Je soussigné, <span class="highlight">${stagiaire.tuteur_id?.prenom || 'Neuman'} ${stagiaire.tuteur_id?.nom || 'Charhbili'}</span>, 
    Développeur et Tuteur de stage au sein de la société
    <span class="highlight">Creative Internet Solutions (VALA)</span>, atteste par la présente que :
  </div>

  <!-- INFO TABLE -->
  <table class="info-table">
    <tr>
      <td>Nom et Prénom</td>
      <td>${stagiaire.user_id?.prenom} ${stagiaire.user_id?.nom}</td>
    </tr>
    <tr>
      <td>Email</td>
      <td>${stagiaire.user_id?.email}</td>
    </tr>
    <tr>
      <td>École / Établissement</td>
      <td>${stagiaire.ecole}</td>
    </tr>
    <tr>
      <td>Niveau d'études</td>
      <td>${stagiaire.niveau}</td>
    </tr>
    <tr>
      <td>Département</td>
      <td>${stagiaire.departement}</td>
    </tr>
    <tr>
      <td>Période de stage</td>
      <td>Du ${dateDebut} au ${dateFin}</td>
    </tr>
    <tr>
      <td>Tuteur de stage</td>
      <td>${stagiaire.tuteur_id?.prenom || 'N/A'} ${stagiaire.tuteur_id?.nom || ''}</td>
    </tr>
  </table>

  <!-- SCORE -->
  ${dernierScore ? `
  <div class="score-box">
    <div>
      <div class="score-label">Score de performance global</div>
      <div class="score-value">${dernierScore.score_total}/100</div>
    </div>
    <span class="score-badge">⭐ ${dernierScore.badge === 'performant' ? 'Performant' : dernierScore.badge === 'moyen' ? 'Moyen' : 'En difficulté'}</span>
  </div>
  ` : ''}

  <!-- CONCLUSION -->
  <div class="conclusion">
    A effectué un stage au sein de notre département <span class="highlight">${stagiaire.departement}</span>
    du <span class="highlight">${dateDebut}</span> au <span class="highlight">${dateFin}</span>.
    Durant cette période, le/la stagiaire a fait preuve de sérieux, d'implication et de professionnalisme.
    La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
  </div>

  <div style="text-align:right; font-size:12px; margin-bottom:20px;">
    Fait à Agadir, le ${dateAujourdhui}
  </div>

  <!-- SIGNATURES -->
  <div class="signature-section">
    <div class="sig-block">
      <div class="sig-title">Le / La Stagiaire</div>
      <div class="sig-name">${stagiaire.user_id?.prenom} ${stagiaire.user_id?.nom}</div>
      <div class="sig-line">Signature</div>
    </div>

    <div class="sig-block">
      <div class="sig-title">Cachet de l'entreprise</div>
      <div class="cachet-box">Cachet officiel</div>
      <div class="sig-line"></div>
    </div>

    <div class="sig-block">
      <div class="sig-title">Le Tuteur de Stage</div>
      <div class="sig-name">${stagiaire.tuteur_id?.prenom || 'Neuman'} ${stagiaire.tuteur_id?.nom || 'Charhbili'}</div>
      <div class="sig-line">Signature</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    Document généré le ${dateAujourdhui} via SIPMS — Smart Intern Performance Management System<br>
    Creative Internet Solutions (VALA) | S.A.R.L | Agadir, Maroc
  </div>

</body>
</html>`

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '0', bottom: '20px', left: '0' }
    })

    await browser.close()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=attestation_${stagiaire.user_id?.nom}_${stagiaire.user_id?.prenom}.pdf`)
    res.send(pdfBuffer)

  } catch (error) {
    console.log('ERREUR PDF:', error)
    res.status(500).json({ message: 'Erreur génération PDF', error: error.message })
  }
}