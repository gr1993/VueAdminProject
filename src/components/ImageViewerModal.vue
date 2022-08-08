<template>
  <v-row>
    <v-dialog v-model="dialog" persistent width="unset" max-width="560">
      <v-card>
        <v-card-title>
          <span class="text-h5">서류</span>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <a
                v-for="(imageLink, i) in imageLinks"
                :key="i"
                :href="imageLink"
                target="_blank"
                class="imageSize imageAtag"
              >
                <v-img :src="imageLink" class="imageSize"> </v-img>
              </a>
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
    imageLinks: [],
    dialog: false,
  }),
  methods: {
    clearModal() {
      this.imageLinks = [];
      this.dialog = false;
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
