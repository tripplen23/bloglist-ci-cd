const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: [true, 'User name required'],
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    minlength: 3,
    required: true,
  },
  // TODO: The ids of the blogs are stored within the user document as an array of Mongo ids
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId, // The type of the field is ObjectId that references blog-style documents
      ref: 'Blog',
    },
  ],
})

userSchema.plugin(uniqueValidator) // Use the unique validator that was added later on by mongoose

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
