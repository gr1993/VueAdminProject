<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer />
    </v-app-bar>
    <Main v-if="isLogin"/>
    <Login v-if="!isLogin"/>
  </v-app>
</template>

<script>
import Main from './views/Main.vue'
import Login from './views/Login.vue'

export default {
  components: {
    Main,
    Login
  },
  data() {
    return {
      isLogin: false,
    }
  }
}
</script>