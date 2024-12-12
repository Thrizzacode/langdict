import Lang from "@/server/models/lang";

export default defineEventHandler(async (event) => {
  try {
    const lang = await Lang.find();
    return lang;
  } catch (error) {
    return createError(error);
  }
});
