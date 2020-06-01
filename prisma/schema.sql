create EXTENSION IF NOT EXISTS "uuid-ossp";

create TYPE role_enum AS ENUM ('ADMIN', 'INVESTOR');

create table "public"."User" (
  id uuid default uuid_generate_v4() primary key not null,
  name VARCHAR(255),
  email varchar(255) unique not null,
  "createdAt" timestamp not null default now(),
  password varchar(255) not null,
  phone varchar(255),
  role role_enum default 'INVESTOR'
);

create table "public"."Car" (
  id uuid default uuid_generate_v4() primary key not null,
  "createdAt" timestamp not null default now(),
  title varchar(255) not null,
  "govNumber" varchar(255) unique not null,
  "ownerId" uuid not null,
  foreign key ("ownerId") references "public"."User"(id),
  price money,
  mileage numeric
);

create table "public"."Report" (
  id uuid default uuid_generate_v4() primary key not null,
  "createdAt" timestamp not null default now(),
  title varchar(255),
  week varchar(255),
  year varchar(255),
  income numeric(2),
  "incomeBranding" numeric(2),
  "serviceFee" numeric(2),
  "trackerFee" numeric(2),
  mileage numeric,
  "govNumber" varchar(255) not null,
  "govNumberId" uuid not null,
  foreign key ("govNumberId") references "public"."Car"(id),
  "totalIncome" numeric(2),
  "managementFeePercent" numeric(2),
  "managementFee" numeric(2),
  "netProfit" numeric(2),
  "netProfitUSD" numeric(2),
  "exchangeRate" numeric(2)
);
