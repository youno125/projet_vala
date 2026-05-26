const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Email 1 — Création compte STAGIAIRE
const envoyerEmailCreationCompte = async (prenom, email, motDePasse) => {
  try {
    await transporter.sendMail({
      from: `"Creative Internet Solutions (VALA)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎓 Bienvenue chez VALA — Votre stage commence !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e8edf8; border-radius: 12px; overflow: hidden;">
          
          <!-- HEADER -->
          <div style="background: #0e2a6e; padding: 28px 32px; text-align: center;">
            <div style="background: #f97316; display: inline-block; padding: 8px 20px; border-radius: 8px; margin-bottom: 12px;">
              <span style="color: white; font-size: 22px; font-weight: bold; letter-spacing: 2px;">VALA</span>
            </div>
            <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">Creative Internet Solutions</p>
          </div>

          <!-- BODY -->
          <div style="padding: 32px;">
            <h2 style="color: #0e2a6e; margin-bottom: 8px;">Bonjour ${prenom} 👋</h2>
            
            <p style="color: #334155; line-height: 1.7;">
              Nous avons le plaisir de vous informer que votre compte a été créé au sein de 
              <strong>Creative Internet Solutions (VALA)</strong>.
            </p>

            <p style="color: #334155; line-height: 1.7;">
              Vous êtes officiellement <strong style="color: #16a34a;">accepté(e) en stage</strong> dans notre agence. 
              Bienvenue dans l'équipe ! Nous sommes ravis de vous accompagner tout au long de cette expérience professionnelle.
            </p>

            <!-- IDENTIFIANTS -->
            <div style="background: #f8faff; border: 1px solid #dbe4ff; border-radius: 10px; padding: 20px; margin: 24px 0;">
              <p style="color: #0e2a6e; font-weight: bold; margin: 0 0 12px 0;">🔐 Vos identifiants de connexion</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #64748b; padding: 6px 0; width: 40%;">Email</td>
                  <td style="color: #0f172a; font-weight: 600; padding: 6px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Mot de passe</td>
                  <td style="color: #0f172a; font-weight: 600; padding: 6px 0;">${motDePasse}</td>
                </tr>
              </table>
            </div>

            <p style="color: #64748b; font-size: 13px;">
              ⚠️ Pensez à changer votre mot de passe après votre première connexion.
            </p>

            <!-- BOUTON -->
            <div style="text-align: center; margin-top: 24px;">
              <a href="http://localhost:3000" style="background: #f97316; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
                Accéder à mon espace →
              </a>
            </div>
          </div>

          <!-- FOOTER -->
          <div style="background: #f8faff; padding: 16px 32px; text-align: center; border-top: 1px solid #e8edf8;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              Creative Internet Solutions (VALA) | Agadir, Maroc<br>
              SIPMS — Smart Intern Performance Management System
            </p>
          </div>
        </div>
      `
    })
    console.log(`✅ Email stagiaire envoyé à ${email}`)
  } catch (err) {
    console.log(`❌ Erreur email : ${err.message}`)
  }
}

// Email 2 — Création compte TUTEUR / ADMIN / DIRECTEUR
const envoyerEmailCreationCompteStaff = async (prenom, email, motDePasse, role) => {
  try {
    const roleLabel = role === 'tuteur' ? 'Tuteur' : role === 'admin' ? 'Administrateur' : 'Directeur'
    await transporter.sendMail({
      from: `"Creative Internet Solutions (VALA)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔐 Votre compte SIPMS — ${roleLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e8edf8; border-radius: 12px; overflow: hidden;">
          
          <div style="background: #0e2a6e; padding: 24px 32px; text-align: center;">
            <div style="background: #f97316; display: inline-block; padding: 8px 20px; border-radius: 8px;">
              <span style="color: white; font-size: 22px; font-weight: bold; letter-spacing: 2px;">VALA</span>
            </div>
          </div>

          <div style="padding: 32px;">
            <h2 style="color: #0e2a6e;">Bonjour ${prenom},</h2>
            <p style="color: #334155; line-height: 1.7;">
              Votre compte <strong>${roleLabel}</strong> sur SIPMS a été créé. Voici vos identifiants :
            </p>

            <div style="background: #f8faff; border: 1px solid #dbe4ff; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #64748b; padding: 6px 0; width: 40%;">Email</td>
                  <td style="color: #0f172a; font-weight: 600; padding: 6px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Mot de passe</td>
                  <td style="color: #0f172a; font-weight: 600; padding: 6px 0;">${motDePasse}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:3000" style="background: #0e2a6e; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
                Se connecter →
              </a>
            </div>
          </div>

          <div style="background: #f8faff; padding: 14px 32px; text-align: center; border-top: 1px solid #e8edf8;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              Creative Internet Solutions (VALA) | SIPMS
            </p>
          </div>
        </div>
      `
    })
    console.log(`✅ Email staff envoyé à ${email}`)
  } catch (err) {
    console.log(`❌ Erreur email : ${err.message}`)
  }
}

// Email 3 — Alerte score bas
const envoyerAlerteScorebas = async (tuteurEmail, stagiairePrenom, stagiaireNom, score) => {
  try {
    await transporter.sendMail({
      from: `"SIPMS - VALA" <${process.env.EMAIL_USER}>`,
      to: tuteurEmail,
      subject: '⚠️ Alerte performance — Intervention recommandée',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #fecdd3; border-radius: 12px;">
          <h2 style="color: #e11d48;">⚠️ Alerte Score Bas</h2>
          <p style="color: #334155;">Le stagiaire <strong>${stagiairePrenom} ${stagiaireNom}</strong> a un score de :</p>
          <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
            <span style="font-size: 36px; font-weight: bold; color: #e11d48;">${score}/100</span>
            <p style="color: #e11d48; margin: 4px 0;">En difficulté</p>
          </div>
          <p style="color: #334155;">Une intervention est recommandée.</p>
          <a href="http://localhost:3000" style="display: inline-block; background: #0e2a6e; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold;">
            Voir le dashboard →
          </a>
          <p style="color: #94a3b8; font-size: 11px; margin-top: 20px;">SIPMS — Creative Internet Solutions (VALA)</p>
        </div>
      `
    })
    console.log(`✅ Alerte score envoyée à ${tuteurEmail}`)
  } catch (err) {
    console.log(`❌ Erreur email alerte : ${err.message}`)
  }
}

module.exports = { envoyerEmailCreationCompte, envoyerEmailCreationCompteStaff, envoyerAlerteScorebas }
