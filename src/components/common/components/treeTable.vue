<template>
<div>
  <div class="thead">
    <div>
      <table class="dataTable posTitle" cellspacing="0" cellpadding="0" border="0" width="100%">
        <thead>
          <tr>
            <td v-for="(item,index) in column" :key="index" :style="{width:item.width}" :class="{'tdLeft':item.tree}">
              <template v-if='item.check&&index===0'>
                <label id="checkd" role="checkbox" class="el-checkbox"><span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner" @click="checkAll"></span><input type="checkbox" class="el-checkbox__original" value=""></span></label>
              </template>
              <template v-else>
               {{item.text}}
              </template>
            </td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
  <div>
    <table :id="id+'Table'" class="dataTable" cellspacing="0" cellpadding="0" border="0" width="100%">
        <thead>
          <tr>
            <td v-for="(item,index) in column" :key="index" v-html="item.text" :style="{width:item.width}" :class="{'tdLeft':item.tree}">
            </td>
          </tr>
        </thead>
      <tbody @click="clitree">

      </tbody>
    </table>
  </div>
  </div>
</template>
<script src="./treeTable.js"></script>
<style src="./treeTable.css"></style>

