<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="300px">
      <v-card>
        <v-card-title>
          <span class="text-h5">심사결과</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-btn
                  v-if="status === '심사중'"
                  color="primary"
                  width="60"
                  @click="
                    updateStatusClick('담당자 확인하시겠습니까?', '심사중1')
                  "
                  >담당자</v-btn
                >
                <v-btn
                  v-if="status !== '심사중'"
                  color="primary"
                  width="60"
                  disabled
                  >담당자</v-btn
                >
              </v-col>
              <v-col cols="4">
                <v-btn
                  v-if="status === '심사중1'"
                  color="primary"
                  width="60"
                  @click="
                    updateStatusClick('임원 확인하시겠습니까?', '심사중2')
                  "
                  >임원</v-btn
                >
                <v-btn
                  v-if="status !== '심사중1'"
                  color="primary"
                  width="60"
                  disabled
                  >임원</v-btn
                >
              </v-col>
              <v-col cols="4">
                <v-btn
                  v-if="status === '심사중2'"
                  color="primary"
                  width="60"
                  @click="
                    updateStatusClick('담당자 확인하시겠습니까?', '심사중3')
                  "
                  >담당자</v-btn
                >
                <v-btn
                  v-if="status !== '심사중2'"
                  color="primary"
                  width="60"
                  disabled
                  >담당자</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="status === '심사중3'">
              <v-col cols="12">
                <v-text-field
                  v-model="holeinone_count"
                  label="홀인원 횟수"
                  type="number"
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="same_store_count"
                  label="동일매장 이용"
                  type="number"
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="holeinone_per_month"
                  label="한달 내 홀인원"
                  type="number"
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <span>동반자 여부</span>
                <v-radio-group v-model="is_companion" row>
                  <v-radio label="있음" value="1"></v-radio>
                  <v-radio label="없음" value="0"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <span>탈퇴 여부</span>
                <v-radio-group v-model="is_holeinone_withdraw" row>
                  <v-radio label="유지" value="0"></v-radio>
                  <v-radio label="탈퇴" value="1"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeButtonClick">
            닫기
          </v-btn>
          <v-btn
            v-if="status === '심사중3'"
            color="blue darken-1"
            text
            @click="saveButtonClick"
          >
            저장
          </v-btn>
          <v-btn
            v-if="status !== '심사중3'"
            color="blue darken-1"
            text
            disabled
          >
            저장
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,

    id: '',
    status: '',

    is_holeinone_withdraw: '0',
    holeinone_count: '',
    same_store_count: '',
    holeinone_per_month: '',
    is_companion: '1',
  }),
  methods: {
    clearModal() {
      this.dialog = false;

      this.id = '';
      this.status = '';

      this.is_holeinone_withdraw = '0';
      this.holeinone_count = '';
      this.same_store_count = '';
      this.holeinone_per_month = '';
      this.is_companion = '1';
    },

    async updateStatusClick(msgText, changeStatus) {
      try {
        const result = window.confirm(msgText);
        if (result) {
          const body = {
            id: this.id,
          };

          const response = await this.$axios.post(
            `${this.hostname}/holeinone/judgment/confirm`,
            body
          );
          const { isSuccess, message } = response.data;
          alert(message);
          if (!isSuccess) return;

          this.status = changeStatus;
          this.$emit('SearchHoleInOne');
        }
      } catch {
        alert('심사 확인에 실패하였습니다.');
      }
    },

    async saveButtonClick() {
      try {
        if (
          !this.is_holeinone_withdraw ||
          !this.holeinone_count ||
          !this.same_store_count ||
          !this.holeinone_per_month ||
          !this.is_companion
        ) {
          alert('모두 입력하세요.');
          return;
        }

        const result = window.confirm('심사완료상태로 저장하시겠습니까?');

        if (result) {
          const body = {
            id: this.id,

            is_holeinone_withdraw: this.is_holeinone_withdraw,
            holeinone_count: this.holeinone_count,
            same_store_count: this.same_store_count,
            holeinone_per_month: this.holeinone_per_month,
            is_companion: this.is_companion,
          };

          const response = await this.$axios.post(
            `${this.hostname}/holeinone/judgment/confirm`,
            body
          );
          const { isSuccess, message } = response.data;
          alert(message);
          if (!isSuccess) return;

          this.clearModal();
          this.$emit('SearchHoleInOne');
        }
      } catch {
        alert('심사 확인에 실패하였습니다.');
      }
    },

    closeButtonClick() {
      this.clearModal();
    },
  },
};
</script>
