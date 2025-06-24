import bcrypt from 'bcrypt';
import sql from '../lib/db';
import {
  customers,
  invoices,
  notifications,
  orders,
  providers,
  providerServices,
  services,
  userDevices,
  users,
} from '../lib/placeholder-data';

async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users
    (
      id             UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
      name           VARCHAR(100) NOT NULL,
      email          TEXT         NOT NULL UNIQUE,
      password       TEXT         NOT NULL,
      phone          VARCHAR(20),
      gender         VARCHAR(30) DEFAULT 'prefer not to say' CHECK ( gender IN ('male', 'female', 'gender diverse', 'prefer not to say')),
      birthdate      DATE,
      avatar         TEXT,
      city           TEXT,
      role           VARCHAR(20) DEFAULT 'customer' CHECK ( role IN ('customer', 'provider', 'admin') ),
      status         VARCHAR(20) DEFAULT 'active' CHECK (
        (role = 'provider' AND status IN ('pending', 'active', 'banned'))
          OR
        (role IN ('customer', 'admin') AND status IN ('active', 'banned'))
        ),
      email_verified BOOLEAN     DEFAULT FALSE,
      phone_verified BOOLEAN     DEFAULT FALSE,
      last_login_at  TIMESTAMPTZ,
      created_at     TIMESTAMPTZ DEFAULT now(),
      updated_at     TIMESTAMPTZ DEFAULT now(),
      is_deleted     BOOLEAN     DEFAULT FALSE
    );
  `;

  return await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      return sql`
        INSERT INTO users (id,
                           name,
                           email,
                           password,
                           phone,
                           gender,
                           birthdate,
                           avatar,
                           city,
                           role,
                           status,
                           email_verified,
                           phone_verified,
                           last_login_at,
                           created_at,
                           updated_at,
                           is_deleted)
        VALUES (${user.id},
                ${user.name},
                ${user.email},
                ${hashedPassword},
                ${user.phone},
                ${user.gender},
                ${user.birthdate},
                ${user.avatar},
                ${user.city},
                ${user.role},
                ${user.status},
                ${user.email_verified},
                ${user.phone_verified},
                ${user.last_login_at},
                ${user.created_at},
                ${user.updated_at},
                ${user.is_deleted})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
}

async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers
    (
      id                      UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id                 UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
      location                VARCHAR(255),
      latitude                DOUBLE PRECISION,
      longitude               DOUBLE PRECISION,
      note                    TEXT,
      is_disabled             BOOLEAN     DEFAULT FALSE,
      emergency_contact_name  VARCHAR(100),
      emergency_contact_phone VARCHAR(20),
      created_at              TIMESTAMPTZ DEFAULT now(),
      updated_at              TIMESTAMPTZ DEFAULT now()
    );
  `;

  await Promise.all(
    customers.map((customer) => {
      return sql`
        INSERT INTO customers (id,
                               user_id,
                               location,
                               latitude,
                               longitude,
                               note,
                               is_disabled,
                               emergency_contact_name,
                               emergency_contact_phone,
                               created_at,
                               updated_at)
        VALUES (${customer.id},
                ${customer.user_id},
                ${customer.location},
                ${customer.latitude},
                ${customer.longitude},
                ${customer.note},
                ${customer.is_disabled},
                ${customer.emergency_contact_name},
                ${customer.emergency_contact_phone},
                ${customer.created_at},
                ${customer.updated_at})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
}

async function seedProvider() {
  await sql`
    CREATE TABLE IF NOT EXISTS providers
    (
      id             UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id        UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
      license_number VARCHAR(50) UNIQUE,
      service_radius INTEGER     DEFAULT 10 CHECK (service_radius >= 0),
      latitude       DOUBLE PRECISION,
      longitude      DOUBLE PRECISION,
      bio            TEXT,
      created_at     TIMESTAMPTZ DEFAULT now(),
      updated_at     TIMESTAMPTZ DEFAULT now()
    );
  `;

  return await Promise.all(
    providers.map(
      (provider) => sql`
        INSERT INTO providers (id,
                               user_id,
                               license_number,
                               service_radius,
                               latitude,
                               longitude,
                               bio,
                               created_at,
                               updated_at)
        VALUES (${provider.id},
                ${provider.user_id},
                ${provider.license_number},
                ${provider.service_radius},
                ${provider.latitude},
                ${provider.longitude},
                ${provider.bio},
                ${provider.created_at},
                ${provider.updated_at})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedService() {
  await sql`
    CREATE TABLE IF NOT EXISTS services
    (
      id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name        VARCHAR(100)       NOT NULL,
      code        VARCHAR(50) UNIQUE NOT NULL,
      icon        TEXT,
      description TEXT,
      created_at  TIMESTAMPTZ      DEFAULT now(),
      updated_at  TIMESTAMPTZ      DEFAULT now()
    );
  `;

  return await Promise.all(
    services.map(
      (service) => sql`
        INSERT INTO services (id,
                              name,
                              code,
                              icon,
                              description,
                              created_at,
                              updated_at)
        VALUES (${service.id},
                ${service.name},
                ${service.code},
                ${service.icon},
                ${service.description},
                ${service.created_at},
                ${service.updated_at})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedProviderService() {
  await sql`
    CREATE TABLE IF NOT EXISTS provider_services
    (
      id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      provider_id      UUID           NOT NULL REFERENCES providers (id) ON DELETE CASCADE,
      service_id       UUID           NOT NULL REFERENCES services (id) ON DELETE CASCADE,
      price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      duration_minutes INT            NOT NULL CHECK (duration_minutes > 0),
      notes            TEXT,
      UNIQUE (provider_id, service_id)
    );
  `;

  return await Promise.all(
    providerServices.map(
      (ps) => sql`
        INSERT INTO provider_services (id,
                                       provider_id,
                                       service_id,
                                       price,
                                       duration_minutes,
                                       notes)
        VALUES (${ps.id},
                ${ps.provider_id},
                ${ps.service_id},
                ${ps.price},
                ${ps.duration_minutes},
                ${ps.notes})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedOrders() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders
    (
      id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id     UUID        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
      provider_id     UUID        NOT NULL REFERENCES providers (id) ON DELETE CASCADE,
      service_id      UUID        NOT NULL REFERENCES services (id) ON DELETE RESTRICT,
      scheduled_start TIMESTAMPTZ NOT NULL,

      status          VARCHAR(20)      DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected')),

      created_at      TIMESTAMPTZ      DEFAULT now()
    );
  `;

  return await Promise.all(
    orders.map(
      (order) => sql`
        INSERT INTO orders (id,
                            customer_id,
                            provider_id,
                            service_id,
                            scheduled_start,
                            status)
        VALUES (${order.id},
                ${order.customer_id},
                ${order.provider_id},
                ${order.service_id},
                ${order.scheduled_start},
                ${order.status})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedInvoices() {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices
    (
      id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id            UUID REFERENCES orders (id) ON DELETE CASCADE,
      user_id             UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,

      amount              INTEGER     NOT NULL,
      tax_rate            INTEGER          DEFAULT 0,

      tax_amount          INTEGER GENERATED ALWAYS AS (
        ROUND((amount * tax_rate)::NUMERIC / 100)
        ) STORED,

      total_amount        INTEGER GENERATED ALWAYS AS (
        amount + ROUND((amount * tax_rate)::NUMERIC / 100)
        ) STORED,

      platform_fee        INTEGER          DEFAULT 0,

      provider_net_income INTEGER GENERATED ALWAYS AS (
        (amount + ROUND((amount * tax_rate)::NUMERIC / 100)) - platform_fee
        ) STORED,

      payment_method      VARCHAR(50) NOT NULL
        CHECK (payment_method IN ('credit_card', 'bank_transfer', 'cash', 'other')),

      paid_at             TIMESTAMPTZ,
      refund_at           TIMESTAMPTZ,
      refund_reason       TEXT,
      date                TIMESTAMPTZ      DEFAULT now(),

      status              VARCHAR(20)      DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'refunded', 'cancelled')),
      source              VARCHAR(20)      DEFAULT 'order'
        CHECK (source IN ('order', 'manual', 'system', 'admin'))
    );
  `;

  return await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (id,
                              order_id,
                              user_id,
                              amount,
                              tax_rate,
                              platform_fee,
                              payment_method,
                              paid_at,
                              status)
        VALUES (${invoice.id},
                ${invoice.order_id},
                ${invoice.user_id},
                ${invoice.amount},
                ${invoice.tax_rate},
                ${invoice.platform_fee},
                ${invoice.payment_method},
                ${invoice.paid_at},
                ${invoice.status})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedNotification() {
  await sql`
    CREATE TABLE IF NOT EXISTS notifications
    (
      id      UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      title   VARCHAR(255) NOT NULL,
      message TEXT         NOT NULL,
      sent_at TIMESTAMPTZ DEFAULT now(),
      is_read BOOLEAN     DEFAULT FALSE,
      type    VARCHAR(20)  NOT NULL CHECK (type IN ('push', 'email', 'sms'))
    );
  `;

  return await Promise.all(
    notifications.map(
      (n) => sql`
        INSERT INTO notifications (id, user_id, title, message, sent_at, is_read, type)
        VALUES (${n.id},
                ${n.user_id},
                ${n.title},
                ${n.message},
                ${n.sent_at},
                ${n.is_read},
                ${n.type})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function seedUserDevice() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_devices
    (
      id           UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id      UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      device_token TEXT        NOT NULL,
      device_type  VARCHAR(10) NOT NULL CHECK (device_type IN ('iOS', 'Android')),
      app_version  VARCHAR(20),
      created_at   TIMESTAMPTZ DEFAULT now()
    );
  `;

  return await Promise.all(
    userDevices.map(
      (device) => sql`
        INSERT INTO user_devices (id, user_id, device_token, device_type, app_version)
        VALUES (${device.id},
                ${device.user_id},
                ${device.device_token},
                ${device.device_type},
                ${device.app_version})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );
}

async function resetAllTables() {
  await sql.begin(async (sql) => {
    await sql`DROP TABLE IF EXISTS user_devices CASCADE`;
    await sql`DROP TABLE IF EXISTS notifications CASCADE`;
    await sql`DROP TABLE IF EXISTS invoices CASCADE`;
    await sql`DROP TABLE IF EXISTS orders CASCADE`;
    await sql`DROP TABLE IF EXISTS provider_services CASCADE`;
    await sql`DROP TABLE IF EXISTS services CASCADE`;
    await sql`DROP TABLE IF EXISTS providers CASCADE`;
    await sql`DROP TABLE IF EXISTS customers CASCADE`;
    await sql`DROP TABLE IF EXISTS revenue CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
  });

  console.log('All tables dropped successfully.');
}

export async function GET() {
  await resetAllTables();

  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  try {
    await sql.begin(async (sql) => [
      await seedUsers(),
      await seedCustomers(),
      await seedProvider(),
      await seedService(),
      await seedProviderService(),
      await seedOrders(),
      await seedInvoices(),
      await seedNotification(),
      await seedUserDevice(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
