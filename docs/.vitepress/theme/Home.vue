<script lang="ts">
import { reactive, toRefs, defineComponent, onMounted } from "vue";
export default defineComponent({
  name: "NotFound",
  setup() {
    const dataMap = reactive({});
    onMounted(() => {});
    return {
      ...toRefs(dataMap),
    };
  },
});
</script>
<template>
  <Content />
  <div>123</div>
</template>
<style lang="scss" scoped></style>
