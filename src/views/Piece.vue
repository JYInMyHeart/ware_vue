<template>
  <div id="app">
    <div class="content-header">
      <h1>零件管理<small>零件信息</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>零件管理</el-breadcrumb-item>
        <el-breadcrumb-item>零件信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-input placeholder="名称/仓库/助记码" v-model="pagination.queryString" style="width: 200px;" class="filter-item"
                    @keyup.enter.native="handleFilter"></el-input>
          <el-button @click="findPage()" class="dalfBut">查询</el-button>
          <el-input placeholder="供应商" v-model="pagination.supplierName" style="width: 200px;" class="filter-item"
                    @keyup.enter.native="handleFilter"></el-input>
          <el-button @click="queryPage('supplierName')" class="dalfBut">查询</el-button>
          <el-input placeholder="销售商" v-model="pagination.dealerName" style="width: 200px;" class="filter-item"
                    @keyup.enter.native="handleFilter"></el-input>
          <el-button @click="queryPage('dealerName')" class="dalfBut">查询</el-button>
          <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
        </div>
        <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
          <el-table-column prop="id" align="center" label="序号"></el-table-column>
          <el-table-column prop="piece_name" label="零件名" align="center"></el-table-column>
          <el-table-column prop="ware_name" label="所属仓库" align="center"></el-table-column>
          <el-table-column prop="scc" label="规格" align="center"></el-table-column>
          <el-table-column prop="price" label="价格" align="center"></el-table-column>
          <el-table-column prop="inventory" label="库存" align="center"></el-table-column>
          <el-table-column prop="state" label="说明" align="center"></el-table-column>
          <el-table-column prop="run_date" label="投入时间" align="center"></el-table-column>
          <el-table-column prop="supplier_name" label="供应商" align="center"></el-table-column>
          <el-table-column prop="dealer_name" label="销售商" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">出库</el-button>
              <!--<el-button size="mini" type="danger">出库</el-button>-->
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
          <el-dialog title="新增零件" :visible.sync="dialogFormVisible">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="零件名">
                          <el-input v-model="formData.piece_name"/>
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
                      <el-col :span="12">
                        <el-form-item label="规格">
                          <el-input v-model="formData.scc"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="助记码">
                          <el-input v-model="formData.help_code"/>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="价格">
                          <el-input v-model="formData.price"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="库存">
                          <el-input v-model="formData.inventory"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="仓库">
                          <el-select v-model="formData.ware_name" placeholder="请选择">
                            <el-option
                              v-for="item in wareData"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name">
                            </el-option>
                          </el-select>
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
                <el-tab-pane label="供应商信息" name="second">
                  <div class="checkScrol">
                    <el-checkbox-group v-model="supplierGroupIds">
                      <el-checkbox v-for="(c,index) in supplierData" :key="index" :label="c.name"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="销售商信息" name="third">
                  <div class="checkScrol">
                    <el-checkbox-group v-model="dealerGroupIds">
                      <el-checkbox v-for="(c,index) in dealerData" :key="index" :label="c.name"></el-checkbox>
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
          <el-dialog title="编辑零件" :visible.sync="dialogFormVisible4Edit">
            <template>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <el-form label-position="right" label-width="100px">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="零件名称">
                          <el-input v-model="formData.piece_name"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="仓库">
                          <el-select v-model="formData.ware_name" placeholder="请选择">
                            <el-option
                              v-for="item in wareData"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="规格">
                          <el-input v-model="formData.scc"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="助记码">
                          <el-input v-model="formData.help_code"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="说明">
                          <el-input v-model="formData.state"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="投入时间">
                          <el-date-picker type="date" placeholder="选择日期" v-model="formData.run_date"
                                          style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="价格">
                          <el-input v-model="formData.price"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="供应商信息" name="second">
                  <div class="checkScrol">
                    <el-checkbox-group v-model="supplierGroupIds">
                      <el-checkbox v-for="(c,index) in supplierData" :key="index" :label="c.name"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="销售商信息" name="third">
                  <div class="checkScrol">
                    <el-checkbox-group v-model="dealerGroupIds">
                      <el-checkbox v-for="(c,index) in dealerData" :key="index" :label="c.name"></el-checkbox>
                    </el-checkbox-group>
                  </div>
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
  name: 'Piece',
  computed: {
    ...mapState(['Authorization'])
  },
  data () {
    return {
      autoUpload: true, // 自动上传
      imageUrl: null, // 模型数据，用于上传图片完成后图片预览
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      pagination: { // 分页相关属性
        currentPage: 1,
        pageSize: 10,
        total: 100,
        queryString: null,
        supplierName: null,
        dealerName: null
      },
      sup: [],
      dataList: [], // 列表数据
      formData: {}, // 表单数据
      tableData: [], // 添加表单窗口中检查组列表数据
      wareData: [], // 添加表单窗口中检查组复选框对应id
      supplierData: [], // 添加表单窗口中检查组复选框对应id
      dealerData: [], // 添加表单窗口中检查组复选框对应id
      supplierGroupIds: [], // 添加表单窗口中检查组复选框对应id
      dealerGroupIds: [], // 添加表单窗口中检查组复选框对应id
      wareGroupIds: [], // 添加表单窗口中检查组复选框对应id
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false// 控制编辑窗口显示/隐藏
    }
  },
  created () {
    this.findPage()
  },
  methods: {

    // 编辑
    handleEdit () {
      this.formData.supplier_name = this.supplierGroupIds.join(',')
      this.formData.dealer_name = this.dealerGroupIds.join(',')
      if (this.formData.run_date != null) {
        this.formData.run_date = this.formData.run_date.Format('yyyy-MM-dd hh:mm:ss')
      }
      // 发送请求，提交表单数据
      this.$axios.post('/piece/web/update', this.formData,
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

    // 添加
    handleAdd () {
      this.formData.supplier_name = this.supplierGroupIds.join(',')
      this.formData.dealer_name = this.dealerGroupIds.join(',')
      if (this.formData.run_date != null) {
        this.formData.run_date = this.formData.run_date.Format('yyyy-MM-dd hh:mm:ss')
      }
      this.$axios.post('/piece/web/insert', this.formData,
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
      this.queryPage('list')
    }, // 分页查询
    queryPage (type) {
      // 分页条件
      const param = {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        supplierName: this.pagination.supplierName,
        dealerName: this.pagination.dealerName,
        keyWord: this.pagination.queryString
      }
      let url = ''
      if (type === 'supplierName') {
        url = '/piece/web/selectBySupplier'
      } else if (type === 'dealerName') {
        url = '/piece/web/selectByDealer'
      } else {
        url = '/piece/web/piece_list'
      }

      // 请求后台数据
      this.$axios.get(url,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          },
          params: param
        }
      ).then((response) => {
        this.dataList = response.data.data.records.lists
        this.pagination.total = response.data.data.records.totalCount
      })
    },
    // 重置表单
    resetForm () {
      this.formData = {}
      this.activeName = 'first'
      this.wareGroupIds = []
      this.wareData = []
      this.supplierData = []
      this.dealerData = []
      this.dealerGroupIds = []
      this.supplierGroupIds = []
      this.imageUrl = null
    },
    // 弹出添加窗口
    handleCreate () {
      console.log(this.$store.state.token)
      this.dialogFormVisible = true
      this.resetForm()
      // 发送ajax,获取所有检查组列表数据
      this.$axios.get('/ware/web/ware_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.wareData = response.data.data.records.lists
        } else {
          this.$message.error(response.data.message)
        }
      })

      // 发送ajax,获取所有供应商
      this.$axios.get('/supplier/web/supplier_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.supplierData = response.data.data.records.lists
        } else {
          this.$message.error(response.data.message)
        }
      })

      this.$axios.get('/dealer/web/dealer_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.dealerData = response.data.data.records.lists
        } else {
          this.$message.error(response.data.message)
        }
      })
    },

    // 切换页码
    handleCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.findPage()
    },
    // 弹出编辑窗口
    handleUpdate (row) {
      console.log('零件:' + row.id)
      // 发送请求，根据ID获取用户数据
      this.$axios.get('/piece/web/selectById?id=' + row.id,
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
          this.formData = response.data.data.piece
        } else {
          this.$message.error(response.data.message)
        }
      })

      // 发送ajax,获取所有检查组列表数据
      this.$axios.get('/ware/web/ware_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.wareData = response.data.data.records.lists
        } else {
          this.$message.error(response.data.message)
        }
      })
      // 发送ajax,获取所有供应商
      this.$axios.get('/supplier/web/supplier_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.supplierData = response.data.data.records.lists
        } else {
          this.$message.error(response.data.message)
        }
      })

      this.$axios.get('/dealer/web/dealer_list',
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          this.dealerData = response.data.data.records.lists
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    // 出库
    handleDelete (row) {
      this.$confirm('确认出库吗?', '提示', { type: 'warning' }).then(() => {
        this.$axios.get('/piece/web/delete?id=' + row.id,
          {
            headers: {
              'content-type': 'application/json',
              Authorization: this.Authorization
            }
          }
        ).then(response => {
          if (response.data.code === 200) {
            this.$message.success('出库成功')
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
