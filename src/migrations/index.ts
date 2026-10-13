import * as migration_20261013_141956_initial from './20261013_141956_initial';
import * as migration_20261013_163629_add_citizens from './20261013_163629_add_citizens';
import * as migration_20261013_191115_add_user_role from './20261013_191115_add_user_role';

export const migrations = [
  {
    up: migration_20261013_141956_initial.up,
    down: migration_20261013_141956_initial.down,
    name: '20261013_141956_initial',
  },
  {
    up: migration_20261013_163629_add_citizens.up,
    down: migration_20261013_163629_add_citizens.down,
    name: '20261013_163629_add_citizens',
  },
  {
    up: migration_20261013_191115_add_user_role.up,
    down: migration_20261013_191115_add_user_role.down,
    name: '20261013_191115_add_user_role'
  },
];
