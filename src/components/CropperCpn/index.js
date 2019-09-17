import React, {Component} from 'react';
import {Modal, Button} from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default class CropperCpn extends Component {
    state = {
        loading: false,
        height: 0,
        width: 0,
    };
    dataUrl = '';
    timer = '';

    _crop() {
        this.timer = setTimeout(() => {
            this.dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL();
            clearTimeout(this.timer);
        }, 1000);
        let cropBox = document.querySelector('.cropper-crop-box');
        this.setState({
            height: cropBox.style.height,
            width: cropBox.style.width,
        });

    }

    handleSubmit = () => {
        this.props.sure(this.dataUrl);
    };

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        // visible
        const {title, content} = this.props;
        const {width, height} = this.state;
        return (
            <Modal title={title} width={1000} style={style.modal} visible={true} centered
                // okText='确定'
                //    closable={false}
                   cancelText='取消'
                   onCancel={this.props.onCancelPopup}
                   footer={<Button onClick={this.handleSubmit}>确定</Button>}
                   destroyOnClose={true}
                   confirmLoading={this.state.loading}
                // okButtonProps={{disabled: false}}
            >
                <Cropper
                    ref='cropper'
                    // src='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2114375040,2314544443&fm=26&gp=0.jpg'
                    src={content}
                    style={{height: 'auto', width: '100%'}}
                    aspectRatio={16 / 9}
                    guides={false}
                    crop={this._crop.bind(this)}/>
                <p>宽度：{width} ,高度：{height}</p>
            </Modal>
        );
    }
}