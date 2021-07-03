<template>
    <div>
        <breadcrumb>
            <template slot="bb">
                <span>数据统计</span>
            </template>
            <template slot="aa">
                <span>数据报表</span>
            </template>
        </breadcrumb>

        <el-card>
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import breadcrumb from 'views/breadcrumb'
    // 导入echarts
    import * as echarts from 'echarts';
    export default {
        data() {
            return {
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }
            }
        },
        components: {
            breadcrumb,

        },
        async mounted() {
            var myChart = echarts.init(document.getElementById('main'));
            const { data: res } = await this.$http.get('reports/type/1')
            if (res.meta.status !== 200) {
                return this.$message.error('获取折线图失败')
            }

            const result = Object.assign(this.options, res.data)
            myChart.setOption(result);
        }

    }

</script>
<style scoped>
</style>