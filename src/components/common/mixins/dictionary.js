// 统一管理字典 统一修改

let dics = {
  courseTypeList: [{
    label: '理论',
    value: 1
  },
  {
    label: '实操',
    value: 2
  }
  ],
  classStatusList: [
    { label: '通过开班申请', value: 0 },
    { label: '开班审批中', value: 1 },
    { label: '驳回', value: 2 }
  ]
  // levelList: [
  //   { label: '初级', value: 1 },
  //   { label: '中级', value: 2 },
  //   { label: '高级', value: 3 },
  //   { label: '技师', value: 4 }
  // ]
}

/**
 * 返回对应的 值 或者 label
 * @param {*} list
 * @param {*} v
 */
function getLabelOrVal (list, v) {
  let res = false
  for (let i = 0; i < list.length; i++) {
    if (v === list[i].value || parseInt(v) === list[i].value) {
      res = list[i].label
    }
    if (v === list[i].label) {
      res = list[i].value
    }
    if (res !== false) {
      break
    }
  }
  return res
}

export default {
  methods: {
    // 课程类别(1.理论 2.实操)
    m_courseType (v) {
      return getLabelOrVal(dics.courseTypeList, v)
    },
    // 班级状态（0 通过审批 1 审批中 2 驳回）
    m_classStatus (v) {
      return getLabelOrVal(dics.classStatusList, v)
    }
    // m_teachLevel (v) {
    //   return getLabelOrVal(dics.levelList, v)
    // },
  }
}
