import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import {
  PortalModal,
  IconButton,
  Button,
  Input,
  Tipso,
  ClassicButton
} from 'light-ui'
import locales from 'LOCALES'
import Icon from 'COMPONENTS/Icon'
import message from 'UTILS/message'
import dateHelper from 'UTILS/date'
import styles from '../../styles/resume_list_modal.css'

const resumeTexts = locales('resume')
const modalTexts = resumeTexts.modal.resumes || {}

const copyToClipboard = (text) => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  return new Promise((resolve, reject) => {
    const success = document.execCommand('copy')
    textArea.remove()
    if (success) {
      resolve()
    } else {
      reject(new Error('copy failed'))
    }
  })
}

class ResumeListModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCreating: false,
      newTitle: '',
      renamingId: null,
      renamingTitle: '',
      confirmDeleteId: null
    }

    this.handleCreateSubmit = this.handleCreateSubmit.bind(this)
    this.handleRenameSubmit = this.handleRenameSubmit.bind(this)
    this.handleCopyLink = this.handleCopyLink.bind(this)
  }

  handleCreateSubmit() {
    const { onCreateResume } = this.props
    const title = (this.state.newTitle || '').trim() || modalTexts.untitled || '新简历'
    onCreateResume && onCreateResume(title)
    this.setState({
      isCreating: false,
      newTitle: ''
    })
  }

  handleRenameSubmit(resumeId) {
    const { onRenameResume } = this.props
    const title = (this.state.renamingTitle || '').trim()
    if (title && onRenameResume) {
      onRenameResume(resumeId, title)
    }
    this.setState({
      renamingId: null,
      renamingTitle: ''
    })
  }

  handleCopyLink(url) {
    copyToClipboard(url)
      .then(() => {
        message.notice(modalTexts.copyLinkSuccess || '公开链接已复制到剪贴板', 1800)
      })
      .catch(() => {
        message.error('复制失败，请手动复制', 1800)
      })
  }

  render() {
    const {
      openModal,
      onClose,
      resumeList = [],
      currentResumeId,
      onSwitchResume,
      onCopyResume,
      onDeleteResume,
      onSetDefaultResume
    } = this.props

    const {
      isCreating,
      newTitle,
      renamingId,
      renamingTitle,
      confirmDeleteId
    } = this.state

    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <Icon icon="files-o" />
              <span>{modalTexts.title || '多简历管理'}</span>
            </div>
            {!isCreating && (
              <ClassicButton theme="dark">
                <Button
                  color="none"
                  value={modalTexts.create || '新建简历'}
                  leftIcon={<Icon icon="plus" />}
                  onClick={() => this.setState({ isCreating: true, newTitle: '' })}
                />
              </ClassicButton>
            )}
          </div>

          {isCreating && (
            <div className={styles.createArea}>
              <Input
                theme="flat"
                className={styles.createInput}
                placeholder={modalTexts.inputTitle || '请输入简历名称'}
                value={newTitle}
                autoFocus
                onChange={val => this.setState({ newTitle: val })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') this.handleCreateSubmit()
                  if (e.key === 'Escape') this.setState({ isCreating: false, newTitle: '' })
                }}
              />
              <IconButton
                color="green"
                icon="check"
                onClick={this.handleCreateSubmit}
              />
              <IconButton
                color="gray"
                icon="times"
                onClick={() => this.setState({ isCreating: false, newTitle: '' })}
              />
            </div>
          )}

          <div className={styles.listWrapper}>
            {resumeList.map((item) => {
              const isActive = item.resumeId === currentResumeId
              const isRenaming = renamingId === item.resumeId
              const isConfirmingDelete = confirmDeleteId === item.resumeId
              const updateTime = item.updatedAt ? dateHelper.validator.fullDate(item.updatedAt) : ''

              const sharePath = item.sharePath || `resume/${item.resumeHash}`
              const fullShareUrl = item.shareUrl || `${origin}/${sharePath}`

              return (
                <div
                  key={item.resumeId}
                  className={cx(
                    styles.item,
                    isActive && styles.itemActive
                  )}
                >
                  <div className={styles.itemTop}>
                    <div className={styles.itemHeader}>
                      {isRenaming ? (
                        <div className={styles.renameInputWrapper}>
                          <Input
                            theme="flat"
                            className={styles.renameInput}
                            value={renamingTitle}
                            autoFocus
                            onChange={val => this.setState({ renamingTitle: val })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') this.handleRenameSubmit(item.resumeId)
                              if (e.key === 'Escape') this.setState({ renamingId: null, renamingTitle: '' })
                            }}
                          />
                          <IconButton
                            color="green"
                            icon="check"
                            className={styles.miniBtn}
                            onClick={() => this.handleRenameSubmit(item.resumeId)}
                          />
                          <IconButton
                            color="gray"
                            icon="times"
                            className={styles.miniBtn}
                            onClick={() => this.setState({ renamingId: null, renamingTitle: '' })}
                          />
                        </div>
                      ) : (
                        <span className={styles.itemTitle}>{item.title}</span>
                      )}

                      {item.isDefault ? (
                        <span className={styles.badgeDefault}>
                          {modalTexts.defaultBadge || '默认'}
                        </span>
                      ) : null}

                      {isActive ? (
                        <span className={styles.badgeActive}>
                          {modalTexts.current || '当前编辑'}
                        </span>
                      ) : null}

                      {item.openShare ? (
                        <span className={styles.badgePublic}>
                          {modalTexts.publicShared || '已公开'}
                        </span>
                      ) : (
                        <span className={styles.badgePrivate}>
                          {modalTexts.notPublicShared || '未公开'}
                        </span>
                      )}
                    </div>

                    <div className={styles.itemActions}>
                      {!isActive && (
                        <Tipso
                          trigger="hover"
                          theme="dark"
                          tipsoContent={(<span>{modalTexts.switchToEdit || '编辑此简历'}</span>)}
                        >
                          <IconButton
                            color="gray"
                            icon="pencil"
                            className={styles.actionBtn}
                            onClick={() => {
                              onSwitchResume && onSwitchResume(item.resumeId)
                              onClose && onClose()
                            }}
                          />
                        </Tipso>
                      )}

                      {!item.isDefault && (
                        <Tipso
                          trigger="hover"
                          theme="dark"
                          tipsoContent={(<span>{modalTexts.setDefault || '设为默认'}</span>)}
                        >
                          <IconButton
                            color="gray"
                            icon="star-o"
                            className={styles.actionBtn}
                            onClick={() => onSetDefaultResume && onSetDefaultResume(item.resumeId)}
                          />
                        </Tipso>
                      )}

                      {!isRenaming && (
                        <Tipso
                          trigger="hover"
                          theme="dark"
                          tipsoContent={(<span>{modalTexts.rename || '重命名'}</span>)}
                        >
                          <IconButton
                            color="gray"
                            icon="edit"
                            className={styles.actionBtn}
                            onClick={() => this.setState({ renamingId: item.resumeId, renamingTitle: item.title })}
                          />
                        </Tipso>
                      )}

                      <Tipso
                        trigger="hover"
                        theme="dark"
                        tipsoContent={(<span>{modalTexts.copy || '复制简历'}</span>)}
                      >
                        <IconButton
                          color="gray"
                          icon="copy"
                          className={styles.actionBtn}
                          onClick={() => onCopyResume && onCopyResume(item.resumeId, `${item.title} (副本)`)}
                        />
                      </Tipso>

                      {resumeList.length > 1 && (
                        isConfirmingDelete ? (
                          <div className={styles.deleteConfirmBox}>
                            <span>确认删除？</span>
                            <IconButton
                              color="red"
                              icon="check"
                              className={styles.miniBtn}
                              onClick={() => {
                                onDeleteResume && onDeleteResume(item.resumeId)
                                this.setState({ confirmDeleteId: null })
                              }}
                            />
                            <IconButton
                              color="gray"
                              icon="times"
                              className={styles.miniBtn}
                              onClick={() => this.setState({ confirmDeleteId: null })}
                            />
                          </div>
                        ) : (
                          <Tipso
                            trigger="hover"
                            theme="dark"
                            tipsoContent={(<span>{modalTexts.delete || '删除'}</span>)}
                          >
                            <IconButton
                              color="gray"
                              icon="trash"
                              className={styles.actionBtn}
                              onClick={() => this.setState({ confirmDeleteId: item.resumeId })}
                            />
                          </Tipso>
                        )
                      )}
                    </div>
                  </div>

                  <div className={styles.urlRow}>
                    <Icon icon="link" className={styles.urlIcon} />
                    <span className={styles.urlText} title={fullShareUrl}>
                      {fullShareUrl}
                    </span>
                    <div className={styles.urlActions}>
                      <Tipso
                        trigger="hover"
                        theme="dark"
                        tipsoContent={(<span>{modalTexts.copyShareUrl || '复制公开链接'}</span>)}
                      >
                        <IconButton
                          color="gray"
                          icon="clipboard"
                          className={styles.miniBtn}
                          onClick={() => this.handleCopyLink(fullShareUrl)}
                        />
                      </Tipso>
                      <Tipso
                        trigger="hover"
                        theme="dark"
                        tipsoContent={(<span>{modalTexts.openShareUrl || '在新窗口查看'}</span>)}
                      >
                        <IconButton
                          color="gray"
                          icon="external-link"
                          className={styles.miniBtn}
                          onClick={() => window.open(fullShareUrl, '_blank')}
                        />
                      </Tipso>
                    </div>
                  </div>

                  <div className={styles.itemBottom}>
                    {updateTime ? <span>{`更新于 ${updateTime}`}</span> : <span />}
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.footer}>
            <blockquote>
              提示：非默认简历通过专属哈希地址公开；公开开关可在编辑时右上角“分享”中切换。
            </blockquote>
            <ClassicButton theme="dark">
              <Button
                color="none"
                value="关闭"
                onClick={onClose}
              />
            </ClassicButton>
          </div>
        </div>
      </PortalModal>
    )
  }
}

ResumeListModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  resumeList: PropTypes.array,
  currentResumeId: PropTypes.string,
  onSwitchResume: PropTypes.func,
  onCreateResume: PropTypes.func,
  onCopyResume: PropTypes.func,
  onDeleteResume: PropTypes.func,
  onSetDefaultResume: PropTypes.func,
  onRenameResume: PropTypes.func
}

ResumeListModal.defaultProps = {
  openModal: false,
  onClose: Function.prototype,
  resumeList: [],
  currentResumeId: '',
  onSwitchResume: Function.prototype,
  onCreateResume: Function.prototype,
  onCopyResume: Function.prototype,
  onDeleteResume: Function.prototype,
  onSetDefaultResume: Function.prototype,
  onRenameResume: Function.prototype
}

export default ResumeListModal
