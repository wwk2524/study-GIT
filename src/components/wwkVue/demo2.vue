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
    <br>Radio 单选框
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
    <div>
      <el-radio v-model="radio" label="1">备选项</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>

      <el-radio disabled v-model="radio1" label="禁用">备选项</el-radio>
      <el-radio disabled v-model="radio1" label="选中且禁用">备选项</el-radio>

      <el-radio-group v-model="radio2">
        <el-radio :label="3">水果</el-radio>
        <el-radio :label="6">饮料</el-radio>
        <el-radio :label="9">蛋糕</el-radio>
      </el-radio-group>

      <el-radio-group v-model="radio3">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>

      <el-checkbox-group v-model="checkList">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="禁用" disabled></el-checkbox>
        <el-checkbox label="选中且禁用" disabled></el-checkbox>
      </el-checkbox-group>

      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>

      <el-input v-model="input" placeholder="请输入内容"></el-input>
    </div>
    <div class="demo-input-suffix">属性方式：
      <el-input placeholder="请选择日期" suffix-icon="el-icon-date" v-model="input2"></el-input>
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input21"></el-input>
    </div>
    <div class="demo-input-suffix">slot 方式：
      <el-input placeholder="请选择日期" v-model="input22">
        <i slot="suffix" class="el-input__icon el-icon-date"></i>
      </el-input>
      <el-input placeholder="请输入内容" v-model="input23">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div>
      <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
      <el-input-number v-model="num9" :precision="2" :step="0.1" :max="10"></el-input-number>
    </div>
    <div>
      <el-select v-model="value5" multiple placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-select
        v-model="value11"
        multiple
        collapse-tags
        style="margin-left: 20px;"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="block">
      <span class="demonstration">默认 click 触发子菜单</span>
      <el-cascader :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>
    </div>
    <div class="block">
      <span class="demonstration">hover 触发子菜单</span>
      <el-cascader
        expand-trigger="hover"
        :options="options"
        v-model="selectedOptions2"
        @change="handleChange"
      ></el-cascader>
    </div>
    <div>
      <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      <br>
      <el-switch v-model="value3" active-text="月付" inactive-text="年付"></el-switch>
      <el-switch
        style="display: block"
        v-model="value4"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="月付"
        inactive-text="年付"
      ></el-switch>
    </div>
    <div class="block">
      <el-slider v-model="value8" show-input></el-slider>
    </div>
    <div class="block">
      <el-slider v-model="value10" vertical height="200px"></el-slider>
    </div>
    <div>
      <el-time-select
        v-model="value11"
        :picker-options="{
    start: '08:30',
    step: '00:15',
    end: '18:30'
  }"
        placeholder="选择时间"
      ></el-time-select>
      <el-time-picker
        v-model="value12"
        :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
        placeholder="任意时间点"
      ></el-time-picker>
      <el-time-picker
        arrow-control
        v-model="value13"
        :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
        placeholder="任意时间点"
      ></el-time-picker>
    </div>
  </div>
</template>

<script>
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  name: "demo2",
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
      value: "",
      radio: "1",
      radio1: "选中且禁用",
      radio2: 3,
      radio3: "上海",
      checkList: ["选中且禁用", "复选框 A"],
      checkAll: false,
      checkedCities: ["上海", "北京"],
      cities: cityOptions,
      isIndeterminate: true,
      input: "",
      input2: "",
      input21: "",
      input22: "",
      input23: "",
      num1: 1,
      num9: 1,
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
      value5: [],
      value11: [],
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ],
      selectedOptions: [],
      selectedOptions2: [],
      value1: true,
      value2: true,
      value3: true,
      value4: true,
      value8: 0,
      value10: 0,
      value11: "",
      value12: new Date(2016, 9, 10, 18, 40),
      value13: new Date(2016, 9, 10, 18, 40)
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleChange(value) {
      console.log(value);
    }
  }
};
</script>

<style scoped>
</style>
