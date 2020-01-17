<template>
  <div class="app-container">
    <div class="filter-container">
		<div class="demo-input-size">
			<el-input v-model="goodsExamineId" placeholder="商品编码" clearable class="elInput" @keyup.enter.native="handleClick" @clear="clearInput(goodsExamineId)" />
			<el-input v-model="goodsName" placeholder="商品名称" clearable class="elInput" @keyup.enter.native="handleClick" @clear="clearInput(goodsName)" />
			<el-select v-model="state" placeholder="请选择" @change="changeSate">
			<el-option v-for="item in stateItem" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-button style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleClick">搜索</el-button>
		</div>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addGoods">添加商品</el-button>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="goodsUpperShelf">上架</el-button>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="goodsLowerShelf">下架</el-button>
		<!--渲染数据 start-->
		<el-table v-loading="loading" :data="tableData" border style="width: 100%" class="taba" @selection-change="handleSelectionChange">>
			<el-table-column type="selection" width="55" />
			<el-table-column prop="goodsExamineId" label="商品编码" />

			<el-table-column prop="goodsName" label="商品名称"  :show-overflow-tooltip="true">
			<template slot-scope="{row}">
				<el-button type="text" @click="detail(row)">{{ row.goodsName | ellipsis }}</el-button>
			</template>
			</el-table-column>
			<el-table-column prop="specifications" label="商品规格" />
			<el-table-column prop="price" label="商品价格(元)">
			<template slot-scope="{row}">
				<el-button v-if="row.state == 0" class="no-click">{{ row.price }}</el-button>
				<el-button v-else type="text" @click="editReserve(row, 'price')">{{ row.price }}</el-button>
			</template>
			</el-table-column>
			<el-table-column prop="reserve" label="商品库存(件)">
			<template slot-scope="{row}">
				<el-button v-if="row.state == 0" class="no-click">{{ row.reserve }}</el-button>
				<el-button v-else type="text" @click="editReserve(row, 'reserve')">{{ row.reserve }}</el-button>
			</template>
			</el-table-column>
			<el-table-column prop="state" label="审核状态" :formatter="auditStatue" />
			<el-table-column prop="topImgList" label="商品轮播">
			<template slot-scope="{row}">
				<div v-for="(item, index) in JSON.parse(row.topImgList)" v-show="index < 1" :key="index" class="demo-image__preview" @click="preveImage(row.topImgList)">
				<el-image
					v-if="!showViewer"
					style="width: 100px; height: 100px"
					:src="item.url"
				/>

				</div>
				<el-image-viewer
				v-show="showViewer"
				:on-close="closeViewer"
				:url-list="srcList"
				/>
			</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
			<template slot-scope="{row}">
				<el-button size="mini" type="primary" icon="el-icon-edit" @click="edit_goods(row)">编辑</el-button>
				<el-button size="mini" type="danger" icon="el-icon-delete" @click="del_goods(row)">删除</el-button>
			</template>
			</el-table-column>
		</el-table>
      <!--渲染数据 end-->
      <!--分页 start-->
      <div class="block">
        <el-pagination
          background
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!--分页 end-->

      <!-- 库存弹窗 start -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
        <el-form>
          <el-form-item v-if="good_stock != ''" label="商品库存" :label-width="formLabelWidth">
            <el-input v-model="good_stock" autocomplete="off" />
          </el-form-item>
          <el-form-item v-else label="商品价格" :label-width="formLabelWidth">
            <el-input v-model="good_price" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveStock">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 库存弹窗 end -->

      <!-- 商品详情 start -->
      <el-dialog title="商品详情" :visible.sync="dialogDetailVisible">
        <div class="rel">
          <div class="el-table-wrapper">
            <div class="el-table el-table-small el-table-border">
              <div class="el-table-body">

                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tbody class="el-table-tbody">
                    <tr class="el-table-row">
                      <td class="head-bg">
                        <div class="el-table-cell">
                          <span>商品分类</span>
                        </div>
                      </td>
                      <td colspan="3">
                        <div class="el-table-cell">
                          <span>{{ this.goodsDetailData.goodsType }}</span>
                        </div>
                      </td>
					 
                    </tr>
					 <tr class="el-table-row">
                      <td class="head-bg">
                        <div class="el-table-cell">
                          <span>商品标题</span>
                        </div>
                      </td>
                      <td colspan="3">
                        <div class="el-table-cell">
                          <span>{{ this.goodsDetailData.goodsName }}</span>
                        </div>
                      </td>

                    </tr>
                    <tr class="el-table-row">
                      <td class="head-bg">
                        <div class="el-table-cell">
                          <span>商品服务</span>
                        </div>
                      </td>
                      <td colspan="3">
                        <div class="el-table-cell">
                          <span>{{ this.goodsDetailData.tag }}</span>
                        </div>
                      </td>

                    </tr>
                    <tr class="el-table-row">
                      <td class="head-bg">
                        <div class="el-table-cell">
                          <span>商品说明</span>
                        </div>
                      </td>
                      <td colspan="3">
                        <div class="el-table-cell">
                          <span>{{ this.goodsDetailData.goodsShow }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr class="el-table-row">
						
						<td class="head-bg">
                        <div class="el-table-cell">
                          <span>商品规格</span>
                        </div>
                      </td>
					  <td class="head-bg"  >
                        <div class="el-table-cell">
                          <span>商品库存</span>
                        </div>
                      </td>
					  <td class="head-bg" colspan="2">
                        <div class="el-table-cell">
                          <span>商品价格</span>
                        </div>
                      </td>
                    </tr>
					<tr class="el-table-row" v-for="(item, index) in this.specificData" :key="index">
						<td>
							<div class="el-table-cell">
								<span>{{item.specifications}}</span>
								<!-- <span>{{this.specificData}}</span> -->
							</div>
						</td>
						<td >
							<div class="el-table-cell">
								<span>{{item.reserve}}</span>
							</div>
						</td>
						<td colspan="2">
							<div class="el-table-cell">
								<span>{{item.price}}</span>
							</div>
						</td>
					</tr>
                    <tr class="el-table-row">
                      <td class="head-bg">
                        <div class="el-table-cell">
                          <span>商品轮播</span>
                        </div>
                      </td>
                      <td colspan="3">
                        <div class="el-table-cell">
							<a :href="item.url"  v-for="(item, index) in this.bannerImg" :key="index" target="_blank">
                          		<img :src="item.url" alt="" class="bannerImg">
							</a>
                        </div>
                      </td>
                    </tr>
                    <tr class="el-table-row">
                      <td class="head-bg">
                        <div class="el-table-cell">
                          <span>商品详情图</span>
                        </div>
                      </td>
                      <td colspan="3">
                        <div class="el-table-cell">
						  	<a :href="item.url"  v-for="(item, index) in this.detailImg" :key="index" target="_blank">
                          		<img :src="item.url" alt="" class="bannerImg">
							</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <el-button type="default" @click="dialogDetailVisible=false">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 商品详情 end -->
    </div>
  </div>
</template>

<script>
import local from '@/assets/commenJs/local'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'GoodsList',
  components: { ElImageViewer },
  data() {
    return {
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      currentPage: 1,
      pageTotal: 1,
      search: '',
      tableData: [],
      goodsExamineId: '',
      state: '',
      goodsName: '',
      user: {},
      dialogVisible: false,
      srcList: [],
      showViewer: false,
      stateItem: [
        { value: 0, label: '待审核' },
        { value: 1, label: '审核通过' },
        { value: 2, label: '审核失败' },
        { value: 3, label: '已下架' },
        { value: 4, label: '已售罄' }
      ],
      itemIds: [],
      itemStatus: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      good_stock: '',
      good_ExamineId: '',
      good_price: '',
      dialogTitle: '',
      dialogDetailVisible: false,
	  goodsDetailData: [],
	  specificData: [],
	  bannerImg: [],
	  detailImg: []
    }
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 15) {
        return value.slice(0, 15) + "...";
      }
      return value;
    }
  },
  created() {
    this.user = local.get('hou')
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 搜索查询
    handleClick() {
      this.getInfo()
    },
    clearInput(name) {
      this.name = this.name
      this.getInfo()
    },
    changeSate() {
      this.getInfo()
    },
    // 查询列表
    getInfo() {
      const parmas = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        // search: this.search,
        goodsExamineId: this.goodsExamineId,
        goodsName: this.goodsName,
        state: this.state,
        shopId: this.user.shopId
      }
      this.loading = true
      this.$api.goodList(parmas).then(res => {
        if (res.code == 200) {
		  const data = res.data.dataList;
          this.tableData = data
          this.pageTotal = res.data.pageSize * res.data.totalPage
        }
        this.loading = false
      })
    },
    handleSelectionChange(arr) {
      this.itemIds = []
      this.itemStatus = []
      arr.forEach((item, index) => {
        this.itemIds.push(item.goodsSpecificationsExamineId)
        this.itemStatus.push(item.state)
      })
    },
    // 审核状态
    auditStatue(row) {
      switch (row.state) {
        case 0:
          return '审核中'
          break
        case 1:
          return '已上架'
          break
        case 2:
          return '审核失败'
          break
        case 3:
          return '已下架'
          break
        case 4:
          return '已售罄'
          break
      }
    },
    // 预览图片
    preveImage(data) {
      this.srcList = []
      //   console.log(11)
      this.showViewer = true
      const arr = JSON.parse(data)
      arr.forEach((item, i) => {
        this.srcList.push(item.url)
      })
      //   console.log(this.srcList)
    },
    // 关闭查看器
    closeViewer() {
      // console.log(22)
      this.showViewer = false
    },
    // 修改每页条数
    handleSizeChange(val) {
      this.pageSize = `${val}`
      this.getInfo()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.pageIndex = `${val}`
      this.getInfo()
    },
    // 新增商品
    addGoods() {
      this.$router.replace('/pms/goods/goods-edit')
    },
    // 删除商品
    del_goods(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteGoods({ ids: row.goodsSpecificationsExamineId })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.pageIndex = 1
              this.getInfo()
              this.currentPage2 = 1
            } else {
              this.$message.error('删除失败')
            }
            // if(res.data.data.)
          })
      }).catch(() => {})
    },
    // 编辑
    edit_goods(row) {
      if (row.state == 0) {
        this.$message.warning('当前商品在审核中不能编辑')
        return
      }
      this.$router.push({
        path: '/pms/goods/goods-edit?id=' + row.goodsExamineId
      })
    },
    // 商品下架
    goodsLowerShelf() {
      if (this.itemIds.length == 0) {
        this.$message.warning('请选择需要下架的商品')
        return
      }
      this.itemStatus.forEach((item, index) => {
        if (item == 0) {
          this.$message.error('请检查该商品是否审核通过')
          return false
        }
        if (item == 2) {
          this.$message.error('该商品审核失败，不能进行下架')
          return false
        }
        if (item == 4) {
          this.$message.error('请检查该商品是否已售罄')
          return false
        }
        this.goodsShelf('lower')
      })
      // return
	},
	goodsUpperShelf() {
		if (this.itemIds.length == 0) {
			this.$message.warning('请选择需要上架的商品')
			return
		}
      this.itemStatus.forEach((item, index) => {
        if (item == 0) {
          this.$message.error('请检查该商品是否审核通过')
          return false
        }
        if (item == 2) {
          this.$message.error('该商品审核失败，不能进行上架')
          return false
        }
        if (item == 4) {
          this.$message.error('请检查该商品是否已售罄')
          return false
        }
        this.goodsShelf('upper')
      })
	},
    goodsShelf(type) {
		if(type == 'lower') {
			this.$confirm('确定商品下架吗, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// let parmas = JSON.stringify(this.itemIds)
				this.$api.goodsLower({ids: this.itemIds.toString()})
				.then(res => {
				    if (res.code == 200) {
				        this.$message.success('下架成功')
				        this.pageIndex = 1
				        this.getInfo()
				        this.currentPage2 = 1
				    } else {
				        this.$message.error('下架失败')
				    }
				    // if(res.data.data.)
				})
			}).catch(() => {})
		} else {
			this.$confirm('确定商品上架吗, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// let parmas = JSON.stringify(this.itemIds)
				this.$api.goodsUpper({ids: this.itemIds.toString()})
				.then(res => {
				    if (res.code == 200) {
				        this.$message.success('上架成功')
				        this.pageIndex = 1
				        this.getInfo()
				        this.currentPage2 = 1
				    } else {
				        this.$message.error('上架失败')
				    }
				    // if(res.data.data.)
				})
			}).catch(() => {})
		}
      
    },
    editReserve(row, type) {
      this.dialogFormVisible = true

      this.good_ExamineId = row.goodsSpecificationsExamineId
      if (type == 'reserve') {
        this.dialogTitle = '修改库存'
        this.good_stock = row.reserve
      } else {
        this.dialogTitle = '修改价格'
        this.good_price = row.price
      }
    },
    // 修改库存
    saveStock() {
      const parmas = {
        goodsSpecificationsExamineId: this.good_ExamineId,
        reserve: this.good_stock,
        price: this.good_price
      }
      this.$api.editGoodsReserve(parmas).then(res => {
        if (res.code == 200) {
          this.dialogFormVisible = false
          this.getInfo()
        }
      })
    },
    // 查看详情
    detail(row) {
      this.dialogDetailVisible = true
      this.$api.detailGoods({ goodsExaminId: row.goodsExamineId }).then(res => {
        if (res.code == 200) {
		  this.goodsDetailData = res.data
		  this.specificData = res.data.goodsSpecificationsList;
		  this.bannerImg = JSON.parse(res.data.topImgList) ;
		  this.detailImg =  JSON.parse(res.data.goodsContent);
          // this.formData = res.data;
          // // this.formData.goodsSpecificationsList = res.data.GoodsSpecificationsExamineList;
          // this.checkedCities =  JSON.parse(res.data.tag);
          // this.fileList =  JSON.parse(res.data.topImgList);
          // this.detailFileList = JSON.parse(res.data.goodsContent);
          // if(cityOptions.length == this.checkedCities.length) {
          //     this.checkAll = true;
          //     return;
          // }
          // if( this.checkedCities.length === 0) {
          //     return;
          // }
          // this.isIndeterminate = true;
        }
      })
    }
  }
}
</script>

<style scoped>
    .block {
        margin-top: 20px;
    }
    .elInput {
        width: 160px;
        margin-bottom: 10px;
    }
    .no-click {
        border: none;
        background: rgba(255,255,255,0)
    }
    table{
        border-collapse:collapse;
  }
    .el-table-tbody td {
       /* border-width: 0 1px 1px 0;  */
        /* border: solid 1px #999; */
        border: 1px solid #dfe6ec;
        text-align: center
        /* border-color: #999; */
    }
    .head-bg {
        background: #f5f7fa;
    }
	.bannerImg {
		width: 100px;
		height: 100px;
		display: inline-block;
	}
</style>
