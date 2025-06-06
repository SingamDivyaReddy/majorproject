const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        location:Joi.string().required(),
        // Category validation: must be a string, is required, and must be one of the predefined valid categories
        category: Joi.string().required().valid("Trending", "Rooms", "Iconic cities", "Mountains", "Amazing pools", "Castles", "Camping", "Farms", "Arctic")
    }).required()
    
})



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required(),
      comment: Joi.string().required(),
    }).required()
  });
