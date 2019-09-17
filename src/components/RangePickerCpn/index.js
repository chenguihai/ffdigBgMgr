import React, {Component} from "react";
import moment from "moment";
import {Button, DatePicker} from "antd";
import "./index.less";

const {RangePicker} = DatePicker;

class RangePickerNew extends Component {
    state = {
        startTime: 0,
        endTime: 0,
        // startTime: moment().subtract(this.props.interval, "months"),
        // endTime: moment(),
        openFlag: false
    };
    isOkFlag = false;
    currentTime = null;
    /**
     * @type {moment.Moment}
     * startTimeOld  endTimeOld  记录提交的时候的值
     */
    startTimeOld = moment().subtract(this.props.interval, "months");
    endTimeOld = moment();

    change = dates => {
        const {startTime, endTime} = this.state;
        if (startTime === 0) {
            let start = this.timePinchFun(dates[0]), end = moment().valueOf();
            let flag = start > end;
            this.currentTime = dates[0];
            this.setState({
                startTime: flag ? moment() : dates[0],
                endTime: flag ? dates[0] : moment(),
            }, () => {
                this.rangDateChangeCommonFun(dates);
            })
        } else {
            this.rangDateChangeCommonFun(dates);
        }
    };
    rangDateChangeCommonFun = (dates) => {
        const {startTime, endTime} = this.state;
        // console.log(startTime.valueOf(), endTime.valueOf());
        let sStartTime = this.timePinchFun(startTime);
        let eEndTime = this.endTimePinchFun(endTime);
        let selectTime = this.timePinchFun(dates[0]);
        if (dates.length > 1) {
            if (this.currentTime && this.timePinchFun(this.currentTime) === selectTime) {
                this.currentTime = dates[1];
            } else {
                this.currentTime = dates[0];
            }
        } else {
            this.currentTime = dates[0];
        }
        let currentTimeDate = this.timePinchFun(this.currentTime);
        if (sStartTime < currentTimeDate && currentTimeDate < eEndTime) { //中
            let flag = eEndTime - currentTimeDate > currentTimeDate - sStartTime;
            this.setState({
                startTime: flag > 0 ? this.currentTime : startTime, //flag true 靠近小的   false  靠近大的
                endTime: flag > 0 ? endTime : this.currentTime,
                openFlag: true
            }, () => {
                this.refs["x-range-picker"].picker.clearHoverValue();
            });
        } else if (currentTimeDate < sStartTime) { //小
            this.setState({
                startTime: this.currentTime,
                endTime: endTime,
                openFlag: true
            }, () => {
                this.refs["x-range-picker"].picker.clearHoverValue();
            });
        } else if (sStartTime === currentTimeDate) {
            this.setState({
                startTime: startTime,
                endTime: endTime,
                openFlag: true
            }, () => {
                this.refs["x-range-picker"].picker.clearHoverValue();
            });
        } else { //大
            this.setState({
                startTime: startTime,
                endTime: this.currentTime,
                openFlag: true
            }, () => {
                this.refs["x-range-picker"].picker.clearHoverValue();
            });
        }
    };

    timePinchFun = (time) => {
        // return time.format('X')
        return time.hour(0).minutes(0).second(0).unix() * 1000
    };
    endTimePinchFun = (time) => {
        // console.log(time.hour(23).minutes(59).second(59).unix() * 1000);
        return time.valueOf()
    };
    show = () => {
        if (this.isOkFlag) return;
        this.setState({
            openFlag: true
        });
    };
    // dateDisabledDate = (current) => {  // 需求有效期的禁止选择时间
    //     if (current) {
    //         return current && current > moment()
    //     }
    // };
    handleSureSelect = () => {
        this.isOkFlag = true;
        let {startTime, endTime} = this.state;
        this.props.handleSubmit(startTime, endTime);
        this.startTimeOld = startTime;
        this.endTimeOld = endTime;
        this.setState({
                openFlag: false,
            }, () => {
                this.isOkFlag = false;
            }
        );
        this.bindClearCalender();
    };
    clickCommonFun = () => {
        this.props.resetTime();
        this.setState({
            startTime: 0,
            endTime: 0,
        });
        this.clearClickEvent();
    };
    handleCancelSelect = () => {
        this.isOkFlag = true;
        this.setState({
                startTime: this.startTimeOld,
                endTime: this.endTimeOld,
                openFlag: false,
            }, () => (this.isOkFlag = false)
        );
    };

    bindClearCalender = () => {
        this.timer = setTimeout(() => {
            let closeCircle = document.querySelector('.ant-calendar-picker-clear');
            if (closeCircle) {
                closeCircle.addEventListener('click', this.clickCommonFun)
            }
            clearTimeout(this.timer);
        }, 1000);
    };
    clearClickEvent = () => {
        let closeCircle = document.querySelector('.ant-calendar-picker-clear');
        if (closeCircle) {
            closeCircle.removeEventListener('click', this.clickCommonFun)
        }
    };

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.clearClickEvent();
    }

    render() {
        const {startTime, endTime, openFlag} = this.state;
        const style = {
            width_200: {width: 230},
        };
        return (
            <div onClick={this.show} id='rangeBox'>
                <RangePicker style={style.width_200}
                             open={openFlag}
                             dropdownClassName='rangPickerWrap'
                             ref='x-range-picker'
                             value={[startTime || null, endTime || null]}
                             renderExtraFooter={() => <div>
                                 <Button size='small' className='mr10' onClick={this.handleCancelSelect}>取消</Button>
                                 <Button size='small' type='primary' onClick={this.handleSureSelect}>确定</Button>
                             </div>}
                             format="YYYY-MM-DD"
                             placeholder={["Start Time", "End Time"]}
                             onCalendarChange={this.change}
                    // disabledDate={this.dateDisabledDate}
                />
            </div>
        );
    }
}

export default RangePickerNew;