<template>
    <!-- 面包屑导航 -->
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <slot name='bb'></slot>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <slot name='aa'></slot>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {

    }

</script>
<style scoped>
</style>