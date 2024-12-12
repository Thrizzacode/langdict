<template>
  <div>
    <el-container>
      <el-header>
        <h2>Lang Dict</h2>
        <el-button type="primary" @click="addDialog = true">Add</el-button>
      </el-header>
      <el-main>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="langCode" label="LangCode" />
          <el-table-column prop="zhCN" label="zh-CN" />
          <el-table-column prop="en" label="en" />
        </el-table>
      </el-main>
    </el-container>

    <el-dialog v-model="addDialog" title="添加LangCode" width="500">
      <el-form :model="form">
        <el-form-item label="LangCode" :label-width="formLabelWidth">
          <el-input v-model="form.langCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="zhCN" :label-width="formLabelWidth">
          <el-input v-model="form.zhCN" autocomplete="off" />
        </el-form-item>
        <el-form-item label="en" :label-width="formLabelWidth">
          <el-input v-model="form.en" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addLangCode">康糞</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            砍手
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
const tableData = ref([]);
const addDialog = ref(false);
const formLabelWidth = ref("120px");
const form = ref({
  langCode: "",
  zhCN: "",
  en: "",
});
// const tableData = [
//   {
//     langCode: "F00001",
//     zhCN: "嗨",
//     en: "Hi",
//   },
// ];

const addLangCode = async () => {
  console.log(form.value);
  try {
    const data = await $fetch("http://localhost:3000/api/lang", {
      method: "POST",
      body: {
        ...form.value,
      },
    });
    console.log(data);
    addDialog.value = false;
    fetchLangs();
    ElMessage({
      message: "添加成功",
      type: "success",
    });
  } catch (error) {
    ElMessage({
      message: error.data.message,
      type: "error",
      customClass: "error-message",
    });
  }
};

const fetchLangs = async () => {
  const data = await $fetch("http://localhost:3000/api/lang");
  console.log(data);
  tableData.value = data;
};

onMounted(() => {
  fetchLangs();
});
</script>

<style>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  z-index: 9999 !important;
}
</style>
