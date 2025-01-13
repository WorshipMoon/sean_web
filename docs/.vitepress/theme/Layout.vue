<script setup>
import DefaultTheme from "vitepress/theme";
import { onMounted } from "vue";

const { Layout } = DefaultTheme;

onMounted(() => {
  // 确保在客户端环境下运行
  if (typeof window !== "undefined") {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // setTimeout(() => {
    //   const s1 = document.createElement("script");
    //   const s0 = document.getElementsByTagName("script")[0];

    //   s1.async = true;
    //   s1.src = "https://embed.tawk.to/6778dc1849e2fd8dfe024847/1igo1ngc3";
    //   s1.charset = "UTF-8";
    //   s1.setAttribute("crossorigin", "*");

    //   if (s0 && s0.parentNode) {
    //     s0.parentNode.insertBefore(s1, s0);
    //   } else {
    //     document.head.appendChild(s1);
    //   }
    // }, 0);

    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/6778dc1849e2fd8dfe024847/1igo1ngc3";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }
});
</script>

<template>
  <Layout />
</template>
