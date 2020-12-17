import React from 'react';
import { Table,Space,Button,Modal,Input,message } from 'antd';
import https from "../api/https";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import VideoPlayer from '../components/VideoPlayer'

export default class VideoList extends React.Component {
    
    state = {
        visible: false,
        editData:{},

        showVideo:false,
        videoUrl: '',
        pageSize:10,
        pageTotal:0,
        videoList:[],
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
                    <Space size="middle" onClick={(e) => this.onPlay(record.resUrl,e)} style={{position:"relative"}}>
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
            {
              title: '操作',
              key: 'action',
              render: record => (
                <Space size="middle">
                  <Button type="primary" onClick={(e) => this.showModal(record,e)} icon={<EditOutlined />} size="size" />
                  <Button type="primary" onClick={(e) => this.onDelete(record,e)} danger icon={<DeleteOutlined />} size="size" />
                </Space>
              ),
            },
        ],
    };
    getVideoList = (index) => {
        let params = {
            page: index-1,
            pageSize: this.state.pageSize
        };
        https.fetchGet("/material/video/index", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    videoList: data.data.list,
                    pageTotal:data.data.page.count
                });
            }
        })
    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
        //console.log(selectedRowKeys)
    };
    onBatchDelete = () => {
        //console.log(this.state.selectedRowKeys)
    };
    onDelete = (record,e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        return
        let params = {
            materialIds: record.materialId
        };
        //console.log(params)
        https.fetchDelete("/material/imagetext/delete", params).then(data => {
            if (data.code === 200) {
                //console.log(data)
                this.getVideoList();
            }
        })
    };
    goPage = index => {
        this.getVideoList(index);
    };
    onPlay = (url,e)=>{
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
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

    jump = () => {
        this.props.history.push(`/createVideo`);
    }

    showModal = (record,e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let editData =  JSON.parse(JSON.stringify(record));
        this.setState({
            visible: true,
            editData,
        });
    };
    
    titleChange = e => {
        let editData = this.state.editData;
        editData.resName = e.target.value;
        this.setState({
            editData
        });
    };
    descChange = e => {
        let editData = this.state.editData;
        editData.resDesc = e.target.value;
        this.setState({
            editData
        });
    };

    handleOk = e => {
        let params = {
            materialId: this.state.editData.materialId,
            title: this.state.editData.resName,
            desc: this.state.editData.resDesc
        };
        https.fetchPut("/material/video/update", params).then(data => {
            if (data.code === 200){
                message.success("编辑成功！");
                this.setState({
                    visible: false,
                },()=>{
                    this.getVideoList(1);
                });
            } 
            else message.info("编辑失败！");
        })
    };
    
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    componentWillMount() {
        this.getVideoList(1);
    }
    render() {
        const { videoList,pageSize,pageTotal,selectedRowKeys,columns,showVideo,videoUrl,visible,editData } = this.state
        return (
            <section>
                <div style={{ fontSize: 16,marginBottom:20 }}>
                    <Button 
                        type="primary"
                        onClick={() => this.onBatchDelete()}
                    >批量删除</Button>
                    <Button 
                        type="primary"
                        onClick={this.jump} 
                        style={{ marginLeft: 15 }}
                    >本地上传</Button>
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
                    dataSource={videoList}
                    pagination={{
                        total: pageTotal,
                        pageSize: pageSize,
                        onChange: this.goPage,
                        showSizeChanger:false
                    }}
                />
                <Modal
                    title="编辑视频素材"
                    cancelText="取消"
                    okText="确定"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="edit-gronp">
                        <div className="edit-label">视频名称</div>
                        <div className="edit-input">
                            <Input 
                                onChange={this.titleChange} 
                                value={editData.resName} 
                                placeholder="请输入内容"
                            />
                        </div>
                    </div>
                    <div className="edit-gronp">
                        <div className="edit-label">描述</div>
                        <div className="edit-input">
                            <Input 
                                onChange={this.descChange} 
                                value={editData.resDesc} 
                                placeholder="请输入内容"
                            />
                        </div>
                    </div>
                </Modal>
                {
                    showVideo?(
                        <div className="layer">
                            <div className="layer-mask" onClick={this.closeVideo}></div>
                            <div className="layer-content">
                                <VideoPlayer videoUrl={videoUrl} />
                            </div>
                        </div>
                    ):null
                }    
            </section>
        )
    }
}