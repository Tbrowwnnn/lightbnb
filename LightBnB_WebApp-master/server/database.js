const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  let user;

  return pool
    .query(`SELECT * 
    FROM users WHERE email LIKE $1;`, [`%${email}%`])
    .then((result) => {
      console.log(result.rows);
      user = result.rows[0]
      return user
    })
    .catch((err) => {
      console.log(err.message);

    });

}
exports.getUserWithEmail = getUserWithEmail;

 // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  return pool
    .query(`SELECT * 
    FROM users WHERE email LIKE $1;`, [`%${id}%`])
    .then((result) => {
      console.log(result.rows);
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);

    });
  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  // let user;
  const queryString = `INSERT INTO users 
  (name, email, password)
  VALUES($1, $2, $3)
  RETURNING *`;

  return pool

    .query(queryString
    , [user.name, user.email, user.password])
    .then((result) => {
      console.log(result.rows);
      
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message);

    });

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const queryString = `SELECT reservations.*, properties.* 
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  WHERE guest_id = $1
  LIMIT $2;`;

  return pool

    .query(queryString
    , [guest_id, limit])
    .then((result) => {
      console.log(result.rows);
      
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);

    });
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
// 
const getAllProperties = (options, limit = 10) => {

   // 1
   const queryParams = [];
   // 2
   let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;
 
   // 3
   if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length}`;
  }

   if (options.city) {
     queryParams.push(`%${options.city}%`);
     queryString += `WHERE city LIKE $${queryParams.length} `;
   }

   if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    if(queryParams.length > 1){
    queryString += `AND cost_per_night >= $${queryParams.length} `
    }else {queryString += `WHERE cost_per_night >= $${queryParams.length} `};
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    if(queryParams.length > 1){
    queryString += `AND cost_per_night <= $${queryParams.length} `
    }else {queryString += `WHERE cost_per_night <= $${queryParams.length} `};
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    if(queryParams.length > 1){
    queryString += `AND property_reviews.rating >= $${queryParams.length} `
    }else {queryString += `WHERE property_reviews.rating >= $${queryParams.length} `};
  }
 
   // 4
   queryParams.push(limit);
   queryString += `
   GROUP BY properties.id
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;
 
   // 5
   console.log(queryString, queryParams);
 
   // 6
   return pool.query(queryString, queryParams).then((res) => res.rows);

  // return pool
  //   .query(`SELECT * 
  //   FROM properties LIMIT $1;`, [limit])
  //   .then((result) => {
  //     console.log(result.rows);
  //     return result.rows
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //   });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  let values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.province, property.city, property.country, property.street, property.post_code]

  const queryString = `
  INSERT INTO properties (owner_id,
    title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, province, city, country, street, post_code) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;`;

    return pool

    .query(queryString
    , values)
    .then((result) => {
      console.log(result.rows);
      console.log('querystring :', queryString);
      
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);

    });

  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
