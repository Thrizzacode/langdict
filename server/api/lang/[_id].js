import Lang from "@/server/models/lang";

export default defineEventHandler(async (event) => {
  try {
    console.log(event);
    const _id = getRouterParam(event, "_id");
    console.log("body", _id);

    await Lang.deleteOne({ _id });
    return { message: "LangCode刪除成功" };
  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
