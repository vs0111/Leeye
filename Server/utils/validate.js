var Joi = require("joi");

var Loginvalidate = function(data) {
  var schema = Joi.object({
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

module.exports = Loginvalidate;
