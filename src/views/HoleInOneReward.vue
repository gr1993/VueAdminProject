<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="rewardData"
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
      <template v-slot:[`item.register_date`]="{ item }">
        {{ formatDate(item.register_date) }}
      </template>

      <template v-slot:[`item.created_at`]="{ item }">
        {{ formatDate(item.created_at) }}
      </template>

      <template v-slot:[`item.tee_off_date`]="{ item }">
        {{ formatDate(item.tee_off_date) }}
      </template>

      <template v-slot:[`item.base_document`]="{ item }">
        <div class="p-2">
          <v-btn
            color="primary"
            :value="item.base_document"
            @click="showImageViewer(item.id)"
          >
            보기
          </v-btn>
        </div>
      </template>

      <template v-slot:[`item.added_document`]="{ item }">
        <div class="p-2">
          <v-btn color="primary" :value="item.added_document"> 보기 </v-btn>
        </div>
      </template>

      <template v-slot:top>
        <v-container fluid>
          <v-row class="searchRow">
            <v-col cols="12">
              <v-toolbar dark color="#698af5" :rounded="true">
                <!-- 날짜 필터 -->
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      label="신청일 기간"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hide-details="auto"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filters.dates"
                    no-title
                    scrollable
                    range
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <!-- 검색 필터 -->
                <v-select
                  v-model="filterTargetSelect"
                  :items="filterTargets"
                  hide-details="auto"
                  style="width: 100px; float: left; padding-left: 30px"
                  label="검색대상"
                  outlined
                  dense
                ></v-select>
                <v-text-field
                  v-model="filters.searchValue"
                  class="mx-4"
                  flat
                  hide-no-data
                  hide-details
                  label="검색어"
                  solo-inverted
                  style="width: 400px; float: left"
                >
                </v-text-field>
                <v-btn icon class="hidden-xs-only" @click="searchButtonClick">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-toolbar>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" align="left">
              <h3 class="badge">
                <v-badge color="green" content="6"> 전체 </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="black" content="6"> 요청 </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="black" content="6"> 심사중 </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="red" content="6"> 심사완료(거절) </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="blue" content="6"> 심사완료(지급) </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="blue" content="6"> 지급완료 </v-badge>
              </h3>
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
    <ImageViewerModal ref="ImageViewer" />
  </v-container>
</template>

<script>
import moment from 'moment';
import ImageViewerModal from '../components/ImageViewerModal.vue';

export default {
  name: 'HoleInOneReward',
  components: {
    ImageViewerModal,
  },
  data() {
    return {
      menu: false,

      filterTargetSelect: '',
      filterTargets: [
        {
          text: '전체',
          value: '',
        },
        {
          text: '구분',
          value: 'type',
        },
        {
          text: '이름',
          value: 'name',
        },
      ],
      filters: {
        dates: ['2022-01-01', '2022-01-01'],
        searchValue: '',
      },
      pagination: {
        page: 1,
        pages: 1,
      },

      rewardData: [],
    };
  },
  created() {
    this.filters.dates[1] = moment().format('YYYY-MM-DD');
  },
  computed: {
    headers() {
      return [
        {
          text: '상태',
          width: 80,
          align: 'center',
          value: 'status',
        },
        {
          text: '구분',
          width: 80,
          align: 'center',
          value: 'type',
        },
        {
          text: '이름',
          width: 80,
          align: 'center',
          value: 'name',
        },
        {
          text: '전화번호',
          width: 130,
          align: 'center',
          value: 'phone_number',
        },
        {
          text: '홀인원 멤버쉽번호',
          width: 140,
          align: 'center',
          value: 'hole_in_one_membership_id',
        },
        { text: '가입일', width: 120, value: 'register_date' },
        { text: '신청일', width: 120, value: 'created_at' },
        { text: '티오프시간', width: 120, value: 'tee_off_date' },
        {
          text: '기본서류',
          width: 100,
          value: 'base_document',
          align: 'center',
        },
        {
          text: '구장(코스)',
          width: 100,
          align: 'center',
          value: 'phone_number',
        },
        {
          text: '업장',
          width: 100,
          align: 'center',
          value: 'phone_number',
        },
        {
          text: '골프존 ID',
          width: 100,
          align: 'center',
          value: 'phone_number',
        },
        {
          text: '추가서류',
          width: 100,
          align: 'center',
          value: 'added_document',
        },
        {
          text: '심사결과',
          width: 100,
          align: 'center',
          value: 'phone_number',
        },
        {
          text: '심사기한',
          width: 100,
          align: 'center',
          value: 'phone_number',
        },
        {
          text: '지급예정',
          width: 100,
          align: 'center',
          value: 'phone_number',
        },
        {
          text: '지급여부',
          width: 100,
          align: 'center',
          value: 'phone_number',
        },
      ];
    },
    dateRangeText() {
      return this.filters.dates.join(' ~ ');
    },
  },
  methods: {
    async SearchHoleInOne() {
      try {
        const filters = {
          start_date: this.filters.dates[0],
          end_date: this.filters.dates[1],
        };
        if (this.filterTargetSelect) {
          filters[this.filterTargetSelect] = this.filters.searchValue;
        }
        const pageNumber = this.pagination.page;

        const response = await this.$axios.get(`${this.hostname}/holeinone`, {
          params: {
            filters,
            pageNumber,
          },
        });
        const { isSuccess, totalCount, data, message } = response.data;

        if (!isSuccess) {
          alert(message);
          return;
        }

        this.rewardData = data.holeInOneRewards;
        return totalCount;
      } catch (error) {
        alert(error.message);
        console.log(error);
        alert('상금지급 검색에 실패하였습니다.');
      }
    },

    async searchButtonClick() {
      const totalCount = await this.SearchHoleInOne();

      this.pagination.page = 1;
      this.pagination.pages = Math.floor((totalCount - 1) / 10) + 1;
    },

    showImageViewer(id) {
      const reward = this.rewardData.find((f) => f.id === id);

      this.$refs.ImageViewer.imageLinks = [
        reward.certificate_image_path,
        reward.certifying_shot_image_path,
      ];
      this.$refs.ImageViewer.dialog = true;
    },

    nextPage() {
      this.SearchHoleInOne();
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

.badge {
  float: left;
  margin: 0 20px 0 20px;
}
.search-toolbar {
  border-radius: 10px;
}
</style>
