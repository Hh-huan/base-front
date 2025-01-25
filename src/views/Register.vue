<template>
  <div class="auth-container">
    <div class="form-container">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-container">
          <input :class="username == '' || isUserNameValid ? 'is-valid' : 'is-invalid'" @input="throttledCheckUserName"
            v-model="username" placeholder="用户名" required />
          <el-icon class="icon-group">
            <CircleCheck color="green" v-if="username && isUserNameValid" />
            <CircleClose color="red" v-if="username && !isUserNameValid" />
          </el-icon>
        </div>

        <div class="input-container">
          <input :class="password == '' || password.length >= 6 ? 'is-valid' : 'is-invalid'" v-model="password"
            type="password" placeholder="密码" required />
          <el-icon class="icon-group">
            <CircleCheck color="green" v-if="password && password.length >= 6" />
            <CircleClose color="red" v-if="password && password.length < 6" />
          </el-icon>
        </div>

        <div class="input-container">
          <input :class="confirmPassword == '' || confirmPassword !== password ? 'is-invalid' : 'is-valid'"
            v-model="confirmPassword" type="password" placeholder="确认密码" required />
          <el-icon class="icon-group">
            <CircleCheck color="green" v-if="confirmPassword && confirmPassword === password" />
            <CircleClose color="red" v-if="confirmPassword && confirmPassword !== password" />
          </el-icon>
        </div>

        <div class="input-container">
          <input :class="email == '' || isEmailValid(email) ? 'is-valid' : 'is-invalid'" v-model="email" type="email"
            placeholder="邮箱" required />
          <el-icon class="icon-group">
            <CircleCheck color="green" v-if="email && isEmailValid(email)" />
            <CircleClose color="red" v-if="email && !isEmailValid(email)" />
          </el-icon>
        </div>

        <button type="submit">注册</button>
      </form>
      <p class="link-text">已有账号？<router-link to="/login">登录</router-link></p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { register } from '@/api/auth'
import { Code } from '@/constants/enum/code.enum'
import { ElMessage } from 'element-plus'
import { checkUserName as apiCheckUserName } from '@/api/user'
import { useRouter } from 'vue-router'
import { isEmailValid } from '@/utils/utils'
export default {
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const email = ref('')
    const isUserNameValid = ref(true)
    let lastCall = 0; // 上次调用的时间
    const throttleDelay = 300; // 节流延迟时间

    const checkUserName = async () => {
      if (username.value == '') {
        isUserNameValid.value = true
        return
      }
      const res = await apiCheckUserName({ userName: username.value })
      console.log(res)
      if (res.code === Code.SUCCESS.code) {
        isUserNameValid.value = res.data // 假设 res.data 是布尔值，表示用户名是否可用
      } else {
        isUserNameValid.value = false
        ElMessage.error(res.message)
      }
    }

    const throttledCheckUserName = () => {
      const now = Date.now();
      if (now - lastCall >= throttleDelay) {
        lastCall = now;
        checkUserName(); // 调用 checkUserName
      }
    }

    const handleRegister = async () => {
      if (!isUserNameValid.value) {
        ElMessage.error("用户名已存在，请重新输入。")
        return
      }
      if (username.value == '') {
        ElMessage.error("用户名不能为空，请重新输入。")
        return
      }
      if (password.value == '') {
        ElMessage.error("密码不能为空，请重新输入。")
        return
      }
      if (confirmPassword.value == '') {
        ElMessage.error("确认密码不能为空，请重新输入。")
        return
      }
      if (email.value == '') {
        ElMessage.error("邮箱不能为空，请重新输入。")
        return
      }
      if (password.value.length < 6 || confirmPassword.value.length < 6) {
        ElMessage.error("密码长度不能小于6位，请重新输入。")
        return
      }
      if (password.value !== confirmPassword.value) {
        ElMessage.error("密码不匹配，请重新输入。")
        return
      }
      if (!isEmailValid(email.value)) {
        ElMessage.error("邮箱格式不正确，请重新输入。")
        return
      }
      const res = await register({ username: username.value, password: password.value, email: email.value })
      if (res.code == Code.SUCCESS.code) {
        ElMessage.success('注册成功')
        router.push('/login')
      } else {
        ElMessage.error(res.message)
      }
    }

    return { username, password, confirmPassword, email, handleRegister, throttledCheckUserName, isUserNameValid, isEmailValid }
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
  padding: 40px;
  width: 390px;
  text-align: center;
}

h2 {
  margin: 0 0 20px;
  font-size: 28px;
  color: #333;
}

.input-container {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
  margin-bottom: 15px;
  /* 输入框和下一个元素之间的间距 */
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  width: calc(100% - 40px);
  /* 减去图标的宽度和间距 */
  box-sizing: border-box;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  width: 100%;
}

button:hover {
  background-color: #0056b3;
}

.link-text {
  margin-top: 15px;
  font-size: 14px;
}

router-link {
  color: #007bff;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}

.is-valid {
  border-color: #007bff;
}

.is-invalid {
  border-color: #ff0000;
}

.error-message {
  color: #ff0000;
  /* 红色提示 */
  margin-left: 10px;
  /* 图标和文本之间的间距 */
}

.success-message {
  color: #007bff;
  /* 蓝色提示 */
  margin-left: 10px;
  /* 图标和文本之间的间距 */
}

.error-icon {
  color: #ff0000;
  /* 红色图标 */
}

.success-icon {
  color: #007bff;
  /* 蓝色图标 */
}

.icon-group {
  margin-left: 10px;
  /* 图标和文本之间的间距 */
}

</style>