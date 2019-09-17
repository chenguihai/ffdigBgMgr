import React from 'react'
import {Menu, Icon} from 'antd';
import {NavLink} from 'react-router-dom'
import MenuConfig from './../../config/menuConfig'
import './index.less'

const SubMenu = Menu.SubMenu;

class NavLeft extends React.Component {
    state = {
        currentKey: '',
        // collapsed: false,
        openKeys: ['/goodsManage'],
        defaultKeys: ['/goodsManage/classifyManage']
    };

    // rootSubmenuKeys = ['/homepage/fbAdverts', '/goodsManage', '/statisticAnalysis'];

    componentDidMount() {
        let hash = window.location.hash.slice(1);
        this.setState({
            openKeys: [hash.slice(0, hash.lastIndexOf('/'))],
            defaultKeys: [hash]
        });
        this.rootSubmenuKeys = MenuConfig.map((item) => item.key);
    }

    componentWillMount() {
        const menuTreeNode = this.renderMenu(MenuConfig);
        this.setState({
            menuTreeNode
        })
    }

// 菜单渲染
    renderMenu = (data) => {
        return data.map((item) => {
            if (item.children) {
                // console.log(item);
                return (
                    <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            // title={item.title}
            return <Menu.Item key={item.key}>
                {/*<Icon type="pie-chart"/>*/}
                {/*<span>*/}
                <NavLink to={item.key}>{item.title}</NavLink>
                {/*</span>*/}
            </Menu.Item>
        })
    };
// toggleCollapsed = () => {
//     this.setState({
//         collapsed: !this.state.collapsed,
//     });
// }


    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.filter(key => this.state.openKeys.indexOf(key) === -1)[0];
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        const {collapsed} = this.props;
        return (
            <div>
                {/*<div className='homepage'><a href="http://cmi.center/fbAdvert.html" target='_blank'>首页</a></div>*/}
                <div className="nav-btn" style={{textAlign: "center", fontSize: "20px"}}>

                    <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={() => {
                        if (this.props.toogleMenu) {
                            this.props.toogleMenu()
                        }
                    }}/>

                </div>
                <Menu mode='inline'
                      inlineCollapsed={collapsed}
                      defaultSelectedKeys={[window.location.hash.slice(1)]}
                    // defaultOpenKeys={['/goodsManage']}
                    // openKeys={openKeys}
                      onOpenChange={this.onOpenChange}
                    // inlineCollapsed={this.state.collapsed}
                    // theme="dark"
                >
                    {this.state.menuTreeNode}
                </Menu>
                {/*<Button type="primary" onClick={this.toggleCollapsed} style={{marginBottom: 16}}>*/}
                {/*<Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>*/}
                {/*</Button>*/}

            </div>
        );
    }
}

export default NavLeft