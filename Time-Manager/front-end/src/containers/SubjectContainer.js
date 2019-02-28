import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as subjectActions from 'store/modules/subject';
import * as watchActions from 'store/modules/watch';
import * as dbActions from 'store/modules/db';
import Subject from 'components/Subject';
import funcs from 'utils/funcs';
import * as restAPI from 'utils/restAPI';

class SubjectContainer extends Component {
  componentDidMount() {
  }

  handleClick = (subject) => {
    const { db, watch, watch_sync, fetchDB } = this.props;
    if(watch.state === 'progress') {
      alert('시계를 멈추고 주제를 바꾸세요!');
      return;
    }
    const dateItem = funcs.findItemBySubject(db.userItems, watch.date, subject);

    if(dateItem) {
      watch_sync({date: watch.date, dateItem});
    } else {
      const userItem = {
        date: watch.date,
        dateItems: [{
          subject,
          time: 0
        }]
      }
      restAPI.addData(watch.user, userItem)
      .then(res => {
        watch_sync({date: watch.date, dateItem: res.data.dateItems[0]});
      })
      .then(res => {
        console.log(res);
        fetchDB(watch.user);
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  insertSubject = (subject) => {
    this.handleClick(subject);
    this.props.subject_insert(subject);
  }

  render() {
    const { db } = this.props;
    const { handleClick, insertSubject } = this;
    
    const subjects = new Set();
    db.userItems.forEach(userItem => {
      userItem.dateItems.forEach(dateItem => {
        if(dateItem && dateItem.subject !== '') subjects.add(dateItem.subject);
      });
    });
    const subjectSet = [...subjects];

    const subjectElems = subjectSet.map(subject => {
      return (
        <div key={subject} className="subject-item" onClick={() => {handleClick(subject)}}>
          {subject}
        </div>
      );
    });
    
    return (
      <Subject
        subjects={subjectElems}
        onInsert={insertSubject}/>
    );
  }
}

const mapStateToProps = ({watch, db}) => {
  return {
    watch: watch,
    db: db
  };
};
const mapDispatchToProps = (dispatch) => bindActionCreators({...subjectActions, ...watchActions, ...dbActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubjectContainer);
