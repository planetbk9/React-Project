import React, { Component } from 'react';
import Modal from 'react-modal';
import './Header.scss';
import menu from 'resource/menu.svg';

const mentionList = ['시간 관리는 본인의 몫!', '관리할 것인가 흘려보낼 것인가', '스케쥴은 안녕하신가요', '오전 시간을 활용해보세요!', '꾸준한 운동은 컨디션 조절에 좋습니다.', '짧은 낮잠은 업무 효율을 높여줍니다.'];
class Header extends Component {
  modalMention;
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

    if (modalType === 'membership') {
      if (id.length < 5) {
        alert('아이디는 5글자 이상으로 해주세요.');
        return;
      }
      if (password.length < 5 || confirm.length < 5) {
        alert('비밀번호는 5글자 이상으로 해주세요.');
        return;
      }
    } else if (modalType === 'changePwd') {
      if (password.length < 5 || confirm.length < 5) {
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

    if (modalType === 'membership') {
      if (password !== confirm) {
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
    } else if (modalType === 'login') {
      this.props.onLogin(id, password)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    } else if (modalType === 'changePwd') {
      if (password !== confirm) {
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
  toggleSmallNav = () => {
    const style = document.getElementById('nav-dropdown-container').style;
    if(style.display === 'none' || !style.display) {
      style.display = 'flex';
      style.opacity = 1;
    } else {
      style.display = 'none';
      style.opacity = 0;
    }
  }
  // Lifecycle
  componentDidMount() {
    Modal.setAppElement('#root');
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(!this.props.modal && nextProps.modal) {
      this.modalMention = mentionList[Math.floor(Math.random()*mentionList.length)];
    }

    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    const { modal, modalType, handleModal, onChangePage, Navigator, SmallNavigator } = this.props;
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
        margin: '0',
        border: '1px solid #F46569',
        outline: 'none'
      }
    };

    return (
      <header className="template-header">
        <div className="template-header-logo"></div>
        <div className="template-header-subject" onClick={() => { onChangePage(0) }}>Time Manager</div>
        <nav className="template-header-nav">
          {Navigator}
        </nav>
        <nav className="template-header-nav-small" onClick={this.toggleSmallNav}>
          <img src={menu} alt="menu"/>
          {SmallNavigator}
        </nav>
        <Modal isOpen={modal} onRequestClose={() => { handleModal(!modal); this.setState({id: '', password: '', confirm: ''}) }} style={modalStyle} contentLabel="Time Manager">
          <h2 className="modal-subject">{modalSubject}</h2>
          <form className="modal-form" onSubmit={(e) => this.onSubmit(e, modalType)}>
            <p className="modal-comment">{this.modalMention}</p>
            {modalType !== 'changePwd' ? <input className="modal-input" type="text" placeholder="아이디" value={this.state.id} onChange={(e) => { this.onInput(e, 'id'); }}></input> : ''}
            <input className="modal-input" type="password" placeholder="비밀번호" value={this.state.password} onChange={(e) => { this.onInput(e, 'password'); }}></input>
            {modalType !== 'login' ? <input className="modal-input" type="password" placeholder="비밀번호 확인" value={this.state.confirm} onChange={(e) => { this.onInput(e, 'confirm'); }}></input> : ''}
            <button className="modal-button" type="submit">등록!</button>
          </form>
        </Modal>
      </header>
    );
  }
}

export default Header;