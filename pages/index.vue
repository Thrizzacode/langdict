<template>
  <div>
    <el-container>
      <el-header>
        <h2>Lang Dict</h2>
        <div>
          <el-button type="primary" @click="addDialog = true"
            >添加LangCode</el-button
          >
          <el-button type="warning" @click="exportJSON">輸出JSON</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="langCode" label="LangCode" />
          <el-table-column prop="zhCN" label="zh-CN" />
          <el-table-column prop="en" label="en" />
          <el-table-column label="Action">
            <template #default="scope">
              <!-- <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                Edit
              </el-button> -->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
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
          <el-button @click="handleAdd">康糞</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            砍手
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import JSZip from "jszip";

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

const handleAdd = async () => {
  console.log(form.value);
  try {
    const data = await $fetch("/api/lang", {
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

const handleDelete = async (index, row) => {
  console.log(index, row);
  try {
    const data = await $fetch(`/api/lang/${row.langCode}`, {
      method: "DELETE",
    });
    console.log(data);
    fetchLangs();
    ElMessage({
      message: "删除成功",
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
  const data = await $fetch("/api/lang");
  console.log(data);
  tableData.value = data;
};

const exportJSON = async () => {
  const zip = new JSZip();

  const zhCNContent = {};
  const enContent = {};

  tableData.value.forEach((item) => {
    const code = item.langCode;
    zhCNContent[code] = item.zhCN;
    enContent[code] = item.en;
  });

  zip.file("zhCN.json", JSON.stringify(zhCNContent, null, 2));
  zip.file("en.json", JSON.stringify(enContent, null, 2));

  // 生成壓縮檔並觸發下載
  zip.generateAsync({ type: "blob" }).then((content) => {
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "langs.zip";
    link.click();
    URL.revokeObjectURL(url);
  });
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
