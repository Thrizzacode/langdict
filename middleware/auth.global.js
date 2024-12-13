export default defineNuxtRouteMiddleware((to, from) => {
  const isLogin = useCookie("isLogin");
  if (!isLogin.value && to.path !== "/login") return navigateTo("/login");
});
