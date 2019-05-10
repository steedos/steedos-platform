
/****** Object:  Table "QHD170411"."TestCrudForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestCrudForOracle"(
	"ID" varchar(50) NOT NULL PRIMARY KEY,
	"NAME" varchar(50) NULL,
	"TITLE" varchar(50) NULL,
	"COUNT" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;

/****** Object:  Table "QHD170411"."TestFieldsForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestFieldsForOracle"(
	"ID" varchar(50) NOT NULL PRIMARY KEY,
	"NAME" varchar(50) NULL,
	"TITLE" varchar(50) NULL,
	"TAG" varchar(50) NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;

/****** Object:  Table "QHD170411"."TestFieldTypesForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestFieldTypesForOracle"(
	"ID" number(10) NOT NULL PRIMARY KEY,
	"TEXT" varchar(50) NULL,
	"TEXTAREA" varchar(50) NULL,
	"INT" int NULL,
	"FLOATNUMBER" float NULL,
	"DATEFIELD" date NULL,
	"DATETIMEFIELD" timestamp NULL,
	"BOOL" number(1) NULL
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
insert on "QHD170411"."TestFieldTypesForOracle" for each row when (new.ID is null)
begin
 
 select SU_TESTFIELDTYPESFORORACLE.nextval into:new.ID from dual;
 
 end;

/****** Object:  Table "QHD170411"."TestFiltersForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestFiltersForOracle"(
	"ID" varchar(50) NOT NULL PRIMARY KEY,
	"NAME" varchar(50) NULL,
	"TITLE" varchar(50) NULL,
	"COUNT" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;
/****** Object:  Table "QHD170411"."TestPageForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestPageForOracle"(
	"ID" varchar(50) NOT NULL PRIMARY KEY,
	"NAME" varchar(50) NULL,
	"TITLE" varchar(50) NULL,
	"INDEX" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;
/****** Object:  Table "QHD170411"."TestPrimaryKeyForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestPrimaryKeyForOracle"(
	"ID" number(10) NOT NULL PRIMARY KEY,
	"NAME" varchar(50) NULL,
	"TITLE" varchar(50) NULL,
	"COUNT" int NULL
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
insert on "QHD170411"."TestPrimaryKeyForOracle" for each row when (new.ID is null)
begin
 
 select SU_TESTPRIMARYKEYFORORACLE.nextval into:new.ID from dual;
 
 end;
-- CREATE OR REPLACE TRIGGER "QHD170411"."TU_TestPrimaryKeyForOracle" BEFORE INSERT ON "QHD170411"."TestPrimaryKeyForOracle" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW
-- BEGIN
-- IF :new.id IS NULL THEN
-- SELECT SU_TESTPRIMARYKEYFORORACLE.NEXTVAL
-- INTO :new.id
-- FROM dual;
-- END IF;
-- END;

/****** Object:  Table "QHD170411"."TestSortForOracle"    Script Date: 2019/4/24 18:22:13 ******/
CREATE TABLE "QHD170411"."TestSortForOracle"(
	"ID" varchar(50) NOT NULL PRIMARY KEY,
	"NAME" varchar(50) NULL,
	"TITLE" varchar(50) NULL,
	"COUNT" int NULL
)
LOGGING
NOCOMPRESS
NOCACHE

;
