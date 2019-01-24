<template>
    <div id="ueditor"></div>
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
    this.YS.YS_ueditor(this.createUe)
  },
  methods: {
    createUe () {
      this.editor = window.UE.getEditor('ueditor', this.config)
      this.editor.addListener('ready', () => {
        this.editor.setContent(this.maindata.intdata)
      })
      this.editor.addListener('contentChange', () => {
        this.maindata.outdata = this.editor.getContent()
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
