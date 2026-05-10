const puppeteer = require('puppeteer')
const Stagiaire = require('../models/Stagiaire')
const Score = require('../models/Score')
const Evaluation = require('../models/Evaluation')

exports.genererAttestation = async (req, res) => {
  try {
    const { stagiaire_id } = req.params

    const stagiaire = await Stagiaire.findOne({ user_id: stagiaire_id })
      .populate('user_id', 'nom prenom email')
      .populate('tuteur_id', 'nom prenom')

    if (!stagiaire) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' })
    }

    const dernierScore = await Score.findOne({ stagiaire_id })
      .sort({ date: -1 })

    const derniereEval = await Evaluation.findOne({ stagiaire_id })
      .sort({ createdAt: -1 })

    const dateDebut = new Date(stagiaire.date_debut).toLocaleDateString('fr-FR')
    const dateFin = new Date(stagiaire.date_fin).toLocaleDateString('fr-FR')
    const dateAujourdhui = new Date().toLocaleDateString('fr-FR')

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      background: #fff;
      color: #1a1a1a;
      padding: 60px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #1a56db;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #1a56db;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }
    .company-info {
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }
    .title {
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 40px 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .subtitle {
      text-align: center;
      font-size: 14px;
      color: #666;
      margin-bottom: 40px;
    }
    .content {
      font-size: 15px;
      line-height: 2;
      text-align: justify;
      margin-bottom: 30px;
    }
    .highlight {
      font-weight: bold;
      color: #1a56db;
    }
    .info-box {
      background: #f8faff;
      border: 1px solid #dbeafe;
      border-radius: 8px;
      padding: 20px 30px;
      margin: 30px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #666; }
    .info-value { font-weight: bold; }
    .score-section {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-radius: 8px;
      padding: 20px 30px;
      margin: 30px 0;
      text-align: center;
    }
    .score-number {
      font-size: 48px;
      font-weight: bold;
      color: #1a56db;
    }
    .score-label { font-size: 14px; color: #666; margin-top: 4px; }
    .badge {
      display: inline-block;
      padding: 4px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
      margin-top: 10px;
    }
    .badge-performant { background: #dcfce7; color: #166534; }
    .badge-moyen { background: #fef9c3; color: #854d0e; }
    .badge-difficulte { background: #fee2e2; color: #991b1b; }
    .signature {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }
    .sig-block { text-align: center; width: 200px; }
    .sig-line {
      border-top: 1px solid #1a1a1a;
      margin-bottom: 8px;
      margin-top: 50px;
    }
    .sig-name { font-size: 13px; font-weight: bold; }
    .sig-title { font-size: 12px; color: #666; }
    .footer {
      margin-top: 60px;
      text-align: center;
      font-size: 11px;
      color: #999;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
    .seal {
      width: 80px;
      height: 80px;
      border: 3px solid #1a56db;
      border-radius: 50%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #1a56db;
      font-weight: bold;
      text-align: center;
      line-height: 1.3;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="company-name">Creative Internet Solutions</div>
    <div class="company-info">
      Immeuble Safwa, Boulevard Hassan 1er, 2ème étage N°6, Dakhla – Agadir 80000, Maroc<br>
      Tél : 00 212 528 21 3045 | S.A.R.L | Hébergement et création de site web
    </div>
  </div>

  <div class="title">Attestation de Stage</div>
  <div class="subtitle">Délivrée à titre officiel par Creative Internet Solutions</div>

  <div class="content">
    Je soussigné, <span class="highlight">Mr. Abdelbast Kayouh</span>, Directeur Général de la société
    <span class="highlight">Creative Internet Solutions</span>, atteste par la présente que :
  </div>

  <div class="info-box">
    <div class="info-row">
      <span class="info-label">Nom et Prénom</span>
      <span class="info-value">${stagiaire.user_id?.prenom} ${stagiaire.user_id?.nom}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Email</span>
      <span class="info-value">${stagiaire.user_id?.email}</span>
    </div>
    <div class="info-row">
      <span class="info-label">École / Établissement</span>
      <span class="info-value">${stagiaire.ecole}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Niveau d'études</span>
      <span class="info-value">${stagiaire.niveau}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Département</span>
      <span class="info-value">${stagiaire.departement}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Période de stage</span>
      <span class="info-value">Du ${dateDebut} au ${dateFin}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Tuteur de stage</span>
      <span class="info-value">${stagiaire.tuteur_id?.prenom || 'N/A'} ${stagiaire.tuteur_id?.nom || ''}</span>
    </div>
  </div>

  <div class="content">
    A effectué un stage au sein de notre département
    <span class="highlight">${stagiaire.departement}</span> du
    <span class="highlight">${dateDebut}</span> au
    <span class="highlight">${dateFin}</span>.
    Durant cette période, le stagiaire a fait preuve de sérieux et de professionnalisme.
  </div>

  ${dernierScore ? `
  <div class="score-section">
    <div class="score-label">Score de performance global</div>
    <div class="score-number">${dernierScore.score_total}/100</div>
    <div>
      <span class="badge ${dernierScore.badge === 'performant' ? 'badge-performant' : dernierScore.badge === 'moyen' ? 'badge-moyen' : 'badge-difficulte'}">
        ${dernierScore.badge === 'performant' ? '⭐ Performant' : dernierScore.badge === 'moyen' ? 'Moyen' : 'En difficulté'}
      </span>
    </div>
  </div>
  ` : ''}

  <div class="content">
    La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
  </div>

  <div class="signature">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">${stagiaire.user_id?.prenom} ${stagiaire.user_id?.nom}</div>
      <div class="sig-title">Le / La Stagiaire</div>
    </div>
    <div class="sig-block">
      <div class="seal">Creative<br>Internet<br>Solutions</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">Mr. Abdelbast Kayouh</div>
      <div class="sig-title">Directeur Général</div>
    </div>
  </div>

  <div class="footer">
    Document généré le ${dateAujourdhui} — SIPMS — Smart Intern Performance Management System<br>
    Creative Internet Solutions | S.A.R.L | RC : Agadir
  </div>

</body>
</html>
    `

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
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