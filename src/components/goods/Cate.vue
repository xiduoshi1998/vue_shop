<template>
  <div>

    <!-- 面包屑 -->
    <breadcrumb>
      <template slot="bb">
        <span>商品管理</span>
      </template>
      <template slot="aa">
        <span>商品列表</span>
      </template>
    </breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click='CateDialog'>添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table :data='catelist' :columns='columns' :selection-type='false' :expand-type='false' border index-text='#'
        :show-index='true' class="treetable">
        <template v-slot:isok='scope'>
          <i class="el-icon-success" v-if='scope.row.cat_deleted===false' style="color: limegreen;"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order='scope'>
          <el-tag size='mini' v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type='success' size='mini' v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type='warning' size='mini' v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template v-slot:opt='scope'>
          <el-button type="primary" icon="el-icon-edit" size='mini' @click='ComPile(scope.row.cat_id)'>编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size='mini' @click='deleteUser(scope.row.cat_id)'>删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page='querInfo.pagenum' :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='CateClose'>
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormReff" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 父级分类 -->
      <el-form :model="addCateForm" ref="addCateFormRef" label-width="100px">
        <!--  options 展示的数据源 -->
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentCateList.data" :props="cascaderProps"
            @change="handleChange" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="CompileDialogVisible" width="50%">
      <el-form :model="FindUser" label-width="100px">
        <el-form-item label="编辑分类">
          <el-input v-model="FindUser.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="CompileDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ComPileUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import breadcrumb from 'views/breadcrumb'
  export default {
    data() {
      return {
        // 商品分类
        catelist: [],
        // 总数据
        total: 0,
        columns: [{
          label: '分类名称',
          prop: "cat_name"
        },

        {
          label: '是否有效',
          // 把当前列自定义末班列
          type: 'template',
          template: 'isok'
        },
        // 
        {
          label: '排序',
          // 把当前列自定义末班列
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 把当前列自定义末班列
          type: 'template',
          template: 'opt'
        }
        ],

        // 请求数据参数
        querInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },

        // 添加分类对话框显示与隐藏
        addCateDialogVisible: false,

        // 添加分类的表单对象
        addCateForm: {},
        cat_name: "",
        cat_pid: 0,
        // 默认分类登记是一级
        cat_level: 0,

        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        },

        // 父级分类的数据
        parentCateList: {},

        // 联级选择器指定的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: "cat_name",
          children: 'children'
        },
        // 选中的父级分类id
        selectedKeys: [],

        CompileDialogVisible: false,

        // 查找到的用户
        FindUser: {}
      }
    },
    components: {
      breadcrumb,
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get('categories', { params: this.querInfo })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品数据失败')
        }
        this.catelist = res.data.result
        this.total = res.data.total
        // console.log(this.catelist);
      },

      // 监听 pagesize 改变
      handleSizeChange(newSize) {
        this.querInfo.pagesize = newSize
        this.getCateList
      },
      // 监听pagenum 改变
      handleCurrentChange(newPage) {
        this.querInfo.pagenum = newPage
        this.getCateList()
      },

      // 点击按钮添加分类对话框
      CateDialog() {

        this.getParentCateList()
        this.addCateDialogVisible = true
      },

      // 获取父级分类数据列表
      async getParentCateList() {
        const { data: res } = await this.$http.get('categories', { type: 2 })
        if (res.meta.status !== 200) {
          this.$message.error('获取分类数据失败')
        }
        this.parentCateList = res
      },

      // 联级选择器选择项变化触发
      handleChange() {
        if (this.selectedKeys.length > 0) {
          // 父级的id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          // 当前分类的登记
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      async addCate() {
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      },
      // 重置表单
      CateClose() {
        this.$refs.addCateFormReff.resetFields()
        this.selectedKeys = 0
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      },

      // 根据id查找用户信息
      async ComPile(id) {
        const { data: res } = await this.$http.get(`categories/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('查找用户信息失败')
        }
        this.FindUser = res.data
        this.CompileDialogVisible = true
      },

      // 编辑用户
      async ComPileUser() {
        const { data: res } = await this.$http.put(`categories/${this.FindUser.cat_id}`,
          { cat_name: this.FindUser.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }

        this.getCateList()
        this.CompileDialogVisible = false
      },

      // 删除用户
      async deleteUser(id) {
        const aa = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          this.$message.info('已取消删除')
        })

        if (aa === 'confirm') {
          const { data: res } = await this.$http.delete(`categories/${id}`)
          this.getCateList()
          this.$message.error('删除成功')
        }
      }


    },


    // 发送请求
    created() {
      this.getCateList()
    },


  }

</script>
<style scoped>
  .treetable {
    margin-top: 20px;
  }

  .el-cascader {
    width: 100%;
  }
</style>