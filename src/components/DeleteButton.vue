<template>
  <el-popconfirm
    :title="title"
    :confirm-button-text="confirmButtonText"
    :cancel-button-text="cancelButtonText"
    @confirm="handleConfirm"
  >
    <template #reference>
      <el-button :link="link" type="danger" :size="size">
        {{ buttonText }}
      </el-button>
    </template>
  </el-popconfirm>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '确定要删除吗？'
  },
  confirmButtonText: {
    type: String,
    default: '确定'
  },
  cancelButtonText: {
    type: String,
    default: '取消'
  },
  buttonText: {
    type: String,
    default: '删除'
  },
  link: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['confirm'])

const handleConfirm = () => {
  emit('confirm')
}
</script> 