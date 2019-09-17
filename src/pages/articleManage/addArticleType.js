import React, {Component} from 'react';
import {Form, Input, Modal} from "antd";

const FormItem = Form.Item;

class AddArticleType extends Component {
    state = {
        loading: false
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Object.keys(values).map(key => values[key] = (values[key] && values[key].trim()));
                this.setState({
                    loading: true
                });
                this.props.sure(values);
            }
        });
    };

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {xs: {span: 5},},
            wrapperCol: {xs: {span: 18},},
        };
        const {data, title, visible} = this.props;
        return (
            <Modal title={title} style={style.modal} visible={visible} centered okText='确定' cancelText='取消'
                   onCancel={this.props.onCancelPopup} onOk={this.handleSubmit} confirmLoading={this.state.loading}
                   okButtonProps={{disabled: false}}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} hasFeedback label='文章类型' help="* 用于在前台供用户筛选文章">
                        {getFieldDecorator('category_name', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '文章类型不能为空'},
                                // {validator: this.checkProductNameEn}
                            ],
                            validateTrigger: 'onBlur'
                        })(
                            <Input type='text' placeholder="16字以内"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(AddArticleType);