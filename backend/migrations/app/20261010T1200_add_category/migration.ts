#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/63492426b9d886fd5f2ec6fa17050a0bbd15e2686d045d72057609543cca8d6f/contract';
import startContract from '../../snapshots/63492426b9d886fd5f2ec6fa17050a0bbd15e2686d045d72057609543cca8d6f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/950b871e9eb2bb4cce825064035f9caec51b86ff47193e93be17ff06c1bdcda4/contract';
import endContract from '../../snapshots/950b871e9eb2bb4cce825064035f9caec51b86ff47193e93be17ff06c1bdcda4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Category',
        columns: [
          col('colour', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Expense',
        column: col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Expense',
        index: 'Expense_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Expense',
        foreignKey: {
          name: 'Expense_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
