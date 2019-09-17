import React, {Component} from 'react'
import {Card, Select, Modal, Button, Table, message, Icon, Switch, Form, Input} from 'antd'
import axiosHttp from "../../utils/ajax";
import moment from 'moment';
import Utils from "../../utils/utils";
import RangePickerCpn from "../../components/RangePickerCpn";
import PreviewArticleCpn from "../../components/previewArticleCpn";
import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const WHOLE = -1, IN_RELEASE = 1, LIST_OFFLINE = 2;  // 全部：-1  发布中：1  已下线：2
class ArticleManage extends Component {

    state = {
        loading: false,
        articleList: [],
        totalCount: 0,
        totalPages: 0,

        articleCategory: [],
        articleEditor: [],
        isPreviewArticle: false,
        articleId: ''
    };
    pageInfo = {
        page: 1,
        limit: 15,
        start_time: undefined, //发布开始时间
        end_time: undefined,//发布结束时间
        // start_time: Utils.timeFormat(moment().subtract(1, "months")), //发布开始时间
        // end_time: Utils.timeFormat(moment()),//发布结束时间
        category_id: "",//文章类型id
        last_edit_id: '',//修订者id
        publish_pc: WHOLE, //PC版发布状态(// 全部：-1  可见：1  不可见：2)
        publish_h5: WHOLE, //h5版发布状态(// 全部：-1  可见：1  不可见：2)
        keyword: '',
        // fileId: '',//排序字段
        // order: '',//升序：asc,降序:desc
    };

    componentDidMount() {
        this.getArticleCategoryListHttp();
        this.getArticleEditerListHttp();
        this.getArticleListPageHttp();
    }

    getArticleCategoryListHttp = (name) => { //获取文章分类列表
        axiosHttp('api/AdminSite/Article/GetArticleCategoryList', {}).then((res) => {
            if (res.code === 200) {
                this.setState({
                    articleCategory: res.data
                })
            } else {
                message.error(res.msg)
            }
        }).catch((e) => {
            console.log(e);
        })
    };


    getArticleEditerListHttp = (name) => { //获取修订者集合
        axiosHttp('api/AdminSite/Article/GetArticleEditerList', {}).then((res) => {
            if (res.code === 200) {
                this.setState({
                    articleEditor: res.data
                })
            } else {
                message.error(res.msg)
            }
        }).catch((e) => {
            console.log(e);
        })
    };


    getArticleListPageHttp = () => { //        根据条件获取文章列表分页数据
        this.setState({
            loading: true
        });
        axiosHttp("api/AdminSite/Article/GetArticleListPage", this.pageInfo).then(res => {
            if (res.code === 200) {
                const {list = [], totalPages = 0, totalCount = 0} = res.data;
                this.setState({
                    articleList: list,
                    totalPages: totalPages,
                    totalCount: totalCount,
                    loading: false
                })
            } else {
                this.setState({
                    articleList: [],
                    totalPages: 0,
                    totalCount: 0,
                    loading: false
                })
            }
        }).catch(e => {
            this.setState({
                articleList: [],
                totalPages: 0,
                totalCount: 0,
                loading: false
            })
        })
    };
    switchConfirmPc = (publish, id, index) => {
        confirm({
            title: publish === IN_RELEASE ? '下线PC文章' : '发布PC文章',
            content: publish === IN_RELEASE ? '关闭后，所选文章将从前台下线。' : '开启后，所选文章将发布至前台。',
            onOk: () => {
                this.UpdateArticlePublishStatusPcHttp(id, publish, index);
            },
            onCancel() {
                message.info('已取消！')
            },
        });
    };
    switchConfirmH5 = (publish, id, index) => {
        confirm({
            title: publish === IN_RELEASE ? '下线H5文章' : '发布H5文章',
            content: publish === IN_RELEASE ? '关闭后，所选文章将从前台下线。' : '开启后，所选文章将发布至前台。',
            onOk: () => {
                this.UpdateArticlePublishStatusH5Http(id, publish, index);
            },
            onCancel() {
                message.info('已取消！')
            },
        });
    };
    deleteArticleByIdHttp = (id, index) => {//删除文章
        axiosHttp('api/AdminSite/Article/DeleteActicleById', Utils.obj2FormData({article_id: id})).then(res => {
            if (res.code === 200) {
                message.success('删除成功');
                const {page} = this.pageInfo;
                let {articleList} = this.state;
                if (this.state.articleList.length === 1) {
                    this.pageInfo.page = page > 1 ? page - 1 : 1;
                }
                articleList.splice(index, 1);
                this.setState({
                    articleList
                })
                // this.getArticleListPageHttp();
            } else {
                message.error(res.msg);
            }

        }).catch(e => {
            message.error('删除失败')
        })
    };
    UpdateArticlePublishStatusPcHttp = (id, status, index) => { //修改文章发布状态
        let param = {
            article_id: id,
            plat: 1, //1:PC 2:H5
            status: status === IN_RELEASE ? LIST_OFFLINE : IN_RELEASE, //1:上线 2:下线
        };
        axiosHttp('api/AdminSite/Article/UpdateActiclePublishStatus', Utils.obj2FormData(param)).then(res => {
            if (res.code === 200) {
                const {articleList} = this.state;
                articleList[index].publish_pc = (status === IN_RELEASE ? LIST_OFFLINE : IN_RELEASE);
                this.setState({
                    articleList
                })
            } else {
                message.error(res.msg);
            }
        }).catch(e => {
            message.error('更新失败');
        })
    };
    UpdateArticlePublishStatusH5Http = (id, status, index) => { //修改文章发布状态
        let param = {
            article_id: id,
            plat: 2, //1:PC 2:H5
            status: status === IN_RELEASE ? LIST_OFFLINE : IN_RELEASE, //1:上线 2:下线
        };
        axiosHttp('api/AdminSite/Article/UpdateActiclePublishStatus', Utils.obj2FormData(param)).then(res => {
            if (res.code === 200) {
                const {articleList} = this.state;
                articleList[index].publish_h5 = (status === IN_RELEASE ? LIST_OFFLINE : IN_RELEASE);
                this.setState({
                    articleList
                })
            } else {
                message.error(res.msg);
            }
        }).catch(e => {
            message.error('更新失败');
        })
    };
    _handlePreviewArticle = (articleId) => {
        // record.keyword = record.keyword.split(',');
        this.setState({
            articleId,
            isPreviewArticle: true
        })
    };

    columns() {
        return ([
            {
                title: "文章ID",
                key: 'article_id',
                dataIndex: 'article_id'
            },
            {
                title: "文章title",
                key: 'title',
                dataIndex: 'title',
                render: (text, record) => {
                    return <span className="a"
                                 onClick={this._handlePreviewArticle.bind(this, record.article_id)}>{record.title}</span>
                }
            },
            {
                title: "作者",
                key: 'author',
                dataIndex: 'author'
            },
            {
                title: "文章类型",
                key: 'category_name',
                dataIndex: 'category_name'
            },
            {
                title: "修订者",
                key: 'last_edit_name',
                dataIndex: 'last_edit_name'
            },
            {
                title: "最近修订时间",
                key: 'update_time',
                dataIndex: 'update_time',
                render: (text, record, index) => {
                    return Utils.timeFormat(record.update_time, 'YYYY-MM-DD')
                }
            },
            {
                title: "最近发布时间",
                key: 'add_time',
                dataIndex: 'add_time',
                render: (text, record, index) => {
                    return Utils.timeFormat(record.add_time, 'YYYY-MM-DD')
                }
            },
            {
                title: "PC发布/下线",
                key: 'publish_pc',
                dataIndex: 'publish_pc',
                render: (text, record, index) => {
                    return (
                        <Switch checked={text === IN_RELEASE}
                                onChange={this.switchConfirmPc.bind(this, text, record.article_id, index)}/>
                    )
                }
            },
            {
                title: "h5发布/下线",
                key: 'publish_h5',
                dataIndex: 'publish_h5',
                render: (text, record, index) => {
                    return (
                        <Switch checked={text === IN_RELEASE}
                                onChange={this.switchConfirmH5.bind(this, text, record.article_id, index)}/>)
                }
            },
            {
                title: "操作",
                key: 'action',
                render: (text, record, index) => {
                    return (<div>
                        <Icon title="编辑" className="pit" type="edit" onClick={() => {
                            this.props.history.push('/columnArticle/' + record.article_id)
                        }}/>
                        {record.publish_pc === LIST_OFFLINE && record.publish_h5 === LIST_OFFLINE ?
                            <Icon title='删除' className="ml pit" type="delete" onClick={() => {
                                confirm({
                                    title: '删除文章',
                                    content: '删除后，将从列表移除该项，不可恢复',
                                    onOk: () => {
                                        this.deleteArticleByIdHttp(record.article_id, index)
                                    },
                                    onCancel() {
                                        message.info('已取消！')
                                    },
                                });
                            }}/> : null}
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
                this.pageInfo = {...this.pageInfo, ...values, page: 1};
                this.getArticleListPageHttp();
            }
        });
    };
    turnPage = (page, pageSize) => {
        this.pageInfo.page = page;
        this.pageInfo.limit = pageSize;
        this.getArticleListPageHttp();
    };
    onShowSizeChange = (current, pageSize) => {
        this.pageInfo.page = 1;
        this.pageInfo.limit = pageSize;
        this.getArticleListPageHttp();
    };
    handleSubmitFun = (startTime, endTime) => {
        // console.log(Util.momentFormat(moment(startTime)), Util.momentFormat(moment(endTime)));
        this.pageInfo.startOnline = Utils.timeFormat(moment(startTime));
        this.pageInfo.endOnline = Utils.timeFormat(moment(endTime));
    };
    _handleResetTimer = () => {
        this.pageInfo.startOnline = '';
        this.pageInfo.endOnline = '';
    };
    showTotal = (total) => {
        return `共 ${total} 个记录`;
    };
    cancelPopup = () => {
        this.setState({
            catRelationFlag: false,
            isPreviewArticle: false,
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loading, totalCount, articleList, articleCategory, articleEditor, isPreviewArticle, articleId = ''} = this.state;
        const {page, limit} = this.pageInfo;
        const style = {
            width_120: {width: 120},
            width_100: {width: 100},
        };
        return (
            <div className='h_percent100'>
                <Card style={{width: '100%'}} title="文章管理">
                    <Form className="homeManage" onSubmit={this.handleSubmit} layout="inline">
                        <FormItem label='发布时间'>
                            <RangePickerCpn type='start' handleSubmit={this.handleSubmitFun}
                                            resetTime={this._handleResetTimer}/>
                        </FormItem>
                        <FormItem label='文章类型'>
                            {getFieldDecorator('category_id', {
                                initialValue: ''
                            })(
                                <Select style={style.width_120}>
                                    <Option value={''}>全部</Option>
                                    {
                                        articleCategory.map((item, index) => {
                                            return <Option key={index}
                                                           value={item.category_id + ''}>{item.category_name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='修订者'>
                            {getFieldDecorator('last_edit_id', {
                                initialValue: ''
                            })(
                                <Select style={style.width_100}>
                                    <Option value=''>全部</Option>
                                    {
                                        articleEditor.map(item => {
                                            return <Option key={item.last_edit_id}
                                                           value={item.last_edit_id}>{item.last_edit_name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='PC发布状态'>
                            {getFieldDecorator('publish_pc', {
                                initialValue: -1
                            })(
                                <Select style={style.width_100}>
                                    <Option value={-1}>全部</Option>
                                    <Option value={1}>发布中</Option>
                                    <Option value={2}>已下线</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='h5发布状态'>
                            {getFieldDecorator('publish_h5', {
                                initialValue: -1
                            })(
                                <Select style={style.width_100}>
                                    <Option value={-1}>全部</Option>
                                    <Option value={1}>发布中</Option>
                                    <Option value={2}>已下线</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('keyword', {
                                initialValue: ''
                            })(
                                <Input placeholder="文章title关键词"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button className="ml" type="primary" htmlType='submit'>查 询</Button>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" ghost onClick={() => {
                                this.props.history.push('/columnArticle/addArticle')
                            }}>新增文章</Button>
                        </FormItem>
                    </Form>
                    <Table loading={loading} pagination={
                        {
                            size: 'small',
                            total: totalCount,
                            pageSize: limit,
                            current: page,
                            onChange: this.turnPage,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                            pageSizeOptions: ['15', '30', '50', '100', '200'],
                            showTotal: this.showTotal,
                            hideOnSinglePage: true
                        }
                    } columns={this.columns()} dataSource={articleList} rowKey={(record) => record.article_id}/>
                </Card>
                {
                    isPreviewArticle ? <PreviewArticleCpn articleId={articleId}
                                                          title='预览文章'
                                                          onCancelPopup={this.cancelPopup}/> : null
                }

            </div>
        )
    }
}

export default Form.create()(ArticleManage)
