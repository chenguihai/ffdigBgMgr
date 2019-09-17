import React, {Component} from 'react'
import {Form, Select, Modal, message} from 'antd'
import axiosHttp from "../../utils/ajax";
import {catRelation} from "../../config/labelData";

const FormItem = Form.Item;
const {Option} = Select;

/**
 *这个组件需要 以下参数和方法
 * @param title 标题
 * @param content 内容
 * @function hide 关闭弹框
 * @function sure 提交内容
 */
class CategoryAssociation extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: false
        };
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                // console.log(values);
                if (isNaN(values.relatedId)) {
                    message.info('请选择关联版式');
                    return
                }
                this.UpdateRelatedHttp(values.relatedId);
            }
        });
    };

    // 关联版式的前台区域块标记id(1.时尚服饰 2.包包鞋子 3.珠宝配饰 4.家具生活)
    UpdateRelatedHttp = (type: any) => { //更新关联栏目
        this.setState({
            loading: true
        });
        axiosHttp(`api/AdminSite/HomePageAdmin/UpdateRelated?id=${this.props.data.id}&relatedId=${type}`, '', 'get').then((res) => {
            if (res.code === 200) {
                message.success(res.msg);
                this.props.hide();
                this.props.sure();
            } else {
                message.error(res.msg)
            }
            this.setState({
                loading: false
            });
        })
    };

    render() {
        const style: any = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {xs: {span: 5},},
            wrapperCol: {xs: {span: 18},},
        };
        const {visible, data = {}} = this.props;
        const {loading} = this.state;
        return (
            <Modal title='关联版式' style={style.modal} visible={visible} centered
                   onCancel={this.props.hide} okText='确定' cancelText='取消' destroyOnClose={true}
                   confirmLoading={loading} onOk={this.handleSubmit}
                   okButtonProps={{disabled: false}}>
                <Form onSubmit={this.handleSubmit} {...formItemLayout}>
                    <FormItem label='栏目名称'>
                        <span>{data.title}</span>
                    </FormItem>
                    <FormItem label='栏目ID'>
                        <span>{data.pid}</span>
                    </FormItem>
                    <FormItem hasFeedback label='关联版式'>
                        {getFieldDecorator('relatedId', {
                            initialValue: (data.relatedId > 0 ? '' + data.relatedId : '请选择')
                        })(
                            <Select style={{width: 120}}>
                                {/* 关联版式的前台区域块标记id(1.时尚服饰 2.包包鞋子 3.珠宝配饰 4.家具生活)*/}
                                {
                                    catRelation.map((item, index) => {
                                        return (<Option key={index} value={(index + 1) + ''}>{item}</Option>)
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CategoryAssociation)