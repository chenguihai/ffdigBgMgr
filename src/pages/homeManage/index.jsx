import React, {Component} from 'react'
import {Card, Select, Modal, Button, Table, message, Icon, Switch, Form} from 'antd'
import {http} from "../../utils/ajax";
import CategoryAssociation from "./categoryAssociation.tsx";
import {catRelation} from "../../config/labelData";
import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class FrontHome extends Component {

    state = {
        list: [],
        total: 0,
        colName: [],
        editMan: [],
        loading: false,
        versionVisible: false,
        versionList: [],
        catRelationFlag: false, //类目关联弹框
        catRelation: {}, //类目关联数据
    };
    pageInfo = {
        page: 1,
        limit: 50,
        colName: null,
        editMan: null,
        isShow: null,
    };

    componentDidMount() {
        // this.getHomePage();
        this.getFilterData();
        this.getList();
    }

    delRow = (pid) => {
        http.delete('api/AdminSite/HomePageAdmin/DeleteShowState', {params: {pid: pid}}).then(res => {
            message.success('删除成功');
            this.getList();
        }).catch(e => {
            message.error('删除失败')
        })
    };
    // getHomePage = () => {
    //   http.get('/api/AdminSite/HomePageAdmin/GetProductGroupName').then(res => {
    //     this.setState({

    //     })
    //   })
    // }
    getFilterData = () => {
        http.get('/api/AdminSite/HomePageAdmin/GetColNameAndEditMan').then(res => {
            Array.isArray(res.colName) && res.colName.unshift("全部");
            Array.isArray(res.editMan) && res.editMan.unshift("全部");
            this.setState({
                colName: res.colName,
                editMan: res.editMan
            })
        }).catch((e) => {
            message.error("获取下拉信息失败");
        })

    };
    getList = () => {
        this.setState({
            loading: true
        });
        http.get("api/AdminSite/HomePageAdmin/GetHomePageCol", {params: this.pageInfo}).then(res => {
            this.setState({
                list: res.list,
                total: res.totalCount,
                loading: false
            })
        })
    };

    isShow = (id, isShow, cb) => {
        http.get('api/AdminSite/HomePageAdmin/UpdateShowState', {params: {id: id, isShow: isShow}}).then(res => {
            cb(true)
            this.getList();
        }).catch(e => {
            message.error('更新失败');
            cb(false)
        })
    }


    handleCategoryLink = (item) => {
        this.setState({
            catRelationFlag: true,
            catRelation: item
        })
    };

    columns() {
        const {list} = this.state;
        return ([
            {
                title: "栏目ID",
                key: 'pid',
                dataIndex: 'pid'
            },
            {
                title: "栏目名称",
                key: 'title',
                dataIndex: 'title'
            },
            {
                title: "展示商品",
                key: 'bdProduct',
                dataIndex: 'bdProduct',
                render: (text, record) => {
                    return <span className="a" onClick={() => {
                        this.props.history.push({
                            pathname: '/ffManage/homeManageViewCol',
                            state: {pid: record.pid, title: record.title}
                        })
                    }}>{text.split(',').length}</span>
                }
            },
            {
                title: "修订者",
                key: 'editBy',
                dataIndex: 'editBy'
            },
            {
                title: "修订时间",
                key: 'updateTime',
                dataIndex: 'updateTime'
            },
            {
                title: "关联版式",
                key: 'relatedId',
                dataIndex: 'relatedId',
                render: (text, record, index) => {
                    return record.relatedId ? <span>{catRelation[record.relatedId - 1]}</span> : '—'
                }
            },
            {
                title: "是否前台可见",
                key: 'isShow',
                dataIndex: 'isShow',
                render: (text, record, index) => {
                    let flag = !text ? 1 : 0;
                    return (record.relatedId && record.bdProduct.split(',').length >= 5 ? <Switch checked={!!text} onChange={() => {
                        confirm({
                            title: flag ? '开启前台可见' : '关闭前台可见',
                            content: flag ? '开启后，前台在对应版式展示添加产品。' : '关闭后，前台在对应版式下线产品',
                            onOk: () => {
                                list[index].isShow = flag;
                                this.setState({
                                    list: list
                                }, () => {
                                    this.isShow(record.id, list[index].isShow, (bl) => {
                                        if (!bl) {
                                            list[index].isShow = !list[index].isShow ? 1 : 0;
                                            this.setState({
                                                list: list
                                            })
                                        }
                                    })
                                })
                            },
                            onCancel() {
                                message.info('已取消！')
                            },
                        });
                    }}/> : null)
                }
            },
            {
                title: "操作",
                key: 'action',
                render: (text, record, index) => {
                    return (<div>
                        <Icon title="编辑" className="pit" type="edit" onClick={() => {
                            this.props.history.push({
                                pathname: '/ffManage/homeManageEdit',
                                state: {pid: record.pid, name: record.title}
                            })
                        }}/>
                        <Icon title="版本" type="diff" className="ml pit" onClick={() => {
                            this.props.history.push({
                                pathname: '/ffManage/homeManageVersion',
                                state: {pid: record.pid, title: record.title}
                            })
                        }}/>
                        <Icon title="关联版式" type="form" className="ml pit"
                              onClick={this.handleCategoryLink.bind(this, record)}/>

                        {!record.isShow && <Icon title='删除' className="ml pit" type="delete" onClick={() => {
                            confirm({
                                title: '删除',
                                content: '是否确定删除此项？',
                                onOk: () => {
                                    this.delRow(record.pid)
                                },
                                onCancel() {
                                    message.info('已取消！')
                                },
                            });
                        }}/>}
                    </div>)
                }
            },
        ])
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values);
                const {colName, editMan, isShow} = values;
                this.pageInfo = {
                    page: 1,
                    limit: 50,
                    colName: colName === "全部" ? null : colName,
                    editMan:
                        editMan === "全部" ? null : editMan,
                    isShow:
                        isShow === '' ? null : isShow,
                };
                this.getList();
            }
        });
    };
    _handleUpdateList = () => {
        this.pageInfo.page = 1;
        this.getList();
    };
    cancelPopup = () => {
        this.setState({
            catRelationFlag: false
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            colName, loading,
            editMan,
            total,
            list,
            catRelation, catRelationFlag
        } = this.state;
        const {page, limit} = this.pageInfo;
        const style = {
            width_120: {width: 120},
            width_100: {width: 100},
        };
        return (
            <div className='h_percent100'>
                <Card
                    style={{width: '100%'}}
                    title="前台首页管理"
                >
                    <Form className="homeManage" onSubmit={this.handleSubmit} layout="inline">
                        <FormItem label='栏目名称'>
                            {getFieldDecorator('colName', {
                                initialValue: '全部'
                            })(
                                <Select style={style.width_120}>
                                    {
                                        colName.map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='修订者'>
                            {getFieldDecorator('editMan', {
                                initialValue: '全部'
                            })(
                                <Select style={style.width_100}>
                                    {
                                        editMan.map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='前台可见'>
                            {getFieldDecorator('isShow', {
                                initialValue: ''
                            })(
                                <Select style={style.width_100}>
                                    <Option value={""}>全部</Option>
                                    <Option value={1}>可见</Option>
                                    <Option value={0}>不可见</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button className="ml" type="primary" htmlType='submit'>查 询</Button>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" ghost onClick={() => {
                                this.props.history.push('/ffManage/homeManageAdd')
                            }}>新增栏目</Button>
                        </FormItem>
                    </Form>
                    <Table loading={loading} pagination={
                        {
                            size: 'small',
                            total: total,
                            pageSize: limit,
                            current: page,
                            onChange: this.turnPage,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            pageSizeOptions: ['15', '30', '50', '100', '200'],
                            showTotal: this.showTotal
                        }
                    } columns={this.columns()} dataSource={list} rowKey={(record) => record.id}/>
                </Card>
                {/*关联版式*/}
                <CategoryAssociation visible={catRelationFlag} data={catRelation} hide={this.cancelPopup}
                                     sure={this._handleUpdateList}
                />
            </div>
        )
    }
}

export default Form.create()(FrontHome)