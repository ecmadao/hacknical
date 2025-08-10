import nodemailer from 'nodemailer'
import config from 'config'
import logger from './logger'

class EmailService {
  constructor() {
    this.transporter = null
    this.senderConfig = {}
    this.init()
  }

  init() {
    let emailConfig = {}
    let senderConfig = {}
    try {
      // 尝试从新的messenger配置中读取
      const messengerEmail = config.get('services.messenger.email') || {}
      if (messengerEmail.config) {
        emailConfig = messengerEmail.config
        senderConfig = messengerEmail.sender || {}
      } else {
        // 兼容旧的配置
        emailConfig = config.get('services.email') || {}
      }
    } catch (e) {
      // 如果配置不存在，使用空对象
      emailConfig = {}
    }
    // 如果没有配置邮件服务，使用默认的SMTP配置
    const defaultConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }

    try {
      this.transporter = nodemailer.createTransport({
        ...defaultConfig,
        ...emailConfig
      })
      // 保存发件人配置
      this.senderConfig = senderConfig
      logger.info('[EMAIL] Email service initialized')
    } catch (error) {
      logger.error('[EMAIL] Failed to initialize email service:', error)
    }
  }

  /**
   * 发送邮件
   * @param {object} options - 邮件选项
   * @param {string} options.to - 收件人
   * @param {string} options.subject - 主题
   * @param {string} options.html - HTML内容
   * @param {string} options.text - 文本内容
   * @returns {Promise<boolean>} 发送结果
   */
  async sendEmail({
    to,
    subject,
    html,
    text
  }) {
    if (!this.transporter) {
      logger.warn('[EMAIL] Email service not configured')
      return false
    }

    try {
      // 使用配置的发件人信息
      const fromAddress = this.senderConfig.address || process.env.SMTP_USER || 'noreply@hacknical.com'
      const fromName = this.senderConfig.name || 'Hacknical'
      const from = `${fromName} <${fromAddress}>`

      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      })

      logger.info(`[EMAIL] Email sent: ${info.messageId}`)
      return true
    } catch (error) {
      logger.error('[EMAIL] Failed to send email:', error)
      return false
    }
  }

  /**
   * 发送注册验证邮件
   * @param {string} email - 邮箱地址
   * @param {string} token - 验证token
   * @param {string} name - 用户名
   * @returns {Promise<boolean>} 发送结果
   */
  async sendVerificationEmail(email, token, name = '') {
    const verifyUrl = `${config.get('url') || 'http://localhost:7001'}/api/user/verify-email?token=${token}`
    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">欢迎注册 Hacknical</h2>
        <p>你好${name ? ` ${name}` : ''}，</p>
        <p>感谢你注册 Hacknical！请点击下面的按钮验证你的邮箱地址：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            验证邮箱
          </a>
        </div>
        <p>或者复制以下链接到浏览器打开：</p>
        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          此链接24小时内有效。如果这不是你的操作，请忽略此邮件。
        </p>
      </div>
    `

    const text = `
      欢迎注册 Hacknical
      
      你好${name ? ` ${name}` : ''}，
      
      感谢你注册 Hacknical！请访问以下链接验证你的邮箱地址：
      ${verifyUrl}
      
      此链接24小时内有效。如果这不是你的操作，请忽略此邮件。
    `

    return await this.sendEmail({
      to: email,
      subject: '验证你的 Hacknical 账号',
      html,
      text
    })
  }

  /**
   * 发送密码重置邮件
   * @param {string} email - 邮箱地址
   * @param {string} token - 重置token
   * @param {string} name - 用户名
   * @returns {Promise<boolean>} 发送结果
   */
  async sendPasswordResetEmail(email, token, name = '') {
    const resetUrl = `${config.get('url') || 'http://localhost:7001'}/reset-password?token=${token}`
    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">重置 Hacknical 密码</h2>
        <p>你好${name ? ` ${name}` : ''}，</p>
        <p>我们收到了重置你账号密码的请求。请点击下面的按钮重置密码：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            重置密码
          </a>
        </div>
        <p>或者复制以下链接到浏览器打开：</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          此链接24小时内有效。如果这不是你的操作，请忽略此邮件，你的密码不会被更改。
        </p>
      </div>
    `

    const text = `
      重置 Hacknical 密码
      
      你好${name ? ` ${name}` : ''}，
      
      我们收到了重置你账号密码的请求。请访问以下链接重置密码：
      ${resetUrl}
      
      此链接24小时内有效。如果这不是你的操作，请忽略此邮件，你的密码不会被更改。
    `

    return await this.sendEmail({
      to: email,
      subject: '重置你的 Hacknical 密码',
      html,
      text
    })
  }
}

// 创建邮件服务实例
const emailService = new EmailService()

export default emailService
