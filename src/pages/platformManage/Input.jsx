import React, { Component } from 'react'
import { Input } from 'antd'

export default class InputError extends Component {
    state = {
        name: "",
        nameError: false,
        nameNull: false
    }
    componentDidMount(){
       
    }
    handleName = (e) => {
        const value = e.target.value
        this.setState({
            name: value,
            nameError: value.length > 16,
            nameNull: value.length === 0,
        })
    }
    onNameNull = () =>{
        this.setState({
            nameNull: true
        })
    }
  render() {
      const {name, nameError, nameNull} = this.state
    return (
      <>
         <Input placeholder="中文或英文或符号，多个名称用&间隔" name={name} onChange={this.handleName} ref={this.props.input}/>
        {nameError && <p className="error">已超16个字</p>}
        {nameNull && <p className="error">不能为空</p>}
      </>
    )
  }
}
