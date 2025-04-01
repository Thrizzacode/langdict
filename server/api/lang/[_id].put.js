import Lang from "@/server/models/lang";

export default defineEventHandler(async (event) => {
  try {
    const _id = getRouterParam(event, "_id");
    const data = await readBody(event);
    console.log("id", _id);
    console.log("body", data);

    await Lang.findOneAndUpdate({ _id }, data);
    return { message: "LangCode修改成功" };
  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
