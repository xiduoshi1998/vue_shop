<template>
    <div>
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
            <GoodsList :goodslist='GoodsList' @aa='getGoodsList' :total='total' :queryInfo='queryInfo' />
            <!-- 表格 -->
            <GoodsTable :goodslist='GoodsList' @aa='getGoodsList' :total='total' :queryInfo='queryInfo' />
        </el-card>

    </div>
</template>

<script>
    import breadcrumb from 'views/breadcrumb'
    import GoodsList from 'views/GoodsList'
    import GoodsTable from 'views/GoodsTable'
    export default {
        data() {
            return {
                // 商品列表
                GoodsList: [],
                total: 0,
                // 商品条数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                }
            }
        },
        methods: {
            async getGoodsList() {
                const { data: res } = await this.$http.get('goods', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表数据失败')
                }
                this.GoodsList = res.data.goods
                this.total = res.data.total
            }
        },
        created() {
            this.getGoodsList()
        },
        components: {
            breadcrumb,
            GoodsList,
            GoodsTable
        }
    }

</script>
<style scoped>
</style>