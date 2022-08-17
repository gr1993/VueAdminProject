<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">구분 변경</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="상태"
                  :value="status"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="이름"
                  :value="name"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="홀인원 멤버쉽번호"
                  :value="hole_in_one_membership_id"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="type"
                  :items="['field', 'screen']"
                  label="구분"
                ></v-select>
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
            수정
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    id: '',
    status: '',
    name: '',
    hole_in_one_membership_id: '',
    type: '',

    dialog: false,
  }),
  methods: {
    clearModal() {
      this.id = '';
      this.status = '';
      this.name = '';
      this.hole_in_one_membership_id = '';
      this.type = '';

      this.dialog = false;
    },

    async saveButtonClick() {
      try {
        if (!this.id) {
          alert('상금신청을 선택하세요');
          return;
        }
        if (!this.type) {
          alert('구분을 선택하세요');
          return;
        }

        const body = {
          id: this.id,
          type: this.type,
        };

        const response = await this.$axios.post(
          `${this.hostname}/holeinone/type/modify`,
          body
        );
        const { isSuccess, message } = response.data;
        alert(message);
        if (!isSuccess) return;

        this.clearModal();
        this.$emit('SearchHoleInOne');
      } catch {
        alert('구분 변경에 실패하였습니다.');
      }
    },

    closeButtonClick() {
      this.clearModal();
    },
  },
};
</script>
