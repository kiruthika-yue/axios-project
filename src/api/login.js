// 对于用户操作的接口管理
import axios from "@/axios";

export default {
  selfDefinedStyle() {
    return axios.get("/api/login/userdefinedStyle.json");
  },
  login() {
    return axios.get("/api/source/login");
  },
  loginFinish(id,params) {
    return axios.post(`/api/source/${id}/finish`, params);
  },
  globalConfig() {
    return axios.get("/api/global_config.json");
  },
  
};
