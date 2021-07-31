import axios from 'axios';
// import store from './store';

const instance = axios.create({
  // baseURL: 'http://iam.richctrl.com',
});

instance.interceptors.request.use((config) => ({
  ...config,
  params: {
    ...config.params,
  },
}), (err) => Promise.reject(err));

instance.interceptors.response.use((res) => res.data, (err) => Promise.reject(err));

export default instance;
