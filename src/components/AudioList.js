import React from 'react';
import { Table,Space,Button,Modal,Input,message } from 'antd';
import https from "../api/https";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default class AudioList extends React.Component {
    
    state = {
        visible: false,
        editData:{},
        pageIndex:10,
        pageTotal:0,
        imageTextList:[],
        selectedRowKeys:[],
        columns:[
            {
                title: '名称',
                width: 120,
                ellipsis: true,
                dataIndex: 'resName',
            },
            {
                title: '音频',
                width: 340,
                ellipsis: true,
                dataIndex: 'resUrl',
                render: resUrl => (
                    <Space size="middle">
                        <audio
                            style={{border:'none'}}
                            src={resUrl}
                            controls="controls"
                        ></audio>
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
    getAudioList = (index) => {
        let params = {
            page: index-1,
            pageSize: this.state.pageIndex
        };
        https.fetchGet("/material/sound/index", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    imageTextList: data.data.list,
                    pageTotal:data.data.page.count
                });
            }
        })
    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
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
                this.getAudioList();
            }
        })
    };
    goPage = index => {
        this.getAudioList(index);
    };

    jump = () => {
        this.props.history.push(`/createAudio`);
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
        https.fetchPut("/material/sound/update", params).then(data => {
            if (data.code === 200){
                message.success("编辑成功！");
                this.setState({
                    visible: false,
                },()=>{
                    this.getAudioList(1);
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
        this.getAudioList(1);
    }
    render() {
        const { imageTextList,pageIndex,pageTotal,selectedRowKeys,columns,visible,editData } = this.state
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
                    dataSource={imageTextList}
                    pagination={{
                        total: pageTotal,
                        pageSize: pageIndex,
                        onChange: this.goPage,
                        showSizeChanger:false
                    }}
                />
                <Modal
                    title="编辑音频素材"
                    cancelText="取消"
                    okText="确定"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="edit-gronp">
                        <div className="edit-label">音频名称</div>
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
            </section>
        )

    }
}