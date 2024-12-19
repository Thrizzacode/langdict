import Lang from "@/server/models/lang";

export default defineEventHandler(async (event) => {
  try {
    const langCode = getRouterParam(event, "langcode");
    console.log("body", langCode);

    await Lang.deleteOne({ langCode });
    return { message: "LangCode刪除成功" };
  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
