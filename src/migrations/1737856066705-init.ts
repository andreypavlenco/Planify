import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737856066705 implements MigrationInterface {
  name = 'Init1737856066705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` enum ('admin', 'manager', 'user') NOT NULL, \`user_id\` int NULL, \`project_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`action_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`action\` varchar(100) NOT NULL, \`changeDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`task_id\` int NOT NULL, \`user_id\` int NULL, \`project_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(50) NOT NULL, \`lastName\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshToken\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_c322cd2084cd4b1b2813a90032\` (\`firstName\`, \`lastName\`), INDEX \`IDX_f0e1b4ecdca13b177e2e3a0613\` (\`lastName\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`status\` enum ('active', 'completed', 'archived') NOT NULL DEFAULT 'active', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_d0bcd5d2244946aec2ee031a5d\` (\`name\`, \`status\`), UNIQUE INDEX \`IDX_dedfea394088ed136ddadeee89\` (\`name\`), INDEX \`IDX_57856cedbec1fbed761154d162\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` enum ('To Do', 'In Progress', 'Done') NOT NULL DEFAULT 'To Do', \`deadline\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`description\` text NULL, \`projectId\` int NULL, \`ownerId\` int NOT NULL, \`assigneeId\` int NULL, INDEX \`IDX_c73abe66aa0a1111a7feb2742a\` (\`projectId\`, \`ownerId\`, \`assigneeId\`, \`status\`), INDEX \`IDX_d6ce64ab404f3d213339b1d38c\` (\`deadline\`), INDEX \`IDX_2fe7a278e6f08d2be55740a939\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_users_user\` (\`projectId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_9666c6dcd769c698bed4aa4bf5\` (\`projectId\`), INDEX \`IDX_f8300efd87679e1e21532be980\` (\`userId\`), PRIMARY KEY (\`projectId\`, \`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` ADD CONSTRAINT \`FK_e3583d40265174efd29754a7c57\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` ADD CONSTRAINT \`FK_f477395106b4790e7ed11a98c18\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_history\` ADD CONSTRAINT \`FK_012f97fb80dc39f959f83f75d6c\` FOREIGN KEY (\`task_id\`) REFERENCES \`task\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_history\` ADD CONSTRAINT \`FK_0270864de454a063d4acddcecbd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_history\` ADD CONSTRAINT \`FK_c848732edf2794de07f8cf00f86\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD CONSTRAINT \`FK_3797a20ef5553ae87af126bc2fe\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD CONSTRAINT \`FK_a132ba8200c3abdc271d4a701d8\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD CONSTRAINT \`FK_7384988f7eeb777e44802a0baca\` FOREIGN KEY (\`assigneeId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` ADD CONSTRAINT \`FK_9666c6dcd769c698bed4aa4bf55\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` ADD CONSTRAINT \`FK_f8300efd87679e1e21532be9808\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE \`query-result-cache\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NULL, \`time\` bigint NOT NULL, \`duration\` int NOT NULL, \`query\` text NOT NULL, \`result\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`query-result-cache\``);
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_f8300efd87679e1e21532be9808\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_9666c6dcd769c698bed4aa4bf55\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_7384988f7eeb777e44802a0baca\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_a132ba8200c3abdc271d4a701d8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_3797a20ef5553ae87af126bc2fe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_history\` DROP FOREIGN KEY \`FK_c848732edf2794de07f8cf00f86\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_history\` DROP FOREIGN KEY \`FK_0270864de454a063d4acddcecbd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_history\` DROP FOREIGN KEY \`FK_012f97fb80dc39f959f83f75d6c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_f477395106b4790e7ed11a98c18\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_e3583d40265174efd29754a7c57\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f8300efd87679e1e21532be980\` ON \`project_users_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9666c6dcd769c698bed4aa4bf5\` ON \`project_users_user\``,
    );
    await queryRunner.query(`DROP TABLE \`project_users_user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2fe7a278e6f08d2be55740a939\` ON \`task\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d6ce64ab404f3d213339b1d38c\` ON \`task\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c73abe66aa0a1111a7feb2742a\` ON \`task\``,
    );
    await queryRunner.query(`DROP TABLE \`task\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_57856cedbec1fbed761154d162\` ON \`project\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_dedfea394088ed136ddadeee89\` ON \`project\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d0bcd5d2244946aec2ee031a5d\` ON \`project\``,
    );
    await queryRunner.query(`DROP TABLE \`project\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f0e1b4ecdca13b177e2e3a0613\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c322cd2084cd4b1b2813a90032\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`action_history\``);
    await queryRunner.query(`DROP TABLE \`role\``);
  }
}
