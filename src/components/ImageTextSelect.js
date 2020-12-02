import React from 'react';
import { Table,Space,Button } from 'antd';
import https from "../api/https";
export default class ImageTextSelect extends React.Component {
    
    state = {
        pageSize:10,
        pageTotal:0,
        list:[],
        record:{},
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
        ],
    };
    getList = (index) => {
        let params = {
            // searchContext: '',
            page: index-1,
            pageSize: this.state.pageSize
        };
        https.fetchGet("/material/imagetext/index", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    list: data.data.list,
                    pageTotal:data.data.page.count
                });
            }
        })
    };
    goPage = index => {
        this.getList(index);
    };
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            record:selectedRows[0]
        });
    };
    close = () => {
        this.props.ComfirmSelect();
    };
    submit = () => {
        this.props.ComfirmSelect(this.state.record);
    };
    componentWillMount() {
        this.getList(1);
    };
    render() {
        const { list,pageSize,pageTotal,selectedRowKeys,columns } = this.state
        return (
            <div className="layer">
                <div className="layer-mask" onClick={this.close} ></div>
                <div className="layer-main">
                    <h3 style={{ marginBottom:10}}>
                        图文素材库
                    </h3>
                    <Table
                        rowKey={item => item.materialId }
                        scroll={{ y: 300 }}
                        rowSelection={{
                            selectedRowKeys,
                            type: "radio",
                            onChange: this.onSelectChange,
                        }}
                        onRow={(record)=>{
                            return{
                                onClick:()=>{
                                    this.setState({
                                        selectedRowKeys:[record.materialId],
                                        record
                                    })
                                }
                            }
                        }}
                        columns={columns}
                        dataSource={list}
                        pagination={{
                            total: pageTotal,
                            pageSize: pageSize,
                            onChange: this.goPage,
                            showSizeChanger:false
                        }}
                    />
                    <div style={{ position:'absolute',bottom:20,width:'100%',textAlign:'center'}}>
                        <Button size="large"
                            onClick={() => this.close()}
                        >取 消</Button>&emsp;
                        <Button  size="large"
                            type="primary"
                            onClick={() => this.submit()}
                        >确 定</Button>
                    </div>
                </div>
            </div>
        )

    }
}