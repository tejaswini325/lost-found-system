import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  // Get token from header.
  // We support both legacy `x-auth-token` and standard `Authorization: Bearer <token>`.
  const bearer = req.headers.authorization;
  const token =
    req.header("x-auth-token") ||
    (bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null);

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user ID to request
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

export default auth;