
import React from 'react'
import cx from 'classnames'
import { InputGroup, IconButton, InputGroupV2 } from 'light-ui'
import WritableList from 'COMPONENTS/WritableList'
import locales from 'LOCALES'
import styles from '../../../styles/resume.css'

const resumeTexts = locales('resume.sections.custom')

class Section extends React.Component {
  constructor(props) {
    super(props)

    this.handleDetailAdded = this.handleDetailAdded.bind(this)
    this.handleDetailRemove = this.handleDetailRemove.bind(this)
    this.handleDetailChange = this.handleDetailChange.bind(this)
  }

  handleDetailAdded(detail) {
    const { section, handleChange } = this.props
    const { details = [] } = section
    handleChange('details')([...details, detail])
  }

  handleDetailRemove(index) {
    const { section, handleChange } = this.props
    const { details } = section
    handleChange('details')(
      [...details.slice(0, index), ...details.slice(index + 1)]
    )
  }

  handleDetailChange(detail, index) {
    const { section, handleChange } = this.props
    const { details } = section
    handleChange('details')(
      [
        ...details.slice(0, index),
        detail,
        ...details.slice(index + 1)
      ]
    )
  }

  render() {
    const { section, disabled, handleDelete, handleChange } = this.props
    const { details, title, url } = section
    return (
      <div className={styles.resume_piece_container}>
        <div className={cx(styles.resume_wrapper, styles.with_margin)}>
          <IconButton
            color="red"
            icon="trash-o"
            onClick={handleDelete}
            className={styles.resume_delete}
          />
          <InputGroup
            value={title}
            theme="flat"
            disabled={disabled}
            placeholder={resumeTexts.sectionTitle}
            tipsoStyle={{
              left: '0',
              transform: 'translateX(0)'
            }}
            inputClassName={styles.resumeFormItem}
            wrapperClassName={cx(styles.input_group, styles.single_input)}
            onChange={handleChange('title')}
          >
            <InputGroupV2
              sections={[
                {
                  value: 'http://',
                  disabled: true,
                  style: {
                    width: 50,
                    padding: '0 5px'
                  }
                },
                {
                  disabled,
                  type: 'url',
                  style: { width: 200 },
                  value: url.replace(/^https?:\/\//, ''),
                  placeholder: resumeTexts.homepage,
                  onChange: handleChange('url')
                }
              ]}
              style={{
                margin: 0
              }}
              theme="underline"
              className={styles.resumeFormItem}
            />
          </InputGroup>
        </div>
        <div className={styles.resume_wrapper}>
          <WritableList
            items={details}
            onAdd={this.handleDetailAdded}
            onDelete={this.handleDetailRemove}
            onChange={this.handleDetailChange}
            placeholder={resumeTexts.addSectionDetail}
          />
        </div>
      </div>
    )
  }
}

export default Section
