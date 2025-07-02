-- Insert Users
INSERT INTO users (id, first_name, last_name, email, password, phone, gender, birthdate, avatar, city, role, status,
                   email_verified,
                   phone_verified, last_login_at, created_at, updated_at, is_deleted)
VALUES ('410544b2-4001-4271-9855-fec4b6a6442a', 'Jason', 'Smiths', 'user@nextmail.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0211234567', 'female', '1990-05-20',
        '/customers/evil-rabbit.png', 'Auckland', 'customer', 'active', true, true, '2025-06-21T10:00:00Z',
        '2025-06-01T08:00:00Z', '2025-06-21T08:00:00Z', false),
       ('a5be9c40-f849-4c77-b92c-9260ff5e9a8b', 'Delba', 'de Oliveira', 'delba@oliveira.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0278889999', 'male', '1985-03-12',
        '/customers/delba-de-oliveira.png', 'Christchurch', 'provider', 'active', true, true, '2025-06-21T11:00:00Z',
        '2025-06-01T10:00:00Z', '2025-06-21T10:00:00Z', false),
       ('f6c211b0-b90e-4453-a144-991d7d0c7b3e', 'Lee', 'Robinson', 'lee@robinson.com',
        '$2b$10$Xf0Ui5hmiU8De9D2aQe4YugakkaX.BHVDdaK5Y5OfAc/mgwC38W16', '0201122334', 'female', '1980-01-01',
        '/customers/lee-robinson.png', 'Wellington', 'admin', 'active', true, false, '2025-06-20T09:00:00Z',
        '2025-06-01T09:00:00Z', '2025-06-20T09:00:00Z', false);


-- Insert Customers
INSERT INTO customers (id, user_id, location, latitude, longitude, note, is_disabled, emergency_contact_name,
                       emergency_contact_phone, created_at, updated_at)
VALUES ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', '410544b2-4001-4271-9855-fec4b6a6442a', 'Auckland', -36.8485, 174.7633,
        'Frequent customer', false, 'Alice Rabbit', '0210000001', now(), now());


-- Insert Providers
INSERT INTO providers (id, user_id, license_number, service_radius, location, latitude, longitude, bio, created_at,
                       updated_at)
VALUES ('11111111-aaaa-aaaa-aaaa-111111111111', 'a5be9c40-f849-4c77-b92c-9260ff5e9a8b', 'THERA-0001', 15,
        'Christchurch', -43.5321, 172.6362,
        'Experienced massage therapist with over 10 years of experience in deep tissue and relaxation techniques.',
        now(), now());


-- Insert Services
INSERT INTO services (id, name, code, icon, description, created_at, updated_at)
VALUES ('b1a11111-1111-1111-1111-111111111111', 'Swedish Massage', 'SWEDISH', '/icons/swedish.png',
        'A gentle, relaxing massage to promote overall well-being.', now(), now()),
       ('b1a22222-2222-2222-2222-222222222222', 'Deep Tissue Massage', 'DEEP', '/icons/deep-tissue.png',
        'A deeper pressure massage to target chronic muscle tension.', now(), now()),
       ('b1a33333-3333-3333-3333-333333333333', 'Hot Stone Therapy', 'HOTSTONE', '/icons/hot-stone.png',
        'Heated stones used to relax and warm up tight muscles.', now(), now());


-- Insert Provider Services
INSERT INTO provider_services (id, provider_id, service_id, price, duration_minutes, notes)
VALUES ('c1a11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-aaaa-aaaa-aaaa-111111111111',
        'b1a11111-1111-1111-1111-111111111111', 80.0, 60, 'Swedish massage available weekdays only.');


-- Insert Orders
INSERT INTO orders (id, customer_id, provider_id, service_id, scheduled_start, status, created_at)
VALUES ('a0011111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
        '11111111-aaaa-aaaa-aaaa-111111111111', 'b1a33333-3333-3333-3333-333333333333', '2025-06-25T10:00:00+12:00',
        'pending', now());


-- Insert Invoices
INSERT INTO invoices (id, order_id, user_id, amount, tax_rate, platform_fee, payment_method, paid_at, status)
VALUES ('9f10c31a-ded3-4f59-babc-111111111111', 'a0011111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '410544b2-4001-4271-9855-fec4b6a6442a', 12000, 15, 20, 'credit_card', '2025-06-26T12:00:00+12:00', 'paid'),
       ('9f10c31a-ded3-4f59-babc-111111111122', null, '410544b2-4001-4271-9855-fec4b6a6442a', 1000, 15, 20,
        'credit_card', '2025-05-21T12:00:00+12:00', 'paid'),
       ('9f10c31a-ded3-4f59-babc-111111111133', null, 'a5be9c40-f849-4c77-b92c-9260ff5e9a8b', 1000, 15, 20,
        'credit_card', '2025-04-11T12:00:00+12:00', 'paid');


-- Insert Notifications
INSERT INTO notifications (id, user_id, title, message, sent_at, is_read, type)
VALUES ('2b222222-2222-2222-2222-222222222222', '410544b2-4001-4271-9855-fec4b6a6442a', 'New Message',
        'You have a new message from your provider.', now(), false, 'push');


-- Insert User Devices
INSERT INTO user_devices (id, user_id, device_token, device_type, app_version, created_at)
VALUES ('10101010-aaaa-bbbb-cccc-111111111111', '410544b2-4001-4271-9855-fec4b6a6442a', 'abc123ios_token', 'iOS',
        '1.0.0', now());
