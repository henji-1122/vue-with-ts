<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        <div>课程：</div>
        <div>阶段：</div>
        <div>课时：</div>
      </div>

      <el-form label-width="40px">
        <el-form-item label="视频">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中：{{ uploadPercent }} %</p>
          <p v-if="isUploadSuccess">视频转码中：{{ isTransCodeSuccess ? '完成' : '正在转码，请稍后...'}}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import {
  getAliyunImagUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/aliyun-oss.ts'

export default Vue.extend({
  name: 'CourseVideo',

  data () {
    return {
      uploader: null,
      videoId: null, // 上传的视频id
      imageUrl: '', // 上传图片的地址
      fileName: '', // 上传视频文件名

      uploadPercent: 0, // 上传百分比
      isUploadSuccess: false, // 是否上传完毕
      isTransCodeSuccess: false // 是否转码完毕
    }
  },

  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },

  created () {
    this.initUploader() // 初始化上传实例
  },

  methods: {
    handleUpload () {
      // 初始化上传状态
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0

      // 获取上传的文件
      const videoFile = this.video.files[0]
      const imageFile = this.image.files[0]
      console.log(videoFile, imageFile)

      // 将用户选择的文件上传到
      // 一旦开始上传，就会按照列表中添加的顺序开始上传
      this.uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      this.uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')
    
      // 开始上传，就会触发onUploadstarted
      this.uploader.startUpload();
    },

    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({ // 在index.html中加载的aliyun-upload-sdk提供的全局对象(这里加window.否则TS不识别)
        //阿里账号ID，必须有值
        userId: 1618139964448548, // 后台开通的阿里云服务id
        //上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: 'cn-shanghai',
        //分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        //并行上传分片个数，默认5
        parallel: 5,
        //网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        //开始上传
        onUploadstarted: async uploadInfo => {
          console.log('onUploadstarted', uploadInfo)

          // 1. 通过我们的后台获取文件上传凭证
          let uploadAddressAndAuth = null // 上传凭证，
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            console.log(data)
            this.imageUrl = data.data.imageURL // 保存图片上传地址
            uploadAddressAndAuth = data.data
          } else {
            // 获取视频上传凭证
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl:this.imageUrl // 注意：确保先上传图片
            })
            console.log(data)
            this.videoId = data.data.videoId
            uploadAddressAndAuth = data.data
          }
          // 2. 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.videoId || uploadAddressAndAuth.imageId
            )
          // 3. 设置好上传凭证确认没问题，上传进度开始
        },
        //文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log('onUploadSucceed', uploadInfo)
        },
        //文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed', uploadInfo, code, message)
        },
        //文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        //上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          console.log('onUploadTokenExpired', uploadInfo)
        },
        //全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true
          console.log('onUploadEnd', uploadInfo)
          // 请求转码
          const { data } = await aliyunTransCode({
            lessonId: this.$route.query.lessonId, // 课程id
            fileId: this.videoId, // 视频id
            coverImageUrl: this.imageUrl, // 封面地址
            fileName: this.fileName // 视频原名称 
          })
          console.log(data)

          // 轮询查看转码进度
          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
            console.log('转码进度', data.data)
            if (data.data === 100) {
              this.isTransCodeSuccess = true
              window.clearInterval(timer)
              console.log('转码成功')
            }
          }, 3000)
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped></style>
