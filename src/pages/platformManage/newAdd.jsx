import React, { Component } from 'react'
import { Table, Modal, Row, Col } from 'antd'
import Input from './Input'

export default class Spusite extends Component {
    state = {
        selectedRowKeys: [],
        selectError: false
    }

    input = React.createRef()

    
    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
            selectError: selectedRowKeys.length === 0
        })
    }

    handleOk = () => {      
        if(this.input.current.state.name.length > 16 || this.state.selectedRowKeys.length === 0 || this.input.current.state.name.length === 0){
            if(this.input.current.state.name.length === 0){
                this.input.current.onNameNull();
            }
           
            this.setState({
                selectError: true
            })
            return
        }

        

        this.props.onOk(this.input.current.state.name, this.state.selectedRowKeys)
    }
    handleCancel = () => {
        this.props.onCancel()
    }
    
    render() {
        const { selectedRowKeys, selectError } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (

            <Modal title="新增展示平台" width="700px"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                <Row>
                    <Col span={4}>
                        <label><span className="error">*</span>前台平台名称</label>
                    </Col>
                    <Col span={20}>
                        <Input ref={this.input} />
                    </Col>
                </Row>
                <Row className="mt8">
                    <Col span={4}>
                        <label><span className="error">*</span>选择前台</label>
                    </Col>
                    <Col span={20}>
                        <p>
                            <span>已选({selectedRowKeys.length})</span>
                        </p>
                        <Table size="small" rowKey={(record) => record.name} rowSelection={rowSelection} scroll={{ y: "350px" }}
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
                        {selectError && <p className="error">至少选择一个</p>}
                    </Col>
                </Row>
            </Modal>
        )
    }
}
