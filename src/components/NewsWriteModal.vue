<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">뉴스기사 수정</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-textarea
                  label="제목"
                  :value="email"
                  :rows="2"
                  :no-resize="true"
                  outlined
                >
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="부제목"
                  :value="email"
                  :rows="2"
                  :no-resize="true"
                  outlined
                >
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="출처"
                  :value="email"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="기사" :value="email" :rows="5" outlined>
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="image"
                  label="이미지"
                  prepend-icon="mdi-camera"
                >
                </v-file-input>
                <v-img :src="url"></v-img>
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
  props: ['email'],
  data: () => ({
    password: '',
    is_admin: null,
    dialog: true,

    url: null,
    image: null,
  }),
  methods: {
    clearModal() {
      this.password = '';
      this.is_admin = null;
      this.dialog = false;
    },

    async saveButtonClick() {
      try {
        const response = await this.$axios.post(
          `${this.hostname}/users/modify`,
          {
            email: this.email,
            password: this.password,
            is_admin: this.is_admin,
          }
        );
        const { isSuccess, message } = response.data;
        alert(message);
        if (!isSuccess) return;

        this.clearModal();
        this.$emit('searchUsers');
      } catch {
        alert('사용자 수정에 실패하였습니다.');
      }
    },

    closeButtonClick() {
      this.clearModal();
    },
  },
};
</script>
