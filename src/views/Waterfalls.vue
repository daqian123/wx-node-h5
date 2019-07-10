<template>
  <div class="home">
    <div @click="shuffle">
      <waterfall
        :align="align"
        :line-gap="200"
        :min-line-gap="100"
        :max-line-gap="220"
        :single-max-width="300"
        :watch="items"
        @reflowed="reflowed"
        ref="waterfall"
      >
        <!-- each component is wrapped by a waterfall slot -->
        <waterfall-slot
          v-for="(item, index) in items"
          :width="item.width"
          :height="item.height"
          :order="index"
          :key="item.index"
          move-class="item-move"
        >
          <div class="item" :style="item.style" :index="item.index"></div>
        </waterfall-slot>
      </waterfall>
    </div>
  </div>
</template>

<script>
import Waterfall from "vue-waterfall/lib/waterfall";
import WaterfallSlot from "vue-waterfall/lib/waterfall-slot";
import common from "@/utils/common";
export default {
  name: "waterfalls",
  components: {
    Waterfall,
    WaterfallSlot
  },
  data() {
    return {
      align: "center",
      items: common.ItemFactory().get(10),
      isBusy: false
    };
  },
  methods: {
    addItems: function() {
      if (!this.isBusy && this.items.length < 50) {
        this.isBusy = true;
        this.items.push.apply(this.items, common.ItemFactory().get(5));
      }
    },
    shuffle: function() {
      this.items.sort(function() {
        return Math.random() - 0.5;
      });
    },
    reflowed: function() {
      this.isBusy = false;
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
@import url("../assets/less/common.less");
.home {
  color: @blue;
  font-size: 16px;
}
.footer {
  .flexLayout(center, center);
  .fix(0, 0, 50px);
  padding: 0 12px;
  box-sizing: border-box;
  box-shadow: @shodow;
  top: auto;
  bottom: 0;
  .div-btn {
    .btn(100%, 36px, 5px);
    box-sizing: border-box;
  }
  .disabled-btn {
    .disabled-btn;
  }
}
.item {
  margin: 0 auto;
  width: 90%;
  height: 90%;
}
.item-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>

