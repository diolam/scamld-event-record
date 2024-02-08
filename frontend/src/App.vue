<script setup></script>

<template>
    <el-container>
        <el-header theme="light" class="header">
            <h1>Scamld - 事件记录系统</h1>
        </el-header>
        <el-container>
            <el-aside>
                <el-menu :router="true" default-active="1">
                    <el-menu-item index="/">
                        <el-icon><HomeFilled /></el-icon>
                        <span slot="title">主页</span>
                    </el-menu-item>
                    <el-menu-item index="/query">
                        <el-icon><Filter /></el-icon>
                        <span slot="title">查询</span>
                    </el-menu-item>
                    <el-menu-item index="/create">
                        <el-icon><Plus /></el-icon>
                        <span slot="title">创建</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
