<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">담당자 확인</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="구장" v-model="golf_field"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="홀" v-model="golf_hole"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="매장(스크린)"
                  v-model="golf_screen"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="지역" v-model="golf_area"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="골프존 ID"
                  v-model="golfzone_id"
                ></v-text-field>
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

    id: '',
    golf_field: '',
    golf_hole: '',
    golf_screen: '',
    golf_area: '',
    golfzone_id: '',
  }),
  methods: {
    clearModal() {
      this.dialog = false;

      this.id = '';
      this.golf_field = '';
      this.golf_hole = '';
      this.golf_screen = '';
      this.golf_area = '';
      this.golfzone_id = '';
    },

    async saveButtonClick() {
      try {
        const body = {
          id: this.id,
          golf_field: this.golf_field,
          golf_hole: this.golf_hole,
          golf_screen: this.golf_screen,
          golf_area: this.golf_area,
          golfzone_id: this.golfzone_id,
        };

        const response = await this.$axios.post(
          `${this.hostname}/holeinone/manager/confirm`,
          body
        );
        const { isSuccess, message } = response.data;
        alert(message);
        if (!isSuccess) return;

        this.clearModal();
        this.$emit('SearchHoleInOne');
      } catch {
        alert('담당자 확인에 실패하였습니다.');
      }
    },

    closeButtonClick() {
      this.clearModal();
    },
  },
};
</script>
