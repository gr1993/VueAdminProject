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
                  v-model="images"
                  label="이미지"
                  prepend-icon="mdi-camera"
                  :multiple="true"
                  @change="fileInputChange"
                >
                </v-file-input>
                <div>
                  <div
                    v-for="(previewImage, i) in previewFiles"
                    :key="i"
                    class="imageSize imageAtag"
                  >
                    <v-img :src="previewImage.url" class="imageSize"></v-img>
                  </div>
                </div>
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
    dialog: false,

    id: null,
    title: '',
    sub_title: '',
    writter: '',
    content: '',

    previewFiles: [],
    images: [],
    isChangeImage: '',
  }),
  methods: {
    clearModal() {
      this.dialog = false;

      this.id = null;
      this.title = '';
      this.sub_title = '';
      this.writter = '';
      this.content = '';

      this.previewFiles = [];
      this.images = [];
      this.isChangeImage = '';
    },

    async getNewsDetail(id) {
      try {
        this.id = id;

        const response = await this.$axios.get(
          `${this.hostname}/news/detail?id=${id}`
        );
        const { isSuccess, message, data } = response.data;
        if (!isSuccess) {
          alert(message);
          return;
        }

        const { news } = data;

        this.title = news.title;
        this.sub_title = news.sub_title;
        this.writter = news.writter;
        this.content = news.content;
      } catch {
        alert('뉴스기사 정보 불러오기 실패');
      }
    },

    async saveButtonClick() {
      try {
        const formData = new FormData();
        formData.append('id', this.id);
        formData.append('title', this.title);
        formData.append('sub_title', this.sub_title);
        formData.append('writter', this.writter);
        formData.append('content', this.content);
        formData.append('isChangeImage', this.isChangeImage);

        if (this.images) {
          for (let i = 0; i < this.images.length; i++) {
            formData.append('images', this.images[i]);
          }
        }

        const response = await this.$axios.post(
          `${this.hostname}/news/modify`,
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
        alert('뉴스기사 수정에 실패하였습니다.');
      }
    },

    fileInputChange() {
      this.isChangeImage = 'Y';

      const images = this.images;
      if (images) {
        this.previewFiles = [];

        images.forEach((img) => {
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const file = {
              url: e.target.result,
              name: img.name,
              size: img.size,
            };
            this.previewFiles.push(file);
          };
          fileReader.readAsDataURL(img);
        });
      }
    },

    closeButtonClick() {
      this.clearModal();
    },
  },
};
</script>
