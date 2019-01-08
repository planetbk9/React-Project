import React, {Component} from 'react';
import styles from './SpaceNavigator.scss';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

class SpaceNavigator extends Component {
  render() {
    const { onPrev, onNext } = this.props;
    return (
      <div className={cx('navigator-wrapper')}>
        <div className={cx('circle left')} onClick={onPrev}>
          <MdChevronLeft/>
        </div>
        <div className={cx('circle right')} onClick={onNext}>
          <MdChevronRight/>
        </div>
      </div>
    );
  }
}

export default SpaceNavigator;