import React, { Component } from 'react'
import { Card, Select, Button, Table  } from 'antd'

export default class index extends Component {
  render() {
    return (
            <div className='h_percent100'>
            <Card
                style={{width: '100%'}}
                title="前台分类管理"
            >

            <label className="ml">产品分类：</label>
            <Select className="width-100"/>

            <label className="ml">修订者：</label>
            <Select className="width-100"/>

            <label className="ml">前台可见：</label>
            <Select className="width-100"/>


            <Button  className="ml" type="primary" size="small">查 询</Button>

            <Button type="primary" className="fr" ghost>新增分类</Button>
            <Table/>
            </Card>
        </div>
    )
  }
}
