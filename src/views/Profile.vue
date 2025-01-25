<template>
  <div class="profile">
    <el-row :gutter="20">
      <!-- 左侧个人信息卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="user-info-top">
            <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <h2>{{ userInfo.userName || '加载中...' }}</h2>
          </div>
          <div class="user-info-list">
            <div class="info-item">
              <el-icon>
                <Message />
              </el-icon>
              <span>{{ userInfo.email || '加载中...' }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Phone />
              </el-icon>
              <span>{{ userInfo.phone || '加载中...' }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Location />
              </el-icon>
              <span>{{ getRegionText() }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧编辑表单 -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </div>
          </template>

          <el-form ref="userInfoRef" :model="userInfo" :rules="rules" label-width="100px" class="profile-form">
            <el-form-item label="用户名" prop="userName">
              <el-input disabled v-model="userInfo.userName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="userInfo.phone" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfo.email" placeholder="请输入邮箱地址" />
            </el-form-item>
            <el-form-item label="所在地区" prop="region">
              <el-cascader v-model="userInfo.region" :options="regionData" :props="{
                expandTrigger: 'hover',
                value: 'code',
                label: 'name',
                children: 'children',
                checkStrictly: false,
                emitPath: true
              }" placeholder="请选择所在地区" clearable @change="handleRegionChange" />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 修改密码卡片 -->
        <el-card class="mt-20">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
              <el-button type="primary" @click="changePassword">确认修改</el-button>
            </div>
          </template>

          <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px"
            class="password-form">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" show-password />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, Phone, Location } from '@element-plus/icons-vue'
import regionOptions from '../data/regionOptions.json'
import { getUserById, updateUser, replacePassword } from '@/api/user'
import { Code } from '@/constants/enum/code.enum'

export default {
  name: 'Profile',
  components: {
    Message,
    Phone,
    Location
  },
  setup() {
    const passwordFormRef = ref(null)
    const userInfoRef = ref(null)
    const regionData = ref(regionOptions)
    const userInfo = reactive({
      userName: '',
      email: '',
      phone: '',
      region: [],
    })
    const userId = JSON.parse(localStorage.getItem('userInfo')).id

    // 密码表单数据
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // 表单校验规则
    const rules = {
      userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ],
      region: [
        { required: true, message: '请选择所在地区', trigger: 'change' }
      ]
    }

    // 密码表单校验规则
    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    // 处理地区选择变化
    const handleRegionChange = (value) => {
      console.log('地区选择变化:', value)
      userInfo.region = value
    }

    // 在左侧卡片中显示地区信息
    const getRegionText = () => {
      if (!userInfo.region || userInfo.region.length === 0) return ''
      const province = regionData.value.find(p => p.code === userInfo.region[0])
      if (!province) return ''

      const city = province.children?.find(c => c.code === userInfo.region[1])
      if (!city) return province.name

      const area = city.children?.find(a => a.code === userInfo.region[2])
      if (!area) return `${province.name}${city.name}`

      return `${province.name}${city.name}${area.name}`
    }

    // 保存个人信息
    const saveProfile = async () => {
      if (!userInfoRef.value) return

      try {
        // 校验表单
        await userInfoRef.value.validate()
        const res = await updateUser({
          id: userId,
          userName: userInfo.userName,
          email: userInfo.email,
          phone: userInfo.phone,
          region: JSON.stringify(userInfo.region)
        })
        if (res.code === Code.SUCCESS.code) {
          ElMessage.success('个人信息修改成功')
        } else {
          ElMessage.error(res.message)
        }
      } catch (error) {
        ElMessage.error('catch error: ' + error.message)
      }
    }

    // 修改密码
    const changePassword = async () => {
      if (!passwordFormRef.value) return

      try {
        await passwordFormRef.value.validate()
        // TODO: 调用API修改密码
        const res = await replacePassword({
          id: userId,
          ...passwordForm
        })
        if (res.code === Code.SUCCESS.code) {
          ElMessage.success('密码修改成功')
          // 清空密码表单
          passwordForm.oldPassword = ''
          passwordForm.newPassword = ''
          passwordForm.confirmPassword = ''
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        ElMessage.error(error.message)
      }
    }

    // 获取用户信息
    onMounted(() => {
      getUserById({ id: userId }).then(res => {
        userInfo.userName = res.data.userName
        userInfo.email = res.data.email
        userInfo.phone = res.data.phone
        userInfo.region = res.data.region ? JSON.parse(res.data.region) : []
      })
    })

    return {
      rules,
      passwordForm,
      passwordFormRef,
      userInfoRef,
      passwordRules,
      regionData,
      handleRegionChange,
      getRegionText,
      saveProfile,
      changePassword,
      userInfo
    }
  }
}
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-card {
  text-align: center;
}

.user-info-top {
  padding: 20px 0;
}

.user-info-top h2 {
  margin: 10px 0 5px;
}

.user-role {
  color: #666;
  margin: 0;
}

.user-info-list {
  text-align: left;
  padding: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.info-item .el-icon {
  margin-right: 10px;
  font-size: 18px;
  color: #666;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-20 {
  margin-top: 20px;
}

/* 暗色主题样式 */
:deep(html.dark) .profile-card {
  background-color: var(--el-bg-color-overlay);
}

:deep(html.dark) .user-role {
  color: var(--el-text-color-secondary);
}

:deep(html.dark) .info-item .el-icon {
  color: var(--el-text-color-secondary);
}
</style>