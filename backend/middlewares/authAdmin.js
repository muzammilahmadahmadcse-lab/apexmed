import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: 'Admin token missing. Please log in again.'
      });
    }

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    if (decoded !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token.'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Admin session expired or invalid. Please log in again.'
    });
  }
};

export default authAdmin;