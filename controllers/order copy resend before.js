const nodemailer = require('nodemailer');

// Route POST pour recevoir les données du formulaire
exports.contactAdmin = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_ONE_SERVICE,
    port: 465,
    secure: true,
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

// const generateClientOrderEmail = (order) => {
//   let emailBody = `
//     <h2>📦 Nouvelle commande effectuée</h2>
//   `;

//   emailBody += `
//       <hr>
//       <h3>Commande #${order.numCommande}</h3>
//       <p><strong>Client :</strong> ${order.fname} ${order.lname}</p>
//       <p><strong>Email :</strong> ${order.email}</p>
//       <p><strong>Téléphone :</strong> ${order.phone}</p>
//       <p><strong>Adresse :</strong> ${order.adresse}</p>

//       <table border="1" width="100%" cellspacing="0" cellpadding="5">
//         <thead>
//           <tr>
//             <th>Produit</th>
//             <th>Quantité</th>
//             <th>Prix unitaire</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>`;

//   order.cart.forEach((produit) => {
//     emailBody += `
//           <tr>
//             <td>${produit.libelle}</td>
//             <td>${produit.quantity}</td>
//             <td>${produit.price} €</td>
//             <td>${produit.quantity * produit.price} €</td>
//           </tr>`;
//   });

//   emailBody += `
//         </tbody>
//       </table>
//       <h4>Total de la commande : ${order.total} €</h4>
//       <h2>📦 Veuillez effectuer le paiement par virement bancaire pour valider votre commande.</h2>
//       <p>Le motif du paiement est le numéro de votre commande : ${order.numCommande}</p>
//       <h2> Coordonnées bancaire </h2>
//       <h4>Nom : ${order.bankData.owner} </h4>
//       <h4>Bank : ${order.bankData.bankName} </h4>
//       <h4>IBAN : ${order.bankData.bankNum} </h4>
//       <h4>BIC : ${order.bankData.bankBic} </h4>
//       <h4>Montant : ${order.total} € </h4>
//       <h4>Motif : ${order.numCommande}</h4>
//       <p>Une fois le paiement effectué, veuillez envoyer la preuve de paiement  l'adresse email: <strong>${order.bankData.bankEmail}</strong> </p>
//     `;

//   return emailBody;
// };

const generateClientOrderEmail = (order) => {
  let emailBody = `
    <h2>📦 Neue Bestellung aufgegeben</h2>
  `;

  emailBody += `
      <hr>
      <h3>Bestellung Nr. ${order.numCommande}</h3>
      <p><strong>Kunde:</strong> ${order.fname} ${order.lname}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Telefon:</strong> ${order.phone}</p>
      <p><strong>Adresse:</strong> ${order.adresse}</p>
      
      <table border="1" width="100%" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Menge</th>
            <th>Einzelpreis</th>
            <th>Gesamt</th>
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
      <h4>Gesamtsumme der Bestellung: ${order.total} €</h4>
      <h2>📦 Bitte führen Sie die Zahlung per Banküberweisung durch, um Ihre Bestellung zu bestätigen.</h2>
      <p>Der Verwendungszweck der Zahlung ist Ihre Bestellnummer: ${order.numCommande}</p>
      <h2>Bankverbindung</h2>
      <h4>Name: ${order.bankData.owner} </h4>
      <h4>Bank: ${order.bankData.bankName} </h4>
      <h4>IBAN: ${order.bankData.bankNum} </h4>
      <h4>BIC: ${order.bankData.bankBic} </h4>
      <h4>Betrag: ${order.total} € </h4>
      <h4>Verwendungszweck: ${order.numCommande}</h4>
      <p>Sobald die Zahlung erfolgt ist, senden Sie bitte den Zahlungsnachweis an folgende E-Mail-Adresse: <strong>${order.bankData.bankEmail}</strong></p>
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
    port: 465,
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

  // Client part

  const transporterClient = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    //debug: true, // Active les logs
    //logger: true,
  });

  const emailContentClient = generateClientOrderEmail(orderList);

  const mailOptionsClient = {
    from: '"RijdenX" <' + process.env.EMAIL_USER + '>',
    to: orderList.email,
    subject: `Nouvelle commande effectuée #${orderList.numCommande}`,
    html: emailContentClient,
  };

  transporterClient.sendMail(mailOptionsClient, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email successfully sent' });
    }
  });
};

// Ln part Rijdenx
exports.contactLoanAdmin = (req, res) => {
  const { lname, fname, email, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_LOAN_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_LOAN_USER,
      pass: process.env.EMAIL_LOAN_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"RijdenX" <' + process.env.EMAIL_LOAN_USER + '>',
    to: process.env.EMAIL_LOAN_USER, // Adresse e-mail de l'administrateur
    subject: `Un nouveau message depuis le formulaire de contact: ${email}`,
    text: `Nom: ${lname}\n\nPrénom: ${fname}\n\nEmail: ${email}\n\nMessage: ${message}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
      //res.status(200).send();
    }
  });
};

exports.loanFAQ = (req, res) => {
  const { email, subject, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_LOAN_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_LOAN_USER,
      pass: process.env.EMAIL_LOAN_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"RijdenX" <' + process.env.EMAIL_LOAN_USER + '>',
    to: process.env.EMAIL_LOAN_USER, // Adresse e-mail de l'administrateur
    subject: `Un nouvelle question depuis le formulaire de FAQ: ${email}`,
    text: `Email: ${email}\n\nSujet: ${subject}\n\nQuestion: ${message}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //console.error('Error sending email:', error);
      //res.status(500).send('Error sending email');
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
      //res.status(200).send();
    }
  });
};

exports.loanForm = (req, res) => {
  const {
    email,
    fullName,
    country,
    address,
    phoneNumber,
    monthlyIncome,
    loanAmount,
    repaymentPeriod,
    repaymentUnit,
    currency,
    loanPurpose,
  } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_LOAN_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_LOAN_USER,
      pass: process.env.EMAIL_LOAN_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"RijdenX" <' + process.env.EMAIL_LOAN_USER + '>',
    to: process.env.EMAIL_LOAN_USER, // Adresse e-mail de l'administrateur
    subject: `Nouvelle demande de prêt de ${fullName}`,
    text: `**Email:** ${email}\n\n**Nom complet:** ${fullName}\n\n**Pays:** ${country}\n\n**Adresse:** ${address}\n\n**Numéro de téléphone:** ${phoneNumber}\n\n**Revenu mensuel:** ${monthlyIncome}\n\n**Montant du prêt:** ${loanAmount} ${currency}\n\n**Période de remboursement:** ${repaymentPeriod} ${repaymentUnit}\n\n**Objet du prêt:** ${loanPurpose}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
};

// Ln part Volbk

exports.contactLoanAdminVolbk = (req, res) => {
  const { lname, fname, email, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_VB_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_VB_USER,
      pass: process.env.EMAIL_VB_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"VOLBK" <' + process.env.EMAIL_VB_USER + '>',
    to: process.env.EMAIL_VOLBK_USER, // Adresse e-mail de l'administrateur
    subject: `Un nouveau message depuis le formulaire de contact: ${email}`,
    text: `Nom: ${lname}\n\nPrénom: ${fname}\n\nEmail: ${email}\n\nMessage: ${message}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
      //res.status(200).send();
    }
  });
};

exports.loanFAQVolbk = (req, res) => {
  const { email, subject, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_VB_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_VB_USER,
      pass: process.env.EMAIL_VB_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"VOLBK" <' + process.env.EMAIL_VB_USER + '>',
    to: process.env.EMAIL_VOLBK_USER, // Adresse e-mail de l'administrateur
    subject: `Un nouvelle question depuis le formulaire de FAQ: ${email}`,
    text: `Email: ${email}\n\nSujet: ${subject}\n\nQuestion: ${message}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //console.error('Error sending email:', error);
      //res.status(500).send('Error sending email');
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
      //res.status(200).send();
    }
  });
};

exports.loanFormVolbk = (req, res) => {
  const {
    email,
    fullName,
    country,
    address,
    phoneNumber,
    monthlyIncome,
    loanAmount,
    repaymentPeriod,
    repaymentUnit,
    currency,
    loanPurpose,
  } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_VB_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_VB_USER,
      pass: process.env.EMAIL_VB_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"VOLBK" <' + process.env.EMAIL_VB_USER + '>',
    to: process.env.EMAIL_VOLBK_USER, // Adresse e-mail de l'administrateur
    subject: `Nouvelle demande de ${fullName}`,
    text: `**Email:** ${email}\n\n**Nom complet:** ${fullName}\n\n**Pays:** ${country}\n\n**Adresse:** ${address}\n\n**Numéro de téléphone:** ${phoneNumber}\n\n**Revenu mensuel:** ${monthlyIncome}\n\n**Montant du prêt:** ${loanAmount} ${currency}\n\n**Période de remboursement:** ${repaymentPeriod} ${repaymentUnit}\n\n**Objet du prêt:** ${loanPurpose}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
};

// *************Ln part monevo**********

const generateMnConfirmationEmail = (formMN) => {
  const P = formMN.loanAmount;

  // Conversion de la durée en mois
  let n;
  if (formMN.repaymentUnit.toLowerCase().startsWith('y')) {
    // années -> mois
    n = formMN.repaymentPeriod * 12;
  } else {
    // déjà en mois
    n = formMN.repaymentPeriod;
  }

  // Taux annuel en fraction
  const annualRate = 2 / 100;

  // Taux mensuel
  const r = annualRate / 12;

  // Calcul de la mensualité (formule d'amortissement)
  const monthlyPayment = (P * r) / (1 - Math.pow(1 + r, -n));

  // Total payé
  const totalPayment = monthlyPayment * n;

  // Intérêts totaux
  const totalInterest = totalPayment - P;

  const today = new Date();
  today.setMonth(today.getMonth() + 3); // +3 mois
  const firstPaymentDate = today.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  let emailBody = `
    <p style="font-size: 14px;">Dear ${formMN.fullName},</p>
    <p style="font-size: 14px;">Thank you for your interest in our credit offers. Please find below the details concerning the parameters of
        your loan</p>
    <h3 style="font-size: 18px;">Loan Amount: ${formMN.loanAmount} ${
    formMN.currency
  }</h3>
    <h3 style="font-size: 18px;">Repayment period : ${formMN.repaymentPeriod} ${
    formMN.repaymentUnit
  } months</h3>
    <h3 style="font-size: 18px;">Annual interest rate: 2</h3>
    <h3 style="font-size: 18px;">Monthly payment: ${monthlyPayment.toFixed(
      2
    )}  ${formMN.currency}</h3>
    <h3 style="font-size: 18px;">First monthly payment: ${firstPaymentDate}</h3>
    <h3 style="font-size: 18px;">Total monthly installments : ${totalPayment.toFixed(
      2
    )}  ${formMN.currency}</h3>
    <h3 style="font-size: 18px;">Total interest: ${totalInterest.toFixed(2)} ${
    formMN.currency
  }</h3>

    <h3 style="text-decoration: underline;">Legal information :</h3>
    <p style="font-size: 14px;">1- The Annual Percentage Rate (APR) of your loan is 2%. This rate represents the total cost of credit for the
        borrower,
        including interest and all ancillary charges.</p>
    <p style="font-size: 14px;">2- Credit granted subject to approval: The amount, term and conditions may be modified depending on the
        assessment of
        your credit file.</p>
    <p style="font-size: 14px;">3- Right of withdrawal: You have a period of 14 calendar days from the date of signature of the loan contract to
        exercise your right of withdrawal without cost or justification.</p>
    <p style="font-size: 14px;">If these conditions are acceptable to you, please confirm your agreement by replying to this e-mail.</p>
    <p style="font-size: 14px;">Once we have received your agreement, we will proceed with the next steps to finalize your request.</p><br/>
    
    <p style="font-size: 14px;">We remain at your disposal for any further information.</p>
    <p style="font-size: 14px;">Best regards,</p>
    <p style="font-size: 14px;">The MONEVOK team</p
    <p>https://www.monevok.com</p>
    `;

  return emailBody;
};

exports.contactLoanAdminMN = (req, res) => {
  const { lname, fname, email, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_MN_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_MN_USER,
      pass: process.env.EMAIL_MN_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"MONEVOK" <' + process.env.EMAIL_MN_USER + '>',
    to: process.env.EMAIL_MN_USER, // Adresse e-mail de l'administrateur
    subject: `nouveau message: ${email}`,
    text: `Nom: ${lname}\n\nPrénom: ${fname}\n\nEmail: ${email}\n\nMessage: ${message}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
      //res.status(200).send();
    }
  });
};

exports.loanFAQMN = (req, res) => {
  const { email, subject, message } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_MN_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_MN_USER,
      pass: process.env.EMAIL_MN_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"MONEVOK" <' + process.env.EMAIL_MN_USER + '>',
    to: process.env.EMAIL_MN_USER, // Adresse e-mail de l'administrateur
    subject: `FAQ: ${email}`,
    text: `Email: ${email}\n\nSujet: ${subject}\n\nQuestion: ${message}`,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //console.error('Error sending email:', error);
      //res.status(500).send('Error sending email');
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      res.status(200).json({ message: 'Email sent successfully' });
      //res.status(200).send();
    }
  });
};

exports.loanFormMN = (req, res) => {
  const {
    email,
    fullName,
    country,
    address,
    phoneNumber,
    monthlyIncome,
    loanAmount,
    repaymentPeriod,
    repaymentUnit,
    currency,
    loanPurpose,
  } = req.body;

  // Configuration du transporteur SMTP pour Nodemailer
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_MN_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_MN_USER,
      pass: process.env.EMAIL_MN_PASSWORD,
    },
  });

  // Options de l'e-mail à envoyer
  const mailOptions = {
    from: '"MONEVOK" <' + process.env.EMAIL_MN_USER + '>',
    to: process.env.EMAIL_MN_USER, // Adresse e-mail de l'administrateur
    subject: `Nouvelle demande de ${fullName}`,
    text: `**Email:** ${email}\n\n**Nom complet:** ${fullName}\n\n**Pays:** ${country}\n\n**Adresse:** ${address}\n\n**Numéro de téléphone:** ${phoneNumber}\n\n**Revenu mensuel:** ${monthlyIncome}\n\n**Montant du prêt:** ${loanAmount} ${currency}\n\n**Période de remboursement:** ${repaymentPeriod} ${repaymentUnit}\n\n**Objet du prêt:** ${loanPurpose}`,
  };

  const mnEmailContent = generateMnConfirmationEmail(req.body);

  const instantConfirmMailOptions = {
    from: '"MONEVOK" <' + process.env.EMAIL_MN_USER + '>',
    to: email,
    cc: process.env.EMAIL_MONE_USER,
    subject: `Credit request confirmation`,
    html: mnEmailContent,
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:');
      // client part
      transporter.sendMail(instantConfirmMailOptions, (error, info) => {
        if (error) {
          // console.error('Error sending email:', error);
          res.status(500).json({ message: 'Error sending email' });
        } else {
          //console.log('Email sent:');
          res.status(200).json({ message: 'Email sent successfully' });
        }
      });

      //res.status(200).json({ message: 'Email sent successfully' });
    }
  });
};
