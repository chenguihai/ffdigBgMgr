import React, { Component } from 'react'
import { Table, Button, Modal, Row, Col, Input } from 'antd'
import { http } from "../../utils/ajax";

export default class Spusite extends Component {
    state = {
        name: "",
        selectedRowKeys: [],
        selectError: false,
        nameError: false,
        nameNull: false,
        visible: false,
        error: false
    }

    componentDidMount(){
        this.setState({
            name: this.props.rowName
        })
        this.getSpuId();
    }

    getSpuId = () => {
        http.get('api/AdminSite/ProductSite/GetBdSpuSite', {params: {id: this.props.rowId}}).then(res => {
            this.setState({
                selectedRowKeys: res.spuIds.split(',')
            })
        }).catch((e) => {
            console.error(e);
        })
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
            selectError: selectedRowKeys.length === 0
        })
    }

    handleOk = () => {      
        if(this.state.selectedRowKeys.length === 0 ){
            
            this.setState({
                selectError: true
            })
        }

        if(this.state.name.length === 0) {
            this.setState({
                nameNull: true
            })
        }

        if(this.state.name.length > 16){
            this.setState({
                nameError: true
            })
        }

        if(this.state.selectedRowKeys.length === 0 || this.state.name.length === 0 || this.state.name.length > 16){
            return
        }

        this.props.onOk(this.state.name, this.state.selectedRowKeys, this.props.rowId)
    }
    handleCancel = () => {
        this.props.onCancel()
    }
    
    render() {
        const { selectedRowKeys, name, nameError, nameNull } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (

            <Modal title="平台编辑"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                <Row>
                    <Col span={5}>
                        <label><span className="error">*</span>前台平台名称</label>
                    </Col>
                    <Col span={19}>
                        <Input value={name} onChange={(e) => {
                            this.setState({
                                name: e.target.value,
                                nameError: e.target.value.length > 16,
                                nameNull: e.target.value.length === 0,
                            })
                        }}/>
                        {nameError && <p className="error">已超16个字</p>}
                        {nameNull && <p className="error">不能为空</p>}
                    </Col>
                </Row>
                <Row className="mt8">
                    <Col span={5}>
                        <label><span className="error">*</span>选择前台</label>
                        
                    </Col>
                    <Col span={19}>
                       
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    visible: true
                                })
                            }}>已选({selectedRowKeys.length})</Button>

                        
                    </Col>
                </Row>
                <Modal title="选择平台" visible={this.state.visible} onCancel={() => {
                    this.setState({
                        visible: false
                    })
                }} onOk={() => {
                    if(selectedRowKeys.length === 0) {
                        this.setState({
                            error: true
                        })
                    } else {
                        this.setState({
                            visible: false
                        })
                    }
                    
                }}>
                    <Table size="small" rowKey={(record)=>record.name}  rowSelection={rowSelection} scroll={{ y: "350px" }} 
                    pagination={false} dataSource={this.props.list} columns={[
                        {
                            title: "网站名称",
                            dataIndex: "name",
                            key: "name"
                        },
                        {
                            title: "SPU数",
                            dataIndex: "spuCount",
                            key: "spuCount",
                            sorter: (a, b) => a.spuCount - b.spuCount,
                        }
                    ]} />
                    {this.state.error && <p className="error mt8">请至少勾选一项</p>}
                </Modal>
            </Modal>
        )
    }
}
