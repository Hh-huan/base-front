<template>
  <div class="statistics">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售统计</span>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
              />
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以放置销售统计图表 -->
            <div style="height: 300px; display: flex; align-items: center; justify-content: center;">
              销售统计图表区域
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>商品分类统计</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以放置分类统计图表 -->
            <div style="height: 300px; display: flex; align-items: center; justify-content: center;">
              分类统计图表区域
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      dateRange: []
    }
  }
}
</script>

<style scoped>
.statistics {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart-container {
  margin-top: 20px;
}
</style> 