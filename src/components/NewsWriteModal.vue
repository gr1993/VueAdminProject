<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">사용자 수정</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="이메일"
                  :value="email"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="패스워드"
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="is_admin"
                  :items="['Y', 'N']"
                  label="관리자 여부"
                  required
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
  props: ['email'],
  data: () => ({
    password: '',
    is_admin: null,
    dialog: false,
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
