import jwt from 'jsonwebtoken';

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized. Login Again'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized. Login Again'
      });
    }

    next();
  } catch (error) {
    console.error('Admin authentication error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin token. Please log in again.'
    });
  }
};

export default authAdmin;