const mongoose = require('mongoose');

const postModelSchema = new mongoose.Schema({

  title: { type: String, require: true },
  content: { type: String, require: true,  },
  description:{ type: String, require: true,  },


    // token: { type: String, required: true }


}, {
  timestamps: true,

});




const PostModel = mongoose.model('postModel', postModelSchema)

module.exports = PostModel