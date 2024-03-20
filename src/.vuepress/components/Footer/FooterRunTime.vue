<script setup lang="ts">
import {onMounted, nextTick} from "vue";
import {useRouter} from "vue-router";


const FooterRunTime = () => {
  const Win: any = window;
  clearInterval(Win.RunningTimeTimer);
  const footer = document.querySelector(".vp-copyright");
  
  if (!footer) return;
  const text = `<br/><span>本站已运行 :day天:hour时:minute分:second秒</span>`;
  const pretext = footer.innerHTML.split('<br>')[0];
  Win.RunningTimeTimer = setInterval(() => {
    const past = new Date("2023-04-03");
    const now = new Date();
    let diffInSeconds = Math.abs((now.getTime() - past.getTime()) / 1000);
    const days = Math.floor(diffInSeconds / (60 * 60 * 24));
    diffInSeconds -= days * (60 * 60 * 24);
    const hours = Math.floor(diffInSeconds / (60 * 60));
    diffInSeconds -= hours * (60 * 60);
    const minutes = Math.floor(diffInSeconds / 60);
    diffInSeconds -= minutes * 60;
    const seconds = Math.floor(diffInSeconds);
    const runtime = text
        .replace(":day", days.toString())
        .replace(":hour", hours.toString())
        .replace(":minute", minutes.toString())
        .replace(":second", seconds.toString());
    footer.innerHTML = `${pretext}${runtime}`;
  }, 1000);
};

onMounted(() => {
  nextTick(() => {
    FooterRunTime();
  });

  const router = useRouter();
  router.afterEach(() => {
    nextTick(() => {
      FooterRunTime();
    });
  });
});
</script>

<template>
  <ClientOnly>
    <div class="none"></div>
  </ClientOnly>
</template>
