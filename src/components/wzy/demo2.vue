<template>
  <div>
    <h2>{{task}}</h2>
    <br>
    <hr>
    <a href="http://element-cn.eleme.io/#/zh-CN/component/installation">elementUI API</a>

    <el-row>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    <br>
    <el-row>
      value:{{value}}
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-row>
    <br>
Radio 单选框
Checkbox 多选框
Input 输入框
InputNumber 计数器
Select 选择器
Cascader 级联选择器
Switch 开关
Slider 滑块
TimePicker 时间选择器
DatePicker 日期选择器
DateTimePicker 日期时间选择器
Upload 上传
Rate 评分
ColorPicker 颜色选择器
Transfer 穿梭框
Form 表单
Data
Table 表格
Tag 标签
Progress 进度条
Tree 树形控件
Pagination 分页
Badge 标记
Notice
Alert 警告
Loading 加载
Message 消息提示
MessageBox 弹框
Notification 通知
Navigation
NavMenu 导航菜单
Tabs 标签页
Breadcrumb 面包屑
Dropdown 下拉菜单
Steps 步骤条
Others
Dialog 对话框
Tooltip 文字提示
Popover 弹出框
Card 卡片
Carousel 走马灯
Collapse 折叠面板
InputNumber 计数器

  </div>
</template>

<script>
export default {
  name: "demo1",
  data() {
    return {
      task: "这个文件 用于练习 element-UI组件",

      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    };
  }
};
</script>

<style scoped>
</style>
