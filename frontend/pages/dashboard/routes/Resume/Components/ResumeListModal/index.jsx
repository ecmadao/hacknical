import React from 'react'
import cx from 'classnames'
import { PortalModal, Button, IconButton } from 'light-ui'
import locales from 'LOCALES'
import Icon from 'COMPONENTS/Icon'
import styles from '../../styles/resume_list_modal.css'
import dateHelper from 'UTILS/date'

const resumeTexts = locales('resume')
const modalTexts = resumeTexts.modal.resumes || {}

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
              <button
                type="button"
                className={cx(styles.actionBtn, styles.actionBtnPrimary)}
                onClick={() => this.setState({ isCreating: true, newTitle: '' })}
              >
                <Icon icon="plus" />
                <span>{modalTexts.create || '新建简历'}</span>
              </button>
            )}
          </div>

          {isCreating && (
            <div className={styles.createArea}>
              <input
                type="text"
                className={styles.createInput}
                placeholder={modalTexts.inputTitle || '请输入简历名称'}
                value={newTitle}
                autoFocus
                onChange={e => this.setState({ newTitle: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') this.handleCreateSubmit()
                  if (e.key === 'Escape') this.setState({ isCreating: false, newTitle: '' })
                }}
              />
              <button
                type="button"
                className={cx(styles.actionBtn, styles.actionBtnPrimary)}
                onClick={this.handleCreateSubmit}
              >
                <Icon icon="check" />
                <span>确定</span>
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => this.setState({ isCreating: false, newTitle: '' })}
              >
                <span>取消</span>
              </button>
            </div>
          )}

          <div className={styles.listWrapper}>
            {resumeList.map((item) => {
              const isActive = item.resumeId === currentResumeId
              const isRenaming = renamingId === item.resumeId
              const isConfirmingDelete = confirmDeleteId === item.resumeId
              const updateTime = item.updatedAt ? dateHelper.validator.fullDate(item.updatedAt) : ''

              return (
                <div
                  key={item.resumeId}
                  className={cx(
                    styles.item,
                    isActive && styles.itemActive
                  )}
                >
                  <div className={styles.itemLeft}>
                    <div className={styles.itemHeader}>
                      {isRenaming ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input
                            type="text"
                            className={styles.renameInput}
                            value={renamingTitle}
                            autoFocus
                            onChange={e => this.setState({ renamingTitle: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') this.handleRenameSubmit(item.resumeId)
                              if (e.key === 'Escape') this.setState({ renamingId: null, renamingTitle: '' })
                            }}
                          />
                          <button
                            type="button"
                            className={cx(styles.actionBtn, styles.actionBtnPrimary)}
                            onClick={() => this.handleRenameSubmit(item.resumeId)}
                          >
                            <Icon icon="check" />
                          </button>
                          <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={() => this.setState({ renamingId: null, renamingTitle: '' })}
                          >
                            <Icon icon="times" />
                          </button>
                        </div>
                      ) : (
                        <span className={styles.itemTitle}>{item.title}</span>
                      )}

                      {item.isDefault && (
                        <span className={styles.badgeDefault}>
                          {modalTexts.defaultBadge || '默认'}
                        </span>
                      )}
                      {isActive && (
                        <span className={styles.badgeActive}>
                          {modalTexts.current || '当前编辑'}
                        </span>
                      )}
                    </div>
                    {updateTime && (
                      <div className={styles.itemMeta}>
                        <span>{`更新于 ${updateTime}`}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.itemActions}>
                    {!isActive && (
                      <button
                        type="button"
                        className={cx(styles.actionBtn, styles.actionBtnPrimary)}
                        onClick={() => {
                          onSwitchResume && onSwitchResume(item.resumeId)
                          onClose && onClose()
                        }}
                      >
                        <Icon icon="pencil" />
                        <span>切换编辑</span>
                      </button>
                    )}

                    {!item.isDefault && (
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onSetDefaultResume && onSetDefaultResume(item.resumeId)}
                      >
                        <Icon icon="star-o" />
                        <span>{modalTexts.setDefault || '设为默认'}</span>
                      </button>
                    )}

                    {!isRenaming && (
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => this.setState({ renamingId: item.resumeId, renamingTitle: item.title })}
                      >
                        <Icon icon="edit" />
                        <span>{modalTexts.rename || '重命名'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => onCopyResume && onCopyResume(item.resumeId, `${item.title} (副本)`)}
                    >
                      <Icon icon="copy" />
                      <span>{modalTexts.copy || '复制'}</span>
                    </button>

                    {resumeList.length > 1 && (
                      isConfirmingDelete ? (
                        <div style={{ display: 'inline-flex', gap: 4 }}>
                          <button
                            type="button"
                            className={cx(styles.actionBtn, styles.actionBtnDanger)}
                            onClick={() => {
                              onDeleteResume && onDeleteResume(item.resumeId)
                              this.setState({ confirmDeleteId: null })
                            }}
                          >
                            <span>确认删除</span>
                          </button>
                          <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={() => this.setState({ confirmDeleteId: null })}
                          >
                            <span>取消</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={cx(styles.actionBtn, styles.actionBtnDanger)}
                          onClick={() => this.setState({ confirmDeleteId: item.resumeId })}
                        >
                          <Icon icon="trash" />
                          <span>{modalTexts.delete || '删除'}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={onClose}
            >
              <span>关闭</span>
            </button>
          </div>
        </div>
      </PortalModal>
    )
  }
}

export default ResumeListModal
