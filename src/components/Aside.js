import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import {
    FolderOutlined,
    UserOutlined,
    TeamOutlined,
    MessageOutlined,
    BarChartOutlined,
    PieChartOutlined,
    AreaChartOutlined,
    SlidersOutlined,
    MenuOutlined,
    HeartOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

class Aside extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo" />
                <Menu 
                    theme="dark" 
                    mode="inline"
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.props.pathname]}
                >
                    
                    <SubMenu key="sub1" icon={<FolderOutlined />} title="服务号管理">
                    <Menu.Item key="/information" icon={<UserOutlined />}>
                        <Link to={'/information'} >基本信息</Link>
                    </Menu.Item>
                    <Menu.Item key="/userManager" icon={<TeamOutlined />}>
                        <Link to={'/userManager'} >用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/message" icon={<MessageOutlined />}>
                        <Link to={'/message'} >消息管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/materialManager" icon={<AppstoreOutlined />}>
                        <Link to={'/materialManager'} >素材管理</Link>
                    </Menu.Item>
                    <SubMenu key="sub2" title="数据统计" icon={<BarChartOutlined />}>
                        <Menu.Item key="/userStatistics" icon={<PieChartOutlined />}>
                            <Link to={'/userStatistics'} >用户分析</Link>
                        </Menu.Item>
                        <Menu.Item key="/messageStatistics" icon={<AreaChartOutlined />}>
                            <Link to={'/messageStatistics'} >消息统计</Link>
                        </Menu.Item>
                        <Menu.Item key="/menuStatistics" icon={<SlidersOutlined />}>
                            <Link to={'/menuStatistics'} >菜单分析</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/customizeMenu" icon={<MenuOutlined />}>
                        <Link to={'/customizeMenu'} >自定义菜单</Link>
                    </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<FolderOutlined />} title="内部管理后台">
                    <Menu.Item key="/serviceList" icon={<AppstoreOutlined />}>
                        <Link to={'/serviceList'} >服务号列表</Link>
                    </Menu.Item>
                    <Menu.Item key="/addService" icon={<AppstoreAddOutlined />}>
                        <Link to={'/addService'} >创建服务号</Link>
                    </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )

    }
}

export default Aside;