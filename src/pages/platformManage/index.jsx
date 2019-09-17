import React, {Component} from 'react'
import {Card, Select, Icon, Button, Table, message, Switch, Modal} from 'antd'
import {http} from "../../utils/ajax";
import MatchAdd from './matchAdd'
import NewAdd from './newAdd'
import Edit from './Edit'

const Option = Select.Option
const confirm = Modal.confirm;
export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spu_site_list: [],
            site_name_list: [],
            site_name: '',
            edit_name_list: [],
            edit_name: '',
            is_show: '',
            list: [],
            page: 1,
            limit: 50,
            total: 0,
            fileId: '',
            order: '',
            loading: false,
            batchVisible: false,
            newVisible: false,
            editVisible: false,
            rowName: "",
            rowId: '',
        }

    }

    componentDidMount() {
        this.getSpuSite();
        this.getFilterData();
        this.getSiteList();
    }

    getSpuSite = (id) => {
        http.get('api/AdminSite/ProductSite/GetSpuSite', {params: {adminSiteId: id}}).then(res => {
            this.setState({
                spu_site_list: res
            })
        }).catch((e) => {
            console.error(e);
        })
    }
    getFilterData = () => {
        http.get('api/AdminSite/ProductSite/GetDownListMsg').then(res => {
            Array.isArray(res.site) && res.site.unshift("全部");
            Array.isArray(res.editMan) && res.editMan.unshift("全部");
            this.setState({
                site_name_list: res.site,
                edit_name_list: res.editMan
            })
        }).catch((e) => {
            console.error(e);
            message.error("获取下拉信息失败");
        })

    }
    getSiteList = () => {
        this.setState({
            loading: true
        })
        const {site_name, edit_name, is_show, page, limit} = this.state
        http.get('api/AdminSite/ProductSite/GetAdminSiteList', {
            params: {
                site_name: site_name ? site_name : null,
                edit_name: edit_name ? edit_name : null,
                is_show: is_show ? is_show : null,
                page,
                limit
            }
        }).then(res => {
            this.setState({
                list: res.list,
                total: res.totalCount,
                loading: false
            })
        }).catch((e) => {
            console.error(e);
            message.error("获取列表信息失败，正在重新获取")
        })

    }
    delRow = (id) => {
        http.get('api/AdminSite/ProductSite/DeleteAdminState', {params: {id: id}}).then(res => {
            message.success('删除成功')
            this.getSiteList();
        }).catch(e => {
            message.error(e.data.msg)
        })
    }
    isShow = (id, isShow, cb) => {
        http.put('api/AdminSite/ProductSite/UpdateShowState', {id: id, isShow: isShow}).then(res => {
            this.getSiteList();
            cb(true)
        }).catch(e => {
            message.error(e.data.msg)
            cb(false)
        })
    }

    batchAdd = (value) => {
        http.post('api/AdminSite/ProductSite/BatchInsertAdminSite', {"spuSite": value.join(',')}).then(res => {
            message.success('批量添加成功')
            this.getSiteList();
        }).catch(e => {
            message.error(e.data.msg)
        })
    }

    newAdd = (name, value) => {
        http.post('api/AdminSite/ProductSite/InsertOrUpdateAdminSite', {
            adminSiteName: name,
            "spuSite": value.join(',')
        }).then(res => {
            message.success('添加成功')
            this.getSiteList();
        }).catch(e => {
            message.error(e.data.msg)
        })
    }

    Edit = (name, value, id) => {
        const rowShow = this.state.rowShow;
        http.post('api/AdminSite/ProductSite/InsertOrUpdateAdminSite', {
            adminSiteName: name,
            "spuSite": value.join(','),
            isShow: rowShow,
            id: id
        }).then(res => {
            message.success('更新成功')
            this.getSiteList();
        }).catch(e => {
            message.error(e.data.msg)
        })
    }

    turnPage = (page, pageSize) => {
        this.setState({
            page: page,
            limit: pageSize
        })
        this.getSiteList();
    };
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            page: current,
            limit: pageSize
        })
        this.getSiteList();
    };
    showTotal = (total) => {
        return `共 ${total} 个记录`;
    };

    render() {
        const {
            rowName, rowId, editVisible,
            newVisible,
            batchVisible, spu_site_list,
            site_name, site_name_list,
            edit_name, edit_name_list,
            is_show,
            list, page, limit, total, loading
        } = this.state
        const columns = [
            {
                title: "前台展示平台",
                key: 'name',
                dataIndex: 'name'
            },
            {
                title: "SPU数",
                key: 'spuCount',
                dataIndex: 'spuCount'
            },
            {
                title: "修订者",
                key: 'editMan',
                dataIndex: 'editMan'
            },
            {
                title: "修订时间",
                key: 'editTime',
                dataIndex: 'editTime'
            },
            {
                title: "是否前台可见",
                key: 'isShow',
                dataIndex: 'isShow',
                render: (text, record, index) => {
                    return <Switch checked={!!text} onChange={() => {

                        confirm({
                            title: '是否前台可见?',
                            content: '取消勾选后，所选项及其下级分类将不会web前台展示',
                            onOk: () => {
                                list[index].isShow = !text ? 1 : 0;
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
                                message.info('以取消！')
                            },
                        });


                    }}/>
                }
            },
            {
                title: "操作",
                key: 'action',
                render: (text, record, index) => {
                    return (<div>
                        <Icon  title="编辑" className="pit" type="edit" onClick={() => {
                            this.setState({
                                editVisible: true,
                                rowName: record.name,
                                rowId: record.id,
                                rowShow: record.isShow
                            });
                            this.getSpuSite(record.id)
                        }}/>

                        {!record.isShow && <Icon title="删除" className="ml pit" type="delete" onClick={() => {
                            confirm({
                                title: '删除',
                                content: '是否确定删除此项？',
                                onOk: () => {
                                    this.delRow(record.id)
                                },
                                onCancel() {
                                    message.info('以取消！')
                                },
                            });
                        }}/>}
                    </div>)
                }
            },
        ]
        return (
            <div className='h_percent100'>
                <Card
                    style={{width: '100%'}}
                    title="前台平台管理"
                >

                    <label className="ml">前台展示平台：</label>
                    <Select className="width-100" value={site_name} onChange={(value) => {
                        this.setState({
                            site_name: value
                        })
                    }}>
                        {
                            site_name_list.map(item => {
                                return <Option key={item} value={item === "全部" ? "" : item}>{item}</Option>
                            })
                        }

                    </Select>

                    <label className="ml">修订者：</label>
                    <Select className="width-100" value={edit_name} onChange={(value) => {
                        this.setState({
                            edit_name: value
                        })
                    }}>
                        {
                            edit_name_list.map(item => {
                                return <Option key={item} value={item === "全部" ? "" : item}>{item}</Option>
                            })
                        }
                    </Select>

                    <label className="ml">前台可见：</label>
                    <Select className="width-100" value={is_show} onChange={(value) => {
                        this.setState({
                            is_show: value
                        })
                    }}>
                        <Option value={""}>全部</Option>
                        <Option value={1}>可见</Option>
                        <Option value={0}>不可见</Option>
                    </Select>


                    <Button className="ml" type="primary" size="small" onClick={() => {
                        this.getSiteList();
                    }}>查 询</Button>

                    <Button type="primary" className="fr" ghost onClick={() => {
                        this.setState({
                            newVisible: true
                        })
                        this.getSpuSite()
                    }}>新增平台</Button>

                    <Button type="primary" className="fr" ghost onClick={() => {
                        this.setState({
                            batchVisible: true
                        })
                        this.getSpuSite()
                    }}>批量添加</Button>


                    <Table pagination={
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
                    } dataSource={list} columns={columns} rowKey={(record) => record.id} loading={loading}/>

                </Card>


                {batchVisible && <MatchAdd visible={batchVisible} list={spu_site_list}
                                           onCancel={() => {
                                               this.setState({
                                                   batchVisible: false
                                               })
                                           }} onOk={(values) => {
                    this.setState({
                        batchVisible: false
                    }, () => {
                        this.batchAdd(values)
                    })
                }}/>}

                {
                    newVisible && <NewAdd visible={newVisible} list={spu_site_list} onCancel={() => {
                        this.setState({
                            newVisible: false
                        })
                    }} onOk={(name, values) => {
                        this.setState({
                            newVisible: false
                        }, () => {
                            this.newAdd(name, values)
                        })
                    }}/>
                }

                {editVisible &&
                <Edit visible={editVisible} list={spu_site_list} rowName={rowName} rowId={rowId} onCancel={() => {
                    this.setState({
                        editVisible: false
                    })
                }} onOk={(name, values, id) => {
                    this.setState({
                        editVisible: false
                    }, () => {
                        this.Edit(name, values, id)
                    })
                }}/>}
            </div>
        )
    }
}
