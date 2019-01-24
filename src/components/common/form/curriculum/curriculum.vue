<template>
    <div>
        <div v-if='isEdit === 0' class='curriculumDetailCon' v-html='curriculumDetail'></div>
        <div v-if='isEdit === 1'>
            <quill-editor v-model="curriculumDetail"></quill-editor>
        </div>
        <div class='text-right mt30'>
            <el-button v-if='isEdit === 1 && isManager' type="primary" @click="saveWorkTypeInfo">保存</el-button>
            <el-button v-if='isEdit === 0 && isManager' type="primary" @click='isEdit=1;'>编辑</el-button>
        </div>
    </div>
</template>
<style scoped>
.curriculumDetailCon >>> img{
  max-width: 100%;
}
</style>
<script src='./curriculum.js'></script>
