import React, {Component, Fragment} from 'react'
import {Icon, Modal} from 'antd'
import Utils from '../../utils/utils'
import axiosHttp from "../../utils/ajax";
import './index.less'

/**
 * @param title 标题
 * @param content 内容
 * @function hide 关闭弹框
 * @function sure 提交内容
 */
export default class Index extends Component {
    state = {
        articleDetail: {}
    };

    componentDidMount() {
        let {data, articleId = ''} = this.props;
        console.log(data, articleId);
        if (articleId) {
            this.getArticleByIdHttp(articleId);
        }
    }

    getArticleByIdHttp = (id) => {  // 通过id获取文章详细信息
        axiosHttp(`api/AdminSite/Article/GetArticleById?article_id=${id}`, '', 'get').then((res) => {
            if (res.code === 200) {
                this.setState({
                    articleDetail: res.data
                });
            }
        }).catch(e => {
            console.log(e)
        })
    };

    render() {
        const style = {
            modal: {top: 0, paddingBottom: 0, margin: 0},
        };
        const {data = {}, title, content = '', loading = false} = this.props;
        const {articleDetail = {}} = this.state;
        const {keyword = ''} = articleDetail;
        let keywordArr = data.keyword ? data.keyword : keyword.split(','),
            headData = data.title ? data : articleDetail;
        return (
            <Modal title={title} style={style.modal} visible={true} centered footer={null} confirmLoading={loading}
                   width={1180}
                   iconType='error'
                   onCancel={this.props.onCancelPopup}>
                <div className="bf-content">
                    <div className="articleHead">
                        <h2 className="title">{headData.title}</h2>
                        <p className="info"><span>{headData.author}</span>{headData.author_translate &&
                        <Fragment>
                            &nbsp;/&nbsp;<span>{headData.author_translate}</span>&nbsp;译
                        </Fragment>}<span
                            className="timer">{Utils.timeFormat(new Date().getTime(), 'YYYY-MM-DD')}</span>
                            <span className="comment"><Icon type="user"/>&nbsp;0</span></p>
                        <p className="label"><span>标签：</span>
                            {
                                keywordArr.length > 0 && keywordArr.map((item, index) => {
                                    return (
                                        <span key={index}>{index > 0 ? ' / ' : ''}{item}</span>
                                    )
                                })
                            }
                        </p>
                        <p className="abstract">{headData.summary}</p>
                    </div>
                    <div className="previewCtn"
                         dangerouslySetInnerHTML={{__html: content || headData.content_hrml_pc}}/>
                </div>
            </Modal>
        )
    }
}
