import React, { Component } from 'react'
import {Table, Card, Icon, message} from 'antd'
import { http } from "../../utils/ajax";
export default class Version extends Component {

    state = {
        versionList: [],
        pid: '',
        title: ''
    }
    componentDidMount() {
       this.getVersions();
    }
    getVersions = () => {
        const {pid, title} = this.props.location.state || {}

        http.get('api/AdminSite/HomePageAdmin/GetVersions', { params: {pid: pid} }).then(res => {
            this.setState({
              versionList: res,
              pid: pid,
              title
            })
        }).catch(e => {
          
        })
      }

      rePublish = (pid, vid) => {
          http.get('api/AdminSite/HomePageAdmin/ReleaseAgain', {params: {pid, vid}}).then(res => {
              message.success('发布成功')
              this.getVersions();
          }).catch(e=> {
              message.error('发布失败')
          })
      }
    render() {
        const {versionList, pid, title} = this.state
        const columns = [
            {
                title: "版本号",
                key: 'vid',
                dataIndex: 'vid'
              },
              {
                title: "发布时间",
                key: 'updateTime',
                dataIndex: 'updateTime'
              },
              {
                title: "发布人",
                key: 'editBy',
                dataIndex: 'editBy'
               
              },
              {
                title: "发布栏目名称",
                key: 'title',
                dataIndex: 'title'
              },
              {
                title: "发布产品数",
                key: 'bdProduct',
                dataIndex: 'bdProduct',
                render: (text) => {
                    return text.split(',').length
                }
              },
              {
                title: "发布状态",
                key: 'isOnline',
                dataIndex: 'isOnline',
                render: (text) => {
                    return text === 1 ? '发布中' : '已下线'
                }
                
              },
              {
                title: "操作",
                key: 'action',
                render: (text, record, index) => {
                    return <div>
                        <span className="a" onClick={() => {
                            this.props.history.push({pathname: '/ffManage/homeManageViewProduct', state: {pid: pid, title: title,vid: record.vid }})
                        }}> 查看</span>
                        { record.isOnline === 0 && <span onClick={() => {
                            this.rePublish(record.pid, record.vid)
                        }} className="a ml"> 重新发布</span>}
                    </div>
                }
              },
        ]
        return (
            <div className='h_percent100'>
            <Card       
                style={{ width: '100%' }}
                title={"前台首页管理"}
            >
                <h3 className="a mt8 mb" onClick={() => {
                    this.props.history.push("/ffManage/homeManage");
                    
                }}><Icon type="left-circle" theme="filled" />查看栏目发布版本</h3>
                <p className="mt8"><b>栏目名称 </b>  <span> {title}</span></p>
                <p className="mt8"><b>栏目ID </b>  <span> {pid}</span></p>
                <p className="mt8"><b>发布版本 </b></p>
                <Table columns={columns} dataSource={versionList} rowKey={r=>r.id}/>
            </Card>
            </div>
        )
    }
}
