import User from "../models/user";
export default defineEventHandler(async (event) => {
  try {
    const { name, email, pwd } = await readBody(event);
    await User.create({ name, email, pwd });
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    return createError(error);
  }
});
