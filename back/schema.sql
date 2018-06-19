create table club(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(128),
  name VARCHAR(128),
  contactName VARCHAR(128),
  contactEmail VARCHAR(128),
  streetAddress VARCHAR(128),
  postCode VARCHAR(5),
  city VARCHAR(64),
  lat FLOAT,
  lng FLOAT
);

create table sport(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(128),
  name VARCHAR(128)
);

create table club_sport(
	clubId INTEGER NOT NULL,
	sportId INTEGER NOT NULL
);

ALTER TABLE club_sport
ADD CONSTRAINT fk_club_sport_1 FOREIGN KEY (clubId) REFERENCES club(id),
ADD CONSTRAINT fk_club_sport_2 FOREIGN KEY (sportId) REFERENCES sport(id);

create table resource(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  clubId INTEGER NOT NULL,
  title VARCHAR(64)
);

ALTER TABLE resource
ADD CONSTRAINT fk_resource_1 FOREIGN KEY (clubId) REFERENCES club(id);

create table timeslot(
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	clubId INTEGER NOT NULL,
	sportId INTEGER NOT NULL,
  resourceId INTEGER NOT NULL,
  title VARCHAR(128),
	timeStart TIME,
	timeEnd TIME,
	first DATE,
	last DATE
);

ALTER TABLE timeslot
ADD CONSTRAINT fk_timeslot_1 FOREIGN KEY (clubId) REFERENCES club(id),
ADD CONSTRAINT fk_timeslot_2 FOREIGN KEY (sportId) REFERENCES sport(id),
ADD CONSTRAINT fk_timeslot_3 FOREIGN KEY (resourceId) REFERENCES resource(id);
