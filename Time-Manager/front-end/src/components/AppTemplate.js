import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from 'store/modules/common';
import './AppTemplate.scss';

class AppTemplate extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.screen !== nextProps.screen;
  }
  render() {
    const { screen, HeaderContainer, Main, StopWatchContainer, HistoryContainer, SubjectContainer, ReportContainer, Footer } = this.props;

    return (
      <div className="template-container">
        <div>
          <HeaderContainer />
        </div>
        <section className={`${screen !== 'home' && 'hide'}`}>
          <Main />
          <section id="image-window"></section>
        </section>
        <div className={`content-container ${screen !== 'home' && 'hide'}`}>
          <section>
            <SubjectContainer />
          </section>
          <section>
            <StopWatchContainer />
          </section>
          <section>
            <HistoryContainer />
          </section>
        </div>
        <div className={`report-container ${screen !== 'report' && 'hide'}`}>
          <section>
            <ReportContainer />
          </section>
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

const mapStateToProps = ({ common }) => {
  return {
    ...common
  };
}
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...commonActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppTemplate);