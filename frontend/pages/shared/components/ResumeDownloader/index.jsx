import React, { PropTypes } from 'react';
import domtoimage from 'dom-to-image';
import objectAssign from 'object-assign';
import { FloatingActionButton } from 'light-ui';

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
          position: 'fixed',
          bottom: '30px',
          right: '15%'
        }}
        color="green"
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
