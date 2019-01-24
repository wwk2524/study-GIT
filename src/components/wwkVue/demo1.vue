<template>
  <div>
    <h2>{{task}}</h2>
    <el-input type="text" v-model="value"></el-input>
    <br>
    {{value}}
    {{2+3}}
    {{hello}}
    <!-- {{ 0< 10?'对的':'错的'}} -->
    <p v-html="hello"></p>
    <p v-text="hello"></p>
    <p></p>
    <div v-bind:class="ha">哈哈</div>
    <div v-bind:title="ts">提示</div>
    <span v-bind:title="message">hi</span>
    <p v-if="seen">我是if为true看到的</p>
    <p v-else>我是if为false看到的</p>
    <p v-show="seen">我是v-show的看到的</p>
    <ul>
      <li v-for="(name,index) in names" v-bind:key="index">{{name}}-{{index}}</li>
    </ul>
    <ul>
      <li v-for="(item,index) in user" :key="index">
        <span>{{item.name}}</span>
        <span>{{item.age}}</span>
      </li>
    </ul>
    <button v-on:click="num+=1">按钮</button>
    <p>{{num}}</p>
    <button v-on:click="handlerClick">弹出</button>
  </div>
</template>

<script>
export default {
  name: "demo1",
  data() {
    return {
      task:
        "这个文件 用于练习Vue的基本使用方法，比如 v-for v-model v-bind v-class 等等等 s",
      value: "修改这里",
      hello: "<p>MYHELLO</p>",
      message: "页面加载于 " + new Date().toLocaleString(),
      seen: true,
      ha: "hai",
      ts: "我是提示",
      names: ["学习 JavaScript", "学习 Vue", "学习Git"],
      user: [
        {
          id: 0,
          name: "tom",
          age: 20
        },
        {
          id: 1,
          name: "ime",
          age: 18
        },
        {
          id: 2,
          name: "ice",
          age: 23
        }
      ],
      num: 2
    };
  },
  methods: {
    handlerClick() {
      this.seen = !this.seen;
    }
  }
};
</script>

<style scoped>
</style>
