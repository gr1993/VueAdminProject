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
                              v-model="email"
                              @keyup.enter="onSubmit"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="lock"
                              name="password"
                              label="Password"
                              type="password"
                              v-model="password"
                              @keyup.enter="onSubmit"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                          color="primary" 
                          @click="onSubmit"
                        >Login</v-btn>
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
      password: '',
    }
  },
  methods: {
    onSubmit () {
      if(!this.email || !this.password) {
        alert('이메일 또는 패스워드를 입력하세요');
      }

      this.login(this.email, this.password);
    },
    login(email, password) {
      this.$store
        .dispatch("user/LOGIN", { email, password })
        .then(() => this.redirect())
        .catch(({ message }) => ( alert(message) ))
    },
    redirect() {
      const { search } = window.location
      const tokens = search.replace(/^\?/, "").split("&")
      const { returnPath } = tokens.reduce((qs, tkn) => {
        const pair = tkn.split("=")
        qs[pair[0]] = decodeURIComponent(pair[1])
        return qs
      }, {})

      // 리다이렉트 처리
      this.$router.push(returnPath);
    }
	}
}
</script>
