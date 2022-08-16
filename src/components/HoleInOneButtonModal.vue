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
  }),
  methods: {
    clearModal() {
      this.dialog = false;

      this.id = '';
      this.status = '';
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
        const result = window.confirm('심사완료상태로 저장하시겠습니까?');

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
