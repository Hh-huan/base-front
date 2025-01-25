// src/store/modules/user.js
import { reactive } from 'vue';

const state = reactive({
    userInfo: null, // 存储用户信息
});

const mutations = {
    SET_USER_INFO(userInfo) {
        state.userInfo = userInfo; // 更新用户信息
    },
    CLEAR_USER_INFO() {
        state.userInfo = null; // 清除用户信息
    },
};

const actions = {
    login(userData) {
        // 模拟登录操作
        // 这里可以调用 API 进行登录
        mutations.SET_USER_INFO(userData); // 登录成功后设置用户信息
    },
    logout() {
        mutations.CLEAR_USER_INFO(); // 退出登录时清除用户信息
    },
};

const getters = {
    isLoggedIn: () => !!state.userInfo, // 判断用户是否登录
    getUserInfo: () => state.userInfo, // 获取用户信息
};

// 导出 useUserStore 函数
export const useUserStore = () => {
    return {
        state,
        actions,
        getters,
    };
};

export default {
    state,
    mutations,
    actions,
    getters,
};