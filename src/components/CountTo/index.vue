<template>
  <span>{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  startVal: {
    type: Number,
    default: 0
  },
  endVal: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const displayValue = ref(props.startVal)
let timer = null
let startTime = null
const remainingTime = ref(0)

const requestAnimationFrame = window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  window.oRequestAnimationFrame || 
  window.msRequestAnimationFrame || 
  function(callback) {
    return window.setTimeout(callback, 1000/60)
  }

const cancelAnimationFrame = window.cancelAnimationFrame || 
  window.webkitCancelAnimationFrame || 
  window.mozCancelAnimationFrame || 
  window.oCancelAnimationFrame || 
  window.msCancelAnimationFrame || 
  function(id) {
    window.clearTimeout(id)
  }

const count = (timestamp) => {
  if (!startTime) startTime = timestamp
  const progress = timestamp - startTime

  remainingTime.value = Math.max(props.duration - progress, 0)
  displayValue.value = Math.round(props.endVal - (remainingTime.value * (props.endVal - props.startVal) / props.duration))

  if (remainingTime.value > 0) {
    timer = requestAnimationFrame(count)
  } else {
    displayValue.value = props.endVal
  }
}

const start = () => {
  if (timer) cancelAnimationFrame(timer)
  startTime = null
  timer = requestAnimationFrame(count)
}

watch(() => props.endVal, (newVal) => {
  if (newVal !== displayValue.value) {
    start()
  }
})

onMounted(() => {
  start()
})
</script> 