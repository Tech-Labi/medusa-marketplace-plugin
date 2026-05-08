import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260428115031 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "super_admin" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "super_admin_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_super_admin_deleted_at" ON "super_admin" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "super_admin" cascade;`);
  }

}
