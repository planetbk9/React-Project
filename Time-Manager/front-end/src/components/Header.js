import React, { Component } from 'react';
import Modal from 'react-modal';
import './Header.scss';

class Header extends Component {
  state = {
    id: '',
    password: '',
    confirm: ''
  }
  
  onInput = (e, domain) => {
    this.setState({
      ...this.state,
      [domain]: e.target.value
    });
  }

  onSubmit = (e, modalType) => {
    e.preventDefault();
    const { id, password, confirm } = this.state;

    if(modalType === 'membership') {
      if(id.length < 5) {
        alert('아이디는 5글자 이상으로 해주세요.');
        return;
      }
      if(password.length < 5 || confirm.length < 5) {
        alert('비밀번호는 5글자 이상으로 해주세요.');
        return;
      }
    } else if(modalType === 'changePwd') {
      if(password.length < 5 || confirm.length < 5) {
        alert('비밀번호는 5글자 이상으로 해주세요.');
        return;
      }
    }

    this.props.handleModal(false);
    this.setState({
      id: '',
      password: '',
      confirm: ''
    });

    if(modalType === 'membership') {
      if(password !== confirm) {
        alert('비밀번호를 다르게 입력하셨습니다.');
        return;
      }
      this.props.onResister(id, password)
      .then(res => {
        console.log(res);
        
      })
      .catch(err => {
        console.error(err);
      });
    } else if(modalType === 'login'){
      this.props.onLogin(id, password)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
    } else if(modalType === 'changePwd'){
      if(password !== confirm) {
        alert('비밀번호를 다르게 입력하셨습니다.');
        return;
      }
      this.props.onChangePwd(this.props.user, password)
      .then(id => {
        alert(id + '의 비밀번호가 변경되었습니다.');
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  componentDidMount () {
    Modal.setAppElement('#root');
  }

  render () {
    const { user, modal, modalType, handleModal, state, onLogout, onChangePage } = this.props;
    const modalSubject = modalType === 'login' ? '로그인' : modalType === 'membership' ? '회원가입' : '비번변경';

    const modalStyle = {
      content: {
        width: '20rem',
        height: 'auto',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        margin: '0'
      }
    };

    return (
    <header className="template-header">
        <div className="template-header-subject" onClick={()=>{onChangePage(0)}}><i className="far fa-clock"></i> 타임매니저</div>
        <nav className="template-header-nav">
          {state === 'logout' ?  
          <ul>
            <li onClick={() => {handleModal(true, 'login')}}>로그인</li>
            <li onClick={() => {handleModal(true, 'membership')}}>회원가입</li>
          </ul>
          :
          <div>
          <div>{user}님 반가워요!</div>
          <ul>
            <li onClick={() => {onChangePage(1)}}>리포트</li>
            <li onClick={() => {handleModal(true, 'changePwd')}}>비밀번호 변경</li>
            <li onClick={onLogout}>로그아웃</li>
          </ul>
          </div>
          }
        </nav>
        <Modal isOpen={modal} onRequestClose={() => {handleModal(!modal)}} style={modalStyle} contentLabel="Time Manager">
          <h2 className="modal-subject">{modalSubject}</h2>
          <form className="modal-form" onSubmit={(e) => this.onSubmit(e, modalType)}>
            <p className="modal-comment">내 시간은 내가 관리한다!</p>
            {modalType !== 'changePwd' ? <input className="modal-input" type="text" placeholder="아이디" value={this.state.id} onChange={(e) => {this.onInput(e, 'id');}}></input> : ''}
            <input className="modal-input" type="password" placeholder="비밀번호" value={this.state.password} onChange={(e) => {this.onInput(e, 'password');}}></input>
            {modalType !== 'login' ? <input className="modal-input" type="password" placeholder="비밀번호 확인" value={this.state.confirm} onChange={(e) => {this.onInput(e, 'confirm');}}></input> : ''}
            <button className="modal-button" type="submit">등록!</button>
          </form>
        </Modal>
    </header>
    );
  }
}

export default Header;