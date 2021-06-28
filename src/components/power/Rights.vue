<template>
    <div>
        <breadcrumb>
            <template slot="bb">
                <span>权限管理</span>
            </template>
            <template slot="aa">
                <span>角色管理</span>
            </template>
        </breadcrumb>

        <el-card>
            <el-table :data='rightList' border stripe>
                <el-table-column type='index' label='#'></el-table-column>
                <el-table-column label='权限名称' prop='authName'></el-table-column>
                <el-table-column label='路径' prop='path'></el-table-column>
                <el-table-column label='权限等级' prop='level'>
                    <template v-slot='scope'>
                        <el-tag v-if='scope.row.level==="0"'>一级</el-tag>
                        <el-tag type="success" v-else-if='scope.row.level==="1"'>二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
    </div>
</template>

<script>
    import breadcrumb from 'views/breadcrumb'
    export default {
        components: {
            breadcrumb,
        },
        data() {
            return {
                // 所有的数据
                rightList: []
            }
        },
        methods: {
            // 请求权限列表
            async getRightList() {
                const { data: res } = await this.$http.get('rights/list')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限列表失败')
                }
                this.rightList = res.data
            }
        },
        created() {
            this.getRightList()
        }
    }

</script>
<style scoped>
</style>