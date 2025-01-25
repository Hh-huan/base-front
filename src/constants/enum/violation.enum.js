/**
 * 违规类型枚举
 */
export const ViolationType = {
  NORMAL: {
    code: 100,
    info: '正常'
  },
  ADVERTISEMENT: {
    code: 10001,
    info: '广告'
  },
  POLITICAL: {
    code: 20001,
    info: '时政'
  },
  PORNOGRAPHY: {
    code: 20002,
    info: '色情'
  },
  ABUSE: {
    code: 20003,
    info: '辱骂'
  },
  ILLEGAL_CRIME: {
    code: 20006,
    info: '违法犯罪'
  },
  FRAUD: {
    code: 20008,
    info: '欺诈'
  },
  VULGAR: {
    code: 20012,
    info: '低俗'
  },
  COPYRIGHT: {
    code: 20013,
    info: '版权'
  },
  OTHER: {
    code: 21000,
    info: '其他'
  }
}

/**
 * 获取违规类型名称
 */
export function getViolationTypeName(code) {
  for (const key in ViolationType) {
    if (ViolationType[key].code === Number(code)) {
      return ViolationType[key].info
    }
  }
  return '未知'
}

/**
 * 获取违规类型标签样式
 */
export function getViolationTagType(code) {
  const code_num = Number(code)
  if (code_num === 100) return 'success'
  if (code_num === 21000) return 'info'
  if ([20001, 20002, 20006, 20008].includes(code_num)) return 'danger'
  if ([10001, 20003, 20012, 20013].includes(code_num)) return 'warning'
  return ''
} 