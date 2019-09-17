import React, {Component, Fragment} from 'react'
import {Icon, Modal, Table, Input, Form, Tooltip, message} from 'antd'
import axiosHttp from "../../../utils/ajax";

const FormItem = Form.Item;

/**
 *这个组件需要 以下参数和方法
 * @param title 标题
 * @param content 内容
 * @function hide 关闭弹框
 * @function sure 提交内容
 */
const initData = [{
    "cat1_id": null,
    "cat2_id": null,
    "cat3_id": null,
    key: 10001,
    classId: '1级',
    cat1_name_cn: '',
    cat1_name_en: '',
    isEdit: true,
    errorInfoen: '',
    errorInfocn: '',
    children: [{
        key: 2000111,
        cat2_name_cn: '',
        cat2_name_en: '',
        classId: '2级',
        isEdit: true,
        errorInfoen: '',
        errorInfocn: '',
        children: [{
            key: 30001131,
            cat3_name_cn: '',
            cat3_name_en: '',
            classId: '3级',
            errorInfoen: '',
            errorInfocn: '',
            isEdit: true,
        }]
    }
    ],
}];
const CATEGORY_EXISTENCE = 6000; //类目存在
class NewClassify extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props) {
        super(props);
        this.state = {
            editClassifyFlag: true,
            deleteId: "",
            expandedRowKeys: [10001, 2000111],
            dataList: initData,
            newClass: 1,
            loading: false
        }
    }

    newData = initData;
    submitFlag = false;
    isHasSameFlag = false;
    timer = null;

    componentDidMount() {
        const {newAddCatId, data} = this.props;
        if (!newAddCatId) {
            return
        }
        let newAddValue = {}, rowKeys = [], cat1 = null, cat2 = null, timer = new Date().getTime(), key = null;
        for (let i = 0; i < data.length; i++) {
            cat1 = data[i];
            if (cat1.cat_id == newAddCatId) {
                key = ('2' + timer) - 0;
                newAddValue = {
                    "cat1_id": cat1.cat_id,
                    "cat2_id": null,
                    "cat3_id": null,
                    key: cat1.cat_id,
                    classId: '1级',
                    isEdit: false,
                    errorInfoen: '',
                    errorInfocn: '',
                    "cat1_name_cn": cat1.cat_name_cn,
                    "cat1_name_en": cat1.cat_name_en,
                    children: [{
                        key: key,
                        cat2_name_cn: '',
                        cat2_name_en: '',
                        classId: '2级',
                        isEdit: true,
                        errorInfoen: '',
                        errorInfocn: '',
                        children: [{
                            key: ('3' + timer) - 0,
                            cat3_name_cn: '',
                            cat3_name_en: '',
                            classId: '3级',
                            errorInfoen: '',
                            errorInfocn: '',
                            isEdit: true,
                        }]
                    }
                    ],
                };
                rowKeys = [cat1.cat_id, key];
                break;
            }
            if (cat1.children) {
                for (let j = 0; j < cat1.children.length; j++) {
                    cat2 = data[i].children[j];
                    if (cat2.cat_id == newAddCatId) {
                        newAddValue = {
                            "cat1_id": cat1.cat_id,
                            "cat2_id": cat2.cat_id,
                            "cat3_id": null,
                            key: cat1.cat_id,
                            classId: '1级',
                            isEdit: false,
                            errorInfoen: '',
                            errorInfocn: '',
                            "cat1_name_cn": cat1.cat_name_cn,
                            "cat1_name_en": cat1.cat_name_en,
                            "children": [
                                {
                                    key: cat2.cat_id,
                                    classId: '2级',
                                    isEdit: false,
                                    errorInfoen: '',
                                    errorInfocn: '',
                                    "cat2_name_cn": cat2.cat_name_cn,
                                    "cat2_name_en": cat2.cat_name_en,
                                    children: [{
                                        key: ('3' + timer) - 0,
                                        cat3_name_cn: '',
                                        cat3_name_en: '',
                                        classId: '3级',
                                        errorInfoen: '',
                                        errorInfocn: '',
                                        isEdit: true,
                                    }]
                                }
                            ]
                        };
                        rowKeys = [cat1.cat_id, cat2.cat_id];
                        break;
                    }
                }
            }
        }
        this.newData = [newAddValue];
        this.setState({
            dataList: [newAddValue],
            expandedRowKeys: rowKeys,
        })
    }

    insertBackstageCatHttp = (params) => { //后台分类批量插入数据
        this.setState({
            loading: true
        });
        axiosHttp('api/AdminSite/BackstageCat/InsertBackstageCat', params).then((res) => {
            if (res.code === 200) {
                message.success(res.msg);
                this.props.hide();
                this.props.sure();
            } else if (res.code === CATEGORY_EXISTENCE) {
                let classIndex = res.msg.substring(0, 1),
                    content = res.msg.match(/【(.+)】/)[1],
                    value = classIndex === "一" ? 1 : classIndex === "二" ? 2 : 3,
                    language = /中文/.test(res.msg) ? 'cn' : 'en';
                this.setBgReturnErrorCommonFun(this.newData, value, content, language);
            } else {
                message.error(res.msg);
            }
            this.setState({
                loading: false
            });
            this.submitFlag = false;
        })
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.submitFlag = true;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Object.keys(values).map(key => values[key] = (values[key] && values[key].trim()));
                // console.log(values);
                let valueObj = {};
                this.values = values;
                for (let key in values) {
                    if (key.indexOf("cn") >= 0) {
                        valueObj[key] = values[key]
                    }
                }
                this.isHasSameFlag = false;

                this.clearErrorInfoCommonFun(this.newData);
                this.setValueCommonFun(this.newData, valueObj);
                this.isJudgeEqualCommonFun(this.newData[0].children);
                this.setState({
                    dataList: this.newData
                });
                if (!this.isHasSameFlag) {
                    let deleteEmptyData = JSON.parse(JSON.stringify(this.newData));
                    this.deleteEmptyItemCommonFun(deleteEmptyData[0]);
                    this.insertBackstageCatHttp(deleteEmptyData[0]);
                }
            }
        });
    };

    hasErrors = (fieldsError) => {
        var arr = Object.keys(fieldsError);
        if (arr.length > 0) {
            let twoClass = {}, threeClass = {};
            for (var key in fieldsError) {
                if (fieldsError[key] !== undefined) {
                    let [name, value] = key.split('=');
                    if (this.newData[0].key == value) {
                        this.newData[0]['errorInfo' + name] = fieldsError[key][0];
                    }
                    for (let i = 0; i < this.newData[0].children.length; i++) {
                        twoClass = this.newData[0].children[i];
                        if (twoClass.key == value) {
                            this.newData[0].children[i]['errorInfo' + name] = fieldsError[key][0];
                        }
                        if (twoClass.children) {
                            for (let j = 0; j < twoClass.children.length; j++) {
                                threeClass = this.newData[0].children[i].children[j];
                                if (threeClass.key == value) {
                                    this.newData[0].children[i].children[j]['errorInfo' + name] = fieldsError[key][0];
                                }
                            }
                        }
                    }
                }
            }
        }
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    };

    checkProductName = (rule, value, callback) => {
        value = value.trim();
        const classIndex = rule.field.split('=')[1], reg = /^(?=.*[\u4e00-\u9fa5])[A-Za-z&\u4e00-\u9fa5]{1,}$/;
        if (classIndex.substring(0, 1) === '2' && value === '') {
            callback();
            return;
        } else if (classIndex.substring(0, 1) === '3' && value === '') {
            callback();
            return;
        }
        let errInfo = '';
        if (!value) {
            errInfo = '不能为空！';
            callback(errInfo);
        } else if (reg.test(value) === false) {
            errInfo = '由中文/中英文和&组成';
            callback(errInfo);
        } else if (value.length > 16) {
            errInfo = '限16个字';
            callback(errInfo);
        } else {
            callback();
        }
        const {getFieldsError} = this.props.form;
        this.hasErrors(getFieldsError());
        clearTimeout(this.timer); // 清除未执行的代码，重置回初始化状态
        this.timer = setTimeout(() => {
            this.clearErrorInfoCommonFun(this.newData);
            this.setState({
                dataList: this.newData
            })
        }, 3000);
        this.setState({
            dataList: this.newData
        });

    };

    checkProductNameEn = (rule, value, callback) => {
        value = value.trim();
        const classIndex = rule.field.split('=')[1];
        if (classIndex.substring(0, 1) === '2' && value === '') {
            callback();
            return;
        } else if (classIndex.substring(0, 1) === '3' && value === '') {
            callback();
            return;
        }
        let errInfo = '';
        if (!value) {
            errInfo = '不能为空！';
            callback(errInfo);
        } else if (/^[a-zA-Z&\s]+$/.test(value) === false) {
            errInfo = '由英文和&组成';
            callback(errInfo);
        } else if (value.match(/\b\w+\b/g).length > 16) {
            errInfo = '限16个单词';
            callback(errInfo);
        } else {
            callback();
        }
        const {getFieldsError} = this.props.form;
        this.hasErrors(getFieldsError());
        clearTimeout(this.timer); // 清除未执行的代码，重置回初始化状态
        this.timer = setTimeout(() => {
            this.clearErrorInfoCommonFun(this.newData);
            this.setState({
                dataList: this.newData
            })
        }, 3000);
        this.setState({
            dataList: this.newData
        });
    };
    setValueCommonFun = (data, valueObj) => { //把获取的表单值，设置到cat(1/2/3)_name_(c/e)n中
        for (let i = 0; i < data.length; i++) {
            for (let key in valueObj) {
                let [name, value] = key.split("=");
                if (value == data[i].key) {
                    let index = data[i].classId.substring(0, 1);
                    data[i][`cat${index}_name_cn`] = this.values['cn=' + value];
                    data[i][`cat${index}_name_en`] = this.values['en=' + value];
                }
            }
            if (data[i].children) {
                this.setValueCommonFun(data[i].children, valueObj);
            }
        }
    };
    setBgReturnErrorCommonFun = (data, classIndex, content, language) => { //把后台返回的错误信息，设置到cat(1/2/3)_name_(c/e)n中
        let index = 0;
        for (let i = 0; i < data.length; i++) {
            index = +data[i].classId.substring(0, 1);
            if (classIndex === index && content === data[i][`cat${classIndex}_name_${language}`]) {
                data[i][`errorInfo${language}`] = '该类目已经存在';
            }
            if (data[i].children) {
                this.setBgReturnErrorCommonFun(data[i].children, classIndex, content, language);
            }
        }
    };
    handleAdd = (obj) => {
        const {dataList, expandedRowKeys} = this.state;
        let newDate = JSON.parse(JSON.stringify(dataList)), timer = new Date().getTime(), key = null;
        if (obj.classId === '1级') {
            key = ('2' + timer) - 0;
            newDate[0].children.push({
                key: key,
                cat2_name_cn: '',
                cat2_name_en: '',
                classId: '2级',
                errorInfoen: '',
                errorInfocn: '',
                isEdit: true,
            })
        } else if (obj.classId === '2级') {
            let item = newDate[0].children;
            for (let i = 0; i < item.length; i++) {
                if (item[i].key === obj.key) {
                    if (!newDate[0].children[i].children) {
                        newDate[0].children[i].children = [];
                    }
                    key = ('3' + timer) - 0;
                    newDate[0].children[i].children.push({
                        key: key,
                        cat3_name_cn: '',
                        cat3_name_en: '',
                        classId: '3级',
                        errorInfoen: '',
                        errorInfocn: '',
                        isEdit: true,
                    });
                    break;
                }
            }

        }
        this.newData = newDate;
        this.setState({
            dataList: newDate,
            expandedRowKeys: [...expandedRowKeys, key]
        });
    };
    handleMinus = (key) => {
        const {dataList} = this.state;
        this.newData = JSON.parse(JSON.stringify(dataList));
        this.deleteItemCommonFun(this.newData[0].children, key);
        this.setState({
            dataList: this.newData
        });
    };
    deleteItemCommonFun = (data, key) => { //删除
        for (let i = 0; i < data.length; i++) {
            if (key == data[i].key) {
                data.splice(i, 1);
                break;
            }
            if (data[i].children) {
                this.deleteItemCommonFun(data[i].children, key);
            }
        }
    };
    deleteEmptyItemCommonFun = (data) => { //删除
        data.children = data.children.filter(item => {
            if (item.cat2_name_cn !== '' && item.cat2_name_en !== '') {
                item.children = item.children.filter(subItem => {
                    return subItem.cat3_name_cn !== '' && subItem.cat3_name_en !== '';
                });
                return true;
            } else {
                return false;
            }
        });
    };

    clearErrorInfoCommonFun = (data) => { //清除错误信息
        for (let i = 0; i < data.length; i++) {
            data[i].errorInfocn = '';
            data[i].errorInfoen = '';
            if (data[i].children) {
                this.clearErrorInfoCommonFun(data[i].children);
            }
        }
    };

    isJudgeEqualCommonFun = (data) => { //判断相同类目的children中有没有相同的类目

        let classIndex = 0, errorMsg = '相同等级中,类目名称不能相同', errorEmpty = '不能为空',
            addClassIndex = +this.props.newAddCatId.substring(0, 1);//新增第几级类目
        for (let i = 0; i < data.length; i++) {
            classIndex = +data[i].classId.substring(0, 1);
            if (classIndex === 2 && addClassIndex === 0 && i === 0) {
                if (!data[0].cat2_name_cn) {
                    data[0].errorInfocn = errorEmpty;
                    this.isHasSameFlag = true;
                }
                if (!data[0].cat2_name_en) {
                    data[0].errorInfoen = errorEmpty;
                    this.isHasSameFlag = true;
                }
            } else if (classIndex === 2 && addClassIndex === 1 && i === 0) {
                if (!data[i].cat2_name_cn) {
                    data[i].errorInfocn = errorEmpty;
                    this.isHasSameFlag = true;
                }
                if (!data[i].cat2_name_en) {
                    data[i].errorInfoen = errorEmpty;
                    this.isHasSameFlag = true;
                }
            } else if (classIndex === 3 && addClassIndex === 0 && i === 0) {
               if (data[i].cat3_name_cn !== '' && data[i].cat3_name_en === '') {
                    data[i].errorInfoen = errorEmpty;
                    this.isHasSameFlag = true;
                } else if (data[i].cat3_name_cn === '' && data[i].cat3_name_en !== '') {
                    data[i].errorInfocn = errorEmpty;
                    this.isHasSameFlag = true;
                }else{
                    this.isHasSameFlag = false;
                }
            } else if (classIndex === 3 && addClassIndex === 1 && i === 0) {
                if (data[i].cat3_name_cn === '' && data[i].cat3_name_en === '') {
                    this.isHasSameFlag = false;
                } else if (data[i].cat3_name_cn !== '' && data[i].cat3_name_en === '') {
                    data[i].errorInfoen = errorEmpty;
                    this.isHasSameFlag = true;
                } else if (data[i].cat3_name_cn === '' && data[i].cat3_name_en !== '') {
                    data[i].errorInfocn = errorEmpty;
                    this.isHasSameFlag = true;
                }
            } else if (classIndex === 3 && addClassIndex === 2 && i === 0) {
                if (!data[i].cat3_name_cn) {
                    data[i].errorInfocn = errorEmpty;
                    this.isHasSameFlag = true;
                }
                if (!data[i].cat3_name_en) {
                    data[i].errorInfoen = errorEmpty;
                    this.isHasSameFlag = true;
                }
            }
            if (data[i].children) {
                this.isJudgeEqualCommonFun(data[i].children);
            }
            if (data.length > 1) {
                for (let j = 1; j < data.length; j++) {
                    if (data[i][`cat${classIndex}_name_cn`] === '' && data[i][`cat${classIndex}_name_en`] !== '') {
                        data[i].errorInfocn = errorEmpty;
                        this.isHasSameFlag = true;
                    }
                    if (data[i][`cat${classIndex}_name_cn`] !== '' && data[i][`cat${classIndex}_name_en`] === '') {
                        data[i].errorInfoen = errorEmpty;
                        this.isHasSameFlag = true;
                    }
                    if (i !== j && data[i][`cat${classIndex}_name_cn`] !== '' && data[i][`cat${classIndex}_name_cn`] === data[j][`cat${classIndex}_name_cn`]) {
                        this.isHasSameFlag = true;
                        data[i].errorInfocn = errorMsg;
                        data[j].errorInfocn = errorMsg;
                    }
                    if (i !== j && data[i][`cat${classIndex}_name_en`] !== '' && data[i][`cat${classIndex}_name_en`] === data[j][`cat${classIndex}_name_en`]) {
                        this.isHasSameFlag = true;
                        data[i].errorInfoen = errorMsg;
                        data[j].errorInfoen = errorMsg;
                    }

                }
            }
        }
    };


    columns() {
        const {getFieldDecorator} = this.props.form;
        return [
            {
                title: '类目级别',
                dataIndex: 'classId',
                key: 'classId',
                width: '13%',
            },
            {
                title: '中文',
                dataIndex: 'cat_name_cn',
                key: 'cat_name_cn',
                width: '40%',
                editable: true,
                render: (text, record, index) => {
                    let classIndex = record.classId.substring(0, 1);
                    return (
                        <Fragment>{
                            record.isEdit ?
                                <Tooltip title={record.errorInfocn} placement='right' visible={!!record.errorInfocn}>
                                    <span className="redStar">{classIndex !== "3" && index === 0 ? '*' : ''}</span>
                                    <FormItem className="newAddClass">
                                        {getFieldDecorator('cn=' + record.key, {
                                            initialValue: '',
                                            rules: [{validator: this.checkProductName}],
                                            validateTrigger: 'onBlur'
                                        })(
                                            <Input placeholder="输入中文，多个名称用&间隔"/>
                                        )}
                                    </FormItem>
                                </Tooltip>
                                :
                                <div
                                    className='word-break'>{record[`cat${classIndex}_name_cn`]}</div>
                        }
                        </Fragment>
                    )
                }
            },
            {
                title: '英文',
                dataIndex: 'cat_name_en',
                key: 'cat_name_en',
                width: '40%',
                editable: true,
                render: (text, record, index) => {
                    let classIndex = record.classId.substring(0, 1);
                    return (
                        <Fragment>{
                            record.isEdit ?
                                <Tooltip title={record.errorInfoen} placement='right' visible={!!record.errorInfoen}>
                                    <span className="redStar">{classIndex !== "3" && index === 0 ? '*' : ''}</span>
                                    <FormItem className="newAddClass">
                                        {getFieldDecorator('en=' + record.key, {
                                            initialValue: '',
                                            rules: [{validator: this.checkProductNameEn}],
                                            validateTrigger: 'onBlur'
                                        })(
                                            <Input placeholder="输入英文，多个名称用&间隔"/>
                                        )}
                                    </FormItem>
                                </Tooltip>
                                :
                                <div
                                    className='word-break'>{record[`cat${classIndex}_name_en`]}</div>
                        }
                        </Fragment>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '7%',
                render: (text, record, index) => {
                    const {newAddCatId} = this.props;
                    let classIndex = +newAddCatId.substring(0, 1),
                        value = +record.classId.substring(0, 1);
                    return (
                        <Fragment>
                            {
                                (value >= classIndex && value < 3) &&
                                <span className='pointer mr10' onClick={this.handleAdd.bind(this, record)}><Icon
                                    type="plus-circle"/></span>
                            }
                            {
                                record.isEdit && index > 0 &&
                                <span className='pointer mr10' onClick={this.handleMinus.bind(this, record.key)}><Icon
                                    type="minus-circle"/></span>
                            }
                            {
                                record.isEdit && classIndex === 1 && value === 3 && index === 0 &&
                                <span className='pointer mr10' onClick={this.handleMinus.bind(this, record.key)}><Icon
                                    type="minus-circle"/></span>
                            }
                            {
                                record.isEdit && classIndex === 0 && value > 2 && index === 0 &&
                                <span className='pointer mr10' onClick={this.handleMinus.bind(this, record.key)}><Icon
                                    type="minus-circle"/></span>
                            }

                        </Fragment>
                    )
                }
            }
        ]
    }

    cancelPopup = () => { //取消编辑
        this.newData.length > 0 && this.clearErrorInfoCommonFun(this.newData);
        this.setState({
            dataList: this.newData
        }, () => {
            this.props.hide();
        });
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
            scroll: {y: this.scrollY, x: '100%'},
            height_500: {maxHeight: 500, overflow: 'auto'}
        };
        const {title} = this.props;
        const {dataList, expandedRowKeys, loading} = this.state;
        return (
            <Modal width={1000} title={title} style={style.modal} visible={true} centered okText='确定' cancelText='取消'
                   confirmLoading={loading}
                   iconType='error' bodyStyle={style.height_500}
                   onCancel={this.cancelPopup} onOk={this.handleSubmit}>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Table expandedRowKeys={expandedRowKeys} rowKey="key" className='table-wrap'
                           dataSource={dataList}
                           columns={this.columns()}
                           scroll={style.scroll}
                           pagination={false}
                    />
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(NewClassify)