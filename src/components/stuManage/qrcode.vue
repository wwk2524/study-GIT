<template>
  <div class="hello">
    <h1>qrcode</h1>
     <div id="paycode" style="text-align:center;"></div>
      <el-button @click="createQrcode" icon="el-icon-edit" type="text" size="small">createQrcode</el-button>
  </div>
</template>

<script>
import QRCode from "arale-qrcode";

export default {
  name: "qrcode",
  data() {
    return {};
  },
  methods: {
    createQrcode() {
      let qrcode = new QRCode({
        text: "www.baidu.com",
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff"
      });
      document.getElementById("paycode").appendChild(qrcode);
    }
  },
  created() {}
};
</script>

<style scoped>
</style>
