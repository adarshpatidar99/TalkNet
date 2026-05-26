





























const sendToken = (user, statusCode, res, message) => {
  const token = user.getJwtToken();

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE);
  const expires = new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000);

  res.status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      expires: expires,
      sameSite: "none", 
      secure: true,     
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};

export default sendToken;
