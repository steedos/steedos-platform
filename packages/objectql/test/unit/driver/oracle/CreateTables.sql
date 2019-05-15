
/****** Object:  Table "QHD170411"."TestCrudForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestCrudForOracle"(
	"id" varchar(50) NOT NULL PRIMARY KEY,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;

/****** Object:  Table "QHD170411"."TestFieldsForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestFieldsForOracle"(
	"id" varchar(50) NOT NULL PRIMARY KEY,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"tag" varchar(50) NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;

/****** Object:  Table "QHD170411"."TestFieldTypesForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestFieldTypesForOracle"(
	"id" number(10) NOT NULL PRIMARY KEY,
	"text" varchar(50) NULL,
	"textarea" varchar(50) NULL,
	"int" int NULL,
	"floatnumber" float NULL,
	"datefield" date NULL,
	"datetimefield" timestamp NULL,
	"datetimefield2" TIMESTAMP WITH TIME ZONE NULL,
	"datetimefield3" TIMESTAMP WITH LOCAL TIME ZONE NULL,
	"bool" number(1) NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;

CREATE SEQUENCE SU_TESTFIELDTYPESFORORACLE
INCREMENT BY 1 
START WITH 1 
NOMAXvalue 
NOCYCLE 
ORDER
CACHE 20;

CREATE OR REPLACE TRIGGER "QHD170411"."TU_TestFieldTypesForOracle" before
insert on "QHD170411"."TestFieldTypesForOracle" for each row when (new."id" is null)
begin
 
 select SU_TESTFIELDTYPESFORORACLE.nextval into:new."id" from dual;
 
 end;

/****** Object:  Table "QHD170411"."TestFiltersForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestFiltersForOracle"(
	"id" varchar(50) NOT NULL PRIMARY KEY,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;
/****** Object:  Table "QHD170411"."TestPageForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestPageForOracle"(
	"id" varchar(50) NOT NULL PRIMARY KEY,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"index" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;
/****** Object:  Table "QHD170411"."TestPrimaryKeyForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestPrimaryKeyForOracle"(
	"id" number(10) NOT NULL PRIMARY KEY,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;
CREATE SEQUENCE SU_TESTPRIMARYKEYFORORACLE
INCREMENT BY 1 
START WITH 1 
NOMAXvalue 
NOCYCLE 
ORDER
CACHE 20;


CREATE OR REPLACE TRIGGER "QHD170411"."TU_TestPrimaryKeyForOracle" before
insert on "QHD170411"."TestPrimaryKeyForOracle" for each row when (new."id" is null)
begin
 
 select SU_TESTPRIMARYKEYFORORACLE.nextval into:new."id" from dual;
 
 end;


/****** Object:  Table "QHD170411"."TestSortForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestSortForOracle"(
	"id" varchar(50) NOT NULL PRIMARY KEY,
	"name" varchar(50) NULL,
	"title" varchar(50) NULL,
	"count" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;
