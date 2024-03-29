const User = require("../models/User");
// const Post = require("../models/Post");
// const Comment = require("../models/Comment");

//$and logic operation to specify multiple conditions to find documents
//$set adds a field(s)
//$unset removes fields

const updateSchema = async () => {
  const user = User.find({ avatar: { $exists: false } });

  await user.updateMany({}, { $set: { avatar: undefined } }, { multi: true });
};

const deleteField = async () => {
  await User.updateMany(
    { avatar: { $exists: true }},
    { $unset: { avatar: undefined } },
    { multi: true }
  );
}; 

const deleteFields = async () => {
  await User.updateMany(
    {$and: [{ middlename: { $exists: true } }, { isActive: { $exists: true } }]},
    { $unset: { middlename: null, isActive: true } },
    { multi: true }
  );
};


module.exports.updateSchema = updateSchema;
module.exports.deleteFields = deleteFields;
module.exports.deleteField = deleteField;