<script setup>
import { onMounted, ref } from "vue";
import { getAll } from "../api";

const { value } = defineProps(["value"]);

const id = defineModel("id");
const options = ref([]);

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
        });
    });

    options.value = _options;
};
</script>

<template>
    <el-form>
        <el-form-item label="名称">
            <el-input v-model="value.name" />
        </el-form-item>
        <el-form-item label="学科">
            <el-cascader v-model="id" :options="options" />
        </el-form-item>
    </el-form>
</template>
