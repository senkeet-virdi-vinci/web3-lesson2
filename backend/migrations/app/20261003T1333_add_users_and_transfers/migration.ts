#!/usr/bin/env -S node
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract as End } from '../../snapshots/63492426b9d886fd5f2ec6fa17050a0bbd15e2686d045d72057609543cca8d6f/contract';
import endContract from '../../snapshots/63492426b9d886fd5f2ec6fa17050a0bbd15e2686d045d72057609543cca8d6f/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/7bb9681a541e8332d005b8efd97f4a3fc8d9762006a6427e959f417aae118a24/contract';
import startContract from '../../snapshots/7bb9681a541e8332d005b8efd97f4a3fc8d9762006a6427e959f417aae118a24/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

const { sql: db, contract } = postgres<End>({ contractJson: endContract });

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Expense', column: 'payer' }),
      this.createTable({
        schema: 'public',
        table: 'ExpenseUser',
        columns: [
          col('expenseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['expenseId', 'userId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Transfer',
        columns: [
          col('amount', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('date', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sourceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('targetId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('bankAccount', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Expense',
        column: col('payerId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(contract, 'wipe-expense-before-payer-migration', {
        run: () => db.public.Expense.delete(),
      }),
      this.setNotNull({ schema: 'public', table: 'Expense', column: 'payerId' }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Expense',
        index: 'Expense_payerId_idx_3d3ae95d',
        columns: ['payerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExpenseUser',
        index: 'ExpenseUser_expenseId_idx_69d413fa',
        columns: ['expenseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ExpenseUser',
        index: 'ExpenseUser_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Transfer',
        index: 'Transfer_sourceId_idx_d92a2571',
        columns: ['sourceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Transfer',
        index: 'Transfer_targetId_idx_9852d518',
        columns: ['targetId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ExpenseUser',
        foreignKey: {
          name: 'ExpenseUser_expenseId_fkey',
          columns: ['expenseId'],
          references: { schema: 'public', table: 'Expense', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ExpenseUser',
        foreignKey: {
          name: 'ExpenseUser_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Transfer',
        foreignKey: {
          name: 'Transfer_sourceId_fkey',
          columns: ['sourceId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Transfer',
        foreignKey: {
          name: 'Transfer_targetId_fkey',
          columns: ['targetId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Expense',
        foreignKey: {
          name: 'Expense_payerId_fkey',
          columns: ['payerId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
