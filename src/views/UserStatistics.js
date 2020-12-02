import React from 'react';
import { Card, } from 'antd';
import UserListByCondition from '../components/UserListByCondition'
import UserChartByCondition from '../components/UserChartByCondition'
import https from "../api/https";
import "../styles/statistics.css";

export default class UserStatistics extends React.Component {
    
    state = {
        list:{}
    };

    getYesterDayKeyIndicator = (index) =>{
        let params = {
            publicId: '600000000070',
        };
        https.fetchGet("/analysis/user/getYesterDayKeyIndicator", params)
        .then(data => {
            if (data.code == 200) {
                this.setState({
                    list: data.data
                });
            }
        })
    }

    componentWillMount() {
        this.getYesterDayKeyIndicator();
    }

    render() {
        const { 
            list
        } = this.state
        
        return (
            <Card title="用户分析" bordered={false}>
                <div>
                    昨日关键指标
                </div>
                <div className="list">
                    <div className="item">
                        <div className="label">
                            <h3>新关注人数</h3>
                            <p style={{marginBottom:'.5em'}}>{list.fouceCount}</p>
                        </div>
                        <div className="label">
                            <span>日</span>
                            {Math.sign(list.fouceDailyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.fouceDailyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.fouceDailyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.fouceDailyCount)}%</span>
                        </div>
                        <div className="label">
                            <span>周</span>
                            {Math.sign(list.fouceWeekCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.fouceWeekCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.fouceWeekCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.fouceWeekCount)}%</span>
                        </div>
                        <div className="label">
                            <span>月</span>
                            {Math.sign(list.fouceMonthlyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.fouceMonthlyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.fouceMonthlyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.fouceMonthlyCount)}%</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="label">
                            <h3>取消关注人数</h3>
                            <p style={{marginBottom:'.5em'}}>{list.unfouceCount}</p>
                        </div>
                        <div className="label">
                            <span>日</span>
                            {Math.sign(list.unfouceDailyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.unfouceDailyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.unfouceDailyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.unfouceDailyCount)}%</span>
                        </div>
                        <div className="label">
                            <span>周</span>
                            {Math.sign(list.unfouceWeekCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.unfouceWeekCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.unfouceWeekCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.unfouceWeekCount)}%</span>
                        </div>
                        <div className="label">
                            <span>月</span>
                            {Math.sign(list.unfouceMonthlyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.unfouceMonthlyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.unfouceMonthlyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.unfouceMonthlyCount)}%</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="label">
                            <h3>净增关注人数</h3>
                            <p style={{marginBottom:'.5em'}}>{list.fouceUnique}</p>
                        </div>
                        <div className="label">
                            <span>日</span>
                            {Math.sign(list.fouceDailyUnique) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.fouceDailyUnique) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.fouceDailyUnique) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.fouceDailyUnique)}%</span>
                        </div>
                        <div className="label">
                            <span>周</span>
                            {Math.sign(list.fouceWeekUnique) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.fouceWeekUnique) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.fouceWeekUnique) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.fouceWeekUnique)}%</span>
                        </div>
                        <div className="label">
                            <span>月</span>
                            {Math.sign(list.fouceMonthlyUnique) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.fouceMonthlyUnique) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.fouceMonthlyUnique) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.fouceMonthlyUnique)}%</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="label">
                            <h3>累计关注人数</h3>
                            <p style={{marginBottom:'.5em'}}>{list.totalCount}</p>
                        </div>
                        <div className="label">
                            <span>日</span>
                            {Math.sign(list.totalDailyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.totalDailyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.totalDailyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.totalDailyCount)}%</span>
                        </div>
                        <div className="label">
                            <span>周</span>
                            {Math.sign(list.totalWeekCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.totalWeekCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.totalWeekCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.totalWeekCount)}%</span>
                        </div>
                        <div className="label">
                            <span>月</span>
                            {Math.sign(list.totalMonthlyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.totalMonthlyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.totalMonthlyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.totalMonthlyCount)}%</span>
                        </div>
                    </div>
                </div>
                <UserChartByCondition />
                <UserListByCondition />
            </Card>
        )

    }
}