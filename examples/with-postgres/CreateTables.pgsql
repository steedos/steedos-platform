
/****** Object:  Table "public"."TestCrudForPostgres"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "public"."TestCrudForPostgres"(
	"id" varchar(50) NOT NULL,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" integer NULL,
 CONSTRAINT "PK_TestCrudForPostgres" PRIMARY KEY ("id") 
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "public"."TestCrudForPostgres"
    OWNER to keycloak;


/****** Object:  Table "public"."TestFieldsForPostgres"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "public"."TestFieldsForPostgres"(
	"id" varchar(50) NOT NULL,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"tag" varchar(50) NULL,
 CONSTRAINT "PK_TestFieldsForPostgres" PRIMARY KEY ("id") 
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "public"."TestFieldsForPostgres"
    OWNER to keycloak;


/****** Object:  Table "public"."TestFieldTypesForPostgres"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "public"."TestFieldTypesForPostgres"(
	"id" serial NOT NULL,
	"text" varchar(50) NULL,
	"textarea" varchar(50) NULL,
	"int" integer NULL,
	"float" double precision NULL,
	"date" date NULL,
	"datetime" timestamp(4) without time zone NULL,
	"datetime2" timestamp(4) with time zone NULL,
	"bool" boolean NULL,
 CONSTRAINT "PK_TestFieldTypesForPostgres" PRIMARY KEY ("id") 
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "public"."TestFieldTypesForPostgres"
    OWNER to keycloak;


/****** Object:  Table "public"."TestFiltersForPostgres"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "public"."TestFiltersForPostgres"(
	"id" varchar(50) NOT NULL,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" integer NULL,
 CONSTRAINT "PK_TestFiltersForPostgres" PRIMARY KEY ("id") 
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "public"."TestFiltersForPostgres"
    OWNER to keycloak;


/****** Object:  Table "public"."TestPageForPostgres"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "public"."TestPageForPostgres"(
	"id" varchar(50) NOT NULL,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"index" integer NULL,
 CONSTRAINT "PK_TestPageForPostgres" PRIMARY KEY ("id") 
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "public"."TestPageForPostgres"
    OWNER to keycloak;


/****** Object:  Table "public"."TestPrimaryKeyForPostgres"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "public"."TestPrimaryKeyForPostgres"(
	"id" serial NOT NULL,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" integer NULL,
 CONSTRAINT "PK_TestPrimaryKeyForPostgres" PRIMARY KEY ("id") 
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "public"."TestPrimaryKeyForPostgres"
    OWNER to keycloak;


/****** Object:  Table "public"."TestSortForPostgres"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "public"."TestSortForPostgres"(
	"id" varchar(50) NOT NULL,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" integer NULL,
 CONSTRAINT "PK_TestSortForPostgres" PRIMARY KEY ("id") 
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE "public"."TestSortForPostgres"
    OWNER to keycloak;


