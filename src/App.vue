<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
    }
  }
}
</script>

<style>
.v-application {
  font-family: 'NanumBarunGothic', sans-serif !important;
}
@font-face {
  font-family:'NanumBarunGothic';
  src: url('assets/fonts/NanumBarunGothic.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family:'NanumBarunGothic';
  src: url('assets/fonts/NanumBarunGothicLight.ttf') format('truetype');
  font-weight: 300;
}
@font-face {
  font-family:'NanumBarunGothic';
  src: url('assets/fonts/NanumBarunGothicBold.ttf') format('truetype');
  font-weight: 700;
}
</style>