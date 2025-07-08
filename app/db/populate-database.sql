INSERT INTO users (id, first_name, last_name, email, password, phone, gender, birthdate,
                   avatar, city, blance, role, status, email_verified, phone_verified,
                   last_login_at, created_at, updated_at, is_deleted)
VALUES ('b0c1e8b6-79c5-4374-927d-6b22fb8a2b11', 'Jason', 'Smiths', 'user@nextmail.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0211234567',
        'female', '1990-05-20', '/customers/evil-rabbit.png', 'Auckland',
        100, 'customer', 'active', true, true, now(), now(), now(), false),
       ('b92a9b2e-4a6f-4a76-9b14-97bb763e6173', 'Delba', 'de Oliveira', 'delba@oliveira.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0278889999',
        'male', '1985-03-12', '/customers/delba-de-oliveira.png', 'Christchurch',
        200, 'provider', 'active', true, true, now(), now(), now(), false),
       ('2f970ba6-d897-4a1a-bc10-d4e9e2a44784', 'Lee', 'Robinson', 'lee@robinson.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0201122334',
        'female', '1980-01-01', '/customers/lee-robinson.png', 'Wellington',
        500, 'admin', 'active', true, false, now(), now(), now(), false);


INSERT INTO customers (id, user_id, default_address, default_latitude, default_longitude,
                       note, is_disabled, emergency_contact_name, emergency_contact_phone,
                       created_at, updated_at)
VALUES ('80fb4ebd-c59b-4419-9e7e-bc2a6493eab9',
        'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
        'Auckland', -36.8485, 174.7633,
        'Frequent customer', false, 'Alice Rabbit', '0210000001',
        now(), now());


INSERT INTO providers (id, user_id, license_number, service_radius_km,
                       base_address, base_latitude, base_longitude, bio,
                       created_at, updated_at)
VALUES ('9b6d4d7a-67e9-4c1d-b34e-319de03e7d42',
        'b92a9b2e-4a6f-4a76-9b14-97bb763e6173',
        'THERA-0001', 15,
        'Christchurch', -43.5321, 172.6362,
        'Experienced massage therapist with over 10 years of experience in deep tissue and relaxation techniques.',
        now(), now());


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
        80.0, 60, 'Swedish massage available weekdays only.');


INSERT INTO orders (id, customer_id, provider_id, service_id, scheduled_start, status, payment_status, created_at,
                    service_address, service_latitude, service_longitude, note,
                    distance_m, service_fee, travel_fee, total_amount, actual_service_m, drive_duration_s,
                    route_geometry)
VALUES ('f7a41952-2213-4d65-98a8-5af6e92e03df',
        '80fb4ebd-c59b-4419-9e7e-bc2a6493eab9',
        '9b6d4d7a-67e9-4c1d-b34e-319de03e7d42',
        'de45f2f3-7c98-40e4-8123-0fb1e482c225',
        '2025-06-25T10:00:00+12:00',
        'pending', 'unpaid', now(),
        'Christchurch Art Gallery', -43.531603, 172.631436, 'Please arrive 15 minutes early.',
        5240, 524, 12000, 12524, 60, 720,
        '{
          "type": "LineString",
          "coordinates": [
            [
              172.631436,
              -43.531603
            ],
            [
              172.624926,
              -43.534170
            ]
          ]
        }'::jsonb);


INSERT INTO invoices (id, order_id, user_id, amount, tax_rate, platform_fee,
                      payment_method, paid_at, status)
VALUES ('fa65e82e-4a2a-4040-9398-45d20eb5eb8a',
        'f7a41952-2213-4d65-98a8-5af6e92e03df',
        'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
        12000, 15, 20, 'credit_card',
        '2025-06-26T12:00:00+12:00', 'paid'),
       ('fb76f92f-5b3b-4051-a601-40ef32fc5c9c', null,
        'b0c1e8b6-79c5-4374-927d-6b22fb8a2b11',
        1000, 15, 20, 'credit_card',
        '2025-05-21T12:00:00+12:00', 'paid'),
       ('fc87fa40-6c4c-4871-b53d-3ef29b0f6a5d', null,
        'b92a9b2e-4a6f-4a76-9b14-97bb763e6173',
        1000, 15, 20, 'credit_card',
        '2025-04-11T12:00:00+12:00', 'paid');


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
