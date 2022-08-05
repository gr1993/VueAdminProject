<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h3 class="blue-color">code_type이 00이면 메인코드로 등록됩니다.</h3>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto contentHeight" max-width="500">
          <v-list class="contentHeight">
            <v-list-item-group
              v-model="selectedMainIndex"
              @change="changeMainCodeList"
            >
              <v-list-item v-for="(item, i) in mainCodes" :key="i">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.title + '(' + item.code + ')'"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto contentHeight" max-width="500">
          <v-list class="contentHeight">
            <v-list-item-group
              v-model="selectedSubIndex"
              @change="changeSubCodeList"
            >
              <v-list-item v-for="(item, i) in subCodes" :key="i">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.title + '(' + item.code + ')'"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="contentHeight" width="100%" align="right">
          <v-col cols="12">
            <v-text-field
              v-model="formDate.code_type"
              type="text"
              label="코드타입"
            ></v-text-field>
            <v-text-field
              v-model="formDate.code"
              type="text"
              label="코드"
            ></v-text-field>
            <v-text-field
              v-model="formDate.title"
              type="text"
              label="타이틀"
            ></v-text-field>
            <v-textarea v-model="formDate.value" label="값" :rows="5">
            </v-textarea>
            <v-text-field
              v-model="formDate.description"
              type="text"
              label="설명"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="blue"
              style="margin-right: 10px"
              @click="addButtonClick"
            >
              등록
            </v-btn>
            <v-btn
              color="green"
              style="margin-right: 10px"
              @click="writeButtonClick"
            >
              수정
            </v-btn>
            <v-btn color="red" @click="deleteButtonClick"> 삭제 </v-btn>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CodeView',
  data() {
    return {
      selectedMainIndex: 0,
      mainCodes: [],
      selectedSubIndex: 0,
      subCodes: [],

      formDate: {
        code_type: '',
        code: '',
        title: '',
        value: '',
        description: '',
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getMainCodes();
      await this.getSubCodes();
    },

    async getMainCodes() {
      try {
        const response = await this.$axios.get(`${this.hostname}/code/main`);
        const { isSuccess, data, message } = response.data;

        if (!isSuccess) {
          alert(message);
        }

        this.mainCodes = data.mainCodes;
      } catch (error) {
        alert('메인코드 검색에 실패하였습니다.');
      }
    },

    async getSubCodes() {
      try {
        const code_type = this.mainCodes[this.selectedMainIndex].code;
        if (!code_type) {
          alert('메인 코드를 선택하세요');
        }

        const response = await this.$axios.get(
          `${this.hostname}/code/sub/${code_type}`
        );
        const { isSuccess, data, message } = response.data;

        if (!isSuccess) {
          alert(message);
        }

        this.subCodes = data.subCodes;
      } catch (error) {
        alert('서브코드 검색에 실패하였습니다.');
      }
    },

    async addButtonClick() {
      const code_type = this.formDate.code_type;
      const code = this.formDate.code;
      const title = this.formDate.title;
      const value = this.formDate.value;
      const description = this.formDate.description;

      try {
        const response = await this.$axios.post(`${this.hostname}/code/sub`, {
          code_type,
          code,
          title,
          value,
          description,
        });
        const { message } = response.data;
        alert(message);

        this.init();
      } catch (error) {
        alert('코드 추가에 실패하였습니다.');
      }
    },

    async writeButtonClick() {
      const code_type = this.formDate.code_type;
      const code = this.formDate.code;
      const title = this.formDate.title;
      const value = this.formDate.value;
      const description = this.formDate.description;

      try {
        const response = await this.$axios.post(
          `${this.hostname}/code/modify`,
          {
            code_type,
            code,
            title,
            value,
            description,
          }
        );
        const { message } = response.data;
        alert(message);

        this.init();
      } catch (error) {
        alert('코드 수정에 실패하였습니다.');
      }
    },

    async deleteButtonClick() {
      const code_type = this.formDate.code_type;
      const code = this.formDate.code;

      try {
        const response = await this.$axios.post(
          `${this.hostname}/code/delete/${code_type}/${code}`
        );
        const { message } = response.data;
        alert(message);

        this.init();
      } catch (error) {
        alert('코드 삭제에 실패하였습니다.');
      }
    },

    changeMainCodeList() {
      if (typeof this.selectedMainIndex !== 'undefined') {
        this.getSubCodes();
      }
    },

    changeSubCodeList() {
      const code = this.subCodes[this.selectedSubIndex];
      if (!code) {
        alert('코드를 선택하세요');
      }

      this.formDate.code_type = code.code_type;
      this.formDate.code = code.code;
      this.formDate.title = code.title;
      this.formDate.value = code.value;
      this.formDate.description = code.description;
    },
  },
};
</script>

<style scoped>
.v-list {
  overflow-y: auto;
}
.contentHeight {
  height: 700px;
}
.blue-color {
  color: blue;
}
</style>
