CREATE TABLE `count` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`siteId` text NOT NULL,
	`date` text DEFAULT (datetime('now')) NOT NULL,
	`referer` text DEFAULT '' NOT NULL,
	`page` text DEFAULT '' NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`ip` text DEFAULT '' NOT NULL,
	`client` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `day_count` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`siteId` text NOT NULL,
	`date` text NOT NULL,
	`test` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL
);
