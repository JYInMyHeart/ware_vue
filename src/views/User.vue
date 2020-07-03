<template>
  <div >
    <div class="content-header">
      <h1>数据维护<small>用户管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据维护</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-input placeholder="用户名称" v-model="pagination.queryString" style="width: 200px;"
                    class="filter-item"></el-input>
          <el-button @click="findPageByCondition()" class="dalfBut">查询</el-button>
          <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="identityID" label="身份证" align="center"></el-table-column>
          <el-table-column prop="username" label="用户名称" align="center"></el-table-column>
          <el-table-column prop="gender" label="性别" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.gender === 1 ? '男' : '女'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="salary" label="工资" align="center"></el-table-column>
          <el-table-column prop="remark" label="用户说明" align="center"></el-table-column>
          <el-table-column prop="authority" label="身份" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.authority === 0 ? '系统管理员' : '普通管理员'}}</span>
            </template>
          </el-table-column>
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
          <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="身份证号">
                          <el-input v-model="formData.identityID"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="工资">
                          <el-input v-model="formData.salary"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="用户名">
                          <el-input v-model="formData.username"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="密码">
                          <el-input type="password" v-model="formData.password"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="出生日期">
                          <el-date-picker type="date" placeholder="选择日期" v-model="formData.time" @change="refresh()"
                                          style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="性别">
                          <el-select v-model="formData.gender" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in genderList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="电话">
                          <el-input v-model="formData.phone"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="权限">
                          <el-select v-model="formData.authority" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in userRoleList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input v-model="formData.remark" type="textarea"></el-input>
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
          <el-dialog title="修改密码" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="用户名">
                          <el-input v-model="formData.username"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="权限">
                          <el-select v-model="formData.authority" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in userRoleList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="出生日期">
                          <el-date-picker type="date" placeholder="选择日期" v-model="formData.time" @change="refresh()"
                                          style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="性别">
                          <el-select v-model="formData.gender" placeholder="请选择" @change="refresh()">
                            <el-option
                              v-for="item in genderList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="电话">
                          <el-input v-model="formData.phone"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input v-model="formData.remark" type="textarea"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="工资">
                          <el-input v-model="formData.salary"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane label="密码修改" name="first_">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="原密码">
                          <el-input v-model="edit.password"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="新密码">
                          <el-input v-model="edit.newPwd"></el-input>
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

<!--        <el-col :span="24">-->
<!--          <el-form-item label="备注">-->
<!--            <el-input v-model="formData.remark" type="textarea"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import '@/dateFormat'
export default {
  name: 'User',
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
      genderList: [
        {
          label: '女',
          value: 0
        },
        {
          label: '男',
          value: 1
        }
      ],
      userRoleList: [
        {
          label: '系统管理员',
          value: 0
        },
        {
          label: '普通管理员',
          value: 1
        }
      ],
      formData: {}, // 表单数据
      tableData: [], // 新增和编辑表单中对应的用户列表数据
      roleIds: [], // 新增和编辑表单中用户对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false// 控制编辑窗口显示/隐藏
    }
  },
  created () {
    this.findPage()
  },
  methods: {
    refresh () {
      this.$forceUpdate()
    },
    // 编辑
    handleEdit () {
      // 发送请求，提交表单数据
      this.$axios.post('/user/web/update_info', this.formData,
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
      this.formData.time = this.formData.time.Format('yyyy-MM-dd hh:mm:ss')
      this.$axios.post('/user/web/register', this.formData,
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
      this.$axios.get('/user/web/user_list',
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
      console.log('用户:' + row.identityID)
      // 发送请求，根据ID获取用户数据
      this.$axios.get('/user/web/selectUserByIdentityID?identityID=' + row.identityID,
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
  },
  computed: {
    ...mapState(['Authorization'])
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
