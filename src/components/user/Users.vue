<template>
    <div>

        <breadcrumb>
            <template slot="bb">
                <span>用户管理</span>
            </template>
            <template slot="aa">
                <span>列表管理</span>
            </template>
        </breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter='30'>
                <el-col :span='9'>
                    <!--:span 设置宽度  -->
                    <el-input placeholder="请输入内容" class="input-with-select" v-model='queryInfo.query' clearable
                        @clear='getUserList'>
                        <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type='primary' @click='addDialogVisible=true'>添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表 -->
            <el-table :data='userlist' border stripe>
                <el-table-column type='index' label='#'></el-table-column>
                <el-table-column label='姓名' prop='username'></el-table-column>
                <el-table-column label='邮箱' prop='email'></el-table-column>
                <el-table-column label='电话' prop='mobile'></el-table-column>
                <el-table-column label='角色' prop='role_name'></el-table-column>
                <el-table-column label='状态'>
                    <template slot-scope='scope'>
                        <el-switch v-model='scope.row.mg_state' @change='userStateChanged(scope.row)'>
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column label='操作'>
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row.id)'>
                        </el-button>

                        <el-button type="danger" icon="el-icon-delete" size='mini' @click='removeUser(scope.row.id)'>
                        </el-button>

                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
                            <el-button type="warning" icon="el-icon-share" size='mini' @click='setRole(scope.row)'>
                            </el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 添加用户 -->
            <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>
                <!-- 内容主体区域 -->
                <el-form :model="addFrom" :rules="verify.addFromRules" ref="addFromRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model='addFrom.username'></el-input>
                    </el-form-item>

                    <!-- 密码 -->
                    <el-form-item label="密码" prop="password">
                        <el-input v-model='addFrom.password'></el-input>
                    </el-form-item>

                    <!-- 邮箱-->
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model='addFrom.email'></el-input>
                    </el-form-item>

                    <!-- 手机号 -->
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model='addFrom.mobile'></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部区 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="adduser">确 定</el-button>
                </span>
            </el-dialog>

            <!--  修改用户对话框-->
            <el-dialog title="修改用户" :visible.sync="ediDialogVisible" width="50%" @close='ediDialogclosed'>
                <el-form :model="editFrom" :rules="verify.addFromRules" ref="editFromRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editFrom.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop='mobile'>
                        <el-input v-model="editFrom.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop='email'>
                        <el-input v-model="editFrom.email"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="ediDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo()">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 角色分配 -->
            <el-dialog title="分配角色" :visible.sync="setDialogVisible" width="50%" @close='setRoleDialogClosed'>
                <p>当前用户: {{user.username}}</p>
                <p>当前角色: {{user.role_name}}</p>
                <p>分配新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="setDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    //验证规则
    import { verify } from 'components/common/verify'
    import breadcrumb from 'views/breadcrumb'
    import { getRolesList } from 'network/request'
    export default {
        data() {

            return {
                verify: verify,
                queryInfo: {
                    query: '',
                    // 当前页数
                    pagenum: 1,
                    // 每页显示多少条的数据
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                // 对话框显示与隐藏
                addDialogVisible: false,
                // 添加用户数据
                addFrom: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                },

                // 控制修改用户区域显示或者隐藏
                ediDialogVisible: false,

                //查询到的用户信息
                editFrom: {},

                // 角色分配
                setDialogVisible: false,
                user: {},
                userId: '',
                // 所有的角色列表
                rolesList: {},

                selectedRoleId: ''
            }


        },

        created() {
            this.getUserList()
        },
        components: {
            breadcrumb
        },

        methods: {
            async getUserList() {
                const { data: res } = await this.$http.get('users', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('无法获取用户数据')
                }
                this.userlist = res.data.users
                this.total = res.data.total
            },

            // 监听 pagesize 改变的事件
            handleSizeChange(newsize) {
                this.queryInfo.pagesize = newsize
                console.log(newsize);
                this.getUserList()
            },

            // 监听页码植改变的事件
            handleCurrentChange(newpage) {
                this.queryInfo.pagenum = newpage
                this.getUserList()
            },

            // 监听开关的改变
            async userStateChanged(userinfo) {
                const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if (res.meta.status !== 200) {
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('用户状态失败')
                }
                this.$message.success('更新用户状态成功')
            },

            // 监听添加用户的关闭事件
            addDialogClosed() {
                this.$refs.addFromRef.resetFields()
            },

            // 点击添加用户
            adduser() {
                this.$refs.addFromRef.validate(async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.post('users', this.addFrom)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加用户失败')
                    }
                    this.$message.success('添加用户成功')
                    // 隐藏添加的对话框
                    this.addDialogVisible = false
                    this.getUserList()
                })
            },

            // 修改用户信息
            async showEditDialog(id) {

                this.ediDialogVisible = true
                let { data: res } = await this.$http.get(`users/${id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户信息失败')
                }
                this.editFrom = res.data
            },

            // 监听用户修改监听事件
            ediDialogclosed() {
                this.$refs.editFromRef.resetFields()
            },

            // 修改用户信息
            editUserInfo() {
                this.$refs.editFromRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`users/${this.editFrom.id}`, {
                        email: this.editFrom.email,
                        mobile: this.editFrom.mobile
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('更新用户信息失败')
                    }

                    this.ediDialogVisible = false;

                    this.getUserList();

                    this.$message.success('更改用户信息成功')
                })
            },

            // 删除用户
            async removeUser(id) {
                // 询问用户是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error)
                // 确定 返回"confirm"  

                if (confirmResult !== "confirm") {
                    return this.$message.info('已取消删除')
                }
                // 删除用户
                const { data: res } = await this.$http.delete(`users/${id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('改用户不能删除')
                }
                this.$message.success('删除成功')
                this.getUserList()
                console.log(this.user.id);
                console.log(this.selectedRoleId);
            },

            // 角色分配展示
            setRole(user) {
                // this.$http.get('roles')
                getRolesList().then(res => {
                    if (res.data.meta.status !== 200) {
                        this.$message.error('获取角色列表失败')
                    }
                    this.rolesList = res.data.data
                    this.$message.success('获取角色列表成功')
                })
                this.userId = user.id
                console.log(this.userId);
                this.user = user
                this.setDialogVisible = true
            },

            // 点击按钮角色分配
            async saveRoleInfo() {
                if (!this.selectedRoleId) {
                    return this.$message.error('请选择分配的角色')
                }

                const { data: res } = await this.$http.put(`users/${this.userId}/role`,
                    { rid: this.selectedRoleId })

                if (res.meta.status !== 200) {
                    return this.$message.error('更新角色失败')
                }
                this.$message.success('角色更新成功')
                this.getRolesList()
                this.setDialogVisible = false
            },
            setRoleDialogClosed() {
                this.selectedRoleId = ''
            }
        },


    }

</script>
<style scoped>
</style>