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
  handleClick = (subject) => {
    const { db, watch, watch_sync } = this.props;

    // guest mode 동작
    if(this.props.common.state === 'logout') {
      const time = +sessionStorage.getItem('timemanager_'+subject) || 0;
      const dateItem = {
        subject,
        time
      };
      watch_sync({date: funcs.getDate(), dateItem});
      return;
    }

    if (watch.state === 'progress') {
      alert('시계를 멈추고 주제를 바꾸세요!');
      return;
    }
    const dateItem = funcs.findItemBySubject(db.userItems, watch.date, subject);

    if (dateItem) {
      watch_sync({ date: watch.date, dateItem });
    } else if (watch.dateItem.subject === '') {
      restAPI.updateData(db.user, watch.dateItem._id, { subject })
        .then(res => {
          const userItems = res.data.userItems;
          const dateItem = res.data.dateItem;
          this.props.db_insert_all({user: db.user, userItems});
          watch_sync({date: watch.date, dateItem});
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      const userItem = {
        date: watch.date,
        dateItems: [{
          subject,
          time: 0
        }]
      }
      restAPI.addData(db.user, userItem)
        .then(res => {
          if (!res || !res.data || !res.data.userItems || !res.data.userItem) throw Error('No data found');
          const userItems = res.data.userItems;
          const userItem = res.data.userItem;
          this.props.db_insert_all({user: db.user, userItems});
          watch_sync({ date: watch.date, dateItem: userItem.dateItems[userItem.dateItems.length - 1] });
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
  keyControl = (comb) => {
    this.props.watch_keycontrol(comb);
  }

  componentDidMount() {
    if(this.props.common.state === 'logout') {
      const str = sessionStorage.getItem('timemanager_list');
      if(!str) return;
      const guestSubjectList = str.split(':');
      let watchSubject;
      for(let subject of guestSubjectList) {
        this.props.subject_insert(watchSubject = subject);
      }
      const watchTime = +sessionStorage.getItem('timemanager_' + watchSubject);
      const dateItem = {subject: watchSubject, time: watchTime};
      this.props.watch_sync({date: funcs.getDate(), dateItem});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.db.userItems !== nextProps.db.userItems) {
      const userItems = nextProps.db.userItems;
      if (!userItems) return null;
      userItems.forEach(userItem => {
        userItem.dateItems.forEach(dateItem => {
          this.props.subject_insert(dateItem.subject);
        });
      });
    }
    return this.props.db !== nextProps.db || this.props.subject !== nextProps.subject || this.state !== nextState;
  }

  render() {
    const { subjects } = this.props.subject;
    const { handleClick, insertSubject, keyControl } = this;
    const subjectElems = subjects.map(subject => {
      return (
        <button key={subject} className="subject-item" onClick={() => { handleClick(subject) }}>
          {subject}
        </button>
      );
    });

    return (
      <Subject
        subjects={subjectElems}
        onInsert={insertSubject}
        onKeyControl={keyControl} />
    );
  }
}

const mapStateToProps = ({ watch, subject, db, common }) => {
  return {
    watch,
    subject,
    db,
    common
  };
};
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...subjectActions, ...watchActions, ...dbActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubjectContainer);
