export default async function isUserActive(req, res, next) {
  const { isActive } = req.localData;

  if (!isActive) {
    return res.status(401).json({
      statusCode: 401,
      message: "You have to activate your account. Please check your email.",
    });
  }

  next();
}
