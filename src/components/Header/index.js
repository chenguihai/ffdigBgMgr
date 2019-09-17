import React from 'react'
import {Row, Col, Button, Divider} from "antd"
import {withRouter} from 'react-router-dom'
import DeleteModal from '../DeleteModal'
import './index.less'

class Header extends React.Component {
    state = {
        nickName: '',
        isLogoutFlag: false,
    };

    componentDidMount() {
        this.setState({
            nickName: window.sessionStorage.getItem('nickName'),
        })
    }

    showLogoutPopup = () => {
        this.setState({
            isLogoutFlag: true
        });
    };

    cancelLogoutPopup = () => {    // 关闭弹框
        this.setState({
            isLogoutFlag: false,
        });
    };

    // 退出登录
    _handleSureLogout = () => {
        window.sessionStorage.clear();
        this.setState({
            nickName: '',
            isLogoutFlag: false
        });
        this.props.history.push('/login');
    };

    render() {
        const {nickName, isLogoutFlag} = this.state;
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={6} className="logo">
                        <h3 className='c-39A0AB'>ffdig火联管理平台</h3>
                    </Col>
                    <Col span={18}>
                        {/*<Button shape="circle" icon='logout' onClick={this.showLogoutPopup}/>*/}
                        <div className='header-right'>
                            {/*<Link to='/goodsManage/goodsCollection'></Link>*/}
                            <img src="/assets/avatar.png" alt="用户头像"/>
                            <span className='ml10'>{nickName}</span>
                            <Divider className='divider' type="vertical"/>
                            <Button title='退出登录' shape="circle" icon='login' onClick={this.showLogoutPopup}/>
                        </div>
                    </Col>
                </Row>
                {/*退出登录*/}
                <DeleteModal visible={isLogoutFlag} title='退出登录' content='确认退出登录吗？' hide={this.cancelLogoutPopup}
                             sure={this._handleSureLogout}/>
            </div>
        );
    }
}

export default withRouter(Header)