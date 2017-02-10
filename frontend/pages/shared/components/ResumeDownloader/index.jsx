import React, { PropTypes } from 'react';
import domtoimage from 'dom-to-image';
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

export default ResumeDownloader;
