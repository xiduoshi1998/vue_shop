<template>
    <div>
        <el-card>
            <!-- 添加角色 -->
            <el-row>
                <el-col>
                    <el-button type='primary' @click='dialogVisible=true'>添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表 -->
            <el-table :data='RolesList' border stripe>
                <el-table-column type='expand'></el-table-column>
                <el-table-column type='index'></el-table-column>

                <!-- 顶部导航 -->
                <el-table-column label='角色名称' prop='roleName'></el-table-column>
                <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
                <el-table-column label='操作'>
                    <template v-slot='scope'>
                        <el-button type="primary" icon="el-icon-search" size='mini'
                            @click='showEditDialog(scope.row.id)'>编辑
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size='mini'>分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加角色 -->
            <el-dialog title="添加角色" width="50%" :visible.sync="dialogVisible" @close='addDialogClosed'>
                <el-form :model="addForm" :rules="verify.addFromRules" label-width="70px" ref="addFromRef">
                    <el-form-item label="角色" prop="username">
                        <el-input v-model='addForm.username'></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="role">
                        <el-input v-model='addForm.role'></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="adduser">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 修改用户 -->
            <el-dialog title="修改权限" :visible.sync="ediDialogVisible" width="50%" @close='ediDialogclosed'>
                <el-form :model="editFrom" :rules="verify.addFromRules" ref="editFromRef" label-width="100px">
                    <el-form-item label="角色名称" prop=''>
                        <el-input v-model="editFrom.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model='editFrom.roleDesc'></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="ediDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click='editUserInfo()'>确 定</el-button>
                </span>
            </el-dialog>
        </el-card>

    </div>
</template>

<script>
    import { verify } from 'components/common/verify'

    export default {
        props: {
            RolesList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                dialogVisible: false,
                // 修改权限 显示与隐藏
                ediDialogVisible: false,
                verify: verify,

                addForm: {
                    username: '',
                    role: ''
                },
                editFrom: {}
            }
        },
        methods: {
            addDialogClosed() {
                this.$refs.addFromRef.resetFields()
            },
            // 添加角色请求
            adduser() {
                this.$refs.addFromRef.validate(async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.post('roles', { roleName: this.addForm })
                    console.log(res);
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加用户失败')
                    }
                    this.$message.success('添加用户成功')
                    // 隐藏添加的对话框
                    this.addDialogVisible = false
                    this.getUserList()
                })
            },

            ediDialogclosed() {
                this.$refs.editFromRef.resetFields()
            },

            // 根据id查询用户
            async showEditDialog(id) {
                this.ediDialogVisible = true
                const { data: res } = await this.$http.get(`roles/${id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询失败')
                }
                this.$message.success('查询成功')
                this.editFrom = res.data
                console.log(this.editFrom);
            },

            // 修改用户信息
            editUserInfo() {
                this.$refs.editFromRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`users/${this.editFrom.roleId}`, { roleName: this.editFrom.roleName })
                    if (res.meta.status !== 200) {
                        return this.$message.error('更新用户信息失败')
                    }

                    this.ediDialogVisible = false;

                    this.getUserList();

                    this.$message.success('更改用户信息成功')
                })
            }
        }

    }

</script>
<style scoped>
</style>