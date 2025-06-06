// Copyright 2025 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { sql } from '../../sql/util';
import type { WritableDB } from '../../sql/Interface';
import { updateToVersion, createDB } from './helpers';

describe('SQL/updateToSchemaVersion1350', () => {
  let db: WritableDB;
  beforeEach(() => {
    db = createDB();
    updateToVersion(db, 1350);
  });

  afterEach(() => {
    db.close();
  });

  it('creates new notificationProfiles table', () => {
    const [query] = sql`SELECT * FROM notificationProfiles`;
    db.prepare(query).run();
  });

  // See test-electron/sql/notificationProfiles_test.ts
});
