<template>
    <div class="login_container">
        <!-- 头像区域 -->
        <div class="login_box">
            <div class="avatar_box">
                <img src="~assets/img/xiangjiao.jpg" alt="">
            </div>
            <!-- 登录区域 -->
            <el-form class="login_from" :model='loginFrom' :rules='loginFromRules' ref='logFromRef'>
                <!-- 用户名 -->
                <el-form-item prop='username'>
                    <el-input prefix-icon="el-icon-user-solid" v-model='loginFrom.username'>
                    </el-input>
                </el-form-item>

                <!-- 密码 -->
                <el-form-item prop='password'>
                    <el-input prefix-icon="el-icon-s-opportunity" v-model='loginFrom.password' type='password'>
                    </el-input>
                </el-form-item>

                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click='login'>登录</el-button>
                    <el-button type="info" @click='resetLoginFrom'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //  登录数据绑定对象
                loginFrom: {
                    username: 'admin',
                    password: '123456'
                },
                // 表单验证规则
                loginFromRules: {
                    //    验证账号是否正确
                    username: [
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    //    验证密码是否正确
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }

            }
        },
        methods: {
            // 重置表单 调用resetFields() 重置
            resetLoginFrom() {
                this.$refs.logFromRef.resetFields();
            },
            // 登录前预验证
            login() {
                this.$refs.logFromRef.validate(async valid => {
                    if (!valid) return;
                    // 发送登录网路请求
                    const { data: res } = await this.$http.post('login', this.loginFrom)
                    //弹窗消息
                    if (res.meta.status !== 200) {
                        return this.$message.error('登录失败！')
                    }
                    this.$message.success('登录成功!')
                    window.sessionStorage.setItem('token', res.data.token)
                    this.$router.push('/home')
                })
            }
        }
    }

</script>
<style scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
    }

    .login_box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        /*让盒子居中 */
        width: 450px;
        height: 300px;
        border-radius: 3px;
        background-color: #fff;
    }

    .avatar_box {
        position: absolute;
        left: 50%;
        top: -25%;
        transform: translate(-50%);
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 100px teal
    }

    .avatar_box img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
    }

    .login_from {
        position: absolute;
        width: 100%;
        bottom: 0px;
        padding: 0 20px;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>