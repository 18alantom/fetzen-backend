-- Run this if database has to be wiped out and recreated.
drop database fetzen;
create database fetzen;
use fetzen;

-- Table to store the user's login credentials
create table user_credential (
  u_uname varchar(60),
  u_passw binary(60) not null,
  primary key (u_uname)
);

-- Table to store the user's data
create table user_data (
  u_id varchar(40),
  u_uname varchar(60),
  u_first_name varchar(30) not null,
  u_last_name varchar(30),
  -- Height will be stored as cm
  u_height dec(7,3) not null,
  primary key (u_id),
  foreign key (u_uname) references user_credential(u_uname)
    on delete cascade
    on update cascade
);

-- Table that tracks user's weight
create table user_weight (
  u_id varchar(40),
  u_measure_date datetime default current_timestamp, 
  -- Weight will be stored as kg
  u_weight dec(6,3) not null, 
  foreign key (u_id) references user_data(u_id)
    on delete cascade
    on update cascade
);

-- Table to store the user's goals
create table goal (
  g_id varchar(40),
  u_id varchar(40),
  g_title varchar(300) not null,
  g_detail varchar(2000) not null,
  g_deadline date not null,
  g_complete tinyint default 0,
  g_date_completed date,
  primary key (g_id),
  foreign key (u_id) references user_data(u_id)
    on delete cascade
    on update cascade
);

-- Table to store the user's workouts
create table workout (
  w_id varchar(40),
  u_id varchar(40),
  w_name varchar(200) not null,
  w_days varchar(20) not null, 
  w_last date,
  primary key (w_id),
  foreign key (u_id) references user_data(u_id)
    on delete cascade
    on update cascade
);

-- A snap is stored when a workout is done
create table workout_snap (
  w_id varchar(40),
  w_date date,
  w_note varchar(2000),
  w_is_creation tinyint default 0,
  primary key(w_id, w_date, w_is_creation),
  foreign key (w_id) references workout(w_id)
    on delete cascade
    on update cascade
);

-- Table that stores an exercise's details
create table exercise (
  e_id varchar(40),
  w_id varchar(40),
  e_name varchar(200) not null,
  e_unit enum('kg','lb','kmpg','mph') not null default 'kg',
  primary key (e_id),
  foreign key (w_id) references workout(w_id)
    on delete cascade
    on update cascade
);

-- Exercise snap is stored when an exercise values 
-- are updated for a date this creates a workout snap 
-- iff there is no workout snap for the date
create table exercise_snap (
  e_id varchar(40),
  w_id varchar(40),
  w_date date,
  e_note varchar(2000),
  w_is_creation tinyint default 0,
  primary key (e_id, w_date),
  foreign key (e_id) references exercise(e_id)
    on delete cascade
    on update cascade,
  foreign key (w_id,w_date,w_is_creation) references workout_snap(w_id,w_date,w_is_creation)
    on delete cascade
    on update cascade
);

-- Table that stores the cycles (sets)
create table cycle_snap (
  c_id varchar(40),
  e_id varchar(40),
  w_id varchar(40),
  w_date date,
  c_intensity dec(6,2) not null default 0.0,
  c_reps smallint unsigned not null default 0,
  c_rest smallint unsigned not null default 0,
  w_is_creation tinyint default 0,
  primary key(c_id, w_date),
  foreign key (e_id) references exercise(e_id)
    on delete cascade
    on update cascade,
  foreign key (w_id,w_date,w_is_creation) references workout_snap(w_id,w_date,w_is_creation)
    on delete cascade
    on update cascade
);

-- The first snap that is created corresponds to 
-- the initial creation of the workout, the date on 
-- this snap should be NULL but it can't be hence 1000-01-01.
-- on initial creation date is not sent and last is set to NULL
-- last changes only when a snap is set.