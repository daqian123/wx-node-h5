<template>
  <div class="wrapper">
    <div class="box" v-for="item in [1,2,3,4,5,6,7]" :key="item">哈哈哈</div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

// import api from "@/api";
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {},
  mounted() {
    new BScroll(".wrapper", {
      scrollY: true,
      click: true
    });
  }
};
</script>
<style lang="less" scoped>
@import url("../assets/less/common.less");
.box {
  height: 100px;
  border: 1px solid #e5e5e5;
  margin-bottom: 30px;
}
</style>

