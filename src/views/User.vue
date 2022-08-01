<template>
  <v-container>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="usersData"
        item-key="id"
        class="elevation-1 pa-6"
        :footer-props="{
          'items-per-page-options': [10],
          'disable-items-per-page': true,
        }"
        :hide-default-header="false"
        :hide-default-footer="true"
        :disable-pagination="true"
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

              <v-col cols="2" class="centeredSearchButton">
                <v-btn
                  color="secondary"
                  class="searchButton"
                  @click="searchButtonClick"
                >
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
                    <v-btn color="green" @click="searchUsers"> 수정 </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-data-table>
    </v-row>
    <div class="centeredPagenation">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.pages"
        @input="nextPage"
      ></v-pagination>
    </div>
  </v-container>
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
      pagination: {
        page: 1,
        pages: 1,
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
          sortable: false,
          width: 200,
        },
        {
          text: '이름',
          value: 'name',
          width: 150,
        },
        {
          text: '닉네임',
          value: 'nickname',
          width: 130,
        },
        {
          text: '전화번호',
          value: 'phone_number',
          width: 150,
        },
        {
          text: '생년월일',
          value: 'birthday',
          width: 150,
        },
        {
          text: '가입일',
          value: 'created_at',
          width: 150,
        },
        {
          text: '관리자',
          value: 'is_admin',
          width: 80,
        },
      ];
    },
  },
  methods: {
    async searchUsers() {
      const filters = this.filters;
      const pageNumber = this.pagination.page;

      const response = await this.$axios.get(`${this.hostname}/users`, {
        params: {
          filters,
          pageNumber,
        },
      });
      const { isSuccess, totalCount, data, message } = response.data;

      if (!isSuccess) {
        alert(message);
      }

      this.usersData = data.users;
      return totalCount;
    },

    async searchButtonClick() {
      const totalCount = await this.searchUsers();

      this.pagination.page = 1;
      this.pagination.pages = Math.floor((totalCount - 1) / 10) + 1;
    },

    nextPage() {
      this.searchUsers();
    },
  },
};
</script>

<style>
.centeredSearchButton {
  text-align: center;
  padding-top: 35px;
}
.centeredPagenation {
  padding-top: 20px;
}
.searchRow {
  height: 85px;
}
.searchButton {
  width: 100px;
  height: 60px;
}
</style>
