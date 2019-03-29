import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from 'components/Header';
import * as watchActions from 'store/modules/watch';
import * as dbActions from 'store/modules/db';
import * as commonActions from 'store/modules/common';
import * as subjectActions from 'store/modules/subject';
import funcs from 'utils/funcs';

class HeaderContainer extends Component {
  handleModal = (modal, modalType) => {
    this.props.common_modal({ modal, modalType });
  }
  loadUser = (user) => {
    const today = funcs.getDate();
    const { watch_sync, fetchDB, db_insert_all } = this.props;

    return fetchDB(user)
      .then(res => {
        if (!res) return null;
        const userItems = res.userItems;
        db_insert_all({ user, userItems });
        return funcs.findUserItemByDate(userItems, today) || userItems[userItems.length - 1];
      })
      .then(userItem => {
        if (userItem) {
          watch_sync({ date: userItem.date, dateItem: userItem.dateItems[userItem.dateItems.length - 1] });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  enrolUser = (id, password) => {
    this.props.subject_clear();
    return this.props.registerUser(id, password)
      .then(user => {
        return this.loadUser(user);
      });
  }
  loginUser = (id, password) => {
    this.props.subject_clear();
    return this.props.loginUser(id, password)
      .then(user => {
        if (!user) return;
        console.log(user + ' 로그인!');
        return this.loadUser(user);
      });
  }
  changePwd = (id, password) => {
    return this.props.changeUserInfo(id, password);
  }
  logout = () => {
    this.props.common_logout();
    this.props.db_clear();
    this.props.watch_sync();
    this.props.subject_clear();
    this.props.common_page(0);

    // Guest mode 세팅
    const sessionString = sessionStorage.getItem('timemanager_list');
    if(!sessionString) return;
    const guestSubjectList = sessionString.split(':');
    let watchSubject;
    for (let subject of guestSubjectList) {
      this.props.subject_insert(watchSubject = subject);
    }
    const watchTime = +sessionStorage.getItem('timemanager_' + watchSubject);
    const dateItem = { subject: watchSubject, time: watchTime };
    this.props.watch_sync({ date: funcs.getDate(), dateItem });
  }
  changeScreen = (type) => {
    this.props.common_page(type);
  }
  getNav = () => {
    const { user } = this.props;
    const { handleModal, changeScreen, logout } = this;
    const ret = this.props.state === 'logout' ?
      <div>
        <div className="template-header-greeting">게스트 모드로 동작합니다.</div>
        <ul>
          <li><button className="nav-button" onClick={() => { handleModal(true, 'login') }}>로그인</button></li>
          <li><button className="nav-button" onClick={() => { handleModal(true, 'membership') }}>회원가입</button></li>
        </ul>
      </div>
      :
      <div>
        <div className="template-header-greeting">{user}님 반가워요!</div>
        <ul>
          <li><button className="nav-button" onClick={() => { changeScreen(1) }}>모아보기</button></li>
          <li><button className="nav-button" onClick={() => { handleModal(true, 'changePwd') }}>정보변경</button></li>
          <li><button className="nav-button" onClick={logout}>로그아웃</button></li>
        </ul>
      </div>
    return ret;
  }
  getSmallNav = () => {
    const { handleModal, changeScreen, logout } = this;
    const ret = this.props.state === 'logout' ?
      <div id="nav-dropdown-container" className="nav-dropdown-container">
        <button className="dropdown-item" onClick={() => { handleModal(true, 'login') }}>로그인</button>
        <button className="dropdown-item" onClick={() => { handleModal(true, 'membership') }}>회원가입</button>
      </div>
      :
      <div id="nav-dropdown-container" className="nav-dropdown-container">
        <button className="dropdown-item" onClick={() => { changeScreen(1) }}>모아보기</button>
        <button className="dropdown-item" onClick={() => { handleModal(true, 'changePwd') }}>정보변경</button>
        <button className="dropdown-item" onClick={logout}>로그아웃</button>
      </div>
    return ret;
  }

  componentDidMount() {
    if (this.props.state === 'login') {
      this.loadUser(this.props.user);
    }
  }

  render() {
    const { modal, modalType } = this.props;
    return (
      <Header
        modal={modal}
        modalType={modalType}
        handleModal={this.handleModal}
        onResister={this.enrolUser}
        onLogin={this.loginUser}
        onChangePwd={this.changePwd}
        onChangePage={this.changeScreen}
        Navigator={this.getNav()}
        SmallNavigator={this.getSmallNav()} />
    );
  }
}

const mapStateToProps = ({ common, db, subject }) => {
  return {
    ...common,
    ...db,
    ...subject
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ ...commonActions, ...dbActions, ...watchActions, ...subjectActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);