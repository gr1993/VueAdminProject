<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    item-key="name"
    class="elevation-1 pa-6"
    :footer-props="{
      'items-per-page-options':[10],
      'disable-items-per-page': true,
    }"
  >
    <template v-slot:[`item.certificate_image_path`]="{ item }">
      <div class="p-2">
        <a :href="item.certificate_image_path" target="_blank">
          <v-img 
            :src="item.certificate_image_path"
            width="150px"
            height="150px"
          >
          </v-img>
        </a>
      </div>
    </template>
    <template v-slot:[`item.certifying_shot_image_path`]="{ item }">
      <div class="p-2">
        <a :href="item.certifying_shot_image_path" target="_blank">
          <v-img 
            :src="item.certifying_shot_image_path"
            width="150px"
            height="150px"
          >
          </v-img>
        </a>
      </div>
    </template>

    <template v-slot:top>
      <!-- v-container, v-col and v-row are just for decoration purposes. -->
      <v-container fluid>
        <v-row class="searchRow">
          <v-col cols="3">
            <v-row class="pa-6">
              <!-- Filter for dessert name-->
              <v-text-field
                v-model="filters.dessertFilterValue"
                type="text"
                label="Name"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col cols="3">
            <v-row class="pa-6">
              <!-- Filter for calories -->
              <v-select
                :items="caloriesList"
                v-model="filters.caloriesFilterValue"
                label="Calories"
              ></v-select>
            </v-row>
          </v-col>

          <v-col cols="4">
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
                  v-model="dateRangeText"
                  label="Picker in menu"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dates"
                no-title
                scrollable
                range
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="menu = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="2" class="centered">
            <v-btn color="secondary" class="searchButton" @click="SearchHoleInOne">
              검색
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-data-table>
</template>

<script>
import tableData from './sampleDataTable2';

export default {
  name: 'HoleInOneReward',
  data() {
    return {
      menu: false,
      dates: ['2019-09-10', '2019-09-20'],
      caloriesList: [
        { text: 'All', value: null },
        { text: 'Only 237', value: 237 },
        { text: 'Only 305', value: 305 },
      ],
      filters: {
        dessertFilterValue: '',
        caloriesFilterValue: null,
        
      },
      desserts: tableData.data,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: '이름',
          width: 80,
          align: 'left',
          value: 'name'
        },
        { 
          text: '전화번호', 
          width: 130, 
          value: 'phone_number',
          align: 'center',
        },
        { text: '구분', width: 80, value: 'type' },
        { text: '홀인원 멤버쉽번호', width: 140, value: 'hole_in_one_membership_id' },
        { text: '생성일', width: 120, value: 'created_at' },
        { text: '등록일', width: 120, value: 'register_date' },
        { text: '타석일', width: 120, value: 'tee_off_date' },
        { 
          text: '증명서 이미지', 
          width: 150, 
          value: 'certificate_image_path',
          align: 'center',
        },
        { 
          text: '증명샷 이미지', 
          width: 150, 
          value: 'certifying_shot_image_path',
          align: 'center'
        },
      ];
    },
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  methods: {
    SearchHoleInOne() {
      alert(this.dessertFilterValue);
      alert(this.caloriesFilterValue);
    },
  },
};
</script>

<style>
.v-data-table > .v-data-table__wrapper > table {
    border-spacing: 0 0.5rem;
}
.centered {
  text-align: center;
  padding-top: 35px;
}
.searchRow {
  height: 85px;
}
.searchButton {
  width: 100px;
  height: 60px;
}
</style>
