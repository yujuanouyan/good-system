<template>
  <div class="app-container">
    <el-form ref="formData" :rules="formRule" label-position="left" :model="formData" label-width="120px">
      <el-row style="text-align:right; margin-bottom: 10px">
        <el-button v-if="audit_adopt" type="primary" @click="submitForm('formData')">提交</el-button>
        <el-button v-else disabled>审核中</el-button>
      </el-row>
      <el-row>
        <div :style="{'color': audit_satus == 1 ? '#42b983' : audit_satus == 2 ? 'red' : '#606266'}">审核状态：{{ audit_satus == 0 ? '审核中': audit_satus == 1 ? '审核成功' : audit_satus == 2 ? '审核失败' : '待审核' }}</div>
      </el-row>
      <el-row>
        <!-- <el-col ：sty>基本信息</el-col> -->
        <div id="shop-message">基本信息：</div>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="5">
          <el-form-item label="店铺编号" prop="shopNum">
            <el-input v-model="formData.shopNum" disabled="" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="店铺名称" prop="shopName">
            <el-input v-model="formData.shopName" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="店铺认证" prop="goodsShow">
            <el-input value="已认证" disabled="" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="店铺分类" prop="shopType">
            <el-input v-model="formData.shopType" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="20">
          <el-form-item label="店铺介绍" prop="spare1">
            <el-input v-model="formData.spare1" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="店铺logo" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemoveLogo"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccessLogo"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="shopLogo"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="首页顶部宣传图" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemoveIndex"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccessIndex"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="spare3"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="店铺详情图" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemoveShop"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccessShop"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="spare2"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 主体信息 start -->
      <el-row>
        <div id="subject-message">主体信息：</div>
      </el-row>
      <el-row :gutter="50">

        <el-col :span="5">
          <el-form-item label="入驻人姓名" prop="settledName">
            <el-input v-model="formData.settledName" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="入驻人联系方式" prop="settledContact">
            <el-input v-model="formData.settledContact" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="入驻人邮箱" prop="settledEmail">
            <el-input v-model="formData.settledEmail" max-length="50" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="入驻人联系地址" prop="contactAddress">
            <el-input v-model="formData.contactAddress" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="50">
        <el-col :span="5">
          <el-form-item label="紧急联系人姓名" prop="urgentContactName">
            <el-input v-model="formData.urgentContactName" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="紧急联系人手机" prop="urgentContactPhone">
            <el-input v-model="formData.urgentContactPhone" />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="身份证正面照片" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemoveId"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccessId"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="idJust"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证反面照片" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemoveBack"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccessBack"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="idBack"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="店铺经营许可证" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemoveLicense"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccessLicense"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="businessLicense"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import local from '@/assets/commenJs/local'
export default {
  name: 'EditGoods',
  data() {
    return {
      formData: {
        shopNum: ''
      },
      formRule: {},
      dialogImageUrl: '',
      dialogVisible: false,
      user: {},
      queryId: '',
      audit_adopt: true,
      businessLicense: [],
      idBack: [],
      idJust: [],
      spare3: [],
      spare2: [],
      shopLogo: [],
      audit_satus: ''
    }
  },
  mounted() {
    this.user = local.get('hou')
    this.formData.shopNum = this.user.shopNum
    const num = this.user.shopNum
    if (this.user.shopNum) {
      // this.queryId = id;
      this.fetchData(num)
    }
  },
  methods: {

    handlePreview() {

    },
    handleRemoveLogo(file) {
      this.shopLogo = []
    },
    handleRemoveShop(file) {
      this.spare2 = []
    },
    handleRemoveIndex(file) {
      this.spare3 = []
    },
    handleRemoveId(file) {
      this.idJust = []
    },
    handleRemoveBack(file) {
      this.idBack = []
    },
    handleRemoveLicense(file) {
      this.businessLicense = []
    },
    beforeRemove() {

    },
    // 店铺logo
    uploadSuccessLogo(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.shopLogo.push(obj)
        // console.log(this.formData.shopLogo)
      }
    },
    // 首页顶部宣传图
    uploadSuccessIndex(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.spare3.push(obj)
        // this.spare3.name = response.data.fileName
      }
    },
    // 店铺详情
    uploadSuccessShop(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.spare2.push(obj)
        // this.spare2.name = response.data.fileName
      }
    },
    // 身份证正面
    uploadSuccessId(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.idJust.push(obj)
        // this.idJust.name = response.data.fileName
      }
    },
    // 身份证反面
    uploadSuccessBack(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.idBack.push(obj)
        // this.idBack.name = response.data.fileName
      }
    },
    // 营业执照
    uploadSuccessLicense(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.businessLicense.push(obj)
        // this.businessLicense.name = response.data.fileName
      }
    },
    handleExceed() {},
    // 提交
    submitForm(name) {
      // let parmas = {
      //     shopNum: this.formData.shopNum,
      //     shopName: this.formData.shopName,
      //     shopType: this.formData.shopType,
      //     shopLogo: JSON.stringify(this.formData.shopLogo),
      //     spare1: this.formData.spare1,
      //     spare2: JSON.stringify(this.formData.spare2),
      //     spare3: JSON.stringify(this.formData.spare3),
      //     settledEmail: this.formData.settledEmail,
      //     settledName: this.formData.settledName,
      //     idJust: JSON.stringify(this.formData.idJust),
      //     idBack: JSON.stringify(this.formData.idBack) ,
      //     settledContact: this.formData.settledContact,
      //     urgentContactName: this.formData.urgentContactName,
      //     urgentContactPhone: this.formData.urgentContactPhone,
      //     contactAddress: this.formData.contactAddress,
      //     businessLicense: JSON.stringify(this.formData.uploadSuccessLicense)
      // }
      const parmas = this.formData
      parmas.businessLicense = JSON.stringify(this.businessLicense)
      parmas.idBack = JSON.stringify(this.idBack)
      parmas.idJust = JSON.stringify(this.idJust)
      parmas.spare3 = JSON.stringify(this.spare3)
      parmas.spare2 = JSON.stringify(this.spare2)
      parmas.shopLogo = JSON.stringify(this.shopLogo)
      if (this.audit_satus == '') {
        this.$api.addShopAuthentication(parmas).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.audit_adopt = false
          }
        })
      } else {
        this.$api.editShopAuthentication(parmas).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.audit_adopt = false
            this.audit_satus = 0
          }
        })
      }
    },
    // 商品详情
    fetchData(num) {
      this.$api.auditShopAuthentication({ number: num }).then(res => {
        if (res.code == 200) {
          this.formData = res.data
          this.businessLicense = JSON.parse(res.data.businessLicense)
          this.idBack = JSON.parse(res.data.idBack)
          this.idJust = JSON.parse(res.data.idJust)
          this.spare3 = JSON.parse(res.data.spare3)
          this.spare2 = JSON.parse(res.data.spare2)
          this.shopLogo = JSON.parse(res.data.shopLogo)
          this.audit_satus = res.data.state
          if (res.data.state == 0) {
            this.audit_adopt = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
   #shop-message, #subject-message {
       /* text-align: center; */
       height: 50px;
       line-height: 50px;
       /* border: 1px solid #e2e2e2; */
       margin-bottom: 20px
   }
</style>
