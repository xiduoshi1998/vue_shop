<template>
    <div>
        <breadcrumb>
            <template slot="bb">
                <span>订单管理</span>
            </template>
            <template slot="aa">
                <span>订单列表</span>
            </template>
        </breadcrumb>

        <el-card>
            <el-row>
                <el-col :span='8'>
                    <el-input placeholder="请输入内容" clearable>
                        <el-button slot='append' icon='el-icon-search'></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表数据 -->
            <el-table :data='orderlist' border stripe>
                <el-table-column type='index' label='#'> </el-table-column>
                <el-table-column label='订单编号' prop='order_number'> </el-table-column>
                <el-table-column label='订单价格' prop='order_price'> </el-table-column>
                <el-table-column label='是否付款' prop='pay_status'>
                    <template v-slot='scope'>
                        <el-tag type='success' v-if='scope.row.order_pay==="1"'>以付款</el-tag>
                        <el-tag v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label='是否发货' prop='is_send'> </el-table-column>
                <el-table-column label='下单时间' prop='create_time'>
                    <template v-slot='scope'>
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label='操作'>
                    <template v-slot='scpe'>
                        <el-button type="primary" icon="el-icon-edit" circle @click='showBox'></el-button>
                        <el-button type="success" icon="el-icon-location" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 50]" :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close='addressDialogClose'>
                <span slot="footer">
                    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                        <el-form-item label="省市区/县" prop="addname">
                            <el-cascader :options='cityData' v-model='addressForm.name'></el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="addname2">
                            <el-input v-model="addressForm.name2"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>

    </div>
</template>

<script>
    import breadcrumb from 'views/breadcrumb'
    import cityData from './citydata.js'
    export default {
        components: {
            breadcrumb
        },
        data() {
            return {
                querInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                // 订单列表
                orderlist: [],
                total: 0,
                addressVisible: false,
                addressForm: {
                    name: [],
                    name2: ''
                },
                addressFormRules: {
                    addname: [
                        { required: true, message: '请选择省市区县', trigger: 'blur' },
                    ],
                    addname2: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' }
                    ]
                },
                cityData

            }
        },
        methods: {
            async getOrderList() {
                const { data: res } = await this.$http.get('orders', { params: this.querInfo });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取订单列表失败')
                }
                this.orderlist = res.data.goods
                this.total = res.data.total
            },

            handleSizeChange(newSize) {
                this.querInfo.pagesize = newSize
                this.getOrderList()
            },

            handleCurrentChange(newPage) {
                this.querInfo.pagenum = newPage
                this.getOrderList()
            },
            // 修改地址
            showBox() {
                this.addressVisible = true
            },
            addressDialogClose() {
                this.$refs.addressFormRef.resetFields()
            }
        },
        created() {
            this.getOrderList()
        }
    }

</script>
<style scoped>
    .el-cascader {
        width: 100%;
    }
</style>