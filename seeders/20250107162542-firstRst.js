'use strict';
const path = require('path')
const restaurant = require(path.join(__dirname, '..', 'data', 'restaurant.json')).results;

//把資料寫成格式
const restaurantData = restaurant.map((rst)=>({
      name: rst.name,
      name_en: rst.name_en,
      category: rst.category,
      image:rst.image,
      location:rst.location,
      phone:rst.phone,
      google_map:rst.google_map,
      rating:rst.rating,
      description:rst.description
    }))


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rstLists', restaurantData, {})
},
  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('rstLists', null, {})
  }
};
