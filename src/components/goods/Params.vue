<template>
    <div>
        <!-- 面包屑 -->
        <breadcrumb>
            <template slot="bb">
                <span>商品管理</span>
            </template>
            <template slot="aa">
                <span>参数列表</span>
            </template>
        </breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable='false' show-icon>
            </el-alert>

            <!-- 商品分类 -->
            <el-row>
                <el-col class="cat_pot">
                    <span>选择商品分类:</span>
                    <!-- 级别写选择框 -->
                    <el-cascader v-model="selectedKeys" :options="CateList"
                        :props="{value:'cat_id',label:'cat_name',children:'children'}" @change="handleChange"
                        expandTrigger='hover'>
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- 标签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 动态属性 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type='primary' :disabled='isBtnDisabled' @click='addDialogVisible=true'>添加参数
                    </el-button>
                    <el-table :data='manyDate' border stripe>
                        <!-- 展开行 -->
                        <el-table-column type='expand'>
                            <template v-slot='scope'>
                                <el-tag v-for='(item,index ) in scope.row.attr_vals' :key='index' closable
                                    @close='handClose(index,scope.row)'>
                                    {{item}}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" class="input-new-tag">
                                </el-input>
                                <!-- 添加文本框 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    添加
                                </el-button>
                            </template>
                        </el-table-column>

                        <el-table-column type='index' label='#'></el-table-column>
                        <el-table-column label='参数名称' prop='attr_name'></el-table-column>

                        <el-table-column label='参数名称'>
                            <template v-slot='scope'>
                                <el-button type='primary' icon="el-icon-edit" size="mini"
                                    @click='editParaMeter(scope.row.attr_id)'>编辑
                                </el-button>
                                <el-button type='danger' icon="el-icon-delete" size="mini"
                                    @click='delteteParams(scope.row.attr_id)'>删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 静态属性 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type='primary' :disabled='isBtnDisabled' @click='addDialogVisible=true'>添加属性
                    </el-button>
                    <el-table :data='onlyDate' border stripe>

                        <el-table-column type='expand'>
                            <template v-slot='scope'>
                                <el-tag v-for='(item,index ) in scope.row.attr_vals' :key='index' closable
                                    @close='handClose(index,scope.row)'>
                                    {{item}}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" class="input-new-tag">
                                </el-input>
                                <!-- 添加文本框 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    添加
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type='index' label='#'></el-table-column>
                        <el-table-column label='参数名称' prop='attr_name'></el-table-column>

                        <el-table-column label='参数名称'>
                            <template v-slot='scope'>
                                <el-button type='primary' icon="el-icon-edit" size="mini"
                                    @click="editParaMeter(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type='danger' icon="el-icon-delete" size="mini"
                                    @click='delteteParams(scope.row.attr_id)'>删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加参数 -->
                <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%">
                    <el-form ref="addFromRef" :model="addFrom" label-width="100px">
                        <el-form-item :label="titleText">
                            <el-input v-model="addFrom.attr_name"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addParams">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 编辑参数 -->
                <el-dialog :title="'修改'+titleText" :visible.sync="adiDialogVisible" width="50%" @close='ediClosed'>
                    <el-form ref="ediFromRef" :model="ediFrom" label-width="100px">
                        <el-form-item :label="titleText">
                            <el-input v-model="ediFrom.attr_name"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer">
                        <el-button @click="adiDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="adiParams">确 定</el-button>
                    </span>
                </el-dialog>

            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import breadcrumb from 'views/breadcrumb'
    export default {
        components: {
            breadcrumb
        },
        data() {
            return {
                // 商品分类数据
                CateList: [],

                // 级联选择框双向绑定
                selectedKeys: [],

                // 标签被点击的名称
                activeName: "many",

                // 动态数据
                manyDate: [],
                // 静态数据
                onlyDate: [],
                addDialogVisible: false,

                // 添加参数对象
                addFrom: {
                    attr_name: ''
                },
                // 添加参数验证规则


                //当前点击的参数
                ParamsDate: {
                    attr_name: ''
                },

                // 参数的对话框显示与隐藏
                ParamsDialogVisible: false,

                //修改参数显示与隐藏
                adiDialogVisible: false,

                ediFrom: {
                    attr_name: ""
                },
                // 分类id

                fenleiid: '',

            }
        },
        computed: {
            isBtnDisabled() {
                if (this.selectedKeys.length !== 3) {
                    return true
                }
                return false
            },
            cateID() {
                if (this.selectedKeys.length === 3) {
                    return this.selectedKeys[2]
                }
                return null
            },
            titleText() {
                if (this.activeName === 'many') {
                    return "动态参数"
                } else {
                    return "静态属性"
                }
            }

        },
        methods: {
            async getCateList() {
                const { data: res } = await this.$http.get('categories',)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败')
                }
                this.CateList = res.data
            },

            // 级联选择框选中触发
            handleChange() {
                this.getParamsDate()
            },

            // tab标签的事件
            handleTabClick() {
                this.getParamsDate()
            },
            async getParamsDate() {
                // 不是三级分类
                if (this.selectedKeys.length !== 3) {
                    this.selectedKeys = []
                    this.manyDate = [],
                        this.onlyDate = []
                    return
                }

                //根据 所选的分类ID，获取对应的参数
                const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`,
                    { params: { sel: this.activeName } })

                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败')
                }

                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    item.inputVisible = false
                    item.inputValue = ''
                })
                console.log(res.data);
                if (this.activeName === 'many') {
                    this.manyDate = res.data
                } else {
                    this.onlyDate = res.data
                }
            },

            // 点击添加参数
            async addParams() {
                const { data: res } = await this.$http.post(`categories/${this.cateID}/attributes`, {
                    attr_name: this.addFrom.attr_name,
                    attr_sel: this.activeName
                })
                console.log(res);
                if (res.meta.status !== 201) {
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
                this.getCateList()
                this.addDialogVisible = false
            },


            // 
            ediClosed() {
                this.$refs.ediFromRef.resetFields()
            },
            // 点击展示修改参数对话框
            async editParaMeter(id) {
                const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes/${id}`, {
                    params: { attr_sel: this.activeName }
                })
                this.fenleiid = id
                this.$message.success('获取参数成功')
                // console.log(res.data);
                this.ediFrom = res.data
                this.adiDialogVisible = true
            },

            // 点击修改参数
            async adiParams() {
                const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.fenleiid}`, {
                    attr_name: this.ediFrom.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('修改' `${this.titleText}` + '失败')
                }
                this.$message.success('修改' + `${this.titleText}` + '成功')
                this.getCateList()
                this.adiDialogVisible = false
            },

            // 删除参数或者属性
            async delteteParams(id) {
                const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    this.$message.info('已取消删除')
                })
                if (result === 'confirm') {
                    const { data: res } = await this.$http.delete(`categories/${this.cateID}/attributes/${id}`)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败')
                    }
                    this.$message.success('删除成功')
                    this.getCateList()
                }
            },

            // 触发文本框
            async handleInputConfirm(row) {
                // 输入的内容不等于0
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = '',
                        row.inputVisible = false
                    return
                }
                // 输入了内容 需要做下一步操作
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = '',
                    row.inputVisible = false

                this.saveAttrVals(row)
            },
            async saveAttrVals(row) {
                // 发起请求 把参数可选项保存起来
                const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })
                if (res.meta.status !== 200) {
                    this.$message.error('添加失败')
                }
                this.$message.success('修改成功')
            },

            // 删除参数可选项
            handClose(index, row) {
                row.attr_vals.splice(index, 1)
                this.saveAttrVals(row)

            },
            // this.$nextTick 页面重新渲染会回调的函数
            showInput(row) {
                row.inputVisible = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            }
        },

        created() {
            this.getCateList()
        },
    }

</script>
<style scoped>
    .cat_pot {
        margin: 20px 0px;
    }

    .el-tag {
        margin-right: 10px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>