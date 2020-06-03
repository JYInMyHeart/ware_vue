<template>
  <div id="app">
    <div class="content-header">
      <h1>数据维护<small>供应商管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据维护</el-breadcrumb-item>
        <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-input placeholder="供应商名称" v-model="pagination.queryString" style="width: 20%"
                    class="filter-item"></el-input>
          <el-button @click="findPageByCondition()" class="dalfBut">查询</el-button>
          <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="name" label="供应商名称" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="state" label="地址" align="center"></el-table-column>
          <el-table-column prop="notes" label="备注" align="center"></el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            class="pagiantion"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
        <!-- 新增标签弹层 -->
        <div class="add-form">
          <el-dialog title="新增供应商" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="40%">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="供应商名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号码">
                          <el-input v-model="formData.phone"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="地址">
                          <el-input v-model="formData.state"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input v-model="formData.notes" type="textarea"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </template>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="handleAdd()">确定</el-button>
            </div>
          </el-dialog>
        </div>

        <!-- 修改密码 -->
        <div class="add-form">
          <el-dialog title="修改供应商" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="40%">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="供应商名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号码">
                          <el-input v-model="formData.phone"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="地址">
                          <el-input v-model="formData.state"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input v-model="formData.notes" type="textarea"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </template>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible4Edit = false">取消</el-button>
              <el-button type="primary" @click="handleEdit()">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Supplier',
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
      tableData: [], // 新增和编辑表单中对应的供应商列表数据
      roleIds: [], // 新增和编辑表单中供应商对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false// 控制编辑窗口显示/隐藏
    }
  },
  computed: {
    ...mapState(['Authorization'])
  },
  created () {
    this.findPage()
  },
  methods: {
    // 编辑
    handleEdit () {
      // 发送请求，提交表单数据
      this.$axios.post('/supplier/web/update', this.formData,
        { headers: { Authorization: this.Authorization } }
      ).then((response) => {
        if (response.data.code === 200) {
          this.$message.success('更新完成')
          this.dialogFormVisible4Edit = false
          this.findPage()
        } else {
          // 返回失败，提示编辑失败
          this.$message.error(response.data.message)
        }
      })
    },
    // 添加
    handleAdd () {
      console.log(this.formData)
      this.$axios.post('/supplier/web/insert', this.formData,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          // 保存成功，提示正确消息
          this.$message.success('添加成功')
        } else {
          // 保存失败，提示错误消息
          this.$message.error(response.data.message)
        }
      }).finally(() => {
        // 关闭新增窗口
        this.dialogFormVisible = false
        // 无论成功与否刷新当前页面
        this.findPage()
      })
    },

    // 分页查询
    findPage () {
      // 封装分页查询参数
      const params = {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        keyWord: this.pagination.queryString
      }

      // 发送请求，获取分页数据
      this.$axios.get('/supplier/web/supplier_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          },
          params: params
        }
      ).then((response) => {
        // 把分页数据和总记录数据赋值给模型
        this.pagination.total = response.data.data.records.totalCount
        this.dataList = response.data.data.records.lists
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
      console.log('供应商:' + row.id)
      // 发送请求，根据ID获取供应商数据
      this.$axios.get('/supplier/web/selectById?id=' + row.id,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          // 弹出编辑窗口
          this.dialogFormVisible4Edit = true
          // 选中第一个Tab标签
          this.activeName = 'first'
          // 把数据赋值给formData
          this.formData = response.data.data.supplier
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
        this.$axios.get('/supplier/web/delete?id=' + row.id,
          {
            headers: {
              'content-type': 'application/json',
              Authorization: this.Authorization
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
.datatable {
  position: relative;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: rgb(96, 98, 102);
  overflow: hidden;
  flex: 1 1 0%;
}

.datatable td, .datatable th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
</style>
