import User from "../models/user";

export default defineEventHandler(async (event) => {
  try {
    const { username, pwd } = await readBody(event);
    const user = await User.findOne({ username });
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "請確認帳號密碼是否正確",
      });
    }

    if (user.pwd !== pwd) {
      throw createError({
        statusCode: 401,
        statusMessage: "密碼錯誤",
      });
    }

    return user;
  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
