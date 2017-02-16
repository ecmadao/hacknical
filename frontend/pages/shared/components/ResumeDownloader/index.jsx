import React, { PropTypes } from 'react';
import domtoimage from 'dom-to-image';
import objectAssign from 'object-assign';
import FloatingActionButton from 'COMPONENTS/FloatingActionButton';
import { GREEN_COLORS } from 'UTILS/colors';

class ResumeDownloader extends React.Component {
  handleDownload() {
    const { resume } = this.props;
    const { info } = resume;
    const node = document.getElementById('resume');
    domtoimage.toPng(node)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `${info.name}的简历.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
  }

  render() {
    const { style } = this.props;
    return (
      <FloatingActionButton
        icon="download"
        style={{
          right: '15%',
          backgroundColor: GREEN_COLORS[1]
        }}
        onClick={this.handleDownload.bind(this)}
      />
    )
  }
}

ResumeDownloader.propTypes = {
  style: PropTypes.object,
  resume: PropTypes.object
};

ResumeDownloader.defaultProps = {
  style: {},
  resume: { info: { name: 'resume' } }
};

export default ResumeDownloader;
