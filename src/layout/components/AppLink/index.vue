<template>
  <component :is="type" v-bind="linkPros(to)">
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
defineOptions({
  name: "AppLink",
  inheritAttrs: false,
});

import { isExternal } from "@/utils/index";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const isExternalLink = computed(() => isExternal(props.to));
const type = computed(() => {
  return isExternalLink.value ? "a" : "router-link";
});
const linkPros = (to: string) => {
  if (isExternalLink.value) {
    return {
      href: to,
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }
  return {
    to: to,
  };
};
</script>
<style scoped lang="scss"></style>
