import Proxy from "../models/proxy";
import { translate } from "@vitalets/google-translate-api";
import { HttpProxyAgent } from "http-proxy-agent";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);

  const PROXY_LIST = data.proxyList;
  const TIMEOUT_MS = 2000;

  async function checkProxy(ip) {
    return new Promise(async (rs, rj) => {
      try {
        const { text } = await translate("cappa", {
          to: "zh-tw",
          // 篩選2秒內有response的地址
          fetchOptions: { agent: new HttpProxyAgent(ip), timeout: TIMEOUT_MS },
        });
        return rs(ip);
      } catch (err) {
        rs("");
      }
    });
  }

  async function run(addrs) {
    const tasks = [];
    for (let i = 0; i < addrs.length; i++) {
      const ip = addrs[i];
      if (ip.startsWith("http")) {
        tasks.push(checkProxy(ip));
      } else {
        const httpAddr = `http://${ip}`;
        const httpsAddr = `https://${ip}`;
        tasks.push(checkProxy(httpAddr));
        tasks.push(checkProxy(httpsAddr));
      }
    }
    return (await Promise.all(tasks)).filter((ip) => ip);
  }

  let validProxyList = [];
  const filteredProxyList = await run(PROXY_LIST);
  // 再次檢查確保地址能使用
  validProxyList = await run(filteredProxyList);
  await Proxy.create({ proxylist: validProxyList });

  return { message: "檢查完畢", proxyList: validProxyList };
});
