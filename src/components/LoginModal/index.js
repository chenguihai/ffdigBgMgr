import React from 'react'
import {Link,withRouter} from 'react-router-dom'
import {Button, Form, Input, message, Modal} from "antd";
import axiosHttp from "../../utils/ajax";

const FormItem = Form.Item;

class LoginModal extends React.Component {
    state = {};

    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values);
                this.userLoginHttp(values);
            }
        });
    };


    userLoginHttp = (values) => { //后台用户登录
        axiosHttp('api/AdminSite/LoginAdmin/UserLogin', {...values, "wb_verify_code": ""}).then((res) => {
            if (res.code === 200) {
                const {token, nickName} = res.data;
                let session = window.sessionStorage;
                session.setItem('nickName', nickName);
                session.setItem('authorization', token);
                this.props.history.push('/productManage/classifyManage');
            } else {
                message.error(res.message)
            }
        })
    };
    checkUsername = (rule, value, callback) => {
        var reg = /^\w+$/;
        if (!value) {
            callback('请输入用户名!');
        } else if (!reg.test(value)) {
            callback('用户名只允许输入英文字母');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码!');
        } else {
            callback();
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const formItemLayout = {
            // , offset: 1
            labelCol: {xs: {span: 5},},
            wrapperCol: {xs: {span: 17},},
        };
        return (
            <Modal title='登录' style={style.modal} visible={true} centered footer={null}
                   iconType='error' onCancel={this.props.cancelPopup}>
                <div style={{paddingTop: 30}}>
                    <Form className="login-form" onSubmit={this._handleSubmit}>
                        <FormItem {...formItemLayout} label='用户名'>
                            {getFieldDecorator('user_name', {
                                initialValue: '',
                                rules: [{validator: this.checkUsername}]
                            })(
                                <Input placeholder="用户名"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='密码'>
                            {getFieldDecorator('pass_word', {
                                initialValue: '',
                                rules: [{validator: this.checkPassword}]
                            })(
                                <Input type="password" placeholder="密码"
                                    // wrappedcomponentref={(inst) => this.pwd = inst}
                                />
                            )}
                        </FormItem>
                        <FormItem wrapperCol={{span: 12, offset: 5}}>
                            {/*onClick={this.loginSubmit}*/}
                            <Button type="primary" htmlType='submit' className="login-form-button">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
}

export default Form.create({})(withRouter(LoginModal));
