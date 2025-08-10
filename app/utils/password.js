import crypto from 'crypto'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

/**
 * 密码加密
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 加密后的密码
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 验证密码
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 加密后的密码
 * @returns {Promise<boolean>} 是否匹配
 */
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * 生成随机token
 * @param {number} length - token长度
 * @returns {string} 随机token
 */
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * 生成密码重置token
 * @returns {string} 重置token
 */
export const generateResetToken = () => {
  return generateToken(32)
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {object} 验证结果
 */
export const validatePassword = (password) => {
  const result = {
    valid: true,
    errors: []
  }

  if (!password || password.length < 6) {
    result.valid = false
    result.errors.push('密码长度不能少于6位')
  }

  if (password.length > 128) {
    result.valid = false
    result.errors.push('密码长度不能超过128位')
  }

  // 检查是否包含至少一个字母和一个数字
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    result.valid = false
    result.errors.push('密码必须包含至少一个字母和一个数字')
  }

  return result
}
