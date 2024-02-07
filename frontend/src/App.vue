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
                        <span slot="title">主页</span>
                    </el-menu-item>
                    <el-menu-item index="/query">
                        <span slot="title">查询</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
