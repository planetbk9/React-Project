import React, { Component } from 'react';
import funcs from 'utils/funcs';
import './Report.scss';

class Report extends Component {
  render() {
    const { changeMonth, reportDateObj, reportItems, monthTotTime, getReportDetail } = this.props;

    return (
      <div>
        <div className="report-table-month">
          <div className="report-month-before" onClick={() => { changeMonth(-1); }}>&#60;</div>
          {reportDateObj.getFullYear() + '년 ' + (reportDateObj.getMonth() + 1) + '월'}
          <div className="report-month-after" onClick={() => { changeMonth(1); }}>&#62;</div>
        </div>
        <div className="report-table">
          {reportItems}
        </div>
        <h2 className="report-mention">이번달은 총 {funcs.timeToString(monthTotTime, true, false, true)} 집중했습니다!</h2>
        <div className="report-detail-container">
          {getReportDetail()}
        </div>
      </div>
    );
  }
}

export default Report;