<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    item-key="name"
    class="elevation-1 pa-6"
  >
    <template v-slot:top>
      <!-- v-container, v-col and v-row are just for decoration purposes. -->
      <v-container fluid>
        <v-row class="searchRow">
          <v-col cols="5">
            <v-row class="pa-6">
              <!-- Filter for dessert name-->
              <v-text-field
                v-model="dessertFilterValue"
                type="text"
                label="Name"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col cols="5">
            <v-row class="pa-6">
              <!-- Filter for calories -->
              <v-select
                :items="caloriesList"
                v-model="caloriesFilterValue"
                label="Calories"
              ></v-select>
            </v-row>
          </v-col>

          <v-col cols="2" class="centered">
            <v-btn color="secondary" class="searchButton" @click="onSubmit">
              검색
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10"> </v-col>
          <v-col cols="2">
            <v-row>
              <v-col cols="6"> </v-col>
              <v-col cols="6">
                <v-btn color="green" @click="onSubmit"> 수정 </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-data-table>
</template>

<script>
import tableData from './sampleDataTable';

export default {
  name: 'UserView',
  data() {
    return {
      caloriesList: [
        { text: 'All', value: null },
        { text: 'Only 237', value: 237 },
        { text: 'Only 305', value: 305 },
      ],

      dessertFilterValue: '',
      caloriesFilterValue: null,

      desserts: tableData.data,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name',
          //filter: this.nameFilter,
        },
        {
          text: 'Calories',
          value: 'calories',
          //filter: this.caloriesFilter,
        },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ];
    },
  },
  methods: {
    nameFilter(value) {
      if (!this.dessertFilterValue) {
        return true;
      }

      return value
        .toLowerCase()
        .includes(this.dessertFilterValue.toLowerCase());
    },

    caloriesFilter(value) {
      if (!this.caloriesFilterValue) {
        return true;
      }

      return value === this.caloriesFilterValue;
    },

    onSubmit() {
      alert(this.dessertFilterValue);
      alert(this.caloriesFilterValue);
    },
  },
};
</script>

<style>
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
