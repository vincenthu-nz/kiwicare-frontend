INSERT INTO users (id, first_name, last_name, email, password, phone, gender, birthdate,
                   avatar, city, balance, role, status, email_verified, phone_verified,
                   last_login_at, created_at, updated_at, is_deleted)
VALUES ('b0c1e8b6-79c5-4374-927d-6b22fb8a2b11', 'Jason', 'Smiths', 'user@nextmail.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0211234567',
        'male', '1990-05-20', '/customers/evil-rabbit.png', 'Auckland',
        10000, 'customer', 'active', true, true, now(), now(), now(), false),

       ('b92a9b2e-4a6f-4a76-9b14-97bb763e6173', 'Delba', 'de Oliveira', 'delba@oliveira.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0278889999',
        'male', '1985-03-12', '/customers/delba-de-oliveira.png', 'Christchurch',
        200, 'provider', 'active', true, true, now(), now(), now(), false),

       ('2f970ba6-d897-4a1a-bc10-d4e9e2a44784', 'Lee', 'Robinson', 'lee@robinson.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0201122334',
        'female', '1980-01-01', '/customers/lee-robinson.png', 'Wellington',
        500, 'admin', 'active', true, false, now(), now(), now(), false),

       ('f3a1e2b4-5c67-48d8-93ab-8a4f623b8c2f', 'Admin', 'User', 'admin@kiwicare.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0210000000',
        'male', '1990-01-01', NULL, 'Christchurch',
        0, 'admin', 'active', true, true, now(), now(), now(), false),

       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e01', 'Olivia', 'Martin', 'olivia.martin@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001001', 'female', '1993-07-12', NULL, 'Auckland', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e02', 'Liam', 'Thompson', 'liam.thompson@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001002', 'male', '1988-02-08', NULL, 'Hamilton', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e03', 'Amelia', 'Brown', 'amelia.brown@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001003', 'female', '1994-05-19', NULL, 'Wellington', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e04', 'Noah', 'Williams', 'noah.williams@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001004', 'male', '1992-03-14', NULL, 'Christchurch', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e05', 'Emily', 'Clark', 'emily.clark@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001005', 'female', '1996-11-23', NULL, 'Dunedin', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e06', 'James', 'Hall', 'james.hall@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001006', 'male', '1989-06-06', NULL, 'Napier', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e07', 'Charlotte', 'Taylor', 'charlotte.taylor@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001007', 'female', '1991-01-27', NULL, 'Nelson', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e08', 'Benjamin', 'Evans', 'benjamin.evans@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001008', 'male', '1995-09-15', NULL, 'Rotorua', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e09', 'Sophia', 'Lee', 'sophia.lee@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001009', 'female', '1997-08-18', NULL, 'Whangarei', 0,
        'customer', 'active', true, true, now(), now(), now(), false),
       ('c0a101e8-0e67-4fa3-9857-b06f1a4b7e10', 'Jack', 'King', 'jack.king@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219001010', 'male', '1990-12-05', NULL, 'Gisborne', 0,
        'customer', 'active', true, true, now(), now(), now(), false),

       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e11', 'Oliver', 'Scott', 'oliver.scott@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101011', 'male', '1987-04-02', NULL, 'Auckland', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e12', 'Isabella', 'Harris', 'isabella.harris@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101012', 'female', '1993-07-28', NULL, 'Hamilton', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e13', 'William', 'Roberts', 'william.roberts@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101013', 'male', '1989-05-06', NULL, 'Wellington', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e14', 'Mia', 'Green', 'mia.green@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101014', 'female', '1994-08-11', NULL, 'Christchurch', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e15', 'Ethan', 'Adams', 'ethan.adams@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101015', 'male', '1990-03-09', NULL, 'Dunedin', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e16', 'Grace', 'Mitchell', 'grace.mitchell@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101016', 'female', '1992-06-21', NULL, 'Napier', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e17', 'Henry', 'Wright', 'henry.wright@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101017', 'male', '1988-11-14', NULL, 'Nelson', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e18', 'Ella', 'Campbell', 'ella.campbell@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101018', 'female', '1995-01-26', NULL, 'Rotorua', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e19', 'Lucas', 'Carter', 'lucas.carter@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101019', 'male', '1991-09-17', NULL, 'Whangarei', 0,
        'provider', 'active', true, true, now(), now(), now(), false),
       ('d0b201e8-0e67-4fa3-9857-b06f1a4b7e20', 'Chloe', 'Bennett', 'chloe.bennett@kiwicare.com',
        '$2b$10$Xf0Ui5...', '0219101020', 'female', '1996-02-22', NULL, 'Gisborne', 0,
        'provider', 'active', true, true, now(), now(), now(), false);


INSERT INTO customers (id, user_id, default_address, default_latitude, default_longitude,
                       note, is_disabled, emergency_contact_name, emergency_contact_phone,
                       created_at, updated_at)
VALUES ('80fb4ebd-c59b-4419-9e7e-bc2a6493eab9',
        'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
        'Auckland', -36.8485, 174.7633,
        'Frequent customer', false, 'Alice Rabbit', '0210000001',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e01',
        'Auckland CBD', -36.8485, 174.7633,
        'Loyal returning customer', false, 'Liam Martin', '0219002001',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e02',
        'Hamilton East', -37.7870, 175.2793,
        'Frequent bookings', false, 'Olivia Thompson', '0219002002',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e03',
        'Wellington Central', -41.2865, 174.7762,
        'VIP loyalty program', false, 'James Brown', '0219002003',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e04',
        'Christchurch South', -43.5321, 172.6362,
        'First time discount', false, 'Emily Williams', '0219002004',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e05',
        'Dunedin North', -45.8788, 170.5028,
        'Regular visitor', false, 'Noah Clark', '0219002005',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e06',
        'Napier Central', -39.4928, 176.9120,
        'Special offer user', false, 'Sophia Hall', '0219002006',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e07',
        'Nelson South', -41.2706, 173.2840,
        'Holiday package buyer', false, 'Benjamin Taylor', '0219002007',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e08',
        'Rotorua Lakes', -38.1368, 176.2497,
        'Returning customer', false, 'Charlotte Evans', '0219002008',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e09',
        'Whangarei City', -35.7251, 174.3237,
        'Promo code user', false, 'Jack Lee', '0219002009',
        now(), now()),

       (gen_random_uuid(), 'c0a101e8-0e67-4fa3-9857-b06f1a4b7e10',
        'Gisborne Central', -38.6639, 178.0176,
        'Regular family bookings', false, 'Amelia King', '0219002010',
        now(), now());


INSERT INTO providers (id, user_id, license_number, service_radius_km,
                       base_address, base_latitude, base_longitude, bio,
                       created_at, updated_at)
VALUES ('9b6d4d7a-67e9-4c1d-b34e-319de03e7d42',
        'b92a9b2e-4a6f-4a76-9b14-97bb763e6173',
        'THERA-0001', 15,
        'Christchurch', -43.523003, 172.583468,
        'Experienced massage therapist with over 10 years of experience in deep tissue and relaxation techniques.',
        now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e11',
        'LIC-PROV001', 12, 'Auckland Central', -36.8485, 174.7633,
        'Certified sports massage specialist.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e12',
        'LIC-PROV002', 14, 'Hamilton Centre', -37.7870, 175.2793,
        'Relaxation and aromatherapy expert.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e13',
        'LIC-PROV003', 16, 'Wellington Clinic', -41.2865, 174.7762,
        'Deep tissue and remedial therapy.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e14',
        'LIC-PROV004', 15, 'Christchurch Hub', -43.5321, 172.6362,
        'Remedial and sports massage certified.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e15',
        'LIC-PROV005', 18, 'Dunedin Spa', -45.8788, 170.5028,
        'Specialist in injury recovery massage.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e16',
        'LIC-PROV006', 14, 'Napier Rooms', -39.4928, 176.9120,
        'Therapeutic and holistic massage.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e17',
        'LIC-PROV007', 17, 'Nelson Centre', -41.2706, 173.2840,
        'Wellness massage with aromatherapy.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e18',
        'LIC-PROV008', 13, 'Rotorua Spa', -38.1368, 176.2497,
        'Relaxation and reflexology specialist.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e19',
        'LIC-PROV009', 16, 'Whangarei Hub', -35.7251, 174.3237,
        'Certified wellness practitioner.', now(), now()),

       (gen_random_uuid(), 'd0b201e8-0e67-4fa3-9857-b06f1a4b7e20',
        'LIC-PROV010', 15, 'Gisborne Rooms', -38.6639, 178.0176,
        'Expert in Swedish massage and aromatherapy.', now(), now());


INSERT INTO services (id, name, code, icon, description,
                      created_at, updated_at)
VALUES ('ab12e51d-937d-42e9-8b94-6ecf40b61b60', 'Swedish Massage', 'SWEDISH',
        '/icons/swedish.png', 'A gentle, relaxing massage to promote overall well-being.',
        now(), now()),
       ('cc34f1d0-25c7-4ae0-86ff-5d5b1b7e04dc', 'Deep Tissue Massage', 'DEEP',
        '/icons/deep-tissue.png', 'A deeper pressure massage to target chronic muscle tension.',
        now(), now()),
       ('de45f2f3-7c98-40e4-8123-0fb1e482c225', 'Hot Stone Therapy', 'HOTSTONE',
        '/icons/hot-stone.png', 'Heated stones used to relax and warm up tight muscles.',
        now(), now());


INSERT INTO provider_services (id, provider_id, service_id, price, duration_minutes, notes)
VALUES ('e5b60c7f-1663-4ed4-a226-299725cbe7ef',
        '9b6d4d7a-67e9-4c1d-b34e-319de03e7d42',
        'ab12e51d-937d-42e9-8b94-6ecf40b61b60',
        8000.0, 60, 'Swedish massage available weekdays only.');


-- INSERT INTO orders (id, customer_id, provider_id, service_id, scheduled_start, status, payment_status, created_at,
--                     service_address, service_latitude, service_longitude, note,
--                     distance_m, service_fee, travel_fee, total_amount, actual_service_m, drive_duration_s,
--                     route_geometry)
-- VALUES ('f7a41952-2213-4d65-98a8-5af6e92e03df',
--         '80fb4ebd-c59b-4419-9e7e-bc2a6493eab9',
--         '9b6d4d7a-67e9-4c1d-b34e-319de03e7d42',
--         'de45f2f3-7c98-40e4-8123-0fb1e482c225',
--         '2025-06-25T10:00:00+12:00',
--         'pending', 'unpaid', now(),
--         'Christchurch Art Gallery', -43.531603, 172.631436, 'Please arrive 15 minutes early.',
--         5240, 524, 12000, 12524, 60, 720,
--         '{
--           "type": "LineString",
--           "coordinates": [
--             [
--               172.626417,
--               -43.538389
--             ],
--             [
--               172.624852,
--               -43.538044
--             ],
--             [
--               172.621654,
--               -43.537352
--             ],
--             [
--               172.619004,
--               -43.536833
--             ],
--             [
--               172.615498,
--               -43.535761
--             ],
--             [
--               172.611698,
--               -43.534187
--             ],
--             [
--               172.608892,
--               -43.532993
--             ],
--             [
--               172.604344,
--               -43.531400
--             ],
--             [
--               172.600298,
--               -43.530297
--             ],
--             [
--               172.596300,
--               -43.529156
--             ],
--             [
--               172.592437,
--               -43.528148
--             ],
--             [
--               172.588582,
--               -43.526804
--             ],
--             [
--               172.585120,
--               -43.525309
--             ],
--             [
--               172.583468,
--               -43.523003
--             ]
--           ]
--         }'::jsonb);


-- INSERT INTO invoices (id, order_id, user_id, amount, tax_rate, platform_fee,
--                       payment_method, paid_at, status)
-- VALUES ('fa65e82e-4a2a-4040-9398-45d20eb5eb8a',
--         'b8c88864-4ba0-4e3c-9442-71d7cf878c97',
--         'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
--         12000, 15, 20, 'credit_card',
--         '2025-06-26T12:00:00+12:00', 'paid'),
--        ('fb76f92f-5b3b-4051-a601-40ef32fc5c9c', null,
--         'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
--         1000, 15, 20, 'credit_card',
--         '2025-05-21T12:00:00+12:00', 'paid'),
--        ('fc87fa40-6c4c-4871-b53d-3ef29b0f6a5d', null,
--         'b92a9b2e-4a6f-4a76-9b14-97bb763e6173',
--         1000, 15, 20, 'credit_card',
--         '2025-04-11T12:00:00+12:00', 'paid');


INSERT INTO notifications (id, user_id, title, message, sent_at, is_read, type)
VALUES ('fd98ab53-7d5d-4064-99b5-30dfd0f7e1d8',
        'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
        'New Message',
        'You have a new message from your provider.',
        now(), false, 'push');


INSERT INTO user_devices (id, user_id, device_token, device_type, app_version, created_at)
VALUES ('fe09bc64-8e6e-4175-8ab9-20ced0e8f2a1',
        'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
        'abc123ios_token',
        'iOS', '1.0.0', now());
