import React from 'react'
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import {message} from 'antd'
import App from './App'
import ClassifyManage from './pages/classifyManage'
import GoodsDataManage from './pages/GoodsDataManage/index.jsx'
import FrontClassify from './pages/frontClassify/index'
import PlatformManage from './pages/platformManage/index'
import HomeManage from './pages/homeManage/index'
import Version from './pages/homeManage/version'
import ViewProduct from './pages/homeManage/viewProduct'
import ViewColumn from './pages/homeManage/viewColumn'
import AddProduct from './pages/homeManage/add'
import EditProduct from './pages/homeManage/edit'

import ArticleManage from './pages/articleManage'
import AddArticle from './pages/articleManage/addArticle'
import {http} from "./utils/ajax";

import Login from './pages/login'

message.config({
    top: 10,
    duration: 5,
    maxCount: 1,
});
export default class ERouter extends React.Component {
// <Common></Common>

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/login" component={Login}/>
                    {/*<Route path="/homepage" render={() =>*/}
                    {/*<Route path="/homepage/fbAdverts" component={OrderDetail} />*/}
                    {/*}*/}
                    {/*/>*/}
                    <Route path="/" render={() => {
                        http.defaults.headers = {
                            "Authorization": "bearer " + window.sessionStorage.getItem("authorization") || "",
                            "Content-Type": 'application/json'
                        }
                        http.defaults.retry = 3;
                        http.defaults.retryDelay = 200;
                        return (
                            <App>
                                <Switch>
                                    <Route path="/productManage/classifyManage" component={ClassifyManage}/>
                                    <Route path="/productManage/goodsDataManage" component={GoodsDataManage}/>
                                    {/*<Redirect to="/productManage/classifyManage" />*/}


                                    <Route path="/ffManage/classifyManage" component={FrontClassify}/>
                                    <Route path="/ffManage/platformManage" component={PlatformManage}/>
                                    <Route path="/columnArticle/articleManage" component={ArticleManage}/>
                                    <Route path="/columnArticle/:addArticle" component={AddArticle}/>
                                    <Route path="/ffManage/homeManage" render={(props) => {
                                        return <HomeManage {...props}/>
                                    }}/>
                                    <Route path="/ffManage/homeManageVersion" render={(props) => {
                                        return <Version {...props}/>
                                    }}/>

                                    <Route path="/ffManage/homeManageViewProduct" render={(props) => {
                                        return <ViewProduct {...props}/>
                                    }}/>
                                    <Route path="/ffManage/homeManageAdd" render={(props) => {
                                        return <AddProduct {...props}/>
                                    }}/>

                                    <Route path="/ffManage/homeManageEdit" render={(props) => {
                                        return <EditProduct {...props}/>
                                    }}/>
                                    <Route path="/ffManage/homeManageViewCol" render={(props) => {
                                        return <ViewColumn {...props}/>
                                    }}/>
                                    <Redirect to="/login"/>
                                    {/* <Route component={NoMatch} /> */}
                                </Switch>
                            </App>
                        )
                    }

                    }/>
                </Switch>
            </HashRouter>
        );
    }
}