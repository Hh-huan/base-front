<template>
  <div class="user-list">
    <h2 class="title">用户管理</h2>
    <div class="actions">
      <el-form :inline="true" label-width="100px">
        <el-form-item label="用户名:">
          <el-input v-model="selectedUser.userName" placeholder="输入用户名" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="用户类型:">
          <el-select v-model="selectedUser.userType" placeholder="选择用户类型" @change="updateSelectedUserType"
            style="width: 150px;">
            <el-option v-for="type in userTypeData" :key="type.code" :label="type.name" :value="type.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="selectedUser.status" placeholder="选择状态" @change="updateSelectedUserStatus"
            style="width: 150px;">
            <el-option v-for="status in statusData" :key="status.code" :label="status.name" :value="status.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区:">
          <el-cascader v-model="selectedUser.region" :options="regionData" :props="{
            expandTrigger: 'hover',
            value: 'code',
            label: 'name',
            children: 'children',
            checkStrictly: false,
            emitPath: true
          }" placeholder="选择所在地区" clearable @change="updateSelectedUserRegion" style="width: 450px;" />
        </el-form-item>
      </el-form>
      <div class="btn-group1">
        <el-button type="primary" @click="searchUsers">搜索</el-button>
        <el-button type="primary" @click="clearSearch">清空搜索</el-button>
      </div>
    </div>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="userName" label="用户名" sortable />
      <el-table-column prop="email" label="邮箱" sortable />
      <el-table-column prop="phone" label="手机" sortable />
      <el-table-column prop="userType" label="角色" sortable>
        <template #default="scope">
          <el-tag :type="scope.row.userType === 1 ? 'success' : 'danger'">{{ userTypeData.find(item => item.code ===
            scope.row.userType).name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="region" label="地区" sortable>
        <template #default="scope">
          <span>{{ getRegionText(scope.row.region) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" sortable>
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ statusData.find(item => item.code ===
            scope.row.status).name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template #header>
        <el-button style="margin: 10px auto;" type="primary" @click="showAddUserModal">添加用户</el-button>
        </template>
        <template #default="scope">
          <div class="btn-group2">
            <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
      :total="totalUsers" layout="total, prev, pager, next, jumper" />

    <el-dialog class="user-dialog" v-model="isAddUserModalVisible" :title="isEditing ? '编辑用户' : '添加用户'">
      <el-form label-width="100px">
        <el-form-item label="用户名:">
          <el-input @change="throttledCheckUserName" :disabled="isEditing" v-model="currentUser.userName"
            placeholder="请输入用户名" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="currentUser.email" placeholder="请输入邮箱" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="手机:">
          <el-input v-model="currentUser.phone" placeholder="请输入手机" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="地区:">
          <el-cascader v-model="currentUser.region" :options="regionData" :props="{
            expandTrigger: 'hover',
            value: 'code',
            label: 'name',
            children: 'children',
            checkStrictly: false,
            emitPath: true
          }" placeholder="请选择地区" clearable @change="handleRegionChange" style="width: 100%;" />
        </el-form-item>
        <el-form-item v-if="isEditing" label="状态:">
          <el-cascader v-model="currentUser.status" :options="statusData" :props="{
            expandTrigger: 'hover',
            value: 'code',
            label: 'name',
            children: 'children',
            checkStrictly: false,
            emitPath: true
          }" placeholder="请选择状态" clearable @change="handleStatusChange" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="saveUser">{{ isEditing ? '更新' : '确定' }}</el-button>
        <el-button type="info" @click="closeModal">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, addUser, updateUser, deleteUser } from '@/api/user'
import regionOptions from '../../data/regionOptions.json'
import statusOptions from '../../data/statusOptions.json'
import userTypeOptions from '../../data/userTypeOptions.json'
import { Code } from '@/constants/enum/code.enum'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isEmailValid, isPhoneValid } from '@/utils/utils'
import { checkUserName as apiCheckUserName } from '@/api/user'

const users = ref([])
const isAddUserModalVisible = ref(false)
const isUserNameValid = ref(true)
let lastCall = 0; // 上次调用的时间
const throttleDelay = 300; // 节流延迟时间
const currentUser = ref({ id: '', userName: '', email: '', phone: '', region: '', status: 0 })
const isEditing = ref(false)
const selectedUser = ref({ userName: '', region: '', userType: '', status: '' }) // 用于筛选
const regionData = ref(regionOptions)
const statusData = ref(statusOptions)
const userTypeData = ref(userTypeOptions)
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页显示的用户数量
const totalUsers = ref(0) // 总用户数量

// 获取用户列表
const fetchUsers = async () => {
  const res = await getUsers({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    webUserInfo: {
      userName: selectedUser.value.userName,
      region: selectedUser.value.region ? JSON.stringify(selectedUser.value.region) : "",
      userType: selectedUser.value.userType,
      status: selectedUser.value.status
    }
  })
  if (res.code === Code.SUCCESS.code) {
    users.value = res.data.records.map(item => {
      if (item.region) {
        item.region = JSON.parse(item.region)
      }
      return item
    })
    totalUsers.value = res.data.total // 更新总用户数量
  } else {
    ElMessage.error(res.msg)
  }
}

// 在左侧卡片中显示地区信息
const getRegionText = (region) => {
  if (!region || region.length === 0) return ''
  const province = regionData.value.find(p => p.code === region[0])
  if (!province) return ''

  const city = province.children?.find(c => c.code === region[1])
  if (!city) return province.name

  const area = city.children?.find(a => a.code === region[2])
  if (!area) return `${province.name}${city.name}`

  return `${province.name}${city.name}${area.name}`
}

// 处理搜索逻辑
const searchUsers = () => {
  currentPage.value = 1 // 重置为第一页
  fetchUsers() // 重新获取用户列表
}

// 更新选中的用户数据
const updateSelectedUserRegion = (value) => {
  selectedUser.value.region = value
}

const updateSelectedUserType = (value) => {
  selectedUser.value.userType = value
}

const updateSelectedUserStatus = (value) => {
  selectedUser.value.status = value
}

// 处理当前页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchUsers() // 重新获取用户列表
}

// 显示添加用户对话框
const showAddUserModal = () => {
  currentUser.value = { id: '', userName: '', email: '', phone: '', region: '', status: 0 }
  isEditing.value = false
  isAddUserModalVisible.value = true
}

// 编辑用户
const editUser = (user) => {
  currentUser.value = { ...user }
  console.log(currentUser.value)
  currentUser.value.region = user.region || []
  currentUser.value.status = [user.status] || ''
  isEditing.value = true
  isAddUserModalVisible.value = true
}

// 保存用户
const saveUser = async () => {
  if (isEditing.value) {
    if (currentUser.value.email !== '') {
      if (!isEmailValid(currentUser.value.email)) {
        ElMessage.error("邮箱格式不正确，请重新输入。")
        return
      }
    }
    if (currentUser.value.phone !== '') {
      if (!isPhoneValid(currentUser.value.phone)) {
        ElMessage.error("手机格式不正确，请重新输入。")
        return
      }
    }
    await updateUser({
      ...currentUser.value,
      region: currentUser.value.region ? JSON.stringify(currentUser.value.region) : "",
      status: currentUser.value.status ? currentUser.value.status[0] : statusOptions[0].code
    })
  } else {
    if (!isUserNameValid.value) {
      ElMessage.error("用户名已存在，请重新输入。")
      return
    }
    if (currentUser.value.userName == '') {
      ElMessage.error("用户名不能为空，请重新输入。")
      return
    }
    if (currentUser.value.email !== '') {
      if (!isEmailValid(currentUser.value.email)) {
        ElMessage.error("邮箱格式不正确，请重新输入。")
        return
      }
    }
    if (currentUser.value.phone !== '') {
      if (!isPhoneValid(currentUser.value.phone)) {
        ElMessage.error("手机格式不正确，请重新输入。")
        return
      }
    }
    await addUser({
      ...currentUser.value,
      region: currentUser.value.region ? JSON.stringify(currentUser.value.region) : "",
      status: currentUser.value.status ? currentUser.value.status[0] : statusOptions[0].code
    })
  }
  closeModal()
  fetchUsers()
}

const throttledCheckUserName = () => {
const now = Date.now();
if (now - lastCall >= throttleDelay) {
  lastCall = now;
  checkUserName(); // 调用 checkUserName
}
}
const clearSearch = () => {
  selectedUser.value = {}
  searchUsers()
}


const checkUserName = async () => {
  if (currentUser.value.userName == '') {
    isUserNameValid.value = true
    return
  }

  const res = await apiCheckUserName({ userName: currentUser.value.userName })
  if (res.code === Code.SUCCESS.code) {
    isUserNameValid.value = res.data // 假设 res.data 是布尔值，表示用户名是否可用
  } else {
    isUserNameValid.value = false
    ElMessage.error(res.message)
  }
}

// 关闭对话框
const closeModal = () => {
  isAddUserModalVisible.value = false
  currentUser.value = { id: null, userName: '', email: '' }
}

// 删除用户
const handleDeleteUser = async (id) => {
  ElMessageBox.confirm('确定要删除该用户吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteUser(id)
    fetchUsers()
  }).catch(() => {
    // 取消删除
  })
}

// 在组件挂载时获取用户列表
onMounted(fetchUsers)
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.user-dialog {
  width: 500px;
  height: 500px;
}

.btn-group2 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.btn-group2 button {
  margin-left: 10px;
}

.btn-group1 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
}

.btn-group1 button {
  margin-top: 10px;
}
</style>