<template>
  <div>
    <el-container>
      <el-header>
        <div class="logo">
          <Icon
            name="streamline:dictionary-language-book"
            size="24"
            style="color: #7ae2ac"
          />
          <h2>小小魔法書</h2>
        </div>
        <div class="right-nav">
          <el-button type="primary" @click="showAddDialog()">添加</el-button>
          <el-button type="warning" @click="exportJSON">輸出JSON</el-button>
          <el-dropdown>
            <el-avatar> <Icon name="emojione:alien" size="24" /> </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">段開魂結</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar ref="scrollHeight">
          <ClientOnly>
            <el-table
              v-loading="tableData.length === 0"
              :data="tableData"
              style="width: 100%"
              border
              :height="tableHeight"
            >
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
                    <Icon class="fire" name="noto:fire" size="16" />
                    燒毀
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </ClientOnly>
        </el-scrollbar>
      </el-main>
    </el-container>

    <el-dialog v-model="langDialog" :title="title" width="500">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item
          label="LangCode"
          :label-width="formLabelWidth"
          prop="langCode"
        >
          <el-input v-model="form.langCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="zh-CN" :label-width="formLabelWidth" prop="zhCN">
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
          <el-button @click="isEdit ? handleEdit() : handleAdd(ruleForm)"
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

const scrollHeight = ref(null);
const tableData = ref([]);
const langDialog = ref(false);
const title = ref("添加LangCode");
const isEdit = ref(false);
const ruleForm = ref(null);
const formLabelWidth = ref("120px");
const form = ref({
  langCode: "",
  zhCN: "",
  en: "",
});

const rules = reactive({
  langCode: [{ required: true, message: "请输入LangCode", trigger: "blur" }],
  zhCN: [{ required: true, message: "请输入zh-CN", trigger: "blur" }],
});

const tableHeight = computed(() => {
  return scrollHeight.value ? scrollHeight.value.$el.clientHeight : 0;
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
  isEdit.value = true;
  langDialog.value = true;
  title.value = "修改LangCode";
  form.value = { ...row };
};

const handleAdd = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
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
    } else {
      ElMessage({
        message: "請輸入正確資料",
        type: "error",
        customClass: "error-message",
      });
    }
  });
};

// 編輯
const handleEdit = async () => {
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

const isLogin = useCookie("isLogin");
const username = useCookie("username");
const logout = () => {
  isLogin.value = null;
  username.value = null;
  navigateTo("/login");
};

onMounted(() => {
  fetchLangs();
});
</script>

<style>
.el-main {
  height: calc(100vh - 60px);
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fire {
  margin-right: 5px;
}

.error-message {
  z-index: 9999 !important;
}

.right-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
