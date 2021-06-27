<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="~assets/img/xiangjiao.jpg">
                <span>电商后台管理系统</span>
            </div>
            <el-button type='danger' @click='logout'>退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-btn" @click='toggleCollase'>|||</div>
                <!-- 侧边栏导航 -->
                <el-menu background-color="#373d41" text-color="#fff" unique-opened :collapse='isCollapse'
                    :collapse-transition='false' router :default-active='this.$route.path'>
                    <!-- 一级菜单 -->
                    <el-submenu :index="String(item.id)" v-for="item in menulist" :key='item.id'>
                        <!-- 一级菜单template -->
                        <template slot="title">
                            <i class="iconfont"></i>
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children" :key='item2.id'>
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{item2.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        // 请求左侧菜单数据
        created() {
            this.$http.get('menus').then(res => {
                if (res.data.meta.status !== 200) return this.$message.err(res.data.meta.msg)
                this.menulist = res.data.data
            })
        },
        data() {
            return {
                // 左侧菜单
                menulist: [],
                isCollapse: false
            }
        },
        methods: {
            logout() {
                // 清除sessionStorage里的数据
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            // 菜单折叠 展开
            toggleCollase() {
                this.isCollapse = !this.isCollapse
            }
        },
    }

</script>
<style scoped>
    .home_container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }

    .el-header div {
        display: flex;
        align-items: center;
    }

    .el-header div span {
        margin-left: 20px;
    }

    .el-header img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
    }

    .el-aside {
        background-color: #373d41;
    }

    .el-main {
        background-color: #eaedf1;
    }

    .el-menu {
        border: none;
    }

    .toggle-btn {
        background-color: #4a5064;
        color: #fff;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
    }
</style>