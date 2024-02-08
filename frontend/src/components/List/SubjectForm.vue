<script setup>
const { value } = defineProps(["value"]);
</script>

<template>
    <el-form>
        <el-form-item label="名称">
            <el-input v-model="value.name" />
        </el-form-item>
    </el-form>
</template>
