<template>
  <div id="app">
    <div class="cropper">
      <vueCropper
        ref="cropper"
        :img="img"
        :outputSize="1"
        :full="false"
        :original="false"
        autoCropWidth="80"
        autoCropHeight="60"
        :autoCrop="true"
      ></vueCropper>
    </div>
    <input type="file" value="上传" @input="inputFile">
    <button type="primary" @click="clipping">截图并上传</button>
    <div>
      <img :src="url">
    </div>
  </div>
</template>


<script>
import { VueCropper } from "vue-cropper";
export default {
  name: "cropImg",
  components: { VueCropper },
  data() {
    return {
      url: "",
      img:
        "https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=575b36d70d3b5bb5a1d726fe06d2d523/a6efce1b9d16fdfad03ef192ba8f8c5494ee7b7f.jpg"
    };
  },
  methods: {
    //截图
    clipping() {
      this.$refs.cropper.getCropBlob(data => {
        this.url = URL.createObjectURL(data);
      });
    },
    inputFile(e) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = e => {
        let result;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          result = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          result = e.target.result;
        }
        this.img = result;
      };
      reader.readAsArrayBuffer(file);
    }
  }
};
</script>
<style scoped>
.cropper {
  height: 300px;
}
</style>
