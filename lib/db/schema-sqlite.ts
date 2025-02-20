import { generateUUID } from '@/lib/utils';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('User', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateUUID()),
  email: text('email', { length: 64 }).notNull(),
  password: text('password', { length: 64 }),
});

export type User = typeof user.$inferSelect;

export const chat = sqliteTable('Chat', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateUUID()),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  title: text('title').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  visibility: text('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = typeof chat.$inferSelect;

export const message = sqliteTable('Message', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateUUID()),
  chatId: text('chatId')
    .notNull()
    .references(() => chat.id),
  role: text('role').notNull(),
  content: text('content', { mode: 'json' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

export type Message = typeof message.$inferSelect;

export const vote = sqliteTable(
  'Vote',
  {
    chatId: text('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: text('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: integer('isUpvoted', { mode: 'boolean' }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = typeof vote.$inferSelect;

export const document = sqliteTable(
  'Document',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => generateUUID()),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: text('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: text('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = typeof document.$inferSelect;

export const suggestion = sqliteTable(
  'Suggestion',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => generateUUID()),
    documentId: text('documentId').notNull(),
    documentCreatedAt: integer('documentCreatedAt', {
      mode: 'timestamp',
    }).notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: integer('isResolved', { mode: 'boolean' })
      .notNull()
      .default(false),
    userId: text('userId')
      .notNull()
      .references(() => user.id),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = typeof suggestion.$inferSelect;
