<template>
  <v-container fluid>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer />

      <h5 style="margin-right: 10px; color: #88f5f7">{{ getEmail }}</h5>
      <v-btn color="secondary" @click="logoutButtonClick">로그아웃</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-col cols="4">
              <v-img
                class="float-left"
                max-height="50"
                max-width="70"
                src="../assets/logo.png"
              >
              </v-img>
            </v-col>
            <v-col cols="8">
              <v-list-item-title class="text-h5"> 롱기스트 </v-list-item-title>
              <v-list-item-subtitle> 어드민 </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MainView',
  components: {},
  data() {
    return {
      drawer: true,
      items: [
        {
          title: '코드',
          icon: 'mdi-note-edit-outline',
          to: '/admin/code',
        },
        {
          title: '사용자',
          icon: 'mdi-account-search-outline',
          to: '/admin/user',
        },
        {
          title: '홀인원 상금지급',
          icon: 'mdi-trophy-outline',
          to: '/admin/holeinone/reward',
        },
        {
          title: '뉴스',
          icon: 'mdi-newspaper',
          to: '/admin/news',
        },
      ],
      right: null,
    };
  },
  computed: {
    ...mapGetters({
      getEmail: 'user/GET_EMAIL',
    }),
  },
  methods: {
    ...mapActions({
      logout: 'user/LOGOUT',
    }),
    logoutButtonClick() {
      this.logout();
      alert('로그아웃 되었습니다.');

      this.$router.push('/admin/view?returnPath=/');
    },
  },
};
</script>
