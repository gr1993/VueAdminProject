<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">뉴스기사 추가</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-textarea
                  v-model="title"
                  label="제목"
                  :rows="2"
                  :no-resize="true"
                  outlined
                >
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="sub_title"
                  label="부제목"
                  :rows="2"
                  :no-resize="true"
                  outlined
                >
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="writter"
                  label="출처"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="content" label="기사" :rows="10" outlined>
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
            추가
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

    title: '',
    sub_title: '',
    writter: '',
    content: '',

    url: null,
    image: null,
  }),
  methods: {
    clearModal() {
      this.dialog = false;

      this.title = '';
      this.sub_title = '';
      this.writter = '';
      this.content = '';

      this.url = null;
      this.image = null;
    },

    async saveButtonClick() {
      try {
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('sub_title', this.sub_title);
        formData.append('writter', this.writter);
        formData.append('content', this.content);
        formData.append('image', this.image);

        const response = await this.$axios.post(
          `${this.hostname}/news/add`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const { isSuccess, message } = response.data;
        alert(message);
        if (!isSuccess) return;

        this.clearModal();
        this.$emit('SearchNews');
      } catch {
        alert('뉴스기사 추가에 실패하였습니다.');
      }
    },

    closeButtonClick() {
      this.clearModal();
    },
  },
};
</script>
