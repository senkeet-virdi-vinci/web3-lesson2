#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7bb9681a541e8332d005b8efd97f4a3fc8d9762006a6427e959f417aae118a24/contract';
import endContract from '../../snapshots/7bb9681a541e8332d005b8efd97f4a3fc8d9762006a6427e959f417aae118a24/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Expense',
        columns: [
          col('amount', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('date', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('payer', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
