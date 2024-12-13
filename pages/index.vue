<template>
  <div>
    <el-container>
      <el-header>
        <h2>Lang Dict</h2>
        <div>
          <el-button type="primary" @click="showAddDialog()"
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
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="showEditDialog(scope.row)">
                編輯
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                燒毀
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-dialog v-model="langDialog" :title="title" width="500">
      <el-form :model="form">
        <el-form-item label="LangCode" :label-width="formLabelWidth">
          <el-input v-model="form.langCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="zhCN" :label-width="formLabelWidth">
          <el-input v-model="form.zhCN" autocomplete="off" />
        </el-form-item>
        <template v-if="isEdit">
          <el-form-item label="en" :label-width="formLabelWidth">
            <el-input v-model="form.en" autocomplete="off" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isEdit ? handleEdit() : handleAdd()"
            >康糞</el-button
          >
          <el-button type="primary" @click="langDialog = false">
            砍手
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import JSZip from "jszip";

const tableData = ref([]);
const langDialog = ref(false);
const title = ref("添加LangCode");
const isEdit = ref(false);
const formLabelWidth = ref("120px");
const form = ref({
  langCode: "",
  zhCN: "",
  en: "",
});

const resetForm = () => {
  form.value = {
    langCode: "",
    zhCN: "",
    en: "",
  };
};
const showAddDialog = () => {
  isEdit.value = false;
  langDialog.value = true;
  title.value = "添加LangCode";
  resetForm();
};

const showEditDialog = (row) => {
  console.log(row);
  isEdit.value = true;
  langDialog.value = true;
  title.value = "修改LangCode";
  form.value = { ...row };
};

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
    langDialog.value = false;
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

// 編輯
const handleEdit = async () => {
  console.log(form.value);
  try {
    const data = await $fetch(`/api/lang/${form.value.langCode}`, {
      method: "PUT",
      body: {
        ...form.value,
      },
    });
    console.log(data);
    langDialog.value = false;
    fetchLangs();
    ElMessage({
      message: "修改成功",
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

// 刪除
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

// 取得資料
const fetchLangs = async () => {
  const data = await $fetch("/api/lang");
  console.log(data);
  tableData.value = data;
};

// 輸入語系包
const exportJSON = async () => {
  const zip = new JSZip();

  const zhCNContent = {};
  const enContent = {};

  tableData.value.forEach((item) => {
    const code = item.langCode;
    zhCNContent[code] = item.zhCN;
    enContent[code] = item.en;
  });

  zip.file("zh-CN.json", JSON.stringify(zhCNContent, null, 2));
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
