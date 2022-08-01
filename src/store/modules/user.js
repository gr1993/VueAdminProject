import axios from 'axios';

const { hostname } = localStorage;

const enhanceAccessToken = () => {
  const { accessToken } = localStorage;
  if (!accessToken) return;
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

const userStore = {
  namespaced: true,
  state: {
    email: null,
    accessToken: null,
  },
  getters: {},
  mutations: {
    LOGIN: function (state, { accessToken, email }) {
      state.email = email;
      state.accessToken = accessToken;

      // 토큰을 로컬 스토리지에 저장
      localStorage.accessToken = accessToken;
    },
    LOGOUT(state) {
      state.accessToken = null;
    },
  },
  actions: {
    LOGIN: async function ({ commit }, { email, password }) {
      const { data } = await axios.post(`${hostname}/users/login`, {
        email,
        password,
      });

      if (data.isSuccess) {
        commit('LOGIN', {
          ...data.data,
          email,
        });

        enhanceAccessToken();
      } else {
        throw Error(data.message);
      }
    },
    LOGOUT({ commit }) {
      commit('LOGOUT');
    },
  },
};

export default userStore;
