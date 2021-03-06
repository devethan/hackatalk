# Migration `20200628200026-init`

This migration has been generated by hyochan at 6/28/2020, 8:00:26 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "Gender" AS ENUM ('male', 'female');

CREATE TYPE "AuthType" AS ENUM ('email', 'facebook', 'google', 'apple');

CREATE TABLE "hackatalk"."User" (
"birthDay" timestamp(3)   ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"deletedAt" timestamp(3)   ,"email" text  NOT NULL ,"gender" "Gender"  ,"id" text  NOT NULL ,"isOnline" boolean   DEFAULT false,"lastSignedIn" timestamp(3)   ,"name" text   ,"nickname" text   ,"password" text  NOT NULL ,"phone" text   ,"photoURL" text   ,"statusMessage" text   ,"thumbURL" text   ,"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"verified" boolean  NOT NULL DEFAULT false,
    PRIMARY KEY ("id"))

CREATE TABLE "hackatalk"."Notification" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"device" text   ,"id" SERIAL,"os" text   ,"token" text  NOT NULL ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "hackatalk"."Profile" (
"authType" "AuthType" NOT NULL ,"id" text  NOT NULL ,"socialId" text   ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "User.email" ON "hackatalk"."User"("email")

CREATE UNIQUE INDEX "Profile.userId" ON "hackatalk"."Profile"("userId")

ALTER TABLE "hackatalk"."Notification" ADD FOREIGN KEY ("userId")REFERENCES "hackatalk"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "hackatalk"."Profile" ADD FOREIGN KEY ("userId")REFERENCES "hackatalk"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200628200026-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,60 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+enum Gender {
+  male
+  female
+}
+
+enum AuthType {
+  email
+  facebook
+  google
+  apple
+}
+
+model User {
+  id               String      @default(cuid()) @id
+  email            String      @unique
+  password         String
+  name             String?
+  nickname         String?
+  thumbURL         String?
+  photoURL         String?
+  birthDay         DateTime?
+  gender           Gender?
+  phone            String?
+  statusMessage    String?
+  verified         Boolean     @default(false)
+  isOnline         Boolean?    @default(false)
+  lastSignedIn     DateTime?
+  notifications    Notification[]
+  profile          Profile?
+  createdAt        DateTime    @default(now())
+  updatedAt        DateTime    @default(now()) @updatedAt
+  deletedAt        DateTime?
+}
+
+model Notification {
+  id          Int         @default(autoincrement()) @id
+  token       String
+  device      String?
+  os          String?
+  userId      String
+  user        User        @relation(fields: [userId], references: [id])
+  createdAt   DateTime    @default(now())
+}
+
+model Profile {
+  id          String      @default(cuid()) @id
+  socialId    String?
+  authType    AuthType
+  userId      String      @unique
+  User        User        @relation(fields: [userId], references: [id])
+}
```


