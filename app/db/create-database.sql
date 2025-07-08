-- Drop tables if exist
DO
$$
  BEGIN
    EXECUTE '
    DROP TABLE IF EXISTS
      user_devices,
      notifications,
      invoices,
      orders,
      provider_services,
      services,
      providers,
      customers,
      pending_users,
      users
    CASCADE
  ';
  END
$$;

-- Drop enum types if exist
DO
$$
  BEGIN
    EXECUTE '
    DROP TYPE IF EXISTS
      user_role,
      user_status,
      gender_type,
      payment_method,
      invoice_status,
      payment_status,
      invoice_source,
      notification_type,
      device_type,
      order_status,
      closureType
    CASCADE
  ';
  END
$$;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types
DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
      CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
      CREATE TYPE user_status AS ENUM ('pending', 'active', 'banned');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
      CREATE TYPE gender_type AS ENUM ('male', 'female', 'gender diverse', 'prefer not to say');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
      CREATE TYPE payment_method AS ENUM ('credit_card', 'bank_transfer', 'cash', 'other');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
      CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'refunded', 'cancelled');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
      CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_source') THEN
      CREATE TYPE invoice_source AS ENUM ('order', 'manual', 'system', 'admin');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
      CREATE TYPE notification_type AS ENUM ('push', 'email', 'sms');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'device_type') THEN
      CREATE TYPE device_type AS ENUM ('iOS', 'Android');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
      CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected');
    END IF;
  END
$$;

DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'closureType') THEN
      CREATE TYPE closureType AS ENUM ('cancel', 'reject');
    END IF;
  END
$$;


CREATE TABLE IF NOT EXISTS users
(
  id             UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name           VARCHAR(200) GENERATED ALWAYS AS (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) STORED,
  first_name     VARCHAR(100),
  last_name      VARCHAR(100),
  email          TEXT NOT NULL UNIQUE,
  password       TEXT NOT NULL,
  phone          VARCHAR(20),
  gender         gender_type DEFAULT 'prefer not to say',
  birthdate      DATE,
  avatar         TEXT,
  city           TEXT,
  balance        NUMERIC(10, 2) NOT NULL CHECK (balance >= 0),
  role           user_role   DEFAULT 'customer',
  status         user_status DEFAULT 'active',
  email_verified BOOLEAN     DEFAULT FALSE,
  phone_verified BOOLEAN     DEFAULT FALSE,
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  is_deleted     BOOLEAN     DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS customers
(
  id                      UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id                 UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  default_address         VARCHAR(255),
  default_latitude        DOUBLE PRECISION,
  default_longitude       DOUBLE PRECISION,
  note                    TEXT,
  is_disabled             BOOLEAN     DEFAULT FALSE,
  emergency_contact_name  VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE IF NOT EXISTS providers
(
  id                UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id           UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  license_number    VARCHAR(50) UNIQUE,
  service_radius_km INTEGER     DEFAULT 10 CHECK (service_radius_km >= 0),
  base_address      VARCHAR(50),
  base_latitude     DOUBLE PRECISION,
  base_longitude    DOUBLE PRECISION,
  bio               TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE IF NOT EXISTS services
(
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        VARCHAR(100)       NOT NULL,
  code        VARCHAR(50) UNIQUE NOT NULL,
  icon        TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE IF NOT EXISTS provider_services
(
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id      UUID           NOT NULL REFERENCES providers (id) ON DELETE CASCADE,
  service_id       UUID           NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration_minutes INT            NOT NULL CHECK (duration_minutes > 0),
  notes            TEXT,
  UNIQUE (provider_id, service_id)
);


CREATE TABLE IF NOT EXISTS orders
(
  id                  UUID           DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id         UUID             NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  provider_id         UUID             NOT NULL REFERENCES providers (id) ON DELETE CASCADE,
  service_id          UUID             NOT NULL REFERENCES services (id) ON DELETE RESTRICT,
  service_address     TEXT             NOT NULL,
  service_latitude    DOUBLE PRECISION NOT NULL,
  service_longitude   DOUBLE PRECISION NOT NULL,
  distance_m          INTEGER          NOT NULL,
  service_fee         NUMERIC(10, 2)   NOT NULL CHECK (service_fee >= 0),
  travel_fee          NUMERIC(10, 2)   NOT NULL CHECK (travel_fee >= 0),
  total_amount        NUMERIC(10, 2)   NOT NULL,
  actual_service_m    INTEGER        DEFAULT 0 CHECK (actual_service_m >= 0),
  drive_duration_s    INTEGER          NOT NULL,
  route_geometry      JSONB            NOT NULL,
  scheduled_start     TIMESTAMPTZ      NOT NULL,
  status              order_status   DEFAULT 'pending',
  payment_status      payment_status DEFAULT 'pending',
  note                TEXT,
  created_at          TIMESTAMPTZ    DEFAULT now(),
  updated_at          TIMESTAMPTZ,
  closure_type        closureType    DEFAULT 'cancel',
  closure_by_id       UUID,
  closure_by_role     TEXT,
  closure_reason      TEXT,
  closure_at          TIMESTAMPTZ,
  started_at          TIMESTAMPTZ,
  start_latitude      DOUBLE PRECISION,
  start_longitude     DOUBLE PRECISION,
  completed_at        TIMESTAMPTZ,
  completed_latitude  DOUBLE PRECISION,
  completed_longitude DOUBLE PRECISION,
);
COMMENT ON COLUMN orders.closure_by_id IS 'user_id of the person who cancelled or rejected the order';
CREATE UNIQUE INDEX one_active_order_per_customer
  ON orders (customer_id)
  WHERE status IN ('pending', 'accepted');


CREATE TABLE IF NOT EXISTS invoices
(
  id             UUID           DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id       UUID REFERENCES orders (id) ON DELETE CASCADE,
  user_id        UUID           NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  amount         INTEGER        NOT NULL,
  tax_rate       INTEGER        DEFAULT 0,
  platform_fee   INTEGER        DEFAULT 0,
  payment_method payment_method NOT NULL,
  paid_at        TIMESTAMPTZ,
  refund_at      TIMESTAMPTZ,
  refund_reason  TEXT,
  date           TIMESTAMPTZ    DEFAULT now(),
  status         invoice_status DEFAULT 'pending',
  source         invoice_source DEFAULT 'order'
);


CREATE TABLE IF NOT EXISTS notifications
(
  id      UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID              NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title   VARCHAR(255)      NOT NULL,
  message TEXT              NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN     DEFAULT FALSE,
  type    notification_type NOT NULL
);


CREATE TABLE IF NOT EXISTS user_devices
(
  id           UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  device_token TEXT        NOT NULL,
  device_type  device_type NOT NULL,
  app_version  VARCHAR(20),
  created_at   TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE pending_users
(
  email      TEXT PRIMARY KEY,
  password   TEXT,
  first_name VARCHAR(100),
  last_name  VARCHAR(100),
  token      TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);
