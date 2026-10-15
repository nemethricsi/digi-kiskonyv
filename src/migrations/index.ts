import * as migration_20261013_141956_initial from './20261013_141956_initial';
import * as migration_20261013_163629_add_citizens from './20261013_163629_add_citizens';
import * as migration_20261013_191115_add_user_role from './20261013_191115_add_user_role';
import * as migration_20261014_205215_add_registrations from './20261014_205215_add_registrations';
import * as migration_20261014_210513_seed_demo_citizen from './20261014_210513_seed_demo_citizen';
import * as migration_20261015_083025_add_appointments from './20261015_083025_add_appointments';
import * as migration_20261015_111852_add_attendances_and_check_in_codes from './20261015_111852_add_attendances_and_check_in_codes';
import * as migration_20261015_113434_add_appointment_label from './20261015_113434_add_appointment_label';

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
    name: '20261013_191115_add_user_role',
  },
  {
    up: migration_20261014_205215_add_registrations.up,
    down: migration_20261014_205215_add_registrations.down,
    name: '20261014_205215_add_registrations',
  },
  {
    up: migration_20261014_210513_seed_demo_citizen.up,
    down: migration_20261014_210513_seed_demo_citizen.down,
    name: '20261014_210513_seed_demo_citizen',
  },
  {
    up: migration_20261015_083025_add_appointments.up,
    down: migration_20261015_083025_add_appointments.down,
    name: '20261015_083025_add_appointments',
  },
  {
    up: migration_20261015_111852_add_attendances_and_check_in_codes.up,
    down: migration_20261015_111852_add_attendances_and_check_in_codes.down,
    name: '20261015_111852_add_attendances_and_check_in_codes',
  },
  {
    up: migration_20261015_113434_add_appointment_label.up,
    down: migration_20261015_113434_add_appointment_label.down,
    name: '20261015_113434_add_appointment_label'
  },
];
