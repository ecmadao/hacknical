import mongoose from '../mongoose/index';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: String,
  passwordHash: String,
  passwordSalt: String,
  // createdTime: Date,
  lastLoginTime: Date,
  email: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Users', UserSchema);
