import React, {Component} from 'react'
import {Row, Col, Form, Input, Modal, message} from 'antd'
import axiosHttp from "../../../utils/ajax";

const FormItem = Form.Item;

/**
 *这个组件需要 以下参数和方法
 * @param title 标题
 * @param content 内容
 * @function hide 关闭弹框
 * @function sure 提交内容
 */
class LabelCategoryAlign extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: false
        };
    }

    pageInfo = {
        "cat1": null,
        "cat2": null,
        "cat3": null,
        "cnName": "",
        "enName": ""
    };

    componentDidMount(): void {
        const {data: {cat_name_en, cat_name_cn, cat_id}, dataList} = this.props;
        let value = +cat_id.substring(0, 1), cat1 = [], cat2 = [], cat3 = [];
        if (value !== 1) {
            for (let i = 0; i < dataList.length; i++) {
                cat1 = dataList[i].children;
                if (cat1) {
                    for (let j = 0; j < cat1.length; j++) {
                        cat2 = cat1[j].children;
                        if (cat1[j].cat_id === cat_id) {
                            this.pageInfo.cat1 = dataList[i].cat_id;
                        }
                        if (cat2) {
                            for (let k = 0; k < cat2.length; k++) {
                                if (cat2[k].cat_id === cat_id) {
                                    this.pageInfo.cat1 = dataList[i].cat_id;
                                    this.pageInfo.cat2 = cat1[j].cat_id;
                                }
                            }
                        }
                    }
                }
            }
        }
        // @ts-ignore
        this.pageInfo[`cat${value}`] = cat_id;
        this.pageInfo.cnName = cat_name_cn;
        this.pageInfo.enName = cat_name_en;
        // console.log(55, this.pageInfo);
        this.props.form.setFieldsValue({
            enName: cat_name_en,
            cnName: cat_name_cn
        });
    }


    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                Object.keys(values).map(key => values[key] = (values[key] && values[key].trim()));
                const {enName, cnName} = this.pageInfo;
                if (values.cnName === cnName && values.enName === enName) {
                    this.props.hide();
                    return
                }
                this.updateBackstageCatHttp(values);
            }
        });
    };
    updateBackstageCatHttp = (values: any) => { //获取所有后台分类信息
        this.setState({
            loading:true
        });
        axiosHttp('api/AdminSite/BackstageCat/UpdateBackstageCat', {...this.pageInfo, ...values}).then((res) => {
            if (res.code === 200) {
                message.success(res.msg);
                this.props.hide();
                this.props.sure();
            } else {
                message.error(res.msg)
            }
            this.setState({
                loading:false
            });
        })
    };
    checkProductName = (rule: object, value: string, callback: any) => {
        value = value.trim();
        const reg = /^(?=.*[\u4e00-\u9fa5])[A-Za-z&\u4e00-\u9fa5]{1,}$/;
        if (!value) {
            callback('不能为空！');
        } else if (reg.test(value) === false) {
            callback('由中文/中英文和&组成');
        }else if(value.length > 16){
            callback('限16个字');
        } else {
            callback();
        }
    };
    checkProductNameEn = (rule: object, value: any, callback: any) => {
        value = value.trim();
        if (!value) {
            callback('不能为空！');
        } else if (/^[a-zA-Z&\s]+$/.test(value) === false) {
            callback('由英文和&组成');
        } else if (value.match(/\b\w+\b/g).length > 16) {
            callback('限16个单词');
        } else {
            callback();
        }

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
        const {data} = this.props;
        return (
            <Modal title='分类编辑' style={style.modal} visible={true} centered okText='确定' cancelText='取消'
                   onCancel={this.props.hide} onOk={this.handleSubmit} confirmLoading={this.state.loading}
                   okButtonProps={{disabled: false}}>
                <Row style={style.inputBox}>
                    <Col span={24}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label='类目级别'>
                                <span>{data.cat_id.substring(0, 1)}级</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label='类目ID'>
                                <span>{data.cat_id}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} hasFeedback label='中文名称'>
                                {getFieldDecorator('cnName', {
                                    initialValue: data.cat1_name_cn,
                                    rules: [{validator: this.checkProductName}],
                                    validateTrigger: 'onBlur'
                                })(
                                    <Input type='text'/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} hasFeedback label='英文名称'>
                                {getFieldDecorator('enName', {
                                    initialValue: data.cat1_name_en,
                                    rules: [{validator: this.checkProductNameEn}],
                                    validateTrigger: 'onBlur'
                                })(
                                    <Input type='text'/>
                                )}
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default Form.create()(LabelCategoryAlign)