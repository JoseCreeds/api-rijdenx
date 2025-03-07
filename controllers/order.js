const nodemailer = require('nodemailer');

// Route POST pour recevoir les données du formulaire
exports.contactAdmin = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_ONE_SERVICE,
    port: 465,
    //secure: true,
    auth: {
      user: process.env.EMAIL_ONE_USER,
      pass: process.env.EMAIL_ONE_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"RijdenX" <' + process.env.EMAIL_ONE_USER + '>',
    to: process.env.EMAIL_ONE_USER, // Adresse e-mail de l'administrateur
    subject: `Un nouveau message depuis le formulaire de contact: ${subject}`,
    text: `Nom: ${name}\n\nEmail: ${email}\n\nTéléphone: ${phone}\n\nSujet: ${subject}\n\nMessage: ${message}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      //res.status(500).send('Error sending email');
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
      //res.status(200).send();
    }
  });
};

const generateOrderEmail = (order) => {
  let emailBody = `
    <h2>📦 Nouvelle commande reçue</h2>
  `;

  emailBody += `
      <hr>
      <h3>Commande #${order.numCommande}</h3>
      <p><strong>Client :</strong> ${order.fname} ${order.lname}</p>
      <p><strong>Email :</strong> ${order.email}</p>
      <p><strong>Téléphone :</strong> ${order.phone}</p>
      <p><strong>Adresse :</strong> ${order.adresse}</p>
      
      <table border="1" width="100%" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>`;

  order.cart.forEach((produit) => {
    emailBody += `
          <tr>
            <td>${produit.libelle}</td>
            <td>${produit.quantity}</td>
            <td>${produit.price} €</td>
            <td>${produit.quantity * produit.price} €</td>
          </tr>`;
  });

  emailBody += `
        </tbody>
      </table>
      <h4>Total de la commande : ${order.total} €</h4>
    `;

  return emailBody;
};

exports.newOrder = (req, res) => {
  const orderList = req.body;

  // if (!orderList.email) {
  //   console.log("L'email du client est requis !");
  // }

  // Génération du corps de l'email
  const emailContent = generateOrderEmail(orderList);

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_ONE_SERVICE,
    //port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ONE_USER,
      pass: process.env.EMAIL_ONE_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"RijdenX" <' + process.env.EMAIL_ONE_USER + '>',
    to: process.env.EMAIL_ONE_USER,
    subject: `Nouvelle commande reçue #${orderList.numCommande}`,
    html: emailContent,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ message: 'Error sending email' });
    } else {
      res.status(200).json({ message: 'Email successfully sent' });
    }
  });

  // Template HTML pour l'e-mail stylisé
  // const htmlContent = ``;

  // const mailClientOptions = {
  //   from: '"ASLYBANK" <' + process.env.EMAIL_ONE_USER + '>',
  //   to: `${email}`,
  //   subject: 'Benachrichtigung über den Darlehensantrag',
  //   html: htmlContent,
  // };

  // transporter.sendMail(mailClientOptions, (error, info) => {
  //   if (error) {
  //     //   console.error('Error sending email:', error);
  //     res.status(500).send('Error sending email');
  //   } else {
  //     //   console.log('Email sent:');
  //     res.status(200).send('Email sent successfully');
  //   }
  // });
};
