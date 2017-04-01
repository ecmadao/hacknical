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
    dom.append($buttonContainer);
    const $button = `.${styles.button}`;

    $(document).on('click', $button, callback);
    $(document).on('mousedown', $button, () => {
      $buttonContainer.addClass(styles['button-press']);
    });
    $(document).on('mouseup', $button, () => {
      $buttonContainer.removeClass(styles['button-press']);
    });
  }
})

export default Button;
