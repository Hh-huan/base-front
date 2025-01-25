<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户总数</span>
            </div>
          </template>
          <div class="card-body">
            <count-to :start-val="0" :end-val="userCount" :duration="1000" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>文章总数</span>
            </div>
          </template>
          <div class="card-body">
            <count-to :start-val="0" :end-val="articleCount" :duration="1000" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>圈子总数</span>
            </div>
          </template>
          <div class="card-body">
            <count-to :start-val="0" :end-val="circleCount" :duration="1000" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserCount, getArticleCount, getCircleCount } from '@/api/dashboard'
import { ElMessage } from 'element-plus'
import { Code } from '@/constants/enum/code.enum'
import CountTo from '@/components/CountTo/index.vue'

const userCount = ref(0)
const articleCount = ref(0)
const circleCount = ref(0)

// 获取统计数据
const getStatistics = async () => {
  try {
    // 获取用户总数
    const userRes = await getUserCount()
    if (userRes.code == Code.SUCCESS.code) {
      userCount.value = userRes.data
    }

    // 获取文章总数
    const articleRes = await getArticleCount()
    if (articleRes.code == Code.SUCCESS.code) {
      articleCount.value = articleRes.data
    }

    // 获取圈子总数
    const circleRes = await getCircleCount()
    if (circleRes.code == Code.SUCCESS.code) {
      circleCount.value = circleRes.data
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

onMounted(() => {
  getStatistics()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
}
</style> 