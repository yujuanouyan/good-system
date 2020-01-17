<template>
  <div class="app-container">
    <el-form ref="formData" :rules="formRule" label-position="left" :model="formData" label-width="120px">
      <el-row style="text-align:right; margin-bottom: 10px">
        <el-button type="primary" @click="submitForm('formData')">提交</el-button>
        <el-button>存草稿</el-button>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="8">
          <el-form-item label="商品标题：" prop="goodsName">
            <el-input v-model="formData.goodsName" max-length="50" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="商品分类" prop="goodsTypeId">
            <el-select v-model="formData.goodsTypeId" placeholder="请选择" @focus="choseCategory">
              <el-option v-for="item in categoryItem" :key="item.id" :label="item.goodsType" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="7">
                    <el-form-item label="二级分类" prop="goodsName">
                        <el-input v-model="formData.goodsName" />
                    </el-form-item>
                </el-col> -->
        <el-col :span="8">
          <el-form-item label="商品说明：" prop="goodsShow">
            <el-input v-model="formData.goodsShow" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="商品轮播图片：" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccess"
              :limit="6"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
                <el-col :span="8">
                    <el-form-item label="商品说明：" prop="goodsShow">
                        <el-input v-model="formData.goodsShow" />
                    </el-form-item>
                </el-col>
            </el-row> -->
      <el-row>
        <el-col>
          <el-form-item label="商品详情图片：" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemoveD"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccessD"
              :limit="6"
              :on-exceed="handleExceed"
              :file-list="detailFileList"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="服务承诺：" prop="tag">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-for="(item, index) in formData.goodsSpecificationsList" :key="index" :gutter="20">
        <el-col :span="4">
          <el-form-item label="商品规格:" prop="specifications">
            <el-input v-model="item.specifications" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="价格:" prop="price">
            <el-input v-model="item.price" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="库存:" prop="reserve">
            <el-input v-model="item.reserve" />
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-button v-if="index" @click="removeSpecsItem(index)">-</el-button>
          <el-button v-else @click="addSpecs">+</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import local from '@/assets/commenJs/local'
const cityOptions = ['正品保障', '免费安装', '免费送货', '放心售后', '上门安装']
export default {
  name: 'EditGoods',
  data() {
    return {
      formData: {
        goodsSpecificationsList: [{ index: 1 }]
      },
      supplierItemIndex: 1,
      formRule: {
		  goodsName: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
		//   tag: [{ type: 'array', required: true, message: '请至少选择一个服务承诺', trigger: 'change' }],
		  goodsTypeId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
		  goodsShow: [{ required: true, message: '请输入商品说明', trigger: 'blur' }],
		//   specifications: [{ required: true, message: '请输入商品规格', trigger: 'blur' }],
		//   reserve: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
		//   price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: false,
      categoryItem: [],
      detailFileList: [],
      user: {},
      queryId: ''
    }
  },
  mounted() {
    this.user = local.get('hou')
    const id = this.$route.query.id
    if (id) {
      this.queryId = id
      this.fetchData(id);
      this.choseCategory();
    }
  },
  methods: {
    // 商品分类
    choseCategory() {
      this.$api.goodCategory().then(res => {
        if (res.code == 200) {
          const data = res.data
          this.categoryItem = data
        }
      })
    },
    // 添加商品规格
    addSpecs() {
      this.supplierItemIndex++
      this.formData.goodsSpecificationsList.push({
        index: this.supplierItemIndex
      })
    },
    removeSpecsItem(index) {
      this.formData.goodsSpecificationsList.splice(index, 1)
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    handlePreview() {

    },
    handleRemove(file) {
      this.fileList.forEach((item, i, array) => {
        if (item.name == file.name) {
          array.splice(i, 1)
        }
      })
    },
    handleRemoveD(file) {
      this.detailFileList.forEach((item, i, array) => {
        if (item.name == file.name) {
          array.splice(i, 1)
        }
      })
    },
    beforeRemove() {

    },
    // 轮播图
    uploadSuccess(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.fileList.push(obj)
      }
    },
    // 商品详情图
    uploadSuccessD(response, file, fileList) {
      if (response.code == 200) {
        const obj = {
          name: response.data.fileName,
          url: response.data.fileUrl
        }
        this.detailFileList.push(obj)
        console.log(this.detailFileList)
      }
    },
    handleExceed() {},
    // 提交
    submitForm(name) {
		this.$refs["formData"].validate((valid) => {
			if (valid) {
				const parmas = this.formData;
				parmas.topImgList = this.fileList;
				parmas.goodsContent = this.detailFileList;
				parmas.tag = this.checkedCities;
				parmas.shopId = this.user.shopId;
				if(this.fileList.length == 0) {
					this.$message.warning('请上传商品轮播图');
					return
				}
				if(this.fileList.detailFileList == 0) {
					this.$message.warning('请上传商品详情图');
					return
				}
				if (this.queryId) {
					parmas.goodsExaminId = this.queryId;
					this.$api.editGoods({ content: JSON.stringify(parmas) }).then(res => {
					if (res.code == 200) {
						this.$router.replace('/pms/goods/list')
					}
					})
				} else {
					this.$api.saveGoods({ content: JSON.stringify(parmas) }).then(res => {
					if (res.code == 200) {
						this.$router.replace('/pms/goods/list')
					}
					})
				}
			}
		 })
      
    },
    // 商品详情
    fetchData(id) {
      this.$api.detailGoods({ goodsExaminId: id }).then(res => {
        if (res.code == 200) {
          this.formData = res.data
          // this.formData.goodsSpecificationsList = res.data.GoodsSpecificationsExamineList;
          this.checkedCities = JSON.parse(res.data.tag)
          this.fileList = JSON.parse(res.data.topImgList)
          this.detailFileList = JSON.parse(res.data.goodsContent)
          if (cityOptions.length == this.checkedCities.length) {
            this.checkAll = true
            return
          }
          if (this.checkedCities.length === 0) {
            return
          }
          this.isIndeterminate = true
        }
      })
    }
  }
}
</script>
