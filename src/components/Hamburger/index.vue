<template>
  <div
    class="px-[15px] flex items-center justify-center color-[var(--el-text-color-regular)]"
    @click="toggleClick"
  >
    <svg-icon
      class="hamburger"
      :class="{ 'is-active': isActive }"
      icon-class="indent-decrease"
    />
  </div>
</template>
<script setup lang="ts">
defineProps({
  isActive: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const emit = defineEmits(["toggleClick"]);
const toggleClick = () => {
  emit("toggleClick");
};
</script>
<style scoped lang="scss">
.hamburger {
  vertical-align: middle;
  cursor: pointer;
  transform: scaleX(-1);
}

.hamburger.is-active {
  transform: scaleX(1);
}
</style>
