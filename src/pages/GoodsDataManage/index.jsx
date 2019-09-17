import React, {Component} from 'react'
import {
    Card,
    DatePicker,
    Select,
    Input,
    Button,
    Table,
    AutoComplete,
    Modal,
    Col,
    Row,
    message,
    Popover,
    Rate,
} from 'antd'
import {NavLink} from 'react-router-dom'
import Filter from '../../components/Filter/index'
import {http} from "../../utils/ajax";
import moment from 'moment'
import Classify from '../classifyManage/selectClassify'
import './index.less'

const {RangePicker} = DatePicker;
const {Option} = Select;
const SPAN_5 = 5, SPAN_6 = 6, SPAN_18 = 18, SPAN_19 = 19;

export default class GoodsDataManage extends Component {
    state = {
        product_list: [],
        spu_site_list: [],
        designer_list: [],
        designer_list_filter: [],
        designer_by_list: [],
        designer_by_list_filter: [],
        site: '', // 平台
        isOffSale: '', // 上下架状态:上架-false,下架-true,全部-null
        designer: '', //品牌
        designer_by: '', // 设计师
        catid: '', //底级分类id
        cmtStars: '', // 评价星级
        keywords: '', // 关键词
        ondateOnlineBg: '', // 上架开始时间 日期统一转为秒级时间戳
        ondateOnlineEd: '', // 上架结束时间
        updateData: [],
        updateDateTimeBg: '', // 更新开始时间
        updateDateTimeEd: '', // 更新结束时间
        cmtCountSort: '', // 评论数排序 升序：asc，降序:desc
        cmtStarSort: '', // 评价星级排序 升序：asc，降序:desc
        priceSort: '', //价格排序 升序：asc，降序:desc
        ondateOnlineSort: '', // 上架时间排序 升序：asc，降序:desc
        page: 1,
        limit: 20,
        total: 0,
        loading: false,
        selectCount: 0,
        selectIds: [],
        visible: false,
        homeName: '',
        homeNameError: false
    };

    componentDidMount() {
        this.getSpuSite();
        this.getDesigner();
        this.getDesignerBy();
        this.getProduct();
        // document.addEventListener('scroll', (e) => {
        //     let s = document.querySelector('html')
        //     if(s.scrollTop === (document.body.scrollHeight - document.body.clientHeight)) {
        //         this.setState({
        //             page: this.state.page + 1
        //         }, () => {
        //             this.getProduct()
        //         })
        //     }
        // })
    }

    // 平台
    getSpuSite = () => {
        http.get('api/AdminSite/ProductGroup/GetSpuSite').then(res => {
            this.setState({
                spu_site_list: res
            })
        }).catch((e) => {
            console.error(e);
        })
    };
    // 品牌
    getDesigner = () => {
        http.get('api/AdminSite/ProductGroup/GetProductDesigner').then(res => {
            this.setState({
                designer_list: res
            })
        }).catch((e) => {
            console.error(e);
        })
    };
    // 设计师
    getDesignerBy = () => {
        http.get('api/AdminSite/ProductGroup/GetProductDesignerBy').then(res => {
            this.setState({
                designer_by_list: res
            })
        }).catch((e) => {
            console.error(e);
        })
    };

    getProduct = () => {
        const {
            site, isOffSale, designer, designer_by, catid, cmtStars,
            keywords, ondateOnlineBg, ondateOnlineEd,
            updateDateTimeBg, updateDateTimeEd, cmtCountSort,
            cmtStarSort, priceSort, ondateOnlineSort, page, limit
        } = this.state;
        let params = {
            site: site === '' ? undefined : site, // 平台
            isOffSale: isOffSale === '' ? undefined : isOffSale === '1', // 上下架状态:上架-false,下架-true,全部-null
            designer: designer === '' ? undefined : designer, //品牌
            designer_by: designer_by === '' ? undefined : designer_by,  // 设计师
            catid: catid === '' ? undefined : catid.cat3 || catid.cat2 || catid.cat1,  //底级分类id
            cmtStar: cmtStars === '' ? undefined : cmtStars,  // 评价星级
            keywords: keywords === '' ? undefined : keywords.replace(/，/g, ',').replace(/\r|\n|\s/g, "").replace(/,$/g, ""),  // 关键词
            ondateOnlineBg: ondateOnlineBg === '' ? undefined : ondateOnlineBg.unix(),  // 上架开始时间 日期统一转为秒级时间戳
            ondateOnlineEd: ondateOnlineEd === '' ? undefined : ondateOnlineEd.unix(),  // 上架结束时间

            updateDateTimeBg: updateDateTimeBg === '' ? undefined : updateDateTimeBg,  // 更新开始时间
            updateDateTimeEd: updateDateTimeEd === '' ? undefined : updateDateTimeEd,  // 更新结束时间
            cmtCountSort: cmtCountSort === '' ? undefined : cmtCountSort,  // 评论数排序 升序：asc，降序:desc
            cmtStarSort: cmtStarSort === '' ? undefined : cmtStarSort, // 评价星级排序 升序：asc，降序:desc
            priceSort: priceSort === '' ? undefined : priceSort,  //价格排序 升序：asc，降序:desc
            ondateOnlineSort: ondateOnlineSort === '' ? undefined : ondateOnlineSort,  // 上架时间排序 升序：asc，降序:desc
            page: page,
            limit: limit
        };
        this.setState({
            loading: true
        });

        ///
        http.post('api/AdminSite/ProductGroup/GetProductMsg', params).then(res => {
            this.setState({
                product_list: res.list,
                loading: false
            })
        }).catch((e) => {
            console.error(e);
        })
        // http.post('api/AdminSite/ProductGroup/GetProductMsgPg', params).then(res => {

        //     this.setState({
        //         total: res.totalCount
        //     })
        // }).catch((e) => {
        //     console.error(e);
        // })
    };

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let ids = selectedRows.map((item, index) => item._id);
            this.setState({
                selectCount: selectedRows.length,
                selectIds: ids
            })
        },
        getCheckBoxProps: record => {
            return {}
        }
    }

    onOk = () => {
        message.info("加载中，请等待...");
        let {homeName, selectIds} = this.state;
        if (homeName.length === 0 || homeName.length > 16) {
            this.setState({
                homeNameError: true
            })
            return
        } else {
            http.post('api/AdminSite/ProductGroup/InsertProductGroup', {
                name: homeName,
                ids: selectIds.join(',')
            }).then(res => {
                message.success("添加到首页成功");
                this.onCancel();
            }).catch((e) => {
                message.error(e.data.msg);
            })
        }

    }

    onCancel = () => {
        this.setState({
            visible: false
        })
    }

    render() {
        const {
            product_list, spu_site_list, designer_list, designer_list_filter, designer_by_list, designer_by_list_filter,
            site, isOffSale, designer, designer_by, cmtStars, page,
            keywords, ondateOnlineBg, ondateOnlineEd, loading, updateData,
            visible, selectCount, homeName, homeNameError
        } = this.state;

        const columns = [
            {
                width: "20%",
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
                width: "30%",
                title: "产品详情",
                key: "info",
                render: (text, record) => {
                    let {bskuCmiCat: {cmiId}, maxPrice, name, cmicatBottom: {cat_name_cn}, count_sku, att = [], designer_by, designer} = record;
                    return (<div>
                        <Row>
                            <Col className="title" span={SPAN_6}>SPUID</Col><Col span={SPAN_18}>{cmiId}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>售价</Col><Col span={SPAN_18}>{maxPrice}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>产品名称</Col><Col span={SPAN_18}>{name}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>产品分类</Col><Col span={SPAN_18}>{cat_name_cn}</Col>
                        </Row>
                        <Row>
                            <Col className="title" span={SPAN_6}>SKU数</Col><Col span={SPAN_18}>{count_sku}</Col>
                        </Row>
                        {
                            att.length > 0 ? <Row>
                                <Col className="title" span={SPAN_6}>规格</Col><Col span={SPAN_18}>
                                <Select size="small" className="width-100"
                                        defaultValue={att[0].value[0] && att[0].value[0].name}>
                                    {
                                        att[0].value.map(item => {
                                            return <Option key={item.name} value={item.name}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                                {
                                    att.length >= 2 ? <Select size="small" className="width-100 ml"
                                                              defaultValue={att[1].value[0] && att[1].value[0].name}>
                                        {
                                            att[1] && att[1].value.map(item => {
                                                return <Option key={item.name} value={item.name}>{item.name}</Option>
                                            })
                                        }
                                    </Select> : null
                                }
                            </Col>
                            </Row> : null
                        }
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
                width: "25%",
                title: "产品状态",
                key: "status",
                render: (text, record) => {
                    let {isOffSale, ondateOnline, updateDateTime, createDateTime} = record;
                    return (<div>
                            <Row>
                                <Col className="title" span={SPAN_6}>当前状态</Col><Col
                                span={SPAN_18}>已{isOffSale ? '下' : '上'}架</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_6}>上架时间</Col><Col
                                span={SPAN_18}>{ondateOnline && moment(ondateOnline * 1000).format("YYYY-MM-DD HH:mm")}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_6}>更新时间</Col><Col
                                span={SPAN_18}>{updateDateTime && moment(updateDateTime * 1000).format("YYYY-MM-DD HH:mm")}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_6}>创建时间</Col><Col
                                span={SPAN_18}>{createDateTime && moment(createDateTime * 1000).format("YYYY-MM-DD HH:mm")}</Col>
                            </Row>
                        </div>

                    )
                }
            },
            {
                width: "25%",
                title: "产品热度",
                key: "hot",
                render: (text, record) => {
                    let {sale_count, cmtCount, cmtStar} = record;
                    return (
                        <div>
                            <Row>
                                <Col className="title" span={SPAN_6}>当前销量</Col><Col span={SPAN_18}>{sale_count}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_6}>评论数</Col><Col span={SPAN_18}>{cmtCount || 0}</Col>
                            </Row>
                            <Row>
                                <Col className="title" span={SPAN_6}>评价星级</Col><Col span={SPAN_18}>{<Rate disabled
                                                                                                          style={{fontSize: 12}}
                                                                                                          defaultValue={+cmtStar}/>}</Col>
                            </Row>
                        </div>
                    )
                }
            }
        ];


        return (
            <div className='h_percent100 goods-data-manage'>
                <Card
                    style={{width: '100%'}}
                    title="产品资料管理"
                >
                    <label className="ml mt8">上架时间：</label>
                    <DatePicker className="mt8" value={ondateOnlineBg || null} onChange={value => {
                        this.setState({
                            ondateOnlineBg: value
                        })
                    }}/>
                    ~
                    <DatePicker className="mt8" value={ondateOnlineEd || null} onChange={value => {
                        this.setState({
                            ondateOnlineEd: value
                        })
                    }}/>


                    <label className="ml mt8">平台：</label>
                    <Select className="width-100 mt8" value={site} onChange={(value) => {
                        this.setState({
                            site: value
                        })
                    }}>
                        <Option value={''}>全部</Option>
                        {
                            spu_site_list.map(item => {
                                return <Option value={item.name} key={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>

                    <label className="ml mt8">当前状态：</label>
                    <Select className="width-100" value={isOffSale} onChange={value => {
                        this.setState({
                            isOffSale: value
                        })
                    }}>
                        {
                            [
                                {name: "全部", value: ''},
                                {name: "已上架", value: '1'},//true
                                {name: "未上架", value: '0'} //false
                            ].map(item => {
                                return <Option key={item.name} value={item.value}>{item.name}</Option>
                            })
                        }
                    </Select>

                    <label className="ml mt8">品牌：</label>
                    <AutoComplete placeholder="请搜索" value={designer} className="mt8 width-150"
                                  dataSource={designer_list_filter}
                                  onChange={(value) => {
                                      this.setState({
                                          designer: value
                                      })
                                  }} onSearch={(value) => {
                        if (!value) return;
                        this.setState({
                            // designer_list_filter: designer_list.filter(item => item.startsWith(value))
                            designer_list_filter: designer_by_list.filter((item) => item.toLowerCase().indexOf(value.toLowerCase()) >= 0)
                        })
                    }}/>

                    <label className="ml">设计师：</label>

                    <AutoComplete placeholder="请搜索" value={designer_by} className="mt8 width-150"
                                  dataSource={designer_by_list_filter}
                                  onChange={value => {
                                      this.setState({
                                          designer_by: value
                                      })
                                  }}
                        // onSelect={(value) => {
                        //     this.setState({
                        //         designer_by: value
                        //     })
                        // }} 
                                  onSearch={(value) => {
                                      if (!value) return;
                                      // console.log(designer_by_list.filter(item => item.startsWith(value)));
                                      this.setState({
                                          designer_by_list_filter: designer_by_list.filter((item) => item.toLowerCase().indexOf(value.toLowerCase()) >= 0)
                                      })
                                  }}/>


                    <label className="ml mt8">评价星级：</label>
                    <Select className="width-100 mt8" value={cmtStars} onChange={value => {
                        this.setState({
                            cmtStars: value
                        })
                    }}>
                        {
                            [
                                {name: "全部", value: ''},
                                {name: "五星", value: '5'},
                                {name: "四星", value: '4'},
                                {name: "三星", value: '3'},
                                {name: "二星", value: '2'},
                                {name: "一星", value: '1'}
                            ].map(item => {
                                return <Option key={item.name} value={item.value}>{item.name}</Option>
                            })
                        }
                    </Select>
                    <div style={{display: "inline-block"}}>
                        <label className="ml">更新时间：</label>
                        <RangePicker className="mt8" value={updateData} onChange={value => {

                            this.setState({
                                updateData: value,
                                updateDateTimeBg: value[0].unix(),
                                updateDateTimeEd: value[1].unix(),
                            });
                        }}/>
                    </div>


                    <label className="ml mt8">产品分类：</label>
                    <Classify className="mt8" onSelect={(selectIds) => {
                        this.setState({
                            catid: selectIds
                        })
                    }}/>

                    <Input className="ml width-200 mt8" placeholder="object_id" value={keywords} onChange={(e) => {
                        this.setState({
                            keywords: e.target.value
                        })
                    }}/>

                    <Button className="ml mt8" type="primary" onClick={() => {
                        this.setState({
                            page: 1
                        }, () => {
                            this.getProduct();
                        })

                    }}>查 询</Button>

                    <Button type="primary" className="fr mt8" ghost>导出文件</Button>
                    <Button type="primary" className="fr mt8" ghost onClick={() => {
                        if (this.state.selectIds.length <= 0) {
                            message.info('请先选择产品')
                            return
                        }
                        this.setState({
                            visible: true
                        })
                    }}>+添加首页展示</Button>


                    <div className="filterWrap">
                        <span>已选（{selectCount}）</span>
                        <div>
                            <span className="lh-35 va-top">评论数</span>
                            <Filter onClick={(btn, active) => {
                                if (active) {
                                    if (btn === 'up') {
                                        this.setState({
                                            cmtCountSort: 'asc'
                                        }, () => {
                                            this.getProduct()
                                        })
                                    } else {
                                        this.setState({
                                            cmtCountSort: 'desc'
                                        }, () => {
                                            this.getProduct()
                                        })
                                    }
                                } else {
                                    this.setState({
                                        cmtCountSort: ''
                                    }, () => {
                                        this.getProduct()
                                    })
                                }

                            }}/>
                            <span className="lh-35 va-top">评价星级</span>
                            <Filter onClick={(btn, active) => {
                                if (active) {
                                    if (btn === 'up') {
                                        this.setState({
                                            cmtStarSort: 'asc'
                                        }, () => {
                                            this.getProduct()
                                        })
                                    } else {
                                        this.setState({
                                            cmtStarSort: 'desc'
                                        }, () => {
                                            this.getProduct()
                                        })
                                    }
                                } else {
                                    this.setState({
                                        cmtStarSort: ''
                                    }, () => {
                                        this.getProduct()
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
                                            this.getProduct()
                                        })
                                    } else {
                                        this.setState({
                                            priceSort: 'desc'
                                        }, () => {
                                            this.getProduct()
                                        })
                                    }
                                } else {
                                    this.setState({
                                        priceSort: ''
                                    }, () => {
                                        this.getProduct()
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
                                            this.getProduct()
                                        })
                                    } else {
                                        this.setState({
                                            ondateOnlineSort: 'desc'
                                        }, () => {
                                            this.getProduct()
                                        })
                                    }
                                } else {
                                    this.setState({
                                        ondateOnlineSort: ''
                                    }, () => {
                                        this.getProduct()
                                    })
                                }

                            }}/>
                        </div>
                    </div>

                    <Table loading={loading} pagination={false} rowSelection={this.rowSelection} columns={columns}
                           dataSource={product_list} rowKey={(record) => record._id}/>

                    <div style={{textAlign: "right"}}>

                        <Button disabled={page <= 1} onClick={() => {
                            if (page <= 1) return
                            this.setState({
                                page: page - 1
                            }, () => {
                                this.getProduct()
                            })
                        }}>上一页</Button>
                        <Button onClick={() => {
                            this.setState({
                                page: page + 1
                            }, () => {
                                this.getProduct()
                            })
                        }}>下一页</Button>
                        <span>跳转到</span>
                        <Input value={page} onChange={e => {
                            const value = e.target.value
                            this.setState({
                                page: value
                            })
                        }} onBlur={() => {
                            this.getProduct()
                        }} className="ml" type="number" style={{width: '70px'}}/>
                        <span className="ml">页</span>
                    </div>


                    <Modal title="添加首页展示" visible={visible} onOk={this.onOk} onCancel={this.onCancel}
                           destroyOnClose={true}>
                        <Row>
                            <Col span={SPAN_5}><span className="error">*</span>产品组名称</Col>
                            <Col span={SPAN_19}>
                                <Input value={homeName} onChange={(e) => {
                                    this.setState({
                                        homeName: e.target.value,
                                        homeNameError: e.target.value.length > 16
                                    })
                                }}/>
                                {(homeNameError) && <p className="error">1-16个字符</p>}
                            </Col>
                        </Row>
                        <Row className="mt8">
                            <Col span={SPAN_5}>已选产品</Col>
                            <Col span={SPAN_19}>
                                {selectCount}个
                            </Col>
                        </Row>
                        <p className="mt8">*添加后在<NavLink to='/productManage/classifyManage'><span
                            className="blur">【前台首页管理】</span></NavLink>新增或编辑栏目可查看。</p>
                    </Modal>
                </Card>
            </div>
        )
    }
}
