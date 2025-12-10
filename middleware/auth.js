const jwt = require(`jsonwebtoken`);

//JWT_SECRET 생성
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-for-dev";

// 토큰 생성
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "인증 정보가 없습니다. (토큰 누락)",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT 검증 실패:", error.message);
    return res.status(403).json({
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

// middleware export
module.exports = { generateToken, authenticateToken };
