import React, {Component} from 'react'
import {Table, Row, Col, Modal, Select, Rate, Popover} from 'antd'
import Filter from '../../components/Filter/index'
import moment from 'moment'
import {http} from "../../utils/ajax";

const Option = Select.Option;
const SPAN_6 = 6, SPAN_10 = 10, SPAN_14 = 14, SPAN_18 = 18;
export default class ProductList extends Component {
    state = {
        loading: false,
        productGroupNameValue: "",
        productGroupName: [],
        productGroupMsg: [],
        selectProduct: [],
        selectCount: 0,
        selectIds: [],
        cmtCountSort: '', // 评论数排序 升序：asc，降序:desc
        cmtStarsSort: '', // 评价星级排序 升序：asc，降序:desc
        priceSort: '', //价格排序 升序：asc，降序:desc
        ondateOnlineSort: '', // 上架时间排序 升序：asc，降序:desc
    }

    componentDidMount() {
        this.getProductGroupName()
        this.getProductGroupMsg();
    }

    sort = () => {
        this.getProductGroupMsg();
    }
    getProductGroupName = () => {
        http.get('api/AdminSite/HomePageAdmin/GetProductGroupName').then(res => {
            this.setState({
                productGroupName: res
            })
        })
    }
    getProductGroupMsg = () => {
        this.setState({loading: true})
        const {cmtCountSort, cmtStarsSort, priceSort, ondateOnlineSort} = this.state
        const params = {
            ids: this.props.ids === '' ? undefined : this.props.ids,
            name: this.state.productGroupNameValue === '' ? undefined : this.state.productGroupNameValue,
            cmtCountSort: cmtCountSort === '' ? undefined : cmtCountSort,
            cmtStarsSort: cmtStarsSort === '' ? undefined : cmtStarsSort,
            priceSort: priceSort === '' ? undefined : priceSort,
            ondateOnlineSort: ondateOnlineSort === '' ? undefined : ondateOnlineSort,

        }
        http.post('api/AdminSite/HomePageAdmin/GetProductGroupMsg', params).then(res => {
            this.setState({
                loading: false,
                productGroupMsg: res.list
            })
        })
    }
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                selectCount: selectedRows.length,
                selectIds: selectedRowKeys,
                selectProduct: selectedRows
            })
        },
        getCheckBoxProps: record => {
            return {}
        }
    }

    render() {
        const {productGroupNameValue, productGroupName, productGroupMsg} = this.state

        const columns = [
            {
                title: "产品图片",
                key: "icon",
                render: (text, record) => {
                    // let {detail} = record
                    // let img = detail && detail.images && detail.images[0] && detail.images[0] || {}
                    // let img_350 = img.scaled_paths && detail.images[0].scaled_paths['_350'] && detail.images[0].scaled_paths['_350'].path || ''
                    // let img_750 = img.scaled_paths && detail.images[0].scaled_paths['_750'] && detail.images[0].scaled_paths['_750'].path || img.url || ''
                    let {images = []} = record.detail;
                    let img = (images.length > 0 && images[0]) || {};
                    let {scaled_paths = {}} = img;
                    let img_350 = (scaled_paths['_350'] && scaled_paths['_350'].path) || img.url || '',
                        img_750 = (scaled_paths['_750'] && scaled_paths['_750'].path) || img.url || '';
                    return (
                        <Popover placement="right" title={null}
                                 content={<div style={{width: 750, minHeight: "100vh"}}><img width="750" src={img_750}
                                                                                             alt="产品大图片"/>
                                 </div>}>
                            <img width="200" src={img_350} alt="产品图片"/>
                        </Popover>

                    )
                }
            },
            {
                title: "产品详情",
                key: "info",
                render: (text, record) => {
                    let {bskuCmiCat: {cmiId}, maxPrice, name, cmicatBottom: {cat_name_cn}, designer_by, designer, _id} = record;
                    return (<div>
                        <Row>
                            <Col className="title" span={SPAN_6}>SPUID</Col><Col span={SPAN_18}>{cmiId}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>售价</Col><Col span={SPAN_18}>{maxPrice}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>产品名称</Col><Col span={SPAN_18}><a
                            href={`http://www.ffdig.com/detailPage?product=${_id}`} target='_blank'
                            rel="产品详情">{name}</a></Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>产品分类</Col><Col span={SPAN_18}>{cat_name_cn}</Col>
                        </Row>
                        {/* <Row>
                                <Col className="title" span={SPAN_6}>SKU数</Col><Col span={SPAN_18}>{count_sku}</Col>
                           </Row> */}
                        {/* <Row>
                               <Col className="title" span={SPAN_6}>规格</Col><Col span={SPAN_18}>
                                <Select className="width-100" defaultValue={att[0].value[0] && att[0].value[0].name}>
                                    {
                                        att[0].value.map(item => {
                                            return <Option key={item.name}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                                <Select className="width-200" defaultValue={att[1].value[0] && att[1].value[0].name}>
                                    {
                                        att[1].value.map(item => {
                                            return <Option key={item.name}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Col>
                           </Row> */}
                        <Row>
                            <Col className="title" span={SPAN_6}>品牌</Col><Col span={SPAN_18}>{designer || ''}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>设计师</Col><Col span={SPAN_18}>{designer_by || ''}</Col>
                        </Row>
                    </div>)
                }
            },
            {
                title: "产品状态",
                key: "status",
                render: (text, record) => {
                    let {isOffSale, ondateOnline, updateDateTime, createDateTime} = record
                    return (<div>
                            <Row>
                                <Col className="title" span={SPAN_10}>当前状态</Col><Col
                                span={SPAN_14}>已{isOffSale ? '下' : '上'}架</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_10}>上架时间</Col><Col
                                span={SPAN_14}>{ondateOnline && moment(ondateOnline * 1000).format("YYYY-MM-DD HH:mm")}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_10}>更新时间</Col><Col
                                span={SPAN_14}>{updateDateTime && moment(updateDateTime * 1000).format("YYYY-MM-DD HH:mm")}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_10}>创建时间</Col><Col
                                span={SPAN_14}>{createDateTime && moment(createDateTime * 1000).format("YYYY-MM-DD HH:mm")}</Col>
                            </Row>
                        </div>

                    )
                }
            },
            {
                title: "产品热度",
                key: "hot",
                render: (text, record) => {
                    let {sale_count, cmtCount, cmtStar} = record
                    return (
                        <div>
                            <Row>
                                <Col className="title" span={SPAN_10}>当前销量</Col><Col span={SPAN_14}>{sale_count}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_10}>评论数</Col><Col span={SPAN_14}>{cmtCount || 0}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_10}>评价星级</Col><Col span={SPAN_14}>{<Rate disabled
                                                                                                           style={{fontSize: 12}}
                                                                                                           defaultValue={+cmtStar}/>}</Col>
                            </Row>
                        </div>
                    )
                }
            }
        ]
        return (
            <Modal width="80%" visible={this.props.visible} onCancel={() => {
                if (this.props.onCancel) {
                    this.props.onCancel()
                }
            }} onOk={() => {
                if (this.props.onOk) {
                    this.props.onOk(this.state.selectProduct)
                }
            }}>
                <Row>
                    <Col span={3}>
                        产品组名称
                    </Col>
                    <Col span={21}>
                        <Select className="width-200 modal-select" value={productGroupNameValue} onChange={v => {
                            this.setState({
                                productGroupNameValue: v
                            }, () => {
                                this.getProductGroupMsg()
                            })
                        }}>
                            <Option value="">全部</Option>
                            {
                                productGroupName.map(i => {
                                    return <Option key={i}>{i}</Option>
                                })
                            }
                        </Select>
                    </Col>
                </Row>
                <div className="filterWrap">
                    <span>已选（{this.state.selectCount}）</span>
                    <div>
                        <span className="lh-35 va-top">评论数</span>
                        <Filter onClick={(btn, active) => {
                            if (active) {
                                if (btn === 'up') {
                                    this.setState({
                                        cmtCountSort: 'asc'
                                    }, () => {
                                        this.sort()
                                    })
                                } else {
                                    this.setState({
                                        cmtCountSort: 'desc'
                                    }, () => {
                                        this.sort()
                                    })
                                }
                            } else {
                                this.setState({
                                    cmtCountSort: ''
                                }, () => {
                                    this.sort()
                                })
                            }

                        }}/>
                        <span className="lh-35 va-top">评价星级</span>
                        <Filter onClick={(btn, active) => {
                            if (active) {
                                if (btn === 'up') {
                                    this.setState({
                                        cmtStarsSort: 'asc'
                                    }, () => {
                                        this.sort()
                                    })
                                } else {
                                    this.setState({
                                        cmtStarsSort: 'desc'
                                    }, () => {
                                        this.sort()
                                    })
                                }
                            } else {
                                this.setState({
                                    cmtStarsSort: ''
                                }, () => {
                                    this.sort()
                                })
                            }

                        }}/>
                        <span className="lh-35 va-top">价格</span>
                        <Filter onClick={(btn, active) => {
                            if (active) {
                                if (btn === 'up') {
                                    this.setState({
                                        priceSort: 'asc'
                                    }, () => {
                                        this.sort()
                                    })
                                } else {
                                    this.setState({
                                        priceSort: 'desc'
                                    }, () => {
                                        this.sort()
                                    })
                                }
                            } else {
                                this.setState({
                                    priceSort: ''
                                }, () => {
                                    this.sort()
                                })
                            }

                        }}/>
                        <span className="lh-35 va-top">上架时间</span>
                        <Filter onClick={(btn, active) => {
                            if (active) {
                                if (btn === 'up') {
                                    this.setState({
                                        ondateOnlineSort: 'asc'
                                    }, () => {
                                        this.sort()
                                    })
                                } else {
                                    this.setState({
                                        ondateOnlineSort: 'desc'
                                    }, () => {
                                        this.sort()
                                    })
                                }
                            } else {
                                this.setState({
                                    ondateOnlineSort: ''
                                }, () => {
                                    this.sort()
                                })
                            }

                        }}/>
                    </div>
                </div>
                <Table loading={this.state.loading} columns={columns} dataSource={productGroupMsg}
                       rowKey={r => r._id} rowSelection={this.rowSelection}/>
            </Modal>
        )
    }
}
