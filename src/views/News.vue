<template>
  <v-container fluid>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="newsData"
      :single-select="true"
      item-key="id"
      class="elevation-1 pa-6"
      :footer-props="{
        'items-per-page-options': [10],
        'disable-items-per-page': true,
      }"
      :hide-default-header="false"
      :hide-default-footer="true"
      :disable-pagination="true"
      show-select
    >
      <template v-slot:[`item.image_path`]="{ item }">
        <div class="p-2">
          <a :href="item.image_path" target="_blank">
            <v-img :src="item.image_path" width="150px" height="150px"> </v-img>
          </a>
        </div>
      </template>

      <template v-slot:[`item.created_at`]="{ item }">
        {{ formatDate(item.created_at) }}
      </template>

      <template v-slot:top>
        <v-container fluid>
          <v-row class="searchRow">
            <v-col cols="4">
              <v-row class="pa-6">
                <v-text-field
                  v-model="filters.title"
                  type="text"
                  label="제목"
                ></v-text-field>
              </v-row>
            </v-col>

            <v-col cols="3">
              <v-row class="pa-6">
                <v-text-field
                  v-model="filters.sub_title"
                  type="text"
                  label="부제목"
                ></v-text-field>
              </v-row>
            </v-col>

            <v-col cols="3">
              <v-row class="pa-6">
                <v-text-field
                  v-model="filters.writter"
                  type="text"
                  label="출처"
                ></v-text-field>
              </v-row>
            </v-col>

            <v-col cols="2" class="centered">
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
            <v-col cols="12" align="right">
              <v-btn
                color="blue"
                style="margin-right: 10px"
                @click="addButtonClick"
              >
                등록
              </v-btn>
              <v-btn
                color="green"
                style="margin-right: 10px"
                @click="writeButtonClick"
              >
                수정
              </v-btn>
              <v-btn color="red" @click="deleteButtonClick"> 삭제 </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-data-table>
    <div class="centeredPagenation">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.pages"
        :total-visible="10"
        @input="nextPage"
      ></v-pagination>
    </div>
    <NewAddModal ref="news_add" @SearchNews="SearchNews" />
    <NewsWriteModal ref="news_modify" @SearchNews="SearchNews" />
  </v-container>
</template>

<script>
import moment from 'moment';
import NewAddModal from '../components/NewsAddModal.vue';
import NewsWriteModal from '../components/NewsWriteModal.vue';

export default {
  name: 'NewsView',
  components: {
    NewAddModal,
    NewsWriteModal,
  },
  data() {
    return {
      selected: [],
      menu: false,

      filters: {
        title: '',
        sub_title: '',
        writter: null,
      },
      pagination: {
        page: 1,
        pages: 1,
      },

      newsData: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: '제목',
          width: 300,
          align: 'center',
          value: 'title',
        },
        {
          text: '부제목',
          width: 180,
          align: 'center',
          value: 'sub_title',
        },
        {
          text: '출처',
          width: 100,
          align: 'center',
          value: 'writter',
        },
        {
          text: '생성일',
          width: 120,
          align: 'center',
          value: 'created_at',
        },
        {
          text: '이미지',
          width: 200,
          align: 'center',
          value: 'image_path',
        },
      ];
    },
  },
  methods: {
    async SearchNews() {
      try {
        const filters = this.filters;
        const pageNumber = this.pagination.page;

        const response = await this.$axios.get(`${this.hostname}/news`, {
          params: {
            filters,
            pageNumber,
          },
        });
        const { isSuccess, totalCount, data, message } = response.data;

        if (!isSuccess) {
          alert(message);
        }

        this.newsData = data.news;
        return totalCount;
      } catch (error) {
        alert(error.message);
        console.log(error);
        alert('기사 검색에 실패하였습니다.');
      }
    },

    async searchButtonClick() {
      const totalCount = await this.SearchNews();

      this.pagination.page = 1;
      this.pagination.pages = Math.floor((totalCount - 1) / 10) + 1;
    },

    addButtonClick() {
      this.$refs.news_add.dialog = true;
    },

    writeButtonClick() {
      if (this.selected[0]) {
        const selectedNews = this.selected[0];

        this.$refs.news_modify.dialog = true;
        this.$refs.news_modify.getNewsDetail(selectedNews.id);
      } else {
        alert('뉴스기사를 선택하세요');
      }
    },

    async deleteButtonClick() {
      if (this.selected[0]) {
        try {
          const result = window.confirm('해당 기사를 삭제하시겠습니까?');
          if (result) {
            const deletedId = this.selected[0].id;

            const response = await this.$axios.post(
              `${this.hostname}/news/delete/${deletedId}`
            );

            const { message } = response.data;
            alert(message);

            this.SearchNews();
          }
        } catch {
          alert('뉴스기사 삭제에 실패하였습니다.');
        }
      } else {
        alert('뉴스기사를 선택하세요');
      }
    },

    nextPage() {
      this.SearchNews();
    },

    formatDate(value) {
      const formatDate = moment(value).format('YYYY-MM-DD hh:mm:ss');
      if (!formatDate || formatDate === 'Invalid date') return '';
      return formatDate;
    },
  },
};
</script>

<style>
.v-data-table > .v-data-table__wrapper > table {
  border-spacing: 0 0.5rem;
}
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
