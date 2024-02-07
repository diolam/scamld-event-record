<script setup>
import { saveValue, getAll } from "../api.js";
import { ref } from "vue";

const visable = ref(false);
const value = ref({});
const loading = ref(false);

const save = async (value) => {
    value.selected ^= true;
    value.editable = false;
    await saveValue("subject", value);
};

const handleEdit = async (scope) => {
    value.value = scope.row;
    visable.value = true;
};

const handleSave = async () => {
    await save(value.value);
    visable.value = false;
};
</script>

<template>
    <Teleport to="body">
        <el-dialog v-model="visable">
            <template #header> 修改 </template>
            <el-form v-model="value">
                <el-form-item label="名称">
                    <el-input v-model="value.name" />
                </el-form-item>
            </el-form>
            <el-button v-loading="loading" type="primary" @click="handleSave()">保存</el-button>
        </el-dialog>
    </Teleport>
    <el-table-column label="ID" prop="id" width="50" />
    <el-table-column label="名称" prop="name" width="60" />
    <el-table-column label="操作" width="90">
        <template #default="scope">
            <el-button v-loading="loading" text type="primary" @click="handleEdit(scope)">
                修改
            </el-button>
        </template>
    </el-table-column>
</template>
