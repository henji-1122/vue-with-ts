<!-- 富文本编辑器组件 -->
<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course.ts'

export default Vue.extend({
  name: 'TextEditor',
  props: { // 声明接收字段
    value: {
      type: String,
      default: ''
    }
  },
  // 组件已经渲染好了，可以初始化操作DOM了
  mounted () {
    this.initEditor()
  },

  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any) // 实例

      // 将富文本编译器中变化的数据，同步到父组件绑定的数据字段上
      // 注意：事件监听必须放在 create之前
      editor.config.onchange = (value: string) => {
        // console.log(value)
        this.$emit('input', value) // 同步到父组件
      }
      editor.create() // 实例化创建编辑器

      // 注意：设置初始值必须在 create之后
      editor.txt.html(this.value)

      // 自己实现上传本地图片
      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        console.log(resultFiles, insertImgFn)
        // 1. resultFiles 是 input 中选中的文件列表数组,上传到服务端，生成图片地址
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        console.log(data)

        // 2. insertImgFn('图片地址') 获取url地址，根据图片地址生成 img标签插入到编辑器内容中
        insertImgFn(data.data.name)
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
