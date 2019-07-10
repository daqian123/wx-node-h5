<template>
  <div class="home">
    <div class="main" @click="clickme">哈哈哈</div>
    <ul class="list">
      <li @click="goPath('/home')">首页</li>
      <li @click="goPath('/waterfalls')">waterfall</li>
      <li @click="goPath('/cropImg')">cropper</li>
      <li @click="goPath('/wrapper')">Wrapper</li>
    </ul>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {
    goPath(path) {
      this.$router.push({ path });
    },
    clickme() {}
  },
  mounted() {},
  created() {
    api.selectCate({ id: 0, mini: 1 }).then(res => {
      console.log(res);
    });
    // api.login({ email: "b@163.com", password: "2962487" }).then(res => {
    //   console.log(res);
    // });
  }
};
</script>
<style lang="less" scoped>
@import url("../assets/less/common.less");

.home {
  font-size: 16px;
  color: @blue;
}
.content {
  padding-bottom: 50px;
}
.box {
  width: 700px;
  height: 100px;
  border: 1px solid #e5e5e5;
  margin-bottom: 30px;
}
.list {
  position: fixed;
  display: flex;
  background: #fff;
  width: 100%;
  height: 45px;
  bottom: 0;
  left: 0;
  z-index: 10;
  box-shadow: 1px 0 5px #e5e5e5;
  border-top: 1px solid #f5f5f9;
  li {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.main {
  margin: 10px;
}
</style>

