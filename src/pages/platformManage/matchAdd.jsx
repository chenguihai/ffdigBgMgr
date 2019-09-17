import React, { Component } from 'react'
import { Table, Modal } from 'antd'
export default class Spusite extends Component {
    state = {
        selectedRowKeys: [],
        error: false
    }
   
    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
            error: false
        })
    }
   
    handleOk = () => {
        if(this.state.selectedRowKeys.length === 0){
            this.setState({
                error: true
            })
            return
        }
        this.props.onOk(this.state.selectedRowKeys)
    }
    handleCancel = () => {
        this.props.onCancel()
    }
    render() {
        const {selectedRowKeys} = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
          };
        return (

            <Modal title="批量增加展示平台"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                <p>*勾选后，将批量增加前台展示平台项，展示名称默认原始名称。</p>
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



        )
    }
}
