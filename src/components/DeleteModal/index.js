import React, {Component} from 'react'
import {Modal} from 'antd'

/**
 * @param title 标题
 * @param content 内容
 * @function hide 关闭弹框
 * @function sure 提交内容
 */
export default class Index extends Component {
    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const {title, content, visible, loading = false} = this.props;
        return (
            <Modal title={title} style={style.modal} visible={visible} centered okText='确定' cancelText='取消'
                   confirmLoading={loading}
                   iconType='error'
                   onCancel={this.props.hide} onOk={this.props.sure}>
                <p>{content}</p>
            </Modal>
        )
    }
}
