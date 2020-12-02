import React from 'react';
import { Card, Button, Input, Row, Col, Table, Checkbox, Tag } from 'antd';
import https from "../api/https";
import "../styles/userManager.css";
const { Search } = Input;

export default class UserManager extends React.Component {
    
    state = {
        disabled:true,
        keyword:'',
        current:1,
        pageSize:20,
        pageTotal:0,
        data:[],
        columns:[
            {
                title: '用户名',
                render: record => (
                    <span style={{fontSize:'16px'}}>
                        {record.name}<br/>
                        {
                            record.lables?(
                                <Tag color={'blue'}>
                                    {record.lables}
                                </Tag>
                            ):''
                        }
                    </span>
                ),
            },
        ],
        selectedRowKeys: [],
        loading: false,
        labelList:[],
        checkId:0,
        tagsIdList:[],
    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
        this.setAdminList(selectedRowKeys);
    };
    setAdminList = list => {
        window.adminList = this.getDataList(list)
        if((window.adminList&&window.adminList.length) || (window.tagsIdList&&window.tagsIdList.length)){
            this.setState({ disabled: false });
        }
        else this.setState({ disabled: true });
    };
    getDataList = (list) =>{
        let data = this.state.data;
        let result = [];
        if(list && list.length){
            for(let i=0; i<list.length; i++){
                let id = list[i];
                for(let j=0; j<data.length; j++){
                    let item = data[j];
                    if(item.fouce_id==id) result.push(item)
                }
            }
        }
        return result;
    };
    checkChange = e => {
        if(this.state.checkId==0){
            if(e.target.checked){
                let obj = this.state.tagsIdList;
                obj.push(e.target.nodes);
                this.setState({
                    checkId: e.target.parentId,
                    tagsIdList: obj
                });
            }
        }else{
            if(e.target.checked){
                let obj = this.state.tagsIdList;
                obj.push(e.target.nodes);
                this.setState({
                    tagsIdList: obj
                });
            }else{
                let obj = this.state.tagsIdList;
                let index = obj.indexOf(e.target.nodes); 
                obj.splice(index, 1); 
                this.setState({
                    tagsIdList: obj
                });
            }
            if(this.state.tagsIdList.length == 0){
                this.setState({
                    checkId: 0,
                });
            }
        }
        window.tagsIdList = this.state.tagsIdList

        if((window.adminList&&window.adminList.length) || (window.tagsIdList&&window.tagsIdList.length)){
            this.setState({ disabled: false });
        }
        else this.setState({ disabled: true });
    }
    searchUserList = (val) => {
        this.setState({ 
            keyword: val,
            current: 1,
        },()=>{
            this.getUserList();
        });
    };

    getUserList = () => {
        let params = {
            accountId: localStorage.getItem("publicId"),
            pageindex: this.state.current,
            totalPage: 0,
            username: this.state.keyword
        };
        https.fetchPost("/publicFouce/selectList", params)
        .then(data => {
            if (data.code === 200) {
                
                this.setState({
                    data: data.data.list,
                    pageTotal:data.data.totalCount,
                });
            }
        })
    };
    goPage = index => {
        this.setState({
            current:index,
        },()=>{
            this.getUserList();
        });
    };

    getLabelList = () => {
        
        https.fetchPost("/lableuser/allLable", {})
        .then(data => {
            if (data.code === 200) {
                this.setState({
                    labelList: data.data.lables,
                });
            }
        })
    };

    jump = () => {
        this.props.history.push(`/groupSend`);
    }
    
    componentWillMount() {
        this.getLabelList();
        this.getUserList();
        window.tagsIdList = []
        window.adminList = []
    }
    render() {
        const { data ,current,pageSize,pageTotal,columns, selectedRowKeys, labelList, tempId, checkId, disabled } = this.state
        return (
            <Card title="用户管理" bordered={false}>
                <Search
                    placeholder="请输入用户名"
                    enterButton="查询"
                    className="search"
                    onSearch={value => this.searchUserList(value)}
                />
                <Row>
                    <Col span={19}>
                        <div className="all">全部用户
                            <Button type="primary"
                                className="group-send"
                                disabled={disabled}
                                onClick={this.jump}
                            >群发消息</Button>
                        </div>
                        <Table
                            rowKey={item => item.fouce_id }
                            rowSelection={{
                                selectedRowKeys,
                                onChange: this.onSelectChange,
                            }}
                            onRow={(record)=>{
                                return{
                                    onClick:()=>{
                                        let selectedRow = JSON.parse(JSON.stringify(selectedRowKeys));
                                        let idx = selectedRow.indexOf(record.fouce_id);
                                        if (idx == -1) selectedRow.push(record.fouce_id);
                                        else selectedRow.splice(idx, 1);
                                        this.setState({
                                            selectedRowKeys:selectedRow
                                        })
                                        this.setAdminList(selectedRow);
                                    }
                                }
                            }}
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                total: pageTotal,
                                current: current,
                                pageSize: pageSize,
                                onChange: this.goPage,
                                showSizeChanger:false
                            }}
                        />
                    </Col>
                    <Col span={5}  className="right">
                        <div className="right-all">全部用户({data.length})</div>
                        <div>{
                            labelList.map((item, index) =>{
                                return (
                                    <div className="tag" key={index}>
                                        <div style={{ color: '#000' }}>{item.lableName}</div>
                                        {
                                            item.nodes.map((nodes,idx) =>{
                                                return (
                                                    <div key={idx}>
                                                        <Checkbox.Group>
                                                            <Checkbox 
                                                                parentId={item.id}
                                                                nodes={nodes}
                                                                value={nodes.nodeValue}
                                                                disabled={checkId!=item.id&&checkId!=0}
                                                                onChange={this.checkChange}
                                                            >
                                                                {nodes.nodeName} ({nodes.count})
                                                            </Checkbox>
                                                        </Checkbox.Group>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                );
                            })
                        }</div>
                    </Col>
                </Row>
                
            </Card>
        )

    }
}