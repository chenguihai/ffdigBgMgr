import axios from "axios";
// import { createBrowserHistory } from 'history';
const appid = "q5HRLsW98Fem9zhjBkQnurVR";
const appsecrect = "Yg2AF3XwqcnoQ1LPnV8gD27n";

const instance = axios.create({
    baseURL: "http://localhost:5500",
    timeout: 1000,
    headers: {
        "X-Custom-Header": "foobar",
        "t-app-id": appid,
        "t-app-secret": appsecrect
    }
});

//拦截器
// Add a request interceptor
instance.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        const xToken = localStorage.getItem("x-token");
        if (xToken) {
            config.headers["Authorization"] = `Bearer ${xToken}`;
        }
        return config;
    },
    function(error) {
        // Do something with request error
        // console.log(error);

        return Promise.reject(error);
    }
);



// Add a response interceptor
instance.interceptors.response.use(
    function(response) {
        // Do something with response data
        if(response.headers["x-token"]){
            localStorage.setItem("x-token",response.headers["x-token"])
        }
        return response;
    },
    function(error) {

        //在这里写首页拦截器（如果没有登录 跳转登录页）也可以
        // Do something with response error
        // if(error.response.status === 401){
        //   console.log("重定向")
        //   // Get the current location.
        // const history = createBrowserHistory();
        // const location = history.location;
        // console.log(location)
        // // Listen for changes to the current location.
        // const unlisten = history.listen((location, action) => {
        //   // location is an object like window.location
        //   console.log(action, location.pathname, location.state);
        // });

        // // Use push, replace, and go to navigate around.
        // history.push('/login', { some: 'state' });

        // // To stop listening, call the function returned from listen().
        // unlisten();
        // }
        return Promise.reject(error);
    }
);

export default instance;