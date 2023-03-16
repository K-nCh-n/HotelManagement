CREATE DATABASE hotel_management;

CREATE TABLE hotel_chain (
    chain_name character varying(20) NOT NULL,
    PRIMARY KEY (chain_name)
);

CREATE TABLE central_office (
    office_id integer NOT NULL,
    chain_name character varying(20) NOT NULL,
    address character varying(60) NOT NULL,
    email character varying(40),
    phone_number integer,
    PRIMARY KEY (office_id),
    FOREIGN KEY (chain_name) REFERENCES hotel_chain(chain_name)
);

CREATE TABLE hotel (
    hotel_id integer NOT NULL,
    chain_name character varying(20) NOT NULL,
    email character varying(20),
    phone_number character varying(20),
    rating smallint,
    manager_id character varying(20),
    PRIMARY KEY (hotel_id),
    FOREIGN KEY (chain_name) REFERENCES hotel_chain(chain_name)
);

CREATE TABLE room (
    room_id integer NOT NULL,
    hotel_id integer NOT NULL,
    price integer,
    commodities character varying(20),
    capacity integer,
    view character varying(20),
    extendable boolean,
    problems character varying(20),
    PRIMARY KEY (room_id),
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id)
);

CREATE TABLE employee (
    employee_nas character varying(20) NOT NULL,
    hotel_id integer NOT NULL,
    salary integer,
    first_name character varying(20),
    last_name character varying(20),
    address character varying(20),
    PRIMARY KEY (employee_nas),
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id)
);

CREATE TABLE customer (
    customer_nas character varying(20) NOT NULL,
    first_name character varying(20),
    last_name character varying(20),
    address character varying(60),
    registrationdate date,
    PRIMARY KEY (customer_nas)
);

CREATE TABLE reservation (
    reservation_id character varying(20) NOT NULL,
    room_id integer NOT NULL,
    customer_nas character varying(20),
    address character varying(20),
    reservation_start_date date,
    reservation_end_date date,
    PRIMARY KEY (reservation_id),
    FOREIGN KEY (room_id) REFERENCES room(room_id),
    FOREIGN KEY (customer_nas) REFERENCES customer(customer_nas)
);

CREATE TABLE rental (
    rental_id character varying(20) NOT NULL,
    reservation_id character varying(20),
    customer_nas character varying(20),
    room_id integer NOT NULL,
    rental_start_date date,
    rental_end_date date,
    number_of_people integer,
    employee_nas character varying(20),
    PRIMARY KEY (rental_id),
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id),
    FOREIGN KEY (customer_nas) REFERENCES customer(customer_nas),
    FOREIGN KEY (room_id) REFERENCES room(room_id),
    FOREIGN KEY (employee_nas) REFERENCES employee(employee_nas)
);

ALTER TABLE hotel
	ADD FOREIGN KEY (manager_id) REFERENCES employee(employee_nas)
