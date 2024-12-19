import Lang from "@/server/models/lang";
import { translate } from "@vitalets/google-translate-api";
import { HttpProxyAgent } from "http-proxy-agent";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    console.log(data);
    const langCode = data.langCode;
    const PROXY_LIST = data.proxyList;

    const TIMEOUT_MS = 5000;
    let currentProxy = 0;

    function getAgent() {
      let idx = currentProxy++;
      if (idx >= PROXY_LIST.length - 1) {
        currentProxy = 0;
      }
      const agent = PROXY_LIST[idx];
      console.log(agent);
      return new HttpProxyAgent(agent);
    }

    async function translateWithProxy(inputTxt) {
      try {
        const agent = getAgent();
        const { text } = await translate(inputTxt, {
          to: "en",
          fetchOptions: { agent, timeout: TIMEOUT_MS },
        });
        console.log(`'${inputTxt}' > ${text}`);
        return text;
      } catch (e) {
        // 嘗試下一個地址
        if (e.name === "TooManyRequestsError") {
          console.log("failed.");
          translateWithProxy(inputTxt);
        }
      }
    }

    const result = await translateWithProxy(data.zhCN);
    console.log("re", result);
    data.en = result;
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
