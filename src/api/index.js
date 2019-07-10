import axios from 'axios';
import Vue from 'vue'
//api接口
export default {
  selectCate(params) {
    return fetchApi('/cate/selectCate', 'get', params)
  },
  selectIndustry(params) {
    return fetchApi('/Industry/selectIndustry', 'get', params)
  },
  //获取用户在平台信息
  getInfo() {
    return fetchApi("/user/personal/getInfo", 'get')
  },
  //获取用户在平台信息
  login(params) {
    return fetchApi("/user/login", 'post', params)
  },
  register(params) {
    return fetchApi("/user/register", 'post', params)
  }
}

/***
 * 请求拦截器，将其转化为表单形式提交
 */
axios.interceptors.request.use(config => {
  Vue.$vux.loading.show({
    text: 'Loading'
  })
  config.headers['Content-Type'] = 'application/json';
  return config
}, err => {
  return Promise.reject(err)
});
/** 
 * 响应拦截器
*/
axios.interceptors.response.use(response => {
  Vue.$vux.loading.hide()
  switch (response.status) {
    case 200:
      return response.data
  }

}, err => {
  var config = err.config;
  if (!config || !config.retry) return Promise.reject(err);
  config.__retryCount = config.__retryCount || 0;
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }
  config.__retryCount += 1;
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });
  return backoff.then(function () {
    return axios(config);
  });
});
// axios.defaults.timeout = 5000; //请求超时时间
// axios.defaults.retry = 2;       //请求超时重新请求次数
// axios.defaults.retryDelay = 5000;//重新请求时间间隔
function fetchApi(path, method, params = {}) {
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  params.mini = "1"
  params.token = userInfo ? userInfo.token : '01a4a29459b9ac605bc5f827a60469a6'
  let data = method === 'get' ? { params: { param: params } } : { param: params }
  return axios[method](`/api${path}`, data)
}
