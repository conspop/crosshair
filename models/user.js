const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required:true, unique: true, dropDups: true},
  password: String,
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  results: [{
    beginningELO: Number,
    opponent: String,
    isWin: Boolean,
    endingELO: Number
  }],
  version: String
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  // password has been changed - salt and hash it
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    if (err) return next(err);
    // replace the user provided password with the hash
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(tryPassword, cb) {
  bcrypt.compare(tryPassword, this.password, cb);
};

module.exports = mongoose.model('User', userSchema);