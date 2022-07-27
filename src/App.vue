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
    <Main/>
  </v-app>
</template>

<script>
import Main from './views/Main.vue'

export default {
  components: {
    Main
  },
}
</script>