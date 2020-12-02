import React from 'react';
import { Table,Space,Button,Input } from 'antd';
import https from "../api/https";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Search } = Input;

export default class ImageTextList extends React.Component {
    
    state = {
        keyword:'',
        current:1,
        pageSize:10,
        pageTotal:0,
        imageTextList:[],
        selectedRowKeys:[],
        columns:[
            {
                title: '标题',
                dataIndex: 'publicImageTextList',
                render: publicImageTextList => (
                  <Space size="middle">
                    {publicImageTextList.length ? publicImageTextList[0].title : ''}
                  </Space>
                ),
            },
            {
                title: '封面',
                dataIndex: 'publicImageTextList',
                render: publicImageTextList => (
                  <Space size="middle">
                    <img height={80} width={80} src={publicImageTextList.length ? publicImageTextList[0].pushImageUrl : ''} />
                  </Space>
                ),
            },
            {  
                title: '创建时间',
                dataIndex: 'createTime',
            },
            {
              title: '操作',
              key: 'action',
              render: record => (
                <Space size="middle">
                  <Button type="primary" onClick={(e) => this.onEdit(record,e)} icon={<EditOutlined />} size="size" />
                  <Button type="primary" onClick={(e) => this.onDelete(record,e)} danger icon={<DeleteOutlined />} size="size" />
                </Space>
              ),
            },
        ],
    };

    jump = () => {
        this.props.history.push(`/addImageText`);
    }

    getImageTextList = () => {
        let params = {
            searchContext: this.state.keyword,
            page: this.state.current-1,
            pageSize: this.state.pageSize
        };
        https.fetchGet("/material/imagetext/index", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    imageTextList: data.data.list,
                    pageTotal:data.data.page.count,
                });
            }
        })
    };
    searchImageTextList = (val) => {
        this.setState({ 
            keyword: val,
            current: 1,
        },()=>{
            this.getImageTextList();
        });
    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
        //console.log(selectedRowKeys)
    };
    onBatchDelete = () => {
        //console.log(this.state.selectedRowKeys)
    };
    onEdit = (record,e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        window.imagetextList = record;
        this.props.history.push(`/editImageText`);
    };
    onDelete = (record,e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let params = {
            materialIds: record.materialId
        };
        https.fetchDelete("/material/imagetext/delete", params).then(data => {
            if (data.code === 200) {
                this.getImageTextList();
            }
        })
    };
    goPage = index => {
        this.setState({
            current:index,
        },()=>{
            this.getImageTextList();
        });
        
    };
    componentWillMount() {
        this.getImageTextList();
        window.imagetextList = [];
    }
    render() {
        const { imageTextList,current,pageSize,pageTotal,selectedRowKeys,columns } = this.state
        return (
            <section>
                <Search
                    placeholder="请输入用户名"
                    enterButton="查询"
                    className="search"
                    onSearch={value => this.searchImageTextList(value)}
                />
                <div style={{ fontSize: 16,marginBottom:20 }}>
                    图文消息({pageTotal}条)
                    <Button type="primary" onClick={this.jump} style={{ float:'right' }}>新建图文消息</Button>
                </div>
                <div style={{ fontSize: 16,marginBottom:20 }}>
                    <Button 
                        type="primary"
                        onClick={() => this.onBatchDelete()}
                    >批量删除</Button>
                </div>
                <Table
                    rowKey={item => item.materialId }
                    rowSelection={{
                        selectedRowKeys,
                        onChange: this.onSelectChange,
                    }}
                    onRow={(record)=>{
                        return{
                            onClick:()=>{
                                let selectedRow = JSON.parse(JSON.stringify(selectedRowKeys));
                                let idx = selectedRow.indexOf(record.materialId);
                                if (idx == -1) selectedRow.push(record.materialId);
                                else selectedRow.splice(idx, 1);
                                this.setState({
                                    selectedRowKeys:selectedRow
                                })
                            }
                        }
                    }}
                    columns={columns}
                    dataSource={imageTextList}
                    pagination={{
                        total: pageTotal,
                        current: current,
                        pageSize: pageSize,
                        onChange: this.goPage,
                        showSizeChanger:false
                    }}
                />
            </section>
        )

    }
}