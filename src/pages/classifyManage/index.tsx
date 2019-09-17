import React, {Fragment} from 'react'
import {
    Select,
    Icon,
    Button,
    Spin,
    Table,
    message,
    Card,
    Divider, Input
} from 'antd'
import EditClassify from './subPage/editClassify'
import NewClassify from './subPage/newClassify'
import ClassifyCalibration from '../../components/ClassifyCalibration'
import DeleteModal from '../../components/DeleteModal'
import axiosHttp from "../../utils/ajax";
import './index.less'

const Option = Select.Option;
const Search = Input.Search;

class ClassifyManage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: false,
            delLoading: false,
            popupLoading: false,
            totalCount: 0,
            dataList: [],
            editClassifyFlag: false,
            newCategoryFlag: false,
            classifyCalFlag: false,
            deleteFlag: false,
            languageType: 'cn',
            selectData: [],
            selectItem: '全部',
            editData: {},
            deleteId: 0,
            editingKey: '',
            newAddCatId: '', //选择新增的catId
        };
    }

    pageInfo = {
        "page": 1,
        "limit": 15,
        "cat1": null,
        "cat2": null,
        "cat3": null
    };
    params = {};
    scrollY = 0;
    timer: any = null;

    componentDidMount() {
        this.getBackstageCatHttp();
        this.getAllBackstageCatHttp();
        this.timer = setTimeout(() => {
            let elem: any = document.getElementsByClassName('ant-select-selection__clear');
            elem[0].addEventListener('click', this.clickFun);
        }, 1000);
        this.scrollY = window.innerHeight - 60 * 3 - 56 - 110;
    }

    clickFun = (e: any) => {
        e.stopPropagation();
        this._handleSureClassifyCal();
    };

    columns() {
        return [
            {
                title: '分类ID',
                dataIndex: 'cat_id',
                key: 'cat_id',
                width: '15%',
            },
            {
                title: '1级类目',
                dataIndex: 'cat_name_cn',
                key: 'cat_name_cn',
                width: '20%',
                editable: true,
                render: (text: any, record: any) => {
                    return (/^10/.test(record.cat_id) && <Fragment>
                        <span className="mr10">{record.cat_name_cn}</span><br/>
                        <span>{record.cat_name_en}</span>
                    </Fragment>)
                }
            },
            {
                title: '2级类目',
                dataIndex: 'cat2_name_cn',
                key: 'cat2_name_cn',
                width: '25%',
                editable: true,
                render: (text: any, record: any) => {
                    return (/^20/.test(record.cat_id) && <Fragment>
                        <span className="mr10">{record.cat_name_cn}</span><br/>
                        <span>{record.cat_name_en}</span>
                    </Fragment>)
                }
            },
            {
                title: '3级类目',
                dataIndex: 'cat3_name_cn',
                key: 'cat3_name_cn',
                width: '23%',
                editable: true,
                render: (text: any, record: any) => {
                    return (/^30/.test(record.cat_id) && <Fragment>
                        <span className="mr10">{record.cat_name_cn}</span><br/>
                        <span>{record.cat_name_en}</span>
                    </Fragment>)
                }
            },
            {
                title: 'SPU数',
                dataIndex: 'spu_count',
                key: 'spu_count',
                width: '9%',
                render: (spu_count: any) => {
                    return spu_count ? spu_count : 0
                }
            },
            {
                // title: '编辑/新增叶子',
                title: '操作',
                dataIndex: 'operation',
                width: '8%',
                render: (text: any, record: any) => {
                    return (
                        <div>
                                    <span title="编辑" className='pointer mr10'
                                          onClick={this.showEditClassifyPopup.bind(this, {
                                              cat_id: record.cat_id,
                                              cat_name_cn: record.cat_name_cn,
                                              cat_name_en: record.cat_name_en
                                          })}><Icon
                                        type='edit'/></span>
                            {
                                !/^30/.test(record.cat_id) &&
                                <span title="新增" className='pointer mr10'
                                      onClick={this.handleAdd.bind(this, record.cat_id)}><Icon
                                    type="plus-circle"/></span>
                            }
                            {
                                !!record.spu_count === false && !!record.children === false &&
                                <span title="删除" onClick={this.handleDelete.bind(this, record.cat_id)}
                                      className='pointer'><Icon
                                    type='delete'/></span>
                            }
                        </div>
                    );
                },
            },
        ]
    };

    handleAdd = (key: any) => {
        this.setState({
            newAddCatId: key,
            classifyCalFlag: false,
            newCategoryFlag: true
        });
    };


    getAllBackstageCatHttp = () => { //获取所有后台分类信息
        this.setState({
            popupLoading: true
        });
        axiosHttp('api/AdminSite/BackstageCat/GetAllBackstageCat', '', 'get').then((res) => {
            if (res.code === 200) {
                this.setState({
                    selectData: res.data,
                    popupLoading: false
                })
            } else {
                this.setState({
                    selectData: [],
                    popupLoading: false
                });
                message.error(res.msg)
            }
        })
    };


    getBackstageCatHttp = () => { //获取后台分类信息
        this.setState({
            loading: true
        });
        axiosHttp('api/AdminSite/BackstageCat/GetBackstageCat', this.pageInfo).then((res) => {
            if (res.code === 200) {
                const {cat1List, totalCount} = res.data;
                this.clearEmptyArrayCommonFun(cat1List);
                this.setState({
                    dataList: cat1List,
                    loading: false,
                    totalCount
                })
            } else {
                this.setState({
                    loading: false
                });
                message.error(res.msg)
            }
        })
    };
    clearEmptyArrayCommonFun = (data: any) => { //去掉children为空的数组
        for (let i = 0; i < data.length; i++) {
            if (data[i].children) {
                if (data[i].children.length === 0) {
                    data[i].children = null;
                } else {
                    this.clearEmptyArrayCommonFun(data[i].children);
                }
            }
        }
    };
    deleteBackstageCatHttp = (id: string) => { //删除后台分类数据
        let classIndex = +id.substring(0, 1),
            params = {
                [`cat${classIndex}_id`]: id
            };
        this.setState({
            delLoading: true
        });
        axiosHttp('api/AdminSite/BackstageCat/DeleteBackstageCat', params, "DELETE").then((res) => {
            if (res.code === 200) {
                message.success(res.msg);
                this.getBackstageCatHttp();
                this.getAllBackstageCatHttp();
            } else {
                message.error(res.msg)
            }
            this.setState({
                delLoading: false
            });
        })
    };
    handleDelete = (key: string) => {
        this.setState({
            classifyCalFlag: false,
            deleteFlag: true,
            deleteId: key
        });
    };
    _handleDeleteClass = () => {
        const dataList = [...this.state.dataList];
        const {deleteId} = this.state;
        this.setState({
            deleteFlag: false,
            dataList: dataList.filter(item => item.key !== deleteId)
        });
        this.deleteBackstageCatHttp(deleteId);
    };
    _handleSubmitNewCategory = () => {
        this.pageInfo.page = 1;
        this.getBackstageCatHttp();
        this.getAllBackstageCatHttp();
    };

    _handleSureClassifyCal = (values: object = {}) => {
        const {selectItem}: any = this.state;
        const {cat1 = '', cat2 = '', cat3 = ''}: any = values;
        if (selectItem === "全部" && cat1 === '') {
            this.setState({
                classifyCalFlag: false
            });
            return;
        }
        this.pageInfo.cat1 = cat1.key || null;
        this.pageInfo.cat2 = cat2.key || null;
        this.pageInfo.cat3 = cat3.key || null;
        let data = this.pageInfo;
        this.params = {cat1: data.cat1, cat2: data.cat2, cat3: data.cat3};
        let value = `${cat1.label}${cat2.label ? '/' + cat2.label : ''}${cat3.label ? '/' + cat3.label : ''}`;
        this.setState({
            selectItem: value === 'undefined' ? '全部' : value
        });
        this.cancelPopup();
        this.getBackstageCatHttp();
    };

    handleNewCategory = () => {
        this.setState({
            classifyCalFlag: false,
            newCategoryFlag: true
        })
    };
    // 显示删除弹框
    showEditClassifyPopup = (item: any) => {
        this.setState({
            classifyCalFlag: false,
            editClassifyFlag: true,
            editData: item
        })
    };
    // 关闭弹框
    cancelPopup = () => {
        this.setState({
            newAddCatId: '',
            editClassifyFlag: false,
            deleteFlag: false,
            newCategoryFlag: false,
            classifyCalFlag: false
        })
    };
    // 确定删除
    _handleSureEditClassify = () => {
        this.getBackstageCatHttp();
        this.getAllBackstageCatHttp();
    };
    turnPage = (page: any, pageSize: any) => {
        this.pageInfo.page = page;
        this.getBackstageCatHttp();
    };
    onShowSizeChange = (current: any, pageSize: any) => {
        this.pageInfo.page = current;
        this.pageInfo.limit = pageSize;
        this.getBackstageCatHttp();
    };
    showTotal = (total: any) => {
        return `共 ${total} 个记录`;
    };

    selectFocus = () => {
        const {classifyCalFlag} = this.state;
        this.setState({
            classifyCalFlag: !classifyCalFlag,
        });
    };
    _handleSearchClassify = (value: any) => {
        value = value.trim();
        if (value === '') {
            if (this.state.selectItem === "全部") {
                this.pageInfo = {...this.pageInfo, cat1: null, cat2: null, cat3: null, page: 1};
            } else {
                this.pageInfo = {...this.pageInfo, ...this.params, page: 1};
            }
            this.getBackstageCatHttp();
            return;
        } else if (value.length !== 8) {
            message.warning('类目Id为8位数字');
            return
        }
        const {selectData} = this.state;
        let cat2 = [], cat3 = [], flag = false;

        for (let i = 0; i < selectData.length; i++) {
            if (value === selectData[i].cat_id) {
                this.pageInfo.cat1 = value;
                this.pageInfo.cat2 = null;
                this.pageInfo.cat3 = null;
                flag = true;
                break;
            }
            cat2 = selectData[i].children ? selectData[i].children : [];
            for (let j = 0; j < cat2.length; j++) {
                if (value === cat2[j].cat_id) {
                    this.pageInfo.cat1 = selectData[i].cat_id;
                    this.pageInfo.cat2 = value;
                    this.pageInfo.cat3 = null;
                    flag = true;
                    break;
                }
                cat3 = cat2[j].children ? cat2[j].children : [];
                for (let m = 0; m < cat3.length; m++) {
                    if (cat3[m].cat_id === value) {
                        this.pageInfo.cat1 = selectData[i].cat_id;
                        this.pageInfo.cat2 = cat2[j].cat_id;
                        this.pageInfo.cat3 = value;
                        flag = true;
                        break;
                    }
                }
            }
        }
        if (flag === false) {
            message.warning('没有查询到此类目Id');
            return
        }
        this.pageInfo.page = 1;
        this.getBackstageCatHttp();
    };
    handleChange = (value: any) => {
        this.setState({
            languageType: value == 1 ? 'cn' : 'en'
        })
    };

    componentWillUnmount(): void {
        clearTimeout(this.timer);
        window.removeEventListener('click', this.clickFun);
    }

    render() {
        const {dataList = [], loading, popupLoading, editClassifyFlag, newCategoryFlag, classifyCalFlag, totalCount, selectData, editData, languageType, newAddCatId, selectItem, deleteFlag, delLoading} = this.state;
        const style = {
            width_120: {width: 120},
            width_200: {width: 200},
            width_auto: {width: 'auto'},
            marginTB10: {margin: '10px 0'},
            scroll: {y: this.scrollY, x: 1000},
            dropdownStyle: {width: 700, height: 465, padding: 10}
        };
        const classNum = +newAddCatId.substring(0, 1);
        return (
            <div className='h_percent100'>
                <Card
                    style={{width: '100%'}}
                    title="分类管理"
                >
                    <div>
                        <div className='mb10'>
                            <Select loading={popupLoading} open={classifyCalFlag}
                                    dropdownMatchSelectWidth={false} value={selectItem}
                                    onFocus={this.selectFocus} allowClear
                                    className="dropdownClassName"
                                    dropdownStyle={style.dropdownStyle}
                                    style={style.width_auto} dropdownRender={() => (
                                <div className="selectBox">
                                    <div className='select-title'><span>分类校准</span>
                                        <div className='fr'><span className='mr10'>分类语言:</span>
                                            <Select defaultValue='1' onChange={this.handleChange}
                                                    style={style.width_120}>
                                                <Option value='1'>中文</Option>
                                                <Option value='0'>英文</Option>
                                            </Select></div>
                                    </div>
                                    <Divider style={style.marginTB10}/>
                                    <ClassifyCalibration open={classifyCalFlag}
                                                         hide={this.cancelPopup}
                                                         data={selectData}
                                                         language={languageType}
                                                         sure={this._handleSureClassifyCal}
                                    />
                                </div>

                            )}
                            />
                            <Search style={style.width_200} placeholder="类目ID" enterButton="查询"
                                    onSearch={this._handleSearchClassify}
                            />
                            <Button className='fr' type="primary" onClick={this.handleNewCategory}>新增类目</Button>
                        </div>
                        <Spin spinning={loading}>
                            {/*total数据总数*/}
                            <Table rowKey="cat_id" className='table-wrap'
                                   dataSource={dataList}
                                   columns={this.columns()}
                                   pagination={dataList.length > 0 && {
                                       size: 'small',
                                       // hideOnSinglePage: true,
                                       showQuickJumper: true,
                                       total: totalCount,
                                       pageSize: this.pageInfo.limit,
                                       current: this.pageInfo.page,
                                       onChange: this.turnPage,
                                       showSizeChanger: true,
                                       onShowSizeChange: this.onShowSizeChange,
                                       pageSizeOptions: ['15', '30', '50', '100', '200'],
                                       showTotal: this.showTotal
                                   }}
                                   scroll={style.scroll}
                            />
                        </Spin>
                    </div>
                </Card>
                {/*编辑弹框*/}
                {editClassifyFlag ?
                    <EditClassify dataList={dataList} data={editData} hide={this.cancelPopup}
                                  sure={this._handleSureEditClassify}/> : null}
                {/*新增类目弹框*/}
                {
                    newCategoryFlag ?
                        <NewClassify data={dataList} newAddCatId={newAddCatId}
                                     title={`新增${classNum > 0 ? classNum + 1 + '级分类' : '商品分类'}`} hide={this.cancelPopup}
                                     sure={this._handleSubmitNewCategory}/> : null
                }

                <DeleteModal visible={deleteFlag} loading={delLoading} title='删除类目' content="你确定删除该类目吗?"
                             hide={this.cancelPopup}
                             sure={this._handleDeleteClass}/>
            </div>
        );
    }
}

export default ClassifyManage;
