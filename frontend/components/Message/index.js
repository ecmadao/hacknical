import 'SRC/vendor/message/message.css';

const Message = () => {
  let messageComponent = null;
  return (() => {
    if (!messageComponent) {
      messageComponent = new MessageComponent();
    }
    return messageComponent;
  })()
};

class MessageComponent {
  constructor(content = '', type = 'positive', time = 2500) {
    this.time = time;
    this.content = content;
    this.type = type;
    this.$message = $(this.messageTemplate());
    this.appendMessage();
  }

  error(msg) {
    this.$message
      .removeClass('positive')
      .removeClass('tips')
      .addClass('negative')
      .find('.message_content').html(msg);
    this.showMessage();
  }

  notice(msg) {
    this.$message
      .removeClass('negative')
      .removeClass('tips')
      .addClass('positive')
      .find('.message_content').html(msg);
    this.showMessage();
  }

  tips(msg) {
    this.$message
      .removeClass('negative')
      .removeClass('positive')
      .addClass('tips')
      .find('.message_content').html(msg);
    this.showMessage();
  }

  showMessage() {
    this.$message.addClass('active');
    // this.autoHideMessage();
  }

  autoHideMessage() {
    let hideMessage = () => {
      this.$message.removeClass('active');
    };
    setTimeout(hideMessage, this.time);
  }

  appendMessage() {
    $('body').append(this.$message);
    this.$message.on('click', '.message_close_icon', () => {
      this.$message.removeClass('active');
    });
  }

  messageTemplate() {
    return "<div class='message_component " + this.type + "'>" +
    "<div class='message_content'>" + this.content + "</div>" +
    "<i class='fa fa-times message_close_icon' aria-hidden='true'></i>" +
    "</div>";
  }
}

export default Message;
