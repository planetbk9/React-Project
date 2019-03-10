import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from 'store/modules/common';
import funcs from 'utils/funcs';
import './AppTemplate.scss';

class AppTemplate extends Component {
  drawCalendar = (reportDateStr) => {
    reportDateStr = reportDateStr || funcs.getDate(new Date());

    const header = ['일', '월', '화', '수', '목', '금', '토', '합계'];
    let calendar = header.map(item => <div key={item} className="report-header-item">{item}</div>);

    let dateObj = new Date(reportDateStr);
    const refObj = new Date(reportDateStr);
    refObj.setDate(1);
    refObj.setMonth(refObj.getMonth()+1);
    dateObj.setDate(1);
    dateObj.setDate(-dateObj.getDay()+1);

    let week = 0;
    let weeks = [];
    let dates = [];
    const { userItems } = this.props;

    while(dateObj.getTime() < refObj.getTime()) {
      let weekReport = {};
      for(let i=0; i<7; i++) {
        const timeConst = funcs.getDate(dateObj);
        dates[i] = new Date(timeConst);
        dateObj.setDate(dateObj.getDate()+1);
      }
      let datesJSX = dates.map(date => {
        let dateStr = funcs.getDate(date);
        const userItem = funcs.findUserItemByDate(userItems, dateStr);
        let rows;
        if(userItem) {
          rows = userItem.dateItems.map(dateItem => {
            if(weekReport[dateItem.subject] !== undefined) weekReport[dateItem.subject] += dateItem.time;
            else weekReport[dateItem.subject] = dateItem.time;
            return (
              <div key={dateItem._id} className="report-item-row">
                <div className="report-item-subject">{dateItem.subject}</div>
                <div className="report-item-time">{funcs.timeToString(dateItem.time, true)}</div>
              </div>
            );
          });
        }
        let key = userItem ? userItem._id : String(date);
        return (
            <div key={key} className="report-item">
              <div className="report-item-date">{date.getDate()}</div>
              {rows}
            </div>
        );
      });

      const weekJSX = Object.keys(weekReport).map(subject => {
        const key = String(dateObj.getFullYear()) + dateObj.getMonth() + ++week + subject;
        return (
          <div key={key} className="report-item-row">
            <div className="report-item-subject">{subject}</div>
            <div className="report-item-time">{funcs.timeToString(weekReport[subject], true)}</div>
          </div>
        );
      });

      datesJSX.push(
        <div key={String(dateObj.getFullYear()) + dateObj.getMonth() + week} className="report-item">
          {weekJSX}
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

  render() {
    const { state, screen, reportDateObj, HeaderContainer, StopWatchContainer, HistoryContainer, SubjectContainer } = this.props;
    let reportItems = this.drawCalendar(funcs.getDate(reportDateObj));  

    return (
      <div className="template-container">
        <div>
          <HeaderContainer />
        </div>
        <div className={`content-container ${screen !== 'home' && 'hide'}`}>
          {state === 'login' ? 
          <div className="subject-container">
            <SubjectContainer />
          </div> : ''}
          <div className="time-history-container">
            <StopWatchContainer />
            {state === 'login' ? <HistoryContainer /> : ''}
          </div>
        </div>
        <div className={`report-container ${screen !== 'report' && 'hide'}`}> 
          <div className="report-table-month"><span className="report-month-before" onClick={() => {this.changeMonth(-1);}}>&#60;</span>{reportDateObj.getFullYear() + '년 ' + (reportDateObj.getMonth()+1) + '월'}<span className="report-month-after" onClick={() => {this.changeMonth(1);}}>&#62;</span></div>
          <div className="report-table">
            {reportItems}
          </div>
        </div>
        <footer>
          <div>Reference:&nbsp;<strong><a href="https://github.com/planetbk9/React-Project/tree/master/Time-Manager">github</a></strong></div>
          <div className="footer-item-right">Contact:&nbsp;<strong>planetbk9@gmail.com</strong></div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = ({common, db}) => {
  return {
    ...common,
    ...db
  };
}
const mapDispatchToProps = (dispatch) => bindActionCreators({...commonActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppTemplate);