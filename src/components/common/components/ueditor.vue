<template>
    <div id="editor"></div>
</template>
<script>
export default {
  data () {
    return {
      editor: null
    }
  },
  props: {
    maindata: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    config: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  mounted () {

  },
  created () {
    let _that = this
    this.YS.YS_ueditor(() => {
      setTimeout(function () {
        _that.createUe()
      }, 200)
    })
  },
  methods: {
    createUe () {
      this.$nextTick(() => {
        console.log(1111)
        this.editor = window.UE.getEditor('editor', this.config)
        this.editor.addListener('ready', () => {
          console.log(2222)
          this.editor.setContent(this.maindata.intdata)
        })
        this.editor.addListener('contentChange', () => {
          this.maindata.outdata = this.editor.getContent()
          this.maindata.outdataTxt = this.editor.getContentTxt()
        })
      })
    }
  },
  destroyed () {
    this.editor.destroy()
  }

}
</script>
<style scoped>

</style>
