<template>
  <el-menu
    :default-active="'/ware'"
    router
    mode="horizontal"
    background-color="black"
    text-color="white"
    active-text-color="red"
    style="min-width: 1300px">
    <el-menu-item v-for="(item,i) in menu" :key="i" :index="item.name">
      {{ item.navItem }}
    </el-menu-item>
    <el-button class="el-icon-switch-button" v-on:click="logout" type="info" style="font-size: 20px;float: right"></el-button>
    <div><label style="font-size: 20px;float: right;color: white; padding-top: 10px;padding-right: 10px">{{username}}</label></div>
  </el-menu>
</template>

<script>
import { createRouter } from '@/router'
import { mapState } from 'vuex'
export default {
  name: 'NavMenu',
  data () {
    return {
      navList: [
        { name: '/user', navItem: '用户' },
        { name: '/ware', navItem: '仓库' },
        { name: '/piece', navItem: '零件' },
        { name: '/supplier', navItem: '供应商' },
        { name: '/dealer', navItem: '销售商' },
        { name: '/person', navItem: '个人信息' },
        { name: '/count', navItem: '统计' }
      ]
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.replace('/')
      // 清空路由，防止路由重复加载
      this.$router.matcher = createRouter.matcher
    }
  },
  computed: {
    menu () {
      if (this.userRole !== '0') {
        return this.navList.filter(n => !n.name.endsWith('user') && !n.name.endsWith('count'))
      } else {
        return this.navList
      }
    },
    ...mapState(['username', 'userRole'])
  }
}
</script>

<style scoped>
  a{
    text-decoration: none;
  }
 .el-menu{
   background-color: #B3C0D1;
   color: #333;
 }
  span {
    pointer-events: none;
  }
</style>
