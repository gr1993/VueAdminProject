<template>
  <v-container
    fluid
  >
		<v-navigation-drawer v-model="drawer" app>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="text-h6">
						Application
					</v-list-item-title>
					<v-list-item-subtitle>
						subtext
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>

			<v-divider></v-divider>

			<v-list
				dense
				nav
			>
				<v-list-item
					v-for="item in items"
					:key="item.title"
					link
					:to="item.to"
				>
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-main>
			<v-container
				fluid
			>
				<router-view/>
			</v-container>
		</v-main>
  </v-container>
</template>

<script> 
export default {
  name: 'MainView',
  components: {
  },
  data () {
    return {
      drawer:true,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Photos', icon: 'mdi-image', to: '/admin/view' },
      ],
      right: null,
    }
  },
}
</script>
