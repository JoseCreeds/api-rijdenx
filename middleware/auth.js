const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // Check if authorization header exists and has the correct format
    if (!authorization || !authorization.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ message: 'No authorization token found !' });
    }

    const token = authorization.split(' ')[1];
    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);

    // Find user based on decoded token's ID
    const userId = decodedToken.userId;

    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
