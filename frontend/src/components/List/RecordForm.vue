<script setup>
import { onMounted, ref } from "vue";
import { getAll } from "../api";

const { value } = defineProps(["value"]);

const id = defineModel("id");
const options = ref([]);

const type_text = {
    todo: "普通",
    submit: "提交",
};

const status_text = {
    todo: "待做",
    cancelled: "取消",
    ok: "完成",
};

onMounted(() => {
    computeOptions();
});

const computeOptions = async () => {
    const database = await getAll();
    const _options = [];
    database.subject.forEach((subject) => {
        _options.push({
            value: subject.id,
            label: subject.name,
            children: database.task
                .filter((task) => task.subject.id === subject.id)
                .map((task) => ({
                    value: task.id,
                    label: task.name,
                    children: database.step
                        .filter((step) => step.task.id === task.id)
                        .map((step) => ({
                            value: step.id,
                            label: step.name,
                        })),
                })),
        });
    });

    options.value = _options;
};

</script>

<template>
    <el-form>
        <el-form-item label="日期">
            <el-date-picker v-model="value.date" value-format="YYYY-MM-DD" type="date" />
        </el-form-item>
        <el-form-item label="类型">
            <el-select v-model="value.type">
                <el-option
                    v-for="item in ['todo', 'submit']"
                    :key="item"
                    :label="type_text[item]"
                    :value="item"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="步骤">
            <el-cascader v-model="id" :options="options" />
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="value.status">
                <el-option
                    v-for="item in ['todo', 'ok', 'cancelled']"
                    :key="item"
                    :label="status_text[item]"
                    :value="item"
                />
            </el-select>
        </el-form-item>
    </el-form>
</template>
