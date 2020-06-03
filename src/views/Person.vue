<template>
  <div id="app">
    <div class="content-header">
      <h1>数据维护<small>当前用户信息管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据维护</el-breadcrumb-item>
        <el-breadcrumb-item>当前用户信息管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container" >
      <div class="add-form">
        <el-card title="修改个人信息"  >
          <template>
            <el-tabs v-model="activeName" type="card">
              <el-tab-pane label="基本信息" name="first">
                <el-form label-position="right" label-width="100px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="身份证">
                        <el-input v-model="formData.identityID" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="权限">
                        <el-input  :value="formData.authority === 0 ? '系统管理员':'普通管理员'" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="用户名">
                        <el-input v-model="formData.username"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="密码">
                        <el-input type="password" v-model="formData.password"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="确认密码">
                        <el-input type="password" v-model="rePassword"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="性别">
                        <el-select v-model="formData.gender" placeholder="请选择">
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
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注">
                        <el-input v-model="formData.remark" type="textarea"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col text-align="right">
                      <el-button type="primary"  @click="updatePersonalData()">修改</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Person',
  data () {
    return {
      activeName: 'first', // 添加/编辑窗口Tab标签名称
      pagination: { // 分页相关属性
        page: 1,
        size: 10,
        total: 100,
        queryString: null
      },
      rePassword: '',
      edit: {},
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
      dataList: [], // 列表数据
      formData: {}, // 表单数据
      tableData: [], // 新增和编辑表单中对应的统计列表数据
      roleIds: [], // 新增和编辑表单中统计对应的复选框，基于双向绑定可以进行回显和数据提交
      dialogFormVisible: false, // 控制添加窗口显示/隐藏
      dialogFormVisible4Edit: false// 控制编辑窗口显示/隐藏
    }
  },
  created () {
    this.init()
  },
  methods: {

    // 弹出编辑窗口
    init () {
      // 发送请求，根据ID获取用户数据
      this.$axios.get('/user/web/selectUserByIdentityID?identityID=' + this.username,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: this.Authorization
          }
        }
      ).then((response) => {
        if (response.data.code === 200) {
          // 把数据赋值给formData
          this.formData = response.data.data.user
          this.rePassword = this.formData.password
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    updatePersonalData () {
      if (this.rePassword !== this.formData.password) {
        this.$message.error('两次输入的密码不一致')
        return
      }

      // 发送请求，提交表单数据
      this.$axios.post('/user/web/update_info', this.formData,
        { headers: { Authorization: this.Authorization } }
      ).then((response) => {
        if (response.data.code === 200) {
          this.$message.success('更新完成')
          this.init()
        } else {
          // 返回失败，提示编辑失败
          this.$message.error(response.data.message)
        }
      })
    },
    // 重置表单
    resetForm () {
      // 清空检查组表单中的数据
      this.formData = {}
      // 清空检查项列表的数据
      this.roleIds = []
    }
  },
  computed: {
    ...mapState(['Authorization', 'username'])
  }
}
</script>

<style scoped>

</style>
