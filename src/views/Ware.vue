<template>
  <div id="app">
    <div class="content-header">
      <h1>仓库管理<small>库房信息</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
        <el-breadcrumb-item>库房信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-input placeholder="名称/地址" v-model="pagination.queryString" style="width: 200px;" class="filter-item"
                    @keyup.enter.native="handleFilter"></el-input>
          <el-button @click="findPage()" class="dalfBut">查询</el-button>
          <el-button type="primary" class="butT" v-if="operationVisible" @click="handleCreate()">新建</el-button>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
          <el-table-column prop="id" align="center" label="序号"></el-table-column>
          <el-table-column prop="name" label="仓库名" align="center"></el-table-column>
          <el-table-column prop="site" label="地址" align="center"></el-table-column>
          <el-table-column prop="area" label="面积" align="center"></el-table-column>
          <el-table-column prop="ware_type" label="仓库类型" align="center">
            <template slot-scope="scope">
              <span>{{wareTypeMap.get(scope.row.ware_type)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="run_date" label="运营时间" align="center"></el-table-column>
          <el-table-column prop="state" label="说明" align="center"></el-table-column>
          <el-table-column prop="manageName" label="管理人" align="center"></el-table-column>
          <el-table-column label="操作" align="center" v-if="operationVisible">
            <template slot-scope="scope">
              <!--<el-button type="primary" size="mini">编辑</el-button>
              <el-button size="mini" type="danger">删除</el-button>-->
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
          <el-dialog title="新增仓库" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="运营时间">
                          <el-date-picker type="date" placeholder="选择日期" v-model="formData.run_date"
                                          style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="仓库类型">
                          <el-select v-model="formData.ware_type">
                            <el-option
                              v-for="item in wareTypeList"
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
                        <el-form-item label="地址">
                          <el-input v-model="formData.site"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="面积">
                          <el-input v-model="formData.area"/>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="说明">
                          <el-input v-model="formData.state" type="textarea"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="管理人信息" name="second">
                  <div class="checkScrol">
                    <el-checkbox-group v-model="checkgroupIds">
                      <el-checkbox v-for="(c,index) in tableData" :key="index" :label="c.username"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </template>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="handleAdd()">确定</el-button>
            </div>
          </el-dialog>
        </div>

        <!-- 编辑标签弹层 -->

        <div class="add-form">
          <el-dialog title="编辑库房" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="库房名称">
                          <el-input v-model="formData.name"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="地址">
                          <el-input v-model="formData.site"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="面积">
                          <el-input v-model="formData.area"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="仓库类型">
                          <el-select v-model="formData.ware_type">
                            <el-option
                              v-for="item in wareTypeList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="投入时间">
                          <el-date-picker type="date" placeholder="选择日期" v-model="formData.run_date"
                                          style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="说明">
                          <el-input v-model="formData.state" type="textarea"/>
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
import '@/dateFormat'
export default {
  name: 'Ware',
  data () {
    return {
      autoUpload: true, // 自动上传
      imageUrl: null, // 模型数据，用于上传图片完成后图片预览
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      pagination: { // 分页相关属性
        currentPage: 1,
        pageSize: 6,
        total: 100,
        queryString: null
      },

      dataList: [], // 列表数据
      formData: {}, // 表单数据
      wareTypeMap: new Map(),
      wareTypeList: [
        {
          label: '标准仓库',
          value: 0
        },
        {
          label: '规划仓库',
          value: 1
        },
        {
          label: '优质仓库',
          value: 2
        }
      ],
      tableData: [], // 添加表单窗口中检查组列表数据
      checkgroupIds: [], // 添加表单窗口中检查组复选框对应id
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false// 控制编辑窗口显示/隐藏
    }
  },
  created () {
    this.findPage()
  },
  computed: {
    operationVisible () {
      return this.userRole === '0'
    },
    ...mapState(['Authorization', 'userRole'])
  },
  methods: {
    // 添加
    handleAdd () {
      this.formData.manageName = this.checkgroupIds.join(',')
      this.formData.run_date = this.formData.run_date.Format('yyyy-MM-dd hh:mm:ss')
      this.$axios.post('/ware/web/insertWare', this.formData,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.$message.success('录入成功')
        } else {
          this.$message.error(response.data.message)
        }
      }).finally(() => {
        this.dialogFormVisible = false
        this.findPage()
      })
    },
    // 分页查询
    findPage () {
      // 分页条件
      const param = {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        keyWord: this.pagination.queryString
      }
      console.log(param)
      // 请求后台数据
      this.$axios.get('/ware/web/ware_list',
        {
          headers: {
            Authorization: this.Authorization
          },
          params: param
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.dataList = response.data.data.records.lists
          this.pagination.total = response.data.data.records.totalCount
          this.wareTypeMap.set(0, '标准仓库')
          this.wareTypeMap.set(1, '规划仓库')
          this.wareTypeMap.set(2, '优质仓库')
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    // 重置表单
    resetForm () {
      this.formData = {}
      this.activeName = 'first'
      this.checkgroupIds = []
      this.imageUrl = null
    },
    // 弹出添加窗口
    handleCreate () {
      this.dialogFormVisible = true
      this.resetForm()
      // 发送ajax,获取所有检查组列表数据
      this.$axios.get('/user/web/user_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.records.lists
        } else {
          this.$message.error(response.data.message)
        }
      })
    },

    // 弹出编辑窗口
    handleUpdate (row) {
      console.log('仓库:' + row.id)
      // 发送请求，根据ID获取用户数据
      this.$axios.get('/ware/web/selectWareById?id=' + row.id,
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
          this.formData = response.data.data.ware
        } else {
          this.$message.error(response.data.message)
        }
      })
    },

    // 编辑
    handleEdit () {
      console.log(this.formData)
      console.log(this.roleIds)

      // 发送请求，提交表单数据
      this.$axios.post('/ware/web/updateWare', this.formData,
        { headers: { Authorization: this.Authorization } }
      ).then((response) => {
        if (response.data.code === 200) {
          // 返回成功，提示编辑成功
          this.$message.success('更新完成')
          // 隐藏编辑窗口
          this.dialogFormVisible4Edit = false
          // 刷新当前页
          this.findPage()
        } else {
          // 返回失败，提示编辑失败
          this.$message.error(response.data.message)
        }
      })
    },

    // 切换页码
    handleCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.findPage()
    },

    // 删除
    handleDelete (row) {
      this.$confirm('确认删除当前选中的记录吗?', '提示', { type: 'warning' }).then(() => {
        this.$axios.get('/ware/web/delete?id=' + row.id,
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

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
