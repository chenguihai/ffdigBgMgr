import React from 'react'
import {Form, Input, Button, message} from 'antd'
import {withRouter} from 'react-router-dom'
import axiosHttp from "../../utils/ajax";
import './index.less'

const FormItem = Form.Item;

class Login extends React.Component {
    render() {
        return (
            <div className="login-page">
                <div className="login-content-wrap">
                    <div className="login-content">
                        <div className="word"/>
                        <div className="login-box">
                            {/*<div className="error-msg-wrap">*/}
                            {/*<div*/}
                            {/*className={this.state.errorMsg ? "show" : ""}>*/}
                            {/*{this.state.errorMsg}*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            <div className="title">ffdig火联管理平台</div>
                            <LoginForm/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;

class LoginForm extends React.Component {
    state = {
        loading: false
    };
    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values);
                Object.keys(values).map(key => values[key] = (values[key] && values[key].trim()));
                this.userLoginHttp(values);
            }
        });
    };
    userLoginHttp = (values) => { //后台用户登录
        this.setState({
            loading: true
        });
        axiosHttp('api/AdminSite/LoginAdmin/UserLogin', {...values, "wb_verify_code": ""}).then((res) => {
            this.setState({
                loading: false
            });
            if (res.code === 200) {
                message.success(res.msg);
                const {token, nickName} = res.data;
                let session = window.sessionStorage;
                session.setItem('nickName', nickName);
                session.setItem('authorization', token);
                if (session.getItem('authorization')) {
                    this.props.history.push('/columnArticle/articleManage');
                }
            } else {
                message.error(res.msg)
            }
        })
    };
    checkUsername = (rule, value, callback) => {
        // var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        value = value.trim();
        if (!value) {
            callback('请输入邮箱!');
        }
        // else if (!reg.test(value)) {
        //     callback('邮箱只允许输入英文字母、数字、下划线、英文句号、中划线');
        // }
        else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        value = value.trim();
        if (!value) {
            callback('请输入密码!');
        } else {
            callback();
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loading} = this.state;
        return (
            <Form className="login-form" onSubmit={this._handleSubmit}>
                <FormItem>
                    {getFieldDecorator('user_name', {
                        initialValue: '',
                        rules: [{validator: this.checkUsername}]
                    })(
                        <Input placeholder="邮箱"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('pass_word', {
                        initialValue: '',
                        rules: [{validator: this.checkPassword}]
                    })(
                        // wrappedcomponentref={(inst) => this.pwd = inst}
                        <Input type="password" placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button loading={loading} type="primary" htmlType='submit' className="login-form-button">登录</Button>
                </FormItem>
            </Form>
        )
    }
}

LoginForm = Form.create({})(withRouter(LoginForm));
