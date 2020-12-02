import React from 'react';
import ReactEcharts from "echarts-for-react";
import { DatePicker, Tabs, Select, ConfigProvider } from 'antd';
import moment from 'moment';
import locale from 'antd/es/locale/zh_CN';
import https from "../api/https";
import "../styles/statistics.css";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

export default class MenuChartByCondition extends React.Component {
    
    state = {
        title:'菜单点击次数',
        type:0,
        startDataTime: '',
        endDataTime: '',
        option: {},
        menuId: '',
        submenuId: '',
        version: '',
        menu:null,
        options:[],
        subList:[],
    };

    onChange = (date, dateString) =>{
        //console.log(date, dateString);
        this.setState({ 
            startDataTime: dateString[0],
            endDataTime: dateString[1],
        },()=>{
            this.getChartByCondition()
        });
    }
    
    callback = (key) =>{
        
        let title = '菜单点击次数';
        if(key==0) title = '菜单点击次数';
        if(key==1) title = '菜单点击人数';
        if(key==2) title = '人均点击次数';
        this.setState({ 
            type: key,
            title: title
         },()=>{
            this.getChartByCondition()
         });
        
    }

    handleChange = (value)=> {
        //console.log(value)
        this.setState({ 
            version: value,
        },()=>{
            this.getChartByCondition();
        });
        let list = this.state.menu;
        for (let items of list) {
            if (value == items.version) {
                let subList = []
                for (let menuItem of items.data) {
                    let arrStr = { value: menuItem.menu_id, label: menuItem.menu_name };
                    subList.push(arrStr);
                }
                this.setState({ 
                    subList: subList,
                });
                //console.log(subList)
            }
        }
    };

    subChange = (value)=> {
        this.setState({ 
            menuId: value,
        },()=>{
            this.getChartByCondition();
        });
        //console.log(value)
    };

    getChartByCondition = () =>{
        let params = {
            startDataTime: this.state.startDataTime,
            endDataTime: this.state.endDataTime,
            type: this.state.type,
            publicId: '600000000070',
            menuId: this.state.menuId,
            submenuId: this.state.submenuId,
            version: this.state.version,
        };
        https.fetchGet("/analysis/menu/getChartByCondition", params)
        .then(data => {
            if (data.code === 200) {
                let rowX = [],rowY = [];
                for (var i = 0; i < data.data.length; i++) {
                    rowX.push(data.data[i].analysis_date);
                    rowY.push(data.data[i].count);
                }
                let option = {
                    color:['#1890ff'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: { data: [this.state.title] },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: { type: 'value' },
                    series: [
                        {
                            name: this.state.title,
                            type: 'line',
                            data: []
                        }
                    ]
                }
                option.xAxis.data = rowX;
                option.series[0].data = rowY;
                this.setState({ option });
            }
        })
    }
    
    //获取版本、菜单
    getMenuVersion = () =>{
        let params = {
            startTime: this.state.startDataTime,
            endTime: this.state.endDataTime,
        };
        https.fetchGet("/publicMenu/menuVersion", params)
        .then(data => {
            if (data.code == 200) {
                let options = [];
                for (let items of data.data) {
                    let arrStr = { value: items.version, label: items.version };
                    options.push(arrStr);
                }
                this.setState({ 
                    menu: data.data,
                    options: options,
                });
                //console.log(data.data)
            }
        })
    }

    componentWillMount() {
        
        let date = new Date();
        let year = date.getFullYear().toString();
        let mouth =
            date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1).toString()
            : (date.getMonth() + 1).toString();

        let day =
            date.getDate() + 1 < 10
            ? "0" + date.getDate().toString()
            : date.getDate().toString();
        let end = year + "-" + mouth + "-" + day;
        let begin = year + "-" + mouth + "-1";

        this.setState({ 
            startDataTime: begin,
            endDataTime: end,
        },()=>{
            this.getChartByCondition();
            this.getMenuVersion();
        });
    }

    render() {
        const { 
            startDataTime,endDataTime,options,subList,submenuId
        } = this.state
        
        return (
            <section>
                <ConfigProvider locale={locale}>
                    <RangePicker defaultValue={[moment(startDataTime, dateFormat), moment(endDataTime, dateFormat)]} onChange={this.onChange} />
                    &ensp;
                    <Select
                        placeholder="请选择"
                        onChange={this.handleChange} 
                        style={{ width: 200 }}
                    >
                        {
                            options.map((item,idx) =>{
                                return (
                                    <Option value={item.value} key={idx}>{item.label}</Option>
                                );
                            })
                        }
                    </Select>&emsp;
                    {
                        subList&&subList.length?(
                            <Select
                                placeholder="请选择"
                                onChange={this.subChange} 
                                style={{ width: 200 }}
                            >
                            {
                                subList.map((item,idx) =>{
                                    return (
                                        <Option value={item.value} key={idx}>{item.label}</Option>
                                    );
                                })
                            }
                            </Select>
                        ):''
                    }
                </ConfigProvider>
                <Tabs onChange={this.callback} style={{marginTop:15}} type="card">
                    <TabPane tab="菜单点击次数" key="0" />
                    <TabPane tab="菜单点击人数" key="1" />
                    <TabPane tab="人均点击次数" key="2" />
                </Tabs>
                <ReactEcharts option={this.state.option}  key={Date.now()} />
            </section>
        )

    }
}