<template>
  <div class="formInput">
    <div class="label">
      <strong class="label-icon">*</strong>
      <label>用户姓名：</label>
    </div>
    <div class="input-r">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: ["value"],
  methods: {}
};
</script>
<style lang="less" scoped>
@import url("../../assets/less/common.less");
.formInput {
  height: 50px;
  font-size: 14px;
  padding: 0 12px;
  border-bottom: @border-bottom;
  .flexLayout(flex-start, center);
  .label {
    width: 90px;
    padding-left: 10px;
    position: relative;
    .label-icon {
      position: absolute;
      left: 0px;
      color: red;
      top: 2px;
      left: 0;
    }
  }
  .input-r {
    flex: 1;
    height: 100%;
    .flexLayout(flex-start, center);
  }
}
</style>
