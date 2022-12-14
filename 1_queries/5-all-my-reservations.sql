SELECT reservations.id, title, cost_per_night, start_date, avg(property_reviews.rating) as average_rating
FROM properties
LEFT JOIN property_reviews ON properties.id = property_id
LEFT JOIN reservations ON properties.id = reservations.property_id
WHERE reservations.guest_id = 1
GROUP BY reservations.start_date, reservations.id, properties.title, properties.cost_per_night
ORDER BY reservations.start_date
LIMIT 10;