<script setup>
defineProps("show");
</script>
<template>
    <el-dialog v-model="show"> 
        <template #title>
            <span>编辑记录</span>
        </template>
        <el-input v-model="record.name"/>
    </el-dialog>
</template>
