// const dev_baseUrl = "http://10.28.1.188:56771/"; //本地环境
const dev_baseUrl = "http://10.28.1.101:56771/"; //测试环境
// const dev_baseUrl = "http://10.28.1.101:3002/"; //测试环境
// const dev_baseUrl = "http://ffdig-api.gw-ec.com/"; //正式环境


// const prod_baseUrl = "http://ffdig-api.gw-ec.com/"; //测试环境

// const prod_baseUrl = "http://10.28.1.101:56771/"; //测试环境
const prod_baseUrl = "http://api.ffdig.com/";//正式环境

const is_dev = process.env.NODE_ENV !== "production";
const baseUrl = is_dev ? dev_baseUrl : prod_baseUrl;
export default {
    baseUrl, is_dev
}
