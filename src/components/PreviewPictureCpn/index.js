import React, {Component} from 'react';
import {Modal, Button} from 'antd';
import './index.less'

export default class PreviewPictureCpn extends Component {
    state = {
        loading: false,
    };

    handleSubmit = () => {
    };

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const {title, visible, content} = this.props;
        return (
            <Modal title={title} width={1000} style={style.modal} visible={visible} centered
                // okText='确定'
                // cancelText='取消'
                onCancel={this.props.onCancelPopup}
                   footer={<Button onClick={this.props.onCancelPopup}>确定</Button>}
                   destroyOnClose={true}
                   confirmLoading={this.state.loading}
                // okButtonProps={{disabled: false}}
            >
                <div className="left pr">
                    <img className="posterImg" src={content} alt=""/>
                    <div className="posterAbs bigPoster">
                        <ul className="label">
                            <li className="labelLi">时尚</li>
                            <li className="labelLi">秋季新品</li>
                            <li className="labelLi">穿衣搭配</li>
                        </ul>
                        <h3 className="title">2019年流行大码连衣裙趋势大码连衣裙趋势大码连衣裙趋势连衣裙趋势连衣势...</h3>
                    </div>
                </div>
                <ul className="recommendArticle">
                    {
                        [1].map((item, index) => {
                            return (
                                <li key={index} className="articleLi">
                                    <div className="articleDiv">
                                        <div className="pr">
                                            <img className="img" src={content} alt=""/>
                                            <div className="posterAbs smallPoster">
                                                <ul className="label">
                                                    <li className="labelLi">时尚</li>
                                                    <li className="labelLi">秋季新品</li>
                                                    <li className="labelLi">穿衣搭配</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="articleText">
                                            <div className="textHeight">
                                                <h4 className="titleH4">2019年流行大码连衣裙趋势</h4>
                                                <p className="desc">随着每个过去的季节，一个新的It包的集合弹出现场，性的非常压倒
                                                    选项可能是非常压倒性的非常压倒性非非常性的非常压倒...</p>
                                            </div>
                                            <div className="info">
                                                <span>2018-03-29</span>
                                                <span><i
                                                    className="iconfont iconyueduren readerIcon"/>2334</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </Modal>
        );
    }
}