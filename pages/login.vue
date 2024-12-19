<template>
  <div class="center">
    <el-form :model="form" @keyup.enter="login()">
      <Icon name="fxemoji:alienmonster" size="80" style="margin-bottom: 10px" />
      <el-form-item label="帳號" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="form.pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="login()"
          >Link Start</el-button
        >
        <el-button class="login-btn" type="primary" @click="register()"
          >註冊</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
const form = ref({
  username: "",
  pwd: "",
});

// 註冊
const register = () => {
  ElMessageBox.alert("請找Mike<3", "註冊", {
    confirmButtonText: "好",
  });
};

// 登入
const login = async () => {
  const isLogin = useCookie("isLogin", { maxAge: 60 * 60 });
  const username = useCookie("username", { maxAge: 60 * 60 });
  try {
    const data = await $fetch("/api/login", {
      method: "POST",
      body: {
        ...form.value,
      },
    });
    isLogin.value = true;
    username.value = data.username;
    ElMessage({
      message: "登入成功",
      type: "success",
      customClass: "success-message",
    });
    navigateTo("/");
  } catch (error) {
    ElMessage({
      message: error.data.message,
      type: "error",
      customClass: "error-message",
    });
  }
};
</script>

<style>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: aliceblue;
}
.el-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 20px;
  padding: 20px;
  background-color: white;
}
</style>
