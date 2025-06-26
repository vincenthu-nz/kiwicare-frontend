// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
    phone: '0211234567',
    gender: 'female',
    birthdate: '1990-05-20',
    avatar: '/customers/evil-rabbit.png',
    city: 'Auckland',
    role: 'customer',
    status: 'active',
    email_verified: true,
    phone_verified: true,
    last_login_at: '2025-06-21T10:00:00Z',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2025-06-21T08:00:00Z',
    is_deleted: false,
  },
  {
    id: 'a5be9c40-f849-4c77-b92c-9260ff5e9a8b',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    password: '123456',
    phone: '0278889999',
    gender: 'male',
    birthdate: '1985-03-12',
    avatar: '/customers/delba-de-oliveira.png',
    city: 'Christchurch',
    role: 'provider',
    status: 'active',
    email_verified: true,
    phone_verified: true,
    last_login_at: '2025-06-21T11:00:00Z',
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2025-06-21T10:00:00Z',
    is_deleted: false,
  },
  {
    id: 'f6c211b0-b90e-4453-a144-991d7d0c7b3e',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    password: '123456',
    phone: '0201122334',
    gender: 'female',
    birthdate: '1980-01-01',
    avatar: '/customers/lee-robinson.png',
    city: 'Wellington',
    role: 'admin',
    status: 'active',
    email_verified: true,
    phone_verified: false,
    last_login_at: '2025-06-20T09:00:00Z',
    created_at: '2025-06-01T09:00:00Z',
    updated_at: '2025-06-20T09:00:00Z',
    is_deleted: false,
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    location: 'Auckland',
    latitude: -36.8485,
    longitude: 174.7633,
    note: 'Frequent customer',
    is_disabled: false,
    emergency_contact_name: 'Alice Rabbit',
    emergency_contact_phone: '0210000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const providers = [
  {
    id: '11111111-aaaa-aaaa-aaaa-111111111111',
    user_id: 'a5be9c40-f849-4c77-b92c-9260ff5e9a8b',
    license_number: 'THERA-0001',
    service_radius: 15,
    location: 'Christchurch',
    latitude: -43.5321,
    longitude: 172.6362,
    bio: 'Experienced massage therapist with over 10 years of experience in deep tissue and relaxation techniques.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const services = [
  {
    id: 'b1a11111-1111-1111-1111-111111111111',
    name: 'Swedish Massage',
    code: 'SWEDISH',
    icon: '/icons/swedish.png',
    description: 'A gentle, relaxing massage to promote overall well-being.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b1a22222-2222-2222-2222-222222222222',
    name: 'Deep Tissue Massage',
    code: 'DEEP',
    icon: '/icons/deep-tissue.png',
    description: 'A deeper pressure massage to target chronic muscle tension.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b1a33333-3333-3333-3333-333333333333',
    name: 'Hot Stone Therapy',
    code: 'HOTSTONE',
    icon: '/icons/hot-stone.png',
    description: 'Heated stones used to relax and warm up tight muscles.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const providerServices = [
  {
    id: 'c1a11111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    provider_id: '11111111-aaaa-aaaa-aaaa-111111111111',
    service_id: 'b1a11111-1111-1111-1111-111111111111',
    price: 80.0,
    duration_minutes: 60,
    notes: 'Swedish massage available weekdays only.',
  },
];

const orders = [
  {
    id: 'a0011111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    customer_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    provider_id: '11111111-aaaa-aaaa-aaaa-111111111111',
    service_id: 'b1a33333-3333-3333-3333-333333333333',
    scheduled_start: '2025-06-25T10:00:00+12:00',
    status: 'pending',
  },
];

const invoices = [
  {
    id: '9f10c31a-ded3-4f59-babc-111111111111',
    order_id: 'a0011111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    amount: 12000,
    tax_rate: 15.0,
    platform_fee: 20.0,
    payment_method: 'credit_card',
    paid_at: '2025-06-26T12:00:00+12:00',
    status: 'paid',
  },
];

const notifications = [
  {
    id: '2b222222-2222-2222-2222-222222222222',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    title: 'New Message',
    message: 'You have a new message from your provider.',
    sent_at: new Date(),
    is_read: false,
    type: 'push',
  },
];

const userDevices = [
  {
    id: '10101010-aaaa-bbbb-cccc-111111111111',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a', // 替换为实际用户 ID
    device_token: 'abc123ios_token',
    device_type: 'iOS',
    app_version: '1.0.0',
  },
];

export {
  users,
  customers,
  invoices,
  providers,
  providerServices,
  services,
  orders,
  notifications,
  userDevices,
};
