<script setup>
import { saveValue } from "../api.js";
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import RecordForm from "./RecordForm.vue";

const visable = ref(false);
const value = ref({});
const loading = ref(false);
const id = ref(0);

const type_tag = {
    todo: "primary",
    submit: "danger",
};

const type_text = {
    todo: "普通",
    submit: "提交",
};

const status_text = {
    todo: "待做",
    cancelled: "取消",
    ok: "完成",
};

const status_tag = {
    todo: "error",
    cancelled: "warning",
    ok: "success",
};

const saveOK = async (value) => {};

const save = async (value) => {
    loading.value = true;
    await saveValue("record", value);
    loading.value = false;
};

const handleEdit = (scope) => {
    visable.value = true;
    id.value = [scope.row.subject.id, scope.row.task.id, scope.row.step.id];
    value.value = scope.row;
};

const handleSave = async () => {
    value.value.step.id = id.value[2];
    await save(value.value);
    visable.value = false;
};

const del = async (value) => {
    try {
        await ElMessageBox.confirm("删除 1 个项目", "删除", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        });
    } catch {
        return;
    }
    value.deleted = true;
    save(value);
};
</script>

<template>
    <el-dialog v-model="visable" append-to-body draggable="true">
        <template #header> 修改 </template>
        <record-form v-if="value && visable" v-model:id="id" :value="value" />
        <el-button v-loading="loading" type="primary" @click="handleSave()">保存</el-button>
    </el-dialog>
    <el-table-column label="ID" prop="id" width="50" />
    <el-table-column label="日期" prop="date" width="120" />
    <el-table-column label="类型" width="80">
        <template #default="scope">
            <el-tag :type="type_tag[scope.row.type]">
                {{ type_text[scope.row.type] }}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column label="ID" prop="subject.id" width="50" />
    <el-table-column label="学科" prop="subject.name" width="60" />
    <el-table-column label="ID" prop="task.id" width="50" />
    <el-table-column label="任务" prop="task.name" width="200" />
    <el-table-column label="ID" prop="step.id" width="50" />
    <el-table-column label="步骤" prop="step.name" width="200" />
    <el-table-column label="综合名" width="300">
        <template #default="scope">
            {{ scope.row.type != "todo" ? "交-" : "" }}{{ scope.row.subject.name }}-{{
                scope.row.task.name
            }}{{ scope.row.step.name == "#" ? "" : "-" + scope.row.step.name }}
        </template>
    </el-table-column>
    <el-table-column label="状态" width="80">
        <template #default="scope">
            <el-tag :type="status_tag[scope.row.status]">
                {{ status_text[scope.row.status] }}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="240">
        <template #default="scope">
            <el-button v-loading="loading" text type="primary" @click="handleEdit(scope)">
                编辑
            </el-button>
            <el-button v-loading="loading" text type="danger" @click="del(scope.row)">
                删除
            </el-button>
            <el-button
                v-loading="loading"
                v-if="scope.row.status !== 'ok'"
                text
                type="success"
                @click="
                    scope.row.status = 'ok';
                    save(scope.row);
                "
            >
                完成
            </el-button>
        </template>
    </el-table-column>
</template>
