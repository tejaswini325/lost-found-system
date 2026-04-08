import jwt from "jsonwebtoken";

// Auth middleware: accepts either 'x-auth-token' header or
// 'Authorization: Bearer <token>' header. Works for both user and admin tokens.
const auth = (req, res, next) => {
  // Get token from header.
  // We support both legacy `x-auth-token` and standard `Authorization: Bearer <token>`.
  const bearer = req.header("authorization") || req.header("Authorization");
  const token =
    req.header("x-auth-token") ||
    (bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null);


  // Check if no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support payloads that use either `userId` (users) or `id` (admins)
    req.userId = decoded.userId || decoded.id || null;
    req.tokenPayload = decoded;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message || err);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

export default auth;