import React, { Component } from 'react';
import styles from './ViewerTemplate.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

class ViewerTemplate extends Component {
  render() {
    const { viewer, spaceNavigator } = this.props;

    return (
      <div className={cx('container')}>
        <header>
          Astronomy Picture of the Day
        </header>
        <div className={cx('viewer-wrapper')}>
          {viewer}
          <div className={cx('space-navigator-wrapper')}>
            {spaceNavigator}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewerTemplate;