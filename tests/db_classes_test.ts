import { assertEquals, assertExists, assertInstanceOf } from '@std/assert';

import { randomIntegerBetween, sample } from '@std/random';

import { faker, type NumberModule } from '@faker-js/faker';

import {
  Block,
  Calendar,
  CalendarAccess,
  Collision,
  Occupant,
  Repeat,
  Space,
  SpaceAccess,
  Tables,
  User,
} from '@collision-calendar/db/classes';

import type { AccessPermissions, RepeatUnit } from '@collision-calendar/types';

const id_options: Parameters<NumberModule['int']>[0] = {
  min: 1,
  max: 100,
};

const repeat_units: RepeatUnit[] = ['day', 'week', 'month', 'year'];

const access_permissions: AccessPermissions[] = [100, 110, 111];

const table_names = [
  'block',
  'calendar',
  'calendar_access',
  'collision',
  'occupant',
  'repeat',
  'space',
  'space_access',
  'user',
];

Deno.test('DB: classes', async (t) => {
  await t.step('class: User', () => {
    const user = new User({
      id: faker.number.int(id_options),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(user, User);
  });

  await t.step('class: Calendar', () => {
    const calendar = new Calendar({
      id: faker.number.int(id_options),
      name: faker.company.name(),
      owneruserid: faker.number.int(id_options),
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(calendar, Calendar);
  });

  await t.step('class: Space', () => {
    const space = new Space({
      id: faker.number.int(id_options),
      name: faker.commerce.department(),
      calendarid: faker.number.int(id_options),
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(space, Space);
  });

  await t.step('class: Block', () => {
    const start = Temporal.Now.plainDateTimeISO();
    const block = new Block({
      id: faker.number.int(id_options),
      name: faker.word.noun(),
      color: faker.color.rgb(),
      start,
      end: start.add({ hours: randomIntegerBetween(1, 8) }),
      spaceid: faker.number.int(id_options),
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(block, Block);
  });

  await t.step('class: Collision', () => {
    const collision = new Collision({
      id: faker.number.int(id_options),
      spaceid_l: faker.number.int(id_options),
      spaceid_r: faker.number.int(id_options),
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(collision, Collision);
  });

  await t.step('class: Occupant', () => {
    const occupant = new Occupant({
      id: faker.number.int(id_options),
      spaceid: faker.number.int(id_options),
      userid: faker.number.int(id_options),
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(occupant, Occupant);
  });

  await t.step('class: Repeat', () => {
    const start = Temporal.Now.plainDateISO();
    const repeat = new Repeat({
      id: faker.number.int(id_options),
      unit: sample(repeat_units)!,
      interval: faker.number.int({ min: 1, max: 4 }),
      start,
      end: start.add({ months: 1 }),
      blockid: faker.number.int(id_options),
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(repeat, Repeat);
  });

  await t.step('class: CalendarAccess', () => {
    const calendar_access = new CalendarAccess({
      id: faker.number.int(id_options),
      userid: faker.number.int(id_options),
      calendarid: faker.number.int(id_options),
      permissions: sample(access_permissions)!,
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(calendar_access, CalendarAccess);
  });

  await t.step('class: SpaceAccess', () => {
    const space_access = new SpaceAccess({
      id: faker.number.int(id_options),
      userid: faker.number.int(id_options),
      spaceid: faker.number.int(id_options),
      permissions: sample(access_permissions)!,
      created_at: Temporal.Now.instant(),
    });

    assertInstanceOf(space_access, SpaceAccess);
  });

  await t.step('table names', () => {
    assertExists(Tables);
    assertEquals(Tables.toSorted(), table_names.toSorted());
  });
});
