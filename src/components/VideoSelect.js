import React from 'react';
import { Table,Space,Button } from 'antd';
import https from "../api/https";
import VideoPlayer from '../components/VideoPlayer'

export default class VideoSelect extends React.Component {
    
    state = {
        showVideo:false,
        videoUrl: '',
        pageSize:10,
        pageTotal:0,
        list:[],
        record:{},
        selectedRowKeys:[],
        columns:[
            {
                title: '名称',
                width: 120,
                ellipsis: true,
                dataIndex: 'resName',
            },
            {
                title: '视频',
                render: record => (
                    <Space size="middle" onClick={() => this.onPlay(record.resUrl)} style={{position:"relative"}}>
                        <img height={100} width={100} src={record.resVideoPic ? record.resVideoPic : ''} />
                        <span className="play"></span>
                    </Space>
                ),
            },
            {  
                title: '描述',
                width: 120,
                ellipsis: true,
                dataIndex: 'resDesc',
            },
            {  
                title: '创建时间',
                dataIndex: 'resCreateTime',
            },
        ],
    };
    getList = (index) => {
        let params = {
            page: index-1,
            pageSize: this.state.pageSize
        };
        https.fetchGet("/material/video/index", params).then(data => {
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
    onPlay = (url)=>{
        this.setState({
            showVideo: true,
            videoUrl:url
        });
    }
    closeVideo = ()=>{
        this.setState({
            showVideo: false,
            videoUrl:''
        });
    }
    componentWillMount() {
        this.getList(1);
    };
    render() {
        const { list,pageSize,pageTotal,selectedRowKeys,columns,showVideo,videoUrl } = this.state
        return (
            <div className="layer">
                <div className="layer-mask" onClick={this.close} ></div>
                <div className="layer-main">
                    <h3 style={{ marginBottom:10}}>
                        视频素材库
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
                {
                    showVideo?(
                        <div className="layer index">
                            <div className="layer-mask" onClick={this.closeVideo}></div>
                            <div className="layer-content">
                                <VideoPlayer videoUrl={videoUrl} />
                            </div>
                        </div>
                    ):null
                }
            </div>
        )

    }
}