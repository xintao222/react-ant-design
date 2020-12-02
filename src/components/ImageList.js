import React from 'react';
import { Table,Space,Button,Modal,Input,message,Upload,Spin } from 'antd';
import https from "../api/https";
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

export default class ImageList extends React.Component {
    
    state = {
        visible: false,
        editData:{},
        pageSize:10,
        pageTotal:0,
        imageList:[],
        selectedRowKeys:[],
        columns:[
            {
                title: '名称',
                width: 220,
                ellipsis: true,
                dataIndex: 'resTitle',
            },
            {
                title: '图片',
                dataIndex: 'resUrl',
                render: resUrl => (
                  <Space size="middle">
                    <img height={100} width={100} src={resUrl ? resUrl : ''} />
                  </Space>
                ),
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
        config:{
            name: 'file',
            action: window.ApiUrl+"/material/image/upload",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("Authorization")
            },
            dataType: "script",
            data: {
                Authorization: localStorage.getItem("Authorization")
            },
            showUploadList:false,
            beforeUpload:(file)=>{
                const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('请上传 JPG/PNG 文件!');
                }
                const isLt2M = file.size / 1024 < 60;
                if (!isLt2M) {
                  message.error('文件大小不能超过60K!');
                }
                return isJpgOrPng && isLt2M;
            },
            onChange:(info)=>{
                if (info.file.status === 'done') {
                    let data = info.file.response;
                    if (data.code === 200) {
                        message.success(`上传成功`);
                        this.getImageList(1);
                    }else{
                        message.error(data.mesg); 
                    }
                } else if (info.file.status === 'error') {
                    message.error(`上传失败，请重新选择`);
                }
            }
        }
    };
    getImageList = (index) => {
        let params = {
            page: index-1,
            pageSize: this.state.pageSize
        };
        https.fetchGet("/material/image/index", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    imageList: data.data.list,
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
        https.fetchDelete("/material/image/delete", params).then(data => {
            if (data.code === 200) {
                //console.log(data)
                this.getImageList(1);
            }
        })
    };
    goPage = index => {
        this.getImageList(index);
    };

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
        editData.resTitle = e.target.value;
        this.setState({
            editData
        });
    };

    handleOk = e => {
        let params = {
            materialId: this.state.editData.materialId,
            title: this.state.editData.resTitle
        };
        https.fetchPut("/material/image/updateimagetitle", params).then(data => {
            if (data.code === 200){
                message.success("编辑成功！");
                this.setState({
                    visible: false,
                },()=>{
                    this.getImageList(1);
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
        this.getImageList(1);
    }
    render() {
        const { imageList,pageSize,pageTotal,selectedRowKeys,columns,visible,editData,config } = this.state
        return (
            <section style={{position:'relative'}}>
                <div style={{ fontSize: 16,marginBottom:20 }}>
                    <Button  style={{ marginRight:15 }}
                        type="primary"
                        onClick={() => this.onBatchDelete()}
                    >批量删除</Button>
                    <Upload className="imgList" {...config} style={{ display:'inline-block' }}>
                        <Button>上传文件</Button>
                    </Upload>
                    <span style={{
                        display:'inline-block',
                        fontSize:16,
                        color: "rgb(154, 141, 141)",
                        marginTop:15,
                        marginLeft:15
                        }}>上传文件大小不超过60KB,支持jpg，png等图片文件</span>
                    
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
                    dataSource={imageList}
                    pagination={{
                        total: pageTotal,
                        pageSize: pageSize,
                        onChange: this.goPage,
                        showSizeChanger:false
                    }}
                />
                <Modal
                    title="编辑图片素材"
                    cancelText="取消"
                    okText="确定"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="edit-gronp">
                        <div className="edit-label">图片名称</div>
                        <div className="edit-input">
                            <Input 
                                onChange={this.titleChange} 
                                value={editData.resTitle} 
                                placeholder="请输入内容"
                            />
                        </div>
                    </div>
                </Modal>
            </section>
        )

    }
}