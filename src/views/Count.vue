<template>
  <div id="app">
    <div class="content-header">
      <h1>数据维护<small>统计管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据维护</el-breadcrumb-item>
        <el-breadcrumb-item>统计管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="user" label="用户" align="center"></el-table-column>
          <el-table-column prop="ware" label="仓库" align="center"></el-table-column>
          <el-table-column prop="piece" label="零件" align="center"></el-table-column>
          <el-table-column prop="supplier" label="供应商" align="center"></el-table-column>
          <el-table-column prop="dealer" label="销售商" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Count',
  data () {
    return {
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      pagination: { // 分页相关属性
        currentPage: 1,
        pageSize: 10,
        total: 100,
        queryString: null
      },
      edit: {},
      dataList: [], // 列表数据
      formData: {}, // 表单数据
      tableData: [], // 新增和编辑表单中对应的统计列表数据
      roleIds: [], // 新增和编辑表单中统计对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false// 控制编辑窗口显示/隐藏
    }
  },
  created () {
    this.findPage()
  },
  methods: {

    // 分页查询
    findPage () {
      // 封装分页查询参数
      const params = {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        keyWord: this.pagination.queryString
      }

      // 发送请求，获取分页数据
      this.$axios.get('/user/web/count',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: window.sessionStorage.getItem('Authorization')
          },
          params: params
        }
      ).then((response) => {
        // 把分页数据和总记录数据赋值给模型
        this.dataList.push(response.data.data.count)
      })
    },
    // 查询按钮使用的分页查询
    findPageByCondition () {
      console.log(this.pagination.queryString)
      // 若有查询条件, 把当前页码设置为第一页
      if (this.pagination.queryString != null && this.pagination.queryString.length > 0) {
        this.pagination.currentPage = 1
      }
      // 调用分页查询
      this.findPage()
    },
    // 重置表单
    resetForm () {
      // 清空检查组表单中的数据
      this.formData = {}
      // 清空检查项列表的数据
      this.roleIds = []
    },
    // 弹出添加窗口
    handleCreate () {
      // 重置表单数据
      this.resetForm()
      // 切换到第一个标签
      this.activeName = 'first'
      // 新增窗口可见
      this.dialogFormVisible = true
    },
    // 弹出编辑窗口
    handleUpdate (row) {
      console.log('统计:' + row.identityID)
      // 发送请求，根据ID获取统计数据
      this.$axios.get('/user/web/selectUserByIdentityID?identityID=' + row.identityID,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: window.sessionStorage.getItem('Authorization')
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          // 弹出编辑窗口
          this.dialogFormVisible4Edit = true
          // 选中第一个Tab标签
          this.activeName = 'first'
          // 把数据赋值给formData
          this.formData = response.data.data.user
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    // 切换页码
    handleCurrentChange (currentPage) {
      // currentPage为切换后的页码
      this.pagination.currentPage = currentPage
      // 再次查询
      this.findPage()
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确认删除当前选中的记录吗?', '提示', { type: 'warning' }).then(() => {
        this.$axios.get('/user/web/delete?identityID=' + row.identityID,
          {
            headers: {
              'content-type': 'application/json',
              Authorization: window.sessionStorage.getItem('Authorization')
            }
          }
        ).then(response => {
          if (response.data.code === 200) {
            this.$message.success('删除成功')
          } else {
            (
              this.$message.error(response.data.message)
            )
          }
          this.findPage()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
