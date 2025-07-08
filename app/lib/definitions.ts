import { LineString } from "geojson";

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  BANNED = 'banned',
}

export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
}

export type UserValidationFields = 'userId' | 'amount' | 'status';
export type CustomerValidationFields = 'customerId' | 'amount' | 'status';

export type State<TFieldNames extends string = string> = {
  errors?: Partial<Record<TFieldNames, string[]>>;
  message?: string | null;
};

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  city: string;
  role: Role;
  status: UserStatus;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  user_id: string;
  customer_id: string;
  name: string;
  email: string;
  avatar: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type OrdersTable = {
  id: string;
  customer_id: string;
  customer_avatar: string;
  customer_name: string;
  customer_address: string;
  customer_longitude: number;
  customer_latitude: number;
  provider_id: string;
  provider_avatar: string;
  provider_name: string;
  distance_m: number;
  service_fee: number;
  travel_fee: number;
  provider_address: string;
  provider_longitude: number;
  provider_latitude: number;
  route_geometry: LineString;
  service: string;
  date: string;
  total_amount: number;
  status:
    | 'pending'
    | 'accepted'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'rejected';
  payment_status: 'paid' | 'unpaid' | 'refunded';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
