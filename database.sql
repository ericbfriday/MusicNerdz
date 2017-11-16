database = "d5v1g130uppe55";

CREATE TABLE "schools" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL
);

CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY,
	"first" text NOT NULL,
	"last" text NOT NULL,
	"email" text UNIQUE NOT NULL,
	"schools_id" INT REFERENCES schools(id)
);

CREATE TABLE "classes" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"code" text,
    "teachers_id" INT REFERENCES teachers(id)
);

CREATE TABLE "students" (
	"id" serial PRIMARY KEY,
	"first" text NOT NULL,
    "last" text NOT NULL,
	"email" text UNIQUE NOT NULL,
    "number" text UNIQUE NOT NULL,
    "classes_id" INT REFERENCES classes(id)
);

CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"type" INT NOT NULL,
	"username" text UNIQUE NOT NULL,
	"password" text NOT NULL,
	"students_id" INT REFERENCES students(id),
    "teachers_id" INT REFERENCES teachers(id),
	"reset_token" varchar(40),
	"reset_token_expires" timestamp
);

CREATE TABLE "modules" (
	"id" serial PRIMARY KEY,
	"description" text NOT NULL,
	"title" text NOT NULL,
    "album" text NOT NULL,
    "artist" text NOT NULL,
    "year" INT NOT NULL,
    "art" text,
    "lyrics" text NOT NULL,
    "video" text NOT NULL
);

CREATE TABLE "questions" (
	"id" serial PRIMARY KEY,
	"question" text NOT NULL,
    "type" text NOT NULL,
    "a" text NOT NULL,
    "b" text NOT NULL,
    "c" text NOT NULL,
    "d" text NOT NULL,
    "correct" text NOT NULL,
    "modules_id" INT REFERENCES modules(id) ON DELETE CASCADE
);

CREATE TABLE "responses" (
	"id" serial PRIMARY KEY,
    "students_id" INT REFERENCES students(id) ON DELETE CASCADE,
	"response" text,
	"admin_notes" text,
	"teacher_comments" text,
	"final_grade" text,
    "questions_id" INT REFERENCES questions(id)
);

CREATE TABLE "resources" (
	"id" serial PRIMARY KEY,
	"description" text,
    "type" text NOT NULL,
    "link" text,
    "modules_id" INT REFERENCES modules(id)
);

CREATE TABLE "history" (
	"id" serial PRIMARY KEY,
	"description" text NOT NULL,
    "year" INT
);

CREATE TABLE "tags" (
	"id" serial PRIMARY KEY,
	"type" text NOT NULL
);

CREATE TABLE "classes_modules" (
	"id" serial PRIMARY KEY,
	"classes_id" INT REFERENCES classes(id) ON DELETE CASCADE,
	"modules_id" INT REFERENCES modules(id) ON DELETE CASCADE
);

CREATE TABLE "modules_tags" (
	"id" serial PRIMARY KEY,
	"modules_id" INT REFERENCES modules(id) ON DELETE CASCADE,	
	"tags_id" INT REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE "modules_history" (
	"id" serial PRIMARY KEY,
	"modules_id" INT REFERENCES modules(id) ON DELETE CASCADE,	
	"history_id" INT REFERENCES history(id) ON DELETE CASCADE
);

CREATE TABLE "history_tags" (
	"id" serial PRIMARY KEY,
	"history_id" INT REFERENCES history(id) ON DELETE CASCADE,	
	"tags_id" INT REFERENCES tags(id) ON DELETE CASCADE
);