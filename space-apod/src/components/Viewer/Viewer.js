import React, {Component} from 'react';
import styles from './Viewer.scss';
import { ChasingDots } from 'better-react-spinkit';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

class Viewer extends Component {
  render() {
    const { loading, url, mediaType } = this.props.data;
    console.log(url);

    if(loading) {
      return (
        <div className={cx('viewer')}>
          <ChasingDots size={50} color='white'/>
        </div>
      );
    }

    return (
      <div className={cx('viewer')}>
        {mediaType === 'image'? (
          <img src={url} type={mediaType} alt="Space"/>
        ) : mediaType === 'video' ? (
          <iframe title='space-video' src={url} type={mediaType}></iframe>
        ) : <div>mediaType Error</div>}
      </div>
    );
  }
}

export default Viewer;