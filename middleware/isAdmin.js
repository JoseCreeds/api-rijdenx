const User = require('../models/User');

const checkIfuserIsAdmin = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return false;
  }

  return user.isAdmin === true;
};

module.exports = async (req, res, next) => {
  try {
    const isAdmin = await checkIfuserIsAdmin(req.auth.userId);

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access. Admin privileges required.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
