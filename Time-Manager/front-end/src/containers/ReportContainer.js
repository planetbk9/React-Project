import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from 'store/modules/common';
import funcs from 'utils/funcs';
import Report from 'components/Report';

class ReportContainer extends Component {
  monthTotTime = 0;
  weekReport = [
    /*
    {
      week: Number,
      data: {
        subject: time
      },
      weekTime: Number
    }
    */
  ];

  drawCalendar = (reportDateStr) => {
    this.weekReport = [];
    this.monthTotTime = 0;
    reportDateStr = reportDateStr || funcs.getDate(new Date());

    const header = ['일', '월', '화', '수', '목', '금', '토', '합계'];
    let calendar = header.map(item => <div key={item} className="report-header-item">{item}</div>);

    let dateObj = new Date(reportDateStr);
    const refObj = new Date(reportDateStr);
    refObj.setDate(1);
    refObj.setMonth(refObj.getMonth() + 1);
    dateObj.setDate(1);
    dateObj.setDate(-dateObj.getDay() + 1);

    let week = 1;
    let weeks = [];
    let dates = [];
    const { userItems } = this.props;

    // 한 주마다 반복
    while (dateObj.getTime() < refObj.getTime()) {
      let dataObj = {};
      let weekObj = { week: week++, data: dataObj, weekTime: 0 };
      for (let i = 0; i < 7; i++) {
        const timeConst = funcs.getDate(dateObj);
        dates[i] = new Date(timeConst);
        dateObj.setDate(dateObj.getDate() + 1);
      }
      let datesJSX = dates.map(date => {
        let dateStr = funcs.getDate(date);
        const userItem = funcs.findUserItemByDate(userItems, dateStr);
        let dayTotTime = 0;
        if (userItem) {
          userItem.dateItems.forEach(dateItem => {
            if (!dataObj[dateItem.subject]) dataObj[dateItem.subject] = dateItem.time;
            else dataObj[dateItem.subject] += dateItem.time;
            dayTotTime += dateItem.time;

          });
        }
        weekObj.weekTime += dayTotTime;
        let key = userItem ? userItem._id : String(date);
        return (
          <div key={key} className="report-item">
            <div className="report-item-date">{date.getDate()}</div>
            {dayTotTime !== 0 ? <div className="report-item-data">{funcs.timeToString(dayTotTime, true, false, true)}</div> : null}
          </div>
        );
      });
      this.weekReport.push(weekObj);
      this.monthTotTime += weekObj.weekTime;
      datesJSX.push(
        <div key={String(dateObj.getFullYear()) + dateObj.getMonth() + week} className="report-item">
          <div className="report-item-data">{funcs.timeToString(weekObj.weekTime, true, false, true)}</div>
        </div>
      );
      weeks.push(datesJSX);
    }
    calendar.push(weeks);
    return calendar;
  }

  changeMonth = (move) => {
    this.props.common_month(move);
  }

  getReportDetail = () => {
    const detailJSX = this.weekReport.map(each => {
      const contents = [];
      contents.push(Object.keys(each.data).map(subject => {
        return (
          <div key={subject} className="detail-content-container">
            <div className="detail-content-subject">{subject}</div>
            <div className="detail-content-time">{funcs.timeToString(each.data[subject], true, false, true)}</div>
          </div>
        );
      }));

      const month = this.props.reportDateObj.getMonth() + 1;
      
      return (
        <div key={`${month}:${each.week}`} className="report-detail-boundary">
          <div className="report-detail-item">
            <h3 className="detail-date">{month}월 {each.week}째주</h3>
            {contents}
            <h3 className="detail-summary">{funcs.timeToString(each.weekTime, true, false, true)}</h3>
          </div>
        </div>
      );
    });

    return detailJSX;
  }

  render() {
    const { reportDateObj } = this.props;
    let reportItems = this.drawCalendar(funcs.getDate(reportDateObj));

    return (
      <Report changeMonth={this.changeMonth} reportDateObj={reportDateObj} reportItems={reportItems} monthTotTime={this.monthTotTime} getReportDetail={this.getReportDetail} />
    );
  }
}

const mapStateToProps = ({ common, db }) => {
  return {
    ...common,
    ...db
  };
}
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...commonActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReportContainer);