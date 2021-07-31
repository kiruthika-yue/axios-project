import Vue from "vue";
import Vuex from "vuex";
import { getUserCookie, setCookie } from "@/utils/userCookie";
import api from "@/api/login";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 用户信息
    user: getUserCookie(),
    initialized: false,
    config: null,
    token: null,
    identity: null
  },
  mutations: {
    update_config(state, config) {
      state.initialized = true;
      state.config = config;

      if (config.identity && config.auth_token) {
        this.commit("auth_success", {
          token: config.auth_token,
          identity: config.identity
        });
      }
    },
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, { auth_token, identity }) {
      state.status = "success";
      state.token = auth_token;
      state.identity = identity;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.identity = "";
    },
    setUserInfo(state, userInfo) {
      state.user = userInfo;
    }
  },
  actions: {
    async initialize({ commit }) {
      let res = await api.globalConfig();
      if (res.status === "success") {
        window.$config = res.data;
        commit("update_config", res.data);
      }
    },
    setUserInfo({ commit }, userInfo) {
      commit("setUserInfo", userInfo);
      setCookie(userInfo);
    }
  },
  modules: {}
});
