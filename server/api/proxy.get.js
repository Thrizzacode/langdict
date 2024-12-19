import Proxy from "../models/proxy";

export default defineEventHandler(async (event) => {
  try {
    const proxyList = await Proxy.find();
    return proxyList;
  } catch (error) {
    return createError(error);
  }
});
