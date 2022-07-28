<template>
   <v-app id="inspire">
      <v-content>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Longest Admin</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              prepend-icon="person"
                              name="Email"
                              label="Email"
                              type="text"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="lock"
                              name="password"
                              label="Password"
                              type="password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" to="/">Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-content>
   </v-app>
</template>


<script> 
export default {
  name: 'LoginView',
  components: {
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    onSubmit () {
      if(!this.email || !this.password) {
        alert('이메일 또는 패스워드를 입력하세요');
      }

      try {
        this.$axios.post(this.Domain + '/login', {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((ex) => {
          console.log('로그인 실패', ex);
        })
      } catch (error) {
        console.error(error);
      }
    }
	}
}
</script>
