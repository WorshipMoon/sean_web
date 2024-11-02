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
  <div class="text-center">404</div>
</template>
<style lang="scss" scoped></style>
