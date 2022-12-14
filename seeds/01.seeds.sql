INSERT INTO users(id, name, email, password)
VALUES (1, 'Darth Vader', 'darth.vader@thedarkside.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
 (2,'Luke Skywalker', 'luk.skywalker@theforce.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
 (3, 'Chewbacca', 'brrr!!aahhh!!rrrrrrrr@grawwwww.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties(id, owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 1, 'The Death Star', 'www.thedeathstar.com', 'www.thedeathstar.com', 1000, 100, 57648, 1000000, 'The Death Star', 'None', 'Vader', 'Palpatine', 'V0V 0V0'),
(2, 2, 'Lars Homestead', 'www.tatooinerealty.com/skywalkerthumb', 'www.tatooinerealty.com/skywalkercover', 187, 3, 2, 7, 'Tatooine', 'None', 'Great Chott Salk Flat', 'Jundland Wastes', 'PO BOX 171789'),
(3, 3, 'Chewys chill place', 'www.kashyyykandassociates.com/chewythumb', 'www.kashyyykandassociates.com/chewycover', 155, 0, 1, 0, 'Kashyyyk', 'Tree No.12958', 'Rwookrrrorro', 'Wroshyr Trees', 'TO.12958');

INSERT INTO reservations(id, start_date, end_date, property_id, guest_id)
VALUES (1, '1923-06-28', '1923-07-05', 1, 1),
(2, '1908-09-15', '1908-09-25', 2, 2),
(3, '1999-12-22', '2000-01-02', 3, 3);

INSERT INTO property_reviews(id, guest_id, property_id, reservation_id, rating, message)
VALUES (1, 3, 3, 3, 5, 'rrryyyaaa'),
(2, 2, 2, 2, 2, 'I just want to hang out with my friends!'),
(3, 1, 1, 1, 5, 'With the power to destroy planets, I will rule the Galaxy!');
