<template>
    <div>
        <el-row :gutter='20'>
            <el-col :span='8'>
                <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear='getgoodslist'
                    @input="changeUserName($event)">
                    <el-button slot="append" icon="el-icon-search" @click='getgoodslist'></el-button>
                </el-input>
            </el-col>
            <el-col :span='4'>
                <el-button type='primary' @click='addparams'>添加商品</el-button>
            </el-col>
        </el-row>
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
            getgoodslist() {
                this.$emit('aa')
            },
            changeUserName(e) {
                if (e === '') {
                    this.$emit('aa')
                }
            },
            addparams() {
                this.$router.push('/add')
            }
        },

    }
</script>
<style scoped>

</style>