
import React from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import {
  Tipso,
  Button,
  Loading,
  PortalModal,
  ClassicButton
} from 'light-ui'
import Icon from 'COMPONENTS/Icon'
import API from 'API'
import { request } from 'API/base'
import message from 'UTILS/message'
import locales from 'LOCALES'
import styles from './styles.css'
import { DEFAULT_AVATOR } from 'UTILS/constant/resume'

const resumeInfoText = locales('resume.sections.info')

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
})

const toFile = url => new Promise((resolve) => {
  let filename = url.split('/').slice(-1)[0]
  if (!/\.(pn|jp|jpe)g$/.test(filename)) {
    filename = `${filename}.png`
  }
  const type = `image/${filename.split('.').slice(-1)[0]}`

  fetch(url, { mode: 'no-cors' }).then(res => res.blob()).then((blob) => {
    const file = new File([blob], filename, {
      type
    })
    resolve(file)
  })
})

class AvatorModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      imageUrl: props.imageUrl || DEFAULT_AVATOR,
      rawImage: null,
      uploading: false,
      initializing: true
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onCropperInitialized = this.onCropperInitialized.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  toBlob() {
    return new Promise((resolve) => {
      this.cropper.getCroppedCanvas().toBlob(blob => resolve(blob))
    })
  }

  async handleFileChange(e) {
    const file = e.target.files[0]
    if (file.size > 4 * 1024 * 1024) {
      message.error(resumeInfoText.avator.error)
      return
    }

    this.setState({
      rawImage: file,
      imageUrl: await toBase64(file)
    })
  }

  async upload(filename, filetype, file) {
    if (!file) return null

    const uploadInfo = await API.resume.getImageUploadUrl({
      filename: filename
    })
    await request(
      uploadInfo.uploadUrl,
      {
        method: 'PUT',
        headers: {
          'Content-Type': filetype || 'application/octet-stream'
        },
        body: file,
      }
    )
    return uploadInfo
  }

  async onSubmit() {
    const { onSubmit } = this.props

    if (!this.state.imageUrl) {
      onSubmit && onSubmit('', true)
      return
    }

    this.setState({
      uploading: true
    })
    message.notice(resumeInfoText.avator.upload)

    let file = this.state.rawImage
    if (!file) file = await toFile(this.state.imageUrl)

    const filenames = file.name.split('.')
    const filenameThumb = [
      ...filenames.slice(0, -1),
      'thumb',
      filenames.slice(-1)[0]
    ].join('.')
    const blob = await this.toBlob()
    const fileThumb = new File([blob], filenameThumb)

    try {
      const [thumbImage, _] = await Promise.all([
        this.upload(filenameThumb, file.type, fileThumb),
        this.upload(file.name, file.type, file)
      ])
      message.notice(resumeInfoText.avator.success)
      onSubmit && onSubmit(thumbImage.previewUrl)
    } catch (e) {
      console.error(e)
      message.error(e.message)
    } finally {
      this.setState({
        uploading: false
      })
    }
  }

  onCropperInitialized() {
    this.setState({
      initializing: false
    })
  }

  onChange() {
    this.imageUploader.click()
  }

  onRemove() {
    this.setState({
      imageUrl: DEFAULT_AVATOR,
      rawImage: null,
      uploading: false
    })
  }

  render() {
    const {
      imageUrl,
      uploading,
      initializing
    } = this.state
    const { openModal, onClose } = this.props

    return (
      <PortalModal showModal={openModal} onClose={onClose}>
        <div className={styles.modalContainer}>
          <div className={styles.imageContainer}>
            {initializing && (
              <div
                className={styles.imageLoading}
                style={{ height: 400 }}
              >
                <Loading loading />
              </div>
            )}
            <Cropper
              ref={ref => (this.cropper = ref)}
              src={imageUrl}
              style={{ height: 400, width: 400 }}
              preview='.image-preview'
              aspectRatio={1}
              guides={true}
              ready={this.onCropperInitialized}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div className={styles.imagePreviewContainer}>
              <div className={`image-preview ${styles.imagePreview}`}></div>
              {imageUrl !== DEFAULT_AVATOR && (
                <Icon
                  icon="close"
                  onClick={this.onRemove}
                  className={styles.avatorRemove}
                />
              )}
            </div>
          </div>
          <div className={styles.operations}>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className={styles.imageInput}
              onChange={this.handleFileChange}
              ref={ref => (this.imageUploader = ref)}
            />
            <Tipso
              trigger="hover"
              theme="dark"
              className={styles.uploadTipso}
              tipsoContent={(<span>{resumeInfoText.avator.tip}</span>)}
            >
              <ClassicButton theme="dark">
                <Button
                  color="none"
                  value={resumeInfoText.avator.change}
                  className={styles.operation}
                  leftIcon={(
                    <Icon icon="file-image-o" />
                  )}
                  onClick={this.onChange}
                  disabled={uploading || initializing}
                />
              </ClassicButton>
            </Tipso>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <ClassicButton theme="green">
              <Button
                color="none"
                value={resumeInfoText.avator.submit}
                className={styles.operation}
                leftIcon={(
                  <Icon icon="cloud-upload" />
                )}
                onClick={this.onSubmit}
                disabled={!imageUrl || uploading || initializing}
              />
            </ClassicButton>
          </div>
        </div>
      </PortalModal>
    )
  }
}

export default AvatorModal
