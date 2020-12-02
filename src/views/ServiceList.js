import React from 'react';
import { Card,Table,Space,Button,Input,Modal,message } from 'antd';
import https from "../api/https";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { Search } = Input;
const { confirm } = Modal;
export default class ServiceList extends React.Component {
    
    state = {
        url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        current:1,
        pageSize:10,
        pageTotal:0,
        serviceList:[],
        selectedRowKeys:[],
        columns:[
            {
                title: '封面',
                dataIndex: 'portrait',
                render: portrait => (
                    <Space size="middle">  
                    {
                        portrait?(
                            <img style={{borderRadius:'50%',height:50,width:50}} src={ portrait.resUrl?portrait.resUrl:''} />
                        ):<img style={{borderRadius:'50%',height:50,width:50}} src={ this.state.url} />
                    }
                    </Space>
                ),
            },
            {
                title: '标题',
                render: record => (
                    <span>
                        {record.name}<br/>
                        <span style={{fontSize:'12px',color:'gray'}}>{record.introduce}</span>
                    </span>
                ),
            },
            {  
                title: '主动消息推送',
                dataIndex: 'sendFlag',
                render: sendFlag => (
                    <Space size="name">
                    {
                        sendFlag?(
                            <div>{sendFlag.setStatus==1 ? "是" : "否"}</div>
                        ):''
                    }
                    </Space>
                ),
            },
            {  
                title: '搜索页推荐',
                dataIndex: 'recommendFlag',
                render: recommendFlag => (
                    <Space size="name">
                    {
                        recommendFlag?(
                            <div>{recommendFlag.setStatus==1 ? "是" : "否"}</div>
                        ):''
                    }
                    </Space>
                ),
            },
            {  
                title: '自定义菜单',
                dataIndex: 'menuFlag',
                render: menuFlag => (
                    <Space size="name">
                    {
                        menuFlag?(
                            <div>{menuFlag.setStatus==1 ? "是" : "否"}</div>
                        ):''
                    }
                    </Space>
                ),
            },
            {
              title: '操作',
              key: 'action',
              render: record => (
                <Space size="middle">
                  <Button type="primary" onClick={(e) => this.onEdit(record,e)} icon={<EditOutlined />} size="size" />
                  {/* <Button type="primary" onClick={(e) => this.onDelete(record,e)} danger icon={<DeleteOutlined />} size="size" /> */}
                </Space>
              ),
            },
        ],
    };
    getServiceList = (index) => {
        let params = {
            pageIndex: index,
            pageSize: 10
        };
        https.fetchGet("/serviceAccount/selectAll", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    serviceList: data.data.list,
                    pageTotal:data.data.page.count,
                    pageSize:10,
                    current:index,
                });
            }
        })
    };
    searchServiceList = (val) => {
        if(!val){
            this.getServiceList(1);
            return;
        }
        let params = {
            name: val,
        };
        https.fetchGet("/serviceAccount/searchAccounts", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    serviceList: data.data,
                    pageTotal:data.data.length,
                    pageSize:data.data.length,
                    current:1,
                });
            }
        })
    }
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    onBatchDelete = () => {
        let that = this;
        let selectList = this.state.selectedRowKeys
        if(!(selectList && selectList.length)){
            message.info('请勾选要删除的服务号');
            return false;
        }
        confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '确定要删除选中服务号吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                let params = "[";
                for (var i = 0; i < selectList.length; i++) {
                    params += '{"id":' + selectList[i] + "},";
                }
                params = params.substring(0, params.length - 1);
                params += "]";
                console.log(params)
                that.doDelete(params)
            },
            onCancel() {},
        });
    };
    doDelete = (params) => {
        https.fetchPost("/serviceAccount/deleteAccounts", params).then(data => {
            if (data.code === 200) {
                message.success("删除成功！");
                this.getServiceList(1);
            }else{
                message.error("删除失败！");
            }
        })
    };
    onEdit = (record,e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        window.songList = record;
        this.props.history.push(`/editService`);
    };
    jump = () => {
        this.props.history.push(`/addService`);
    }
    goPage = index => {
        this.getServiceList(index);
    };
    componentWillMount() {
        this.getServiceList(1);
    }
    render() {
        const { serviceList,current,pageSize,pageTotal,selectedRowKeys,columns } = this.state
        return (
            <Card title="服务号管理" bordered={false}>
                <Search
                    placeholder="请输入搜索关键词"
                    enterButton="查询"
                    className="search"
                    onSearch={value => this.searchServiceList(value)}
                />
                <div style={{ fontSize: 16,marginBottom:20 }}>
                    <Button 
                        type="primary"
                        onClick={() => this.onBatchDelete()}
                    >批量删除</Button>
                    <Button type="primary" onClick={this.jump} style={{ float:'right' }}>创建服务号</Button>
                </div>
                <Table
                    rowKey={item => item.id }
                    rowSelection={{
                        selectedRowKeys,
                        onChange: this.onSelectChange,
                    }}
                    onRow={(record)=>{
                        return{
                            onClick:()=>{
                                let selectedRow = JSON.parse(JSON.stringify(selectedRowKeys));
                                let idx = selectedRow.indexOf(record.id);
                                if (idx == -1) selectedRow.push(record.id);
                                else selectedRow.splice(idx, 1);
                                this.setState({
                                    selectedRowKeys:selectedRow
                                })
                            }
                        }
                    }}
                    columns={columns}
                    customRow={"setRow"}
                    dataSource={serviceList}
                    pagination={{
                        total: pageTotal,
                        current: current,
                        pageSize: pageSize,
                        onChange: this.goPage,
                        showSizeChanger:false
                    }}
                />
            </Card>
        )

    }
}