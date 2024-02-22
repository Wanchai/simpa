import { MigrationInterface, QueryRunner } from "typeorm";

export class First1708419188968 implements MigrationInterface {
    name = 'First1708419188968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "site" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "url" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "day_count" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "siteId" varchar NOT NULL, "date" datetime NOT NULL, "test" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_c706635074991eff69e2694d48" ON "day_count" ("siteId") `);
        await queryRunner.query(`CREATE TABLE "count" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "siteId" varchar NOT NULL, "date" datetime NOT NULL DEFAULT (datetime('now')), "referer" varchar NOT NULL, "page" varchar NOT NULL, "country" varchar NOT NULL, "ip" varchar NOT NULL, "client" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_1e89b511a8e6ae70fcd594b7fc" ON "count" ("siteId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_1e89b511a8e6ae70fcd594b7fc"`);
        await queryRunner.query(`DROP TABLE "count"`);
        await queryRunner.query(`DROP INDEX "IDX_c706635074991eff69e2694d48"`);
        await queryRunner.query(`DROP TABLE "day_count"`);
        await queryRunner.query(`DROP TABLE "site"`);
    }

}
