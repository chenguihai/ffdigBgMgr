import React, {Component} from 'react';
import {Row, Col} from 'antd';
import Header from './components/Header'
import NavLeft from './components/NavLeft'
import './App.css';
import './style/common.less';

export default class App extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            collapsed: false,
            width: 150
        }
    }

    render() {
        const {width, collapsed} = this.state;
        return (
            <Row className="container">
                <Col md={24}>
                    <Header/>
                </Col>
                <div className="base-layout">
                    <div className="layout-left" style={{width: width - 10}}>
                        <NavLeft collapsed={collapsed} toogleMenu={() => {
                            this.setState({
                                collapsed: !collapsed,
                                width: !collapsed ? 91 : 150
                            })
                        }}/>
                    </div>

                    <div className="content layout-right" style={{paddingLeft: width}}>
                        {this.props.children}
                    </div>
                </div>
            </Row>
        );
    }
}
