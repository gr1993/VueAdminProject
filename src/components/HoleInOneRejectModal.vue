<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">담당자 거절</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="reject_reason"
                  label="거절 사유"
                  :rows="7"
                  outlined
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeButtonClick">
            닫기
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveButtonClick">
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

    url: '',
    reject_reason: '',
  }),
  methods: {
    clearModal() {
      this.dialog = false;

      this.url = '';
      this.reject_reason = '';
    },

    async saveButtonClick() {
      try {
        const body = {
          id: this.id,
          reject_reason: this.reject_reason,
        };

        const response = await this.$axios.post(
          this.url
            ? `${this.hostname}/${this.url}`
            : `${this.hostname}/holeinone/manager/reject`,
          body
        );
        const { isSuccess, message } = response.data;
        alert(message);
        if (!isSuccess) return;

        this.clearModal();
        this.$emit('SearchHoleInOne');
      } catch {
        alert('담당자 거절에 실패하였습니다.');
      }
    },

    closeButtonClick() {
      this.clearModal();
    },
  },
};
</script>
