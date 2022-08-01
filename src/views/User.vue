<template>
  <v-data-table
    :headers="headers"
    :items="usersData"
    item-key="id"
    class="elevation-1 pa-6"
    :footer-props="{
      'items-per-page-options': [10],
      'disable-items-per-page': true,
    }"
  >
    <template v-slot:top>
      <v-container fluid>
        <v-row class="searchRow">
          <v-col cols="3">
            <v-row class="pa-6">
              <v-text-field
                v-model="filters.email"
                type="text"
                label="이메일"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col cols="2">
            <v-row class="pa-6">
              <v-text-field
                v-model="filters.name"
                type="text"
                label="이름"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col cols="3">
            <v-row class="pa-6">
              <!-- Filter for calories -->
              <v-select
                :items="userTypeList"
                v-model="filters.is_admin"
                label="관리자 여부"
              ></v-select>
            </v-row>
          </v-col>

          <v-col cols="2">
            <v-row class="pa-6"> </v-row>
          </v-col>

          <v-col cols="2" class="centered">
            <v-btn color="secondary" class="searchButton" @click="SearchUsers">
              검색
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10"> </v-col>
          <v-col cols="2">
            <v-row>
              <v-col cols="6"> </v-col>
              <v-col cols="6">
                <v-btn color="green" @click="SearchUsers"> 수정 </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      userTypeList: [
        { text: 'All', value: null },
        { text: '관리자', value: 'Y' },
      ],
      filters: {
        email: '',
        name: '',
        is_admin: null,
      },

      usersData: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: '이메일',
          value: 'email',
        },
        {
          text: '이름',
          value: 'name',
        },
        {
          text: '닉네임',
          value: 'nickname',
        },
        {
          text: '전화번호',
          value: 'phone_number',
        },
        {
          text: '생년월일',
          value: 'birthday',
        },
        {
          text: '가입일',
          value: 'created_at',
        },
        {
          text: '관리자 여부',
          value: 'is_admin',
        },
      ];
    },
  },
  methods: {
    async SearchUsers() {
      const filters = this.filters;
      const pageNumber = 1;

      const response = await this.$axios.get(`${this.hostname}/users`, {
        params: {
          filters,
          pageNumber,
        },
      });
      this.usersData = response.data.data.users;
      this.$forceUpdate();
    },
  },
};
</script>

<style>
.centered {
  text-align: center;
  padding-top: 35px;
}
.searchRow {
  height: 85px;
}
.searchButton {
  width: 100px;
  height: 60px;
}
</style>
