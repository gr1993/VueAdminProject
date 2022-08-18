<template>
  <v-container fluid>
    <v-data-table
      v-model="selected"
      :single-select="true"
      show-select
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
      disable-sort
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

      <template v-slot:[`item.time_taken`]="{ item }">
        {{ getTimeTaken(item.tee_off_date, item.register_date) }}
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

      <template v-slot:[`item.golf_field`]="{ item }">
        {{ getGolfField(item.golf_field, item.golf_hole) }}
      </template>

      <template v-slot:[`item.manager_confirm`]="{ item }">
        <div class="p-2">
          <v-row v-if="item.status === '요청'">
            <v-col cols="6">
              <v-btn
                color="green"
                :value="item.manager_confirm"
                @click="managerConfirmClick(item.id)"
              >
                확인
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="red"
                :value="item.manager_confirm"
                @click="managerRejectClick(item.id)"
              >
                거절
              </v-btn>
            </v-col>
          </v-row>
          <span v-if="item.status !== '요청'">
            {{ getManagerConfirmText(item.id) }}
          </span>
        </div>
      </template>

      <template v-slot:[`item.added_document`]="{ item }">
        <div class="p-2">
          <v-btn
            v-if="item.additional_documents_date"
            color="primary"
            @click="showAddedImageViewer(item.id)"
          >
            보기
          </v-btn>
          <v-btn
            v-if="!item.additional_documents_date"
            color="primary"
            disabled
          >
            보기
          </v-btn>
        </div>
      </template>

      <template v-slot:[`item.additional_documents_date`]="{ item }">
        {{ formatDate(item.additional_documents_date) }}
      </template>

      <template v-slot:[`item.judgment_result`]="{ item }">
        <div class="p-2">
          <v-row
            v-if="
              item.additional_documents_date &&
              (item.status === '심사중' ||
                item.status === '심사중1' ||
                item.status === '심사중2' ||
                item.status === '심사중3')
            "
          >
            <v-col cols="6">
              <v-btn
                color="green"
                :value="item.judgment_result"
                @click="judgmentConfirmClick(item.id, item.status)"
              >
                확인
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="red"
                :value="item.manager_confirm"
                @click="judgmentRejectClick(item.id)"
              >
                거절
              </v-btn>
            </v-col>
          </v-row>
          <span
            v-if="
              item.additional_documents_date &&
              item.status !== '심사거절' &&
              item.status !== '심사중' &&
              item.status !== '심사중1' &&
              item.status !== '심사중2' &&
              item.status !== '심사중3'
            "
          >
            발송완료
          </span>
          <v-row
            v-if="item.additional_documents_date && item.status === '심사거절'"
          >
            <v-col cols="1"></v-col>
            <v-col cols="4">
              <v-btn color="error" @click="showJudgmentRejectReason(item.id)">
                사유확인
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="!item.additional_documents_date">
            <v-col cols="6">
              <v-btn color="green" disabled> 확인 </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="red" disabled> 거절 </v-btn>
            </v-col>
          </v-row>
        </div>
      </template>

      <template v-slot:[`item.judging_deadline_date`]="{ item }">
        {{ formatOnlyDate(item.judging_deadline_date) }}
      </template>

      <template v-slot:[`item.payment_due_date`]="{ item }">
        {{ formatOnlyDate(item.payment_due_date) }}
      </template>

      <template v-slot:[`item.is_payment`]="{ item }">
        <div v-if="item.status === '심사완료'" class="p-2">
          <v-row v-if="!item.payment_date">
            <v-col cols="12">
              <v-btn color="green" @click="paymentCompleteClick(item.id)">
                지급
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <span v-if="item.status === '지급완료' && item.payment_date">
          완료
        </span>
      </template>

      <template v-slot:[`item.payment_date`]="{ item }">
        {{ formatDate(item.payment_date) }}
      </template>

      <template v-slot:[`item.is_holeinone_withdraw`]="{ item }">
        {{ getBooleanText(item.is_holeinone_withdraw) }}
      </template>

      <template v-slot:[`item.is_companion`]="{ item }">
        {{ getBooleanText(item.is_companion) }}
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
                <v-badge color="green" :content="statusList.total">
                  전체
                </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="black" :content="statusList.request">
                  요청
                </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="red" :content="statusList.requestReject">
                  요청거절
                </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="black" :content="statusList.judgment">
                  심사중
                </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="red" :content="statusList.judgmentReject">
                  심사거절
                </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="blue" :content="statusList.judgmentComplete">
                  심사완료
                </v-badge>
              </h3>
              <h3 class="badge">
                <v-badge color="blue" :content="statusList.paymentComplete">
                  지급완료
                </v-badge>
              </h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn
                color="green"
                style="margin-right: 10px"
                @click="typeChangeButtonClick"
              >
                구분 변경
              </v-btn>
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
    <HoleInOneModal ref="ManagerConfirm" @SearchHoleInOne="SearchHoleInOne" />
    <HoleInOneRejectModal
      ref="ManagerReject"
      @SearchHoleInOne="SearchHoleInOne"
    />
    <HoleInOneButtonModal
      ref="JudgmentConfirm"
      @SearchHoleInOne="SearchHoleInOne"
    />
    <HoleInOneTypeModal
      ref="TypeChangeModal"
      @SearchHoleInOne="SearchHoleInOne"
    />
  </v-container>
</template>

<script>
import moment from 'moment';
import ImageViewerModal from '../components/ImageViewerModal.vue';
import HoleInOneModal from '../components/HoleInOneModal.vue';
import HoleInOneButtonModal from '../components/HoleInOneButtonModal.vue';
import HoleInOneRejectModal from '../components/HoleInOneRejectModal.vue';
import HoleInOneTypeModal from '../components/HoleInOneTypeModal.vue';

export default {
  name: 'HoleInOneReward',
  components: {
    ImageViewerModal,
    HoleInOneModal,
    HoleInOneButtonModal,
    HoleInOneRejectModal,
    HoleInOneTypeModal,
  },
  data() {
    return {
      selected: [],
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
      statusList: {
        total: '0',
        request: '0',
        requestReject: '0',
        judgment: '0',
        judgmentComplete: '0',
        judgmentReject: '0',
        paymentComplete: '0',
      },
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
          width: 120,
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
        { text: '소요시간', width: 120, value: 'time_taken' },
        {
          text: '기본서류',
          width: 100,
          value: 'base_document',
          align: 'center',
        },
        {
          text: '담당자확인',
          width: 150,
          value: 'manager_confirm',
          align: 'center',
        },
        {
          text: '구장(코스)',
          width: 120,
          align: 'center',
          value: 'golf_field',
        },
        {
          text: '업장',
          width: 100,
          align: 'center',
          value: 'golf_screen',
        },
        {
          text: '지역',
          width: 100,
          align: 'center',
          value: 'golf_area',
        },
        {
          text: '골프존 ID',
          width: 100,
          align: 'center',
          value: 'golfzone_id',
        },
        {
          text: '추가서류',
          width: 100,
          align: 'center',
          value: 'added_document',
        },
        {
          text: '추가서류 접수일',
          width: 150,
          align: 'center',
          value: 'additional_documents_date',
        },
        {
          text: '심사결과',
          width: 150,
          align: 'center',
          value: 'judgment_result',
        },
        {
          text: '심사기한',
          width: 120,
          align: 'center',
          value: 'judging_deadline_date',
        },
        {
          text: '지급예정',
          width: 120,
          align: 'center',
          value: 'payment_due_date',
        },
        {
          text: '지급여부',
          width: 100,
          align: 'center',
          value: 'is_payment',
        },
        {
          text: '지급일',
          width: 150,
          align: 'center',
          value: 'payment_date',
        },
        {
          text: '탈퇴여부',
          width: 120,
          align: 'center',
          value: 'is_holeinone_withdraw',
        },
        {
          text: '홀인원 횟수',
          width: 150,
          align: 'center',
          value: 'holeinone_count',
        },
        {
          text: '동일매장 이용',
          width: 150,
          align: 'center',
          value: 'same_store_count',
        },
        {
          text: '한달 내 홀인원',
          width: 150,
          align: 'center',
          value: 'holeinone_per_month',
        },
        {
          text: '동반자 여부',
          width: 150,
          align: 'center',
          value: 'is_companion',
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
        this.getStatusList(filters);
        return totalCount;
      } catch (error) {
        alert(error.message);
        console.log(error);
        alert('상금지급 검색에 실패하였습니다.');
      }
    },

    async getStatusList(filters) {
      const response = await this.$axios.get(
        `${this.hostname}/holeinone/status/list`,
        {
          params: {
            filters,
          },
        }
      );
      const { isSuccess, data, message } = response.data;

      if (!isSuccess) {
        alert(message);
        return;
      }

      const list = data.statusList;
      if (list && list.length) {
        this.statusList.total = list
          .reduce((acc, cur) => acc + cur.count, 0)
          .toString();

        const request = list.find((f) => f.status === '요청');
        this.statusList.request = request ? request.count.toString() : '0';

        const requestReject = list.find((f) => f.status === '요청거절');
        this.statusList.requestReject = requestReject
          ? requestReject.count.toString()
          : '0';

        const judgment = list.find((f) => f.status === '심사중');
        const judgment1 = list.find((f) => f.status === '심사중1');
        const judgment2 = list.find((f) => f.status === '심사중2');
        const judgment3 = list.find((f) => f.status === '심사중3');
        const sumJudgment = [
          judgment ? judgment.count : 0,
          judgment1 ? judgment1.count : 0,
          judgment2 ? judgment2.count : 0,
          judgment3 ? judgment3.count : 0,
        ];
        this.statusList.judgment =
          sumJudgment && sumJudgment.length > 0
            ? sumJudgment.reduce((acc, count) => acc + count, 0).toString()
            : '0';

        const judgmentReject = list.find((f) => f.status === '심사거절');
        this.statusList.judgmentReject = judgmentReject
          ? judgmentReject.count.toString()
          : '0';

        const judgmentComplete = list.find((f) => f.status === '심사완료');
        this.statusList.judgmentComplete = judgmentComplete
          ? judgmentComplete.count.toString()
          : '0';

        const paymentComplete = list.find((f) => f.status === '지급완료');
        this.statusList.paymentComplete = paymentComplete
          ? paymentComplete.count.toString()
          : '0';
      }
    },

    async searchButtonClick() {
      const totalCount = await this.SearchHoleInOne();

      this.pagination.page = 1;
      this.pagination.pages = Math.floor((totalCount - 1) / 10) + 1;
    },

    typeChangeButtonClick() {
      if (this.selected[0]) {
        const selectedReword = this.selected[0];

        this.$refs.TypeChangeModal.id = selectedReword.id;
        this.$refs.TypeChangeModal.status = selectedReword.status;
        this.$refs.TypeChangeModal.name = selectedReword.name;
        this.$refs.TypeChangeModal.hole_in_one_membership_id =
          selectedReword.hole_in_one_membership_id;
        this.$refs.TypeChangeModal.type = selectedReword.type;

        this.$refs.TypeChangeModal.dialog = true;
      } else {
        alert('상금신청을 선택하세요');
      }
    },

    managerConfirmClick(id) {
      this.$refs.ManagerConfirm.id = id;
      this.$refs.ManagerConfirm.dialog = true;
    },

    managerRejectClick(id) {
      this.$refs.ManagerReject.id = id;
      this.$refs.ManagerReject.dialog = true;
    },

    judgmentConfirmClick(id, status) {
      this.$refs.JudgmentConfirm.id = id;
      this.$refs.JudgmentConfirm.status = status;
      this.$refs.JudgmentConfirm.dialog = true;
    },

    judgmentRejectClick(id) {
      this.$refs.ManagerReject.id = id;
      this.$refs.ManagerReject.url = 'holeinone/judgment/reject';
      this.$refs.ManagerReject.dialog = true;
    },

    async paymentCompleteClick(id) {
      try {
        const result = window.confirm('지급완료상태로 저장하시겠습니까?');

        if (result) {
          const body = { id };

          const response = await this.$axios.post(
            `${this.hostname}/holeinone/payment/complete`,
            body
          );
          const { isSuccess, message } = response.data;
          alert(message);
          if (!isSuccess) return;

          this.SearchHoleInOne();
        }
      } catch {
        alert('지급완료에 실패하였습니다.');
      }
    },

    showImageViewer(id) {
      const reward = this.rewardData.find((f) => f.id === id);

      this.$refs.ImageViewer.imageLinks = [
        reward.certificate_image_path,
        reward.certifying_shot_image_path,
      ];
      this.$refs.ImageViewer.dialog = true;
    },

    showAddedImageViewer(id) {
      const reward = this.rewardData.find((f) => f.id === id);
      const imageLinks = [];
      if (reward.idcard_image_path) {
        imageLinks.push(reward.idcard_image_path);
      }
      if (reward.bankbook_image_path) {
        imageLinks.push(reward.bankbook_image_path);
      }
      if (reward.scorecard_image_path) {
        imageLinks.push(reward.scorecard_image_path);
      }

      this.$refs.ImageViewer.imageLinks = imageLinks;
      this.$refs.ImageViewer.dialog = true;
    },

    nextPage() {
      this.SearchHoleInOne();
    },

    getTimeTaken(tee_off_date, register_date) {
      if (
        !tee_off_date ||
        !register_date ||
        tee_off_date === '0000-00-00 00:00:00'
      )
        return '';

      const diff = moment(tee_off_date).diff(moment(register_date));
      const diffDays = moment.duration(diff).asDays();
      const diffHours = moment.duration(diff).asHours();

      const days = Math.floor(diffDays);
      const hours = Math.floor(diffHours) - days * 24;

      return `${days}일 ${hours}시간`;
    },

    getGolfField(golf_field, golf_hole) {
      if (!golf_field) return '';

      return golf_field + '/' + golf_hole;
    },

    getManagerConfirmText(id) {
      const reward = this.rewardData.find((f) => f.id === id);
      const confirmLog = reward.logs.find((f) => f.status === '심사중');
      if (confirmLog) {
        return `확인(${moment(confirmLog.created_at).format('YY/MM/DD')})`;
      }
      const rejectLog = reward.logs.find((f) => f.status === '요청거절');
      if (rejectLog) {
        return `거절(${moment(rejectLog.created_at).format('YY/MM/DD')})`;
      }
      return '';
    },

    getJudgmentResultText(id) {
      const reward = this.rewardData.find((f) => f.id === id);
      const confirmLog = reward.logs.find((f) => f.status === '심사완료');
      if (confirmLog) {
        return `확인(${moment(confirmLog.created_at).format('YY/MM/DD')})`;
      }
      const rejectLog = reward.logs.find((f) => f.status === '심사거절');
      if (rejectLog) {
        return `거절(${moment(rejectLog.created_at).format('YY/MM/DD')})`;
      }
      return '';
    },

    getBooleanText(number) {
      if (number == null) return '';

      return number && number === 1 ? '예' : '아니요';
    },

    showJudgmentRejectReason(id) {
      const reward = this.rewardData.find((f) => f.id === id);
      const rejectLog = reward.logs.find((f) => f.status === '심사거절');
      if (rejectLog) {
        alert(rejectLog.description);
      }
    },

    formatDate(value) {
      const formatDate = moment(value).format('YYYY-MM-DD HH:mm:ss');
      if (!formatDate || formatDate === 'Invalid date') return '';
      return formatDate;
    },

    formatOnlyDate(value) {
      const formatDate = moment(value).format('YYYY/MM/DD');
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
