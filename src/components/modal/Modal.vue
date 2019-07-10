<template>
  <div class="hello">
    <div class="h1">你好呀{{ msg }}</div>
    <div class="h2">你好呀{{ msg }}</div>
    <div class="h3">你好呀{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: {
    msg: String
  }
};
</script>
<style scoped >
.h1 {
  font-size: 16px;
  margin: 40px 0 0;
}
</style>
