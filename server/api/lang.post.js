import Lang from "@/server/models/lang";
import { translate } from "@vitalets/google-translate-api";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const langCode = data.langCode;

    const { text: en } = await translate(data.zhCN, { to: "en" });
    data.en = en;
    console.log("body", data);
    const existLangCode = await Lang.findOne({ langCode });
    if (existLangCode) {
      throw createError({
        statusCode: 409,
        statusMessage: "LangCode已存在",
      });
    }

    await Lang.create(data);
    return { message: "LangCode添加成功", data };
  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
