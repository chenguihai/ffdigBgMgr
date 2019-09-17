import React, {Component} from 'react'
import {Table, Button, Card, Icon, message, Row, Col, Input, Select, Rate, Popover} from 'antd'
import moment from 'moment'
import {http} from "../../utils/ajax";
import ProductList from './productList'

const Option = Select.Option;
const SPAN_6 = 6, SPAN_10 = 10, SPAN_14 = 14, SPAN_18 = 18;
export default class Version extends Component {

    state = {
        name: '',
        visible: false,
        selectList: []
    };

    componentDidMount() {

    }

    submit = () => {
        if (this.state.selectList.length < 8) {
            message.info('至少添加八个');
            return
        }
        const params = {
            name: this.state.name,
            ids: this.state.selectList.map(item => item._id).join(',')
        }
        http.post('api/AdminSite/HomePageAdmin/InsertOrEditHomePageCol', params).then(res => {
            message.success('发布成功')
            this.props.history.push('/ffManage/homeManage')
        }).catch(e => {
            message.error('发布失败')
        })
    }

    render() {
        const {name, visible, selectList} = this.state

        const columns = [
            {
                title: '',
                key: 'actions',
                render: (text, record, index) => {
                    return <Icon type="minus-circle" onClick={() => {
                        selectList.splice(index, 1);
                        this.setState({
                            selectList
                        })
                    }}/>
                }
            },
            {
                title: "产品图片",
                key: "icon",
                render: (text, record) => {
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
                    let {bskuCmiCat: {cmiId}, maxPrice, name, cmicatBottom: {cat_name_cn}, designer_by, designer, _id} = record
                    return (<div>
                        <Row>
                            <Col className="title" span={SPAN_6}>SPUID</Col><Col span={SPAN_18}>{cmiId}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>售价</Col><Col span={SPAN_18}>{maxPrice}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>产品名称</Col><Col span={SPAN_18}><a
                            href={`http://www.ffdig.com/detailPage?product=${_id}`} target="_blank">{name}</a></Col>
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
            <div className='h_percent100'>
                <Card
                    style={{width: '100%'}}
                    title={"前台首页管理"}
                >
                    <h3 className="a mt8 mb" onClick={() => {
                        this.props.history.push("/ffManage/homeManage");
                    }}><Icon type="left-circle" theme="filled"/>新增栏目</h3>
                    <Row>
                        <Col span={2}><span className="error">*</span><b>前台栏目名称</b></Col>
                        <Col span={22}>
                            <Input placeholder="限30个字以内" value={name} onChange={e => {
                                const value = e.target.value
                                if (value.length > 30) return
                                this.setState({
                                    name: value
                                })
                            }}/>
                        </Col>

                    </Row>
                    <Row className="mt8">
                        <Col span={2}><span className="error">*</span><b>前台展示产品</b></Col>
                        <Col span={22}>
                            <Button type="primary" ghost onClick={() => {

                                this.setState({
                                    visible: true
                                })
                            }}>+添加产品</Button>
                            <span>(至少8个产品已选{this.state.selectList.length}个)</span>
                        </Col>
                    </Row>

                    {selectList.length > 0 && <Table rowKey={r => r._id} columns={columns} dataSource={selectList}/>}


                    <div style={{paddingTop: 20}}>
                        <Button className="fl" type="text" onClick={() => {
                            this.props.history.push("/ffManage/homeManage");
                        }}>取消</Button>

                        <Button disabled={name === '' || selectList.length === 0} type="primary" onClick={() => {
                            this.submit();
                        }}>提交并发布</Button>
                    </div>

                </Card>
                {visible &&
                <ProductList ids={selectList.map(i => i._id).join(',')} visible={visible} onOk={(selectList) => {
                    this.setState({
                        visible: false,
                        selectList: this.state.selectList.concat(selectList)
                    })
                }} onCancel={() => {
                    this.setState({
                        visible: false
                    })
                }}/>}

            </div>
        )
    }
}
