const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Email 1 — Création de compte
const envoyerEmailCreationCompte = async (prenom, email, motDePasse) => {
  try {
    await transporter.sendMail({
      from: `"SIPMS - VALA" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎓 Votre compte SIPMS a été créé',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #e8edf8; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #0e2a6e; color: white; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 10px; display: inline-block;">VALA</div>
          </div>
          <h2 style="color: #0e2a6e;">Bonjour ${prenom} 👋</h2>
          <p style="color: #334155;">Votre compte SIPMS a été créé avec succès. Voici vos identifiants de connexion :</p>
          <div style="background: #f8faff; border: 1px solid #dbe4ff; border-radius: 10px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0;"><strong>Email :</strong> ${email}</p>
            <p style="margin: 6px 0;"><strong>Mot de passe :</strong> ${motDePasse}</p>
          </div>
          <a href="http://localhost:3000" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            Se connecter →
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            Pensez à changer votre mot de passe après votre première connexion.<br>
            SIPMS — Smart Intern Performance Management System
          </p>
        </div>
      `
    })
    console.log(`✅ Email envoyé à ${email}`)
  } catch (err) {
    console.log(`❌ Erreur email : ${err.message}`)
  }
}

// Email 2 — Alerte score bas
const envoyerAlerteScorebas = async (tuteurEmail, stagiairePrenom, stagiaireNom, score) => {
  try {
    await transporter.sendMail({
      from: `"SIPMS - VALA" <${process.env.EMAIL_USER}>`,
      to: tuteurEmail,
      subject: '⚠️ Alerte performance — Intervention recommandée',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #fecdd3; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #0e2a6e; color: white; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 10px; display: inline-block;">VALA</div>
          </div>
          <h2 style="color: #e11d48;">⚠️ Alerte Score Bas</h2>
          <p style="color: #334155;">Le stagiaire <strong>${stagiairePrenom} ${stagiaireNom}</strong> a un score de :</p>
          <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
            <span style="font-size: 36px; font-weight: bold; color: #e11d48;">${score}/100</span>
            <p style="color: #e11d48; margin: 4px 0;">En difficulté</p>
          </div>
          <p style="color: #334155;">Une intervention de votre part est recommandée pour aider ce stagiaire à améliorer ses performances.</p>
          <a href="http://localhost:3000" style="display: inline-block; background: #0e2a6e; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            Voir le dashboard →
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">SIPMS — Smart Intern Performance Management System</p>
        </div>
      `
    })
    console.log(`✅ Alerte score envoyée à ${tuteurEmail}`)
  } catch (err) {
    console.log(`❌ Erreur email alerte : ${err.message}`)
  }
}

module.exports = { envoyerEmailCreationCompte, envoyerAlerteScorebas }