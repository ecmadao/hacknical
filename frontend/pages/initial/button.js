import styles from './styles/button.css';

const baseButton = (value = 'BOOM!') => {
  return `
    <div class="${styles['button-container']}">
      <div class="${styles['button-wrapper']}">
        <div class="${styles.button}">${value}</div>
      </div>
    </div>
  `;
};

const Button = (value) => ({
  renderIn: (dom, callback = () => {}) => {
    const $buttonContainer = $(baseButton(value));
    const resetButtonPress = () => $buttonContainer.removeClass(styles['button-press']);
    dom.append($buttonContainer);
    const $button = `.${styles.button}`;

    $(document).on('click', $button, callback);
    $(document).on('mousedown', $button, () => {
      $buttonContainer.addClass(styles['button-press']);
    });
    $(document).on('mouseup', $button, resetButtonPress);
    $(document).on('mouseout', $button, resetButtonPress);
    $(document).on('mouseleave', $button, resetButtonPress);
  }
})

export default Button;
