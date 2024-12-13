import Lang from "@/server/models/lang";

export default defineEventHandler(async (event) => {
  try {
    const langCode = getRouterParam(event, "langcode");
    const data = await readBody(event);
    console.log("langCode", langCode);
    console.log("body", data);

    await Lang.findOneAndUpdate({ langCode }, data);
    return { message: "LangCode修改成功" };
  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
