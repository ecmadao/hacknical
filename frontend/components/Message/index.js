import 'SRC/vendor/message/message.css';

const Message = (...args) => {
  let messageComponent = null;
  return (() => {
    if (!messageComponent) {
      messageComponent = new MessageComponent(...args);
    }
    return messageComponent;
  })()
};

class MessageComponent {
  constructor(content = '', type = 'positive', timeOut = 2500) {
    this.timeOut = timeOut;
    this.content = content;
    this.type = type;
    this.$message = $(this.messageTemplate());
    this.appendMessage();
  }

  error(msg, timeOut) {
    this.$message
      .removeClass('positive')
      .removeClass('tips')
      .addClass('negative')
      .find('.message_content').html(msg);
    this.showMessage(timeOut);
  }

  notice(msg, timeOut) {
    this.$message
      .removeClass('negative')
      .removeClass('tips')
      .addClass('positive')
      .find('.message_content').html(msg);
    this.showMessage(timeOut);
  }

  tips(msg, timeOut) {
    this.$message
      .removeClass('negative')
      .removeClass('positive')
      .addClass('tips')
      .find('.message_content').html(msg);
    this.showMessage(timeOut);
  }

  showMessage(timeOut = this.timeOut) {
    this.$message.addClass('active');
    this.autoHideMessage(timeOut);
  }

  autoHideMessage(timeOut) {
    let hideMessage = () => {
      this.$message.removeClass('active');
    };
    setTimeout(hideMessage, timeOut);
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
