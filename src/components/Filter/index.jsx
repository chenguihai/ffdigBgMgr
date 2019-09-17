import React, {Component} from 'react'
import {Icon} from 'antd'
import './index.less'

export default class Filter extends Component {
    state = {
        upActive: false,
        downActive: false
    }
    clickUp = () => {
        let {upActive} = this.state
        this.setState({
            upActive: !upActive,
            downActive: false
        })
        this.props.onClick && this.props.onClick("up", !upActive)
    }
    clickDown = () => {
        let {downActive} = this.state
        this.setState({
            downActive: !downActive,
            upActive: false
        })
        this.props.onClick && this.props.onClick("down", !downActive)
    }

    render() {
        let {upActive, downActive} = this.state;
        return (
            <span className="filterItem">
                <Icon type="caret-up" onClick={this.clickUp} style={{color: upActive ? "#333" : "#999"}}/>
                <Icon type="caret-down" onClick={this.clickDown} style={{color: downActive ? "#333" : "#999"}}/>
        </span>
        )
    }
}
