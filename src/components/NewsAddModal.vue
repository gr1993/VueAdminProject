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
              <v-col cols="12" sm="6" md="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="날짜"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="11" sm="5">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="time"
                      label="시간"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu2"
                    v-model="time"
                    full-width
                    @click:minute="$refs.menu2.save(time)"
                  ></v-time-picker>
                </v-menu>
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

    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    time: null,
    menu: false,
    menu2: false,

    title: '',
    sub_title: '',
    writter: '',
    content: '',

    previewFiles: [],
    images: [],
  }),
  methods: {
    clearModal() {
      this.dialog = false;

      this.title = '';
      this.sub_title = '';
      this.writter = '';
      this.content = '';

      this.previewFiles = [];
      this.images = [];
    },

    async saveButtonClick() {
      try {
        if (!this.time) {
          alert('시간을 선택하세요.');
          return;
        }
        const created_at = `${this.date} ${this.time}:00`;

        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('sub_title', this.sub_title);
        formData.append('writter', this.writter);
        formData.append('content', this.content);
        formData.append('created_at', created_at);

        if (this.images) {
          for (let i = 0; i < this.images.length; i++) {
            formData.append('images', this.images[i]);
          }
        }

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

    fileInputChange() {
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

<style scoped>
.imageAtag {
  float: left;
  margin: 10px;
}
.imageSize {
  width: 150px;
  height: 150px;
}
</style>
