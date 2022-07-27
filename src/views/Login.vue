<template>

  <v-container
    fluid
  >
    <div>
      <h2>Longest LogIn</h2>
      <form @submit="onSubmit">
        <input placeholder="Enter your email" v-model="email">
        <input placeholder="Enter your password" v-model="password">
        <button type="submit">Login</button>
      </form>
      <button @click="onSubmit">Test</button>
    </div>
  </v-container>
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
