<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>商品管理</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/goods' }">
                <span>商品列表</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span>添加列表</span>
            </el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>

            <el-steps :active="activeIdex - 0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- table栏 -->
            <el-form :model="addForm" label-position='top' :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-tabs :tab-position="'left'" v-model='activeIdex' :before-leave='beforeTabLeave'
                    @tab-click='tabClick'>
                    <el-tab-pane label="基本信息" name='0'>
                        <el-form-item label='商品名称' prop='goods_name'>
                            <el-input v-model='addForm.goods_name'></el-input>
                        </el-form-item>
                        <el-form-item label='商品价格' prop='goods_price' type='number'>
                            <el-input v-model='addForm.goods_price'></el-input>
                        </el-form-item>
                        <el-form-item label='商品重量' prop='goods_weight' type='number'>
                            <el-input v-model='addForm.goods_weight'></el-input>
                        </el-form-item>
                        <el-form-item label='商品数量' prop='goods_number' type='number'>
                            <el-input v-model='addForm.goods_number'></el-input>
                        </el-form-item>
                        <el-form-item label='商品分类' prop='goods_cat'>
                            <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProp"
                                @change="handleChange" expandTrigger='hover'>
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name='1'>
                        <el-form-item :label='item.attr_name' v-for='(item,index) in manyData' :key='item.attr_id'>
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cd" v-for='(cd,index) in item.attr_vals' :key="index">
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name='2'>
                        <el-form-item :label='item.attr_name' v-for='(item,index) in onlyData' :key='item.attr_id'>
                            <el-input v-model="item.attr_vals">
                            </el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name='3'>
                        <el-upload action="http://timemeetyou.com:8889/api/private/v1/upload"
                            :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
                            :headers='headerObj' :on-success='handleSuccess'>
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>
                        <!-- 富文本 -->
                        <quill-editor v-model='addForm.goods_introduce'>
                        </quill-editor>
                        <el-button type='primary' class="btnAdd" @click='Add'>添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <!-- 点击图片放大 -->
            <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
                <img :src="url" class="previewImg">
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                activeIdex: 0,
                // 添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: '',
                    goods_weight: '',
                    goods_number: '',
                    goods_cat: [],
                    pics: [],
                    // 商品详情描述
                    goods_introduce: '',
                    attrs: [],
                },
                cateProp: {
                    label: "cat_name",
                    value: "cat_id",
                    children: 'children'
                },
                //商品分类数据
                catelist: [],
                // 动态参数列表
                manyData: [],
                // 静态参数列表
                onlyData: [],
                //图片 url地址
                url: '',
                // 
                previewVisible: false,
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // 效验规则
                addFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    this.$message.error('获取商品列表失败')
                }
                this.catelist = res.data
            },
            // 级联选择器变化触发
            handleChange() {
                if (this.addForm.goods_cat.length !== 3) {
                    return this.addForm.goods_cat = []
                }
            },
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请选择商品分类')
                    return false
                }
            },
            async tabClick() {
                if (this.activeIdex === '1') {
                    const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,
                        { params: { sel: "many" } })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取动态参数列表失败')
                    }

                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    })
                    this.manyData = res.data
                } else if (this.activeIdex === '2') {
                    const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,
                        { params: { sel: "only" } })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取静态参数列表失败')
                    }
                    this.onlyData = res.data
                }
            },

            // 点击图片触发
            handlePreview(file) {
                this.url = file.response.data.url
                this.previewVisible = true
            },
            // 处理移除图片
            handleRemove(file) {
                const filePath = file.response.data.tmp_path
                const i = this.addForm.pics.findIndex(x => {
                    x.pic === filePath
                })
                this.addForm.pics.splice(i, 1)


            },
            // 上传图片成功触发
            handleSuccess(response) {
                const picInfo = { pic: response.data.tmp_path };
                this.addForm.pics.push(picInfo)
                console.log(this.addForm);
            },
            Add() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项')
                    }
                    //·点击添加表单
                    const form = JSON.parse(JSON.stringify(this.addForm))
                    form.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数  和静态属性

                    // 处理动态
                    this.manyData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        };
                        this.addForm.attrs.push(newInfo)
                    })
                    // 处理静态
                    this.onlyData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    })

                    form.attrs = this.addForm.attrs

                    const { data: res } = await this.$http.post('goods', form)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加商品失败')
                    }
                    this.$message.success('添加商品成功')
                    this.$router.push('/goods')
                })
            }
        },
        created() {
            this.getCateList()
        }
    }

</script>
<style scoped>
    .el-steps {
        width: 80%;
        margin: 0 auto;
        margin-top: 10px;
    }

    .el-checkbox {
        margin: 0px 10px 0px 0px !important;

    }

    .previewImg {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>