<template>
    <div>
        <el-table :data='goodslist' border stripe>
            <el-table-column type='index' label='#'></el-table-column>
            <el-table-column label='商品名称' prop='goods_name'></el-table-column>
            <el-table-column label='商品价格(元)' prop='goods_price' width='95px'></el-table-column>
            <el-table-column label='商品重量' prop='goods_weight' width='70px'></el-table-column>
            <el-table-column label='创建时间' prop='add_time' width='150px'>
                <template v-slot='scope'>
                    {{scope.row.add_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label='操作' width='130px'>
                <template v-slot='scope'>
                    <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click=' removeById(scope.row)'>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 50]" :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" background>
        </el-pagination>
    </div>
</template>

<script>
    export default {

        props: {
            goodslist: {
                type: Array,
                default: function () {
                    return []
                }
            },
            total: {
                typeof: Number,
                default: 0
            },
            queryInfo: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },

        methods: {
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.$emit('aa')
            },

            handleCurrentChange(newPage) {
                // 保存当前的页数 发送请求 重新渲染
                this.queryInfo.pagenum = newPage
                this.$emit('aa')
            },

            // 点击删除
            async removeById(row) {
                const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => {
                    this.$message.info('取消了删除')
                })
                if (result === 'confirm') {
                    const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
                    if (res.meta.status !== 200) {
                        this.$message.error('删除失败')
                    }
                    this.$message.success('删除成功')
                    this.$emit('aa')
                }
            }
        }
    }

</script>
<style scoped>
</style>