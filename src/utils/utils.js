export const isEmailValid = (email) => {
    // 简单的邮箱验证
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const isPhoneValid = (phone) => {
    // 简单的手机号验证
    const regex = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    return regex.test(phone);
}