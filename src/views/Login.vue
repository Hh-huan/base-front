<template>
  <div class="auth-container">
    <div class="form-container">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="用户名" required />
        <input v-model="password" type="password" placeholder="密码" required />
        <button type="submit">登录</button>
      </form>
      <p class="link-text">没有账号？<router-link to="/register">注册</router-link></p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { login } from '@/api/auth'
import { Code } from '@/constants/enum/code.enum'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const router = useRouter()

    const handleLogin = async () => {
      const res = await login({ username: username.value, password: password.value })
      if (res.code === Code.SUCCESS.code) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.webUserInfo))
        localStorage.setItem('role', res.data.webUserInfo.userType)
        ElMessage.success('登录成功')
        router.push('/')
      } else {
        ElMessage.error(res.msg)
      }
    }

    return { username, password, handleLogin }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #a18cd1, #fbc2eb);
}

.form-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px; /* 增加内边距 */
  width: 350px; /* 增加宽度 */
  text-align: center; /* 中心对齐 */
}

h2 {
  margin: 0 0 20px; /* 增加底部间距 */
  font-size: 28px; /* 增加字体大小 */
  color: #333;
}

input {
  margin-bottom: 15px; /* 增加底部间距 */
  padding: 12px; /* 增加内边距 */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px; /* 增加字体大小 */
  transition: border-color 0.3s; /* 增加过渡效果 */
  width: calc(100% - 24px); /* 使输入框宽度与容器一致，减去内边距 */
  box-sizing: border-box; /* 包含内边距和边框在内的宽度计算 */
}

input:focus {
  border-color: #007bff; /* 聚焦时边框颜色变化 */
  outline: none; /* 去掉默认的轮廓 */
}

button {
  padding: 12px; /* 增加内边距 */
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s; /* 增加过渡效果 */
  width: 100%; /* 使按钮宽度与容器一致 */
}

button:hover {
  background-color: #0056b3; /* 悬停时颜色变化 */
}

.link-text {
  margin-top: 15px; /* 增加顶部间距 */
  font-size: 14px; /* 字体大小 */
}

router-link {
  color: #007bff; /* 链接颜色 */
  text-decoration: none; /* 去掉下划线 */
}

router-link:hover {
  text-decoration: underline; /* 悬停时下划线 */
}
</style> 