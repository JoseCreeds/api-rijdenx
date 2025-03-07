const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Fonction pour générer une chaîne aléatoire
const randString = () => {
  const len = 8;
  let randStr = '';
  for (let i = 0; i < len; i++) {
    const ch = Math.floor(Math.random() * 10 + 1);
    randStr += ch;
  }
  return randStr;
};

// Fonction pour envoyer un e-mail de validation
const sendMail = (email, uniqueString) => {
  var Transport = nodemailer.createTransport({
    service: process.env.EMAIL_ONE_SERVICE,
    // port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ONE_USER,
      pass: process.env.EMAIL_ONE_PASSWORD,
    },
  });

  var mailOptions;
  let sender = 'ASLY BANK';
  mailOptions = {
    from: 'contact@aslyonline.com',
    to: email,
    subject: 'Validate account',
    html: `Press <a href=${process.env.BASE_URL}/api/auth/verify/${uniqueString}>here</a> to validate your account. Thanks\n\n\nIf clicking doesn't work, you can copy and paste this link directly into your browser: ${process.env.BASE_URL}/api/auth/verify/${uniqueString}`,
  };

  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent');
    }
  });
};

// Fonction pour vérifier si l'email existe
exports.verifyEmail = async (req, res, next) => {
  // getting the string
  const { uniqueString } = req.params;
  // check is there is anyone with this string
  const user = await User.findOne({ uniqueString: uniqueString });

  if (user) {
    // if there is anyone, mark them verified
    user.isValid = true;
    await user.save();
    res.redirect('https://aslyonline.com/login');
  } else {
    res.json({ meaage: 'User not found' });
  }
};

// Enregistrement d'un nouvel utilisateur
exports.signup = async (req, res, next) => {
  // delete req.body._id;
  const uniqueString = randString();
  const isValid = false;

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Utilisez directement req.body sans déstructuration inutile
    // Utilisation de async/await pour rendre la lecture plus propre
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: false,
    });
    await user.save();

    // Envoi de l'e-mail de validation
    //sendMail(req.body.email, uniqueString);

    res.status(200).json({ message: 'Object created !' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error });
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Incorrect login/password pair' });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: 'Incorrect login/password pair' });
          } else {
            const token = jwt.sign(
              { userId: user._id },
              process.env.RANDOM_TOKEN_SECRET,
              { expiresIn: '2h' }
            );
            res.status(200).json({
              user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
              },
              token: token,
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const userProfile = await User.findOne({ _id: req.auth.userId });
    if (!userProfile) {
      res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(userProfile); // Renvoie les données de l'utilisateur
  } catch (error) {
    res.status(400).json({ error: error.message }); // Renvoie l'erreur
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const profileObject = req.file
    ? {
        ...JSON.parse(req.body.user),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete profileObject._userId;
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      if (user._id != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized !' });
      } else {
        User.updateOne(
          { _id: req.auth.userId },
          { ...profileObject, _id: req.auth.userId }
        )
          .then(() => res.status(200).json({ message: 'Object modified !' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getUsers = async (req, res, next) => {
  User.find({ isAdmin: false })
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.user.id })
    .then((result) => {
      // res.status(404).json({ message: 'object not found !' }); // Ajoutez cette ligne pour voir la réponse de MongoDB
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Object deleted' });
      } else {
        res.status(404).json({ message: 'Object not found' });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteAllUsers = async (req, res, next) => {
  try {
    const result = await User.deleteMany({});
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'All users deleted successfully' });
    } else {
      res.status(404).json({ message: 'No users found' });
    }
    error;
  } catch (error) {
    console.error(error); // Ajoutez ceci pour imprimer l'erreur dans la console
    res.status(500).json({ error });
  }
};

// Fonction pour envoyer un e-mail de validation
const notifyTransfert = (email, amount, firstName, lastName) => {
  var Transport = nodemailer.createTransport({
    service: process.env.EMAIL_ONE_SERVICE,
    // port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ONE_USER,
      pass: process.env.EMAIL_ONE_PASSWORD,
    },
  });

  const operationDate = new Date();
  var mailOptions;
  let sender = 'ASLY BANK';
  mailOptions = {
    from: 'contact@aslyonline.com',
    to: email,
    subject: 'Bank transfer',
    html: `Hello ${firstName} ${lastName},\n you have received a transfer of € ${amount} to your bank account from the internal loan and insurance department. Here are the details of the operation:\n
    Amount : € ${amount}\n
    Operation request date : ${operationDate}.\n 
    Thanks`,
  };

  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    }
    // else {
    //   console.log('Message sent');
    // }
  });
};

exports.creditUserAccount = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found !' });
    }

    user.solde = user.solde + req.body.solde;
    await user.save();
    notifyTransfert(user.email, req.body.solde, user.firstName, user.lastName);
    // console.log('here', req.params.id);
    res.status(200).json({ message: 'Account credited' });
  } catch (error) {
    console.log(req.params.id);

    res.status(500).json({ error: error.message });
  }
};
