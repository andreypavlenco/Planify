import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737582128343 implements MigrationInterface {
  name = 'Init1737582128343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`status\` enum ('active', 'completed', 'archived') NOT NULL DEFAULT 'active', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_d0bcd5d2244946aec2ee031a5d\` (\`name\`, \`status\`), UNIQUE INDEX \`IDX_dedfea394088ed136ddadeee89\` (\`name\`), INDEX \`IDX_57856cedbec1fbed761154d162\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` enum ('To Do', 'In Progress', 'Done') NOT NULL DEFAULT 'To Do', \`deadline\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`description\` varchar(255) NULL, \`projectId\` int NULL, \`assigneeId\` int NULL, INDEX \`IDX_642459bdc10a7d4ffa960fdc1b\` (\`projectId\`, \`assigneeId\`, \`status\`), INDEX \`IDX_d6ce64ab404f3d213339b1d38c\` (\`deadline\`), INDEX \`IDX_2fe7a278e6f08d2be55740a939\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('admin', 'manager', 'user') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(50) NOT NULL, \`lastName\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_c322cd2084cd4b1b2813a90032\` (\`firstName\`, \`lastName\`), INDEX \`IDX_f0e1b4ecdca13b177e2e3a0613\` (\`lastName\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_users_user\` (\`projectId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_9666c6dcd769c698bed4aa4bf5\` (\`projectId\`), INDEX \`IDX_f8300efd87679e1e21532be980\` (\`userId\`), PRIMARY KEY (\`projectId\`, \`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles_role\` (\`userId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_5f9286e6c25594c6b88c108db7\` (\`userId\`), INDEX \`IDX_4be2f7adf862634f5f803d246b\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD CONSTRAINT \`FK_3797a20ef5553ae87af126bc2fe\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_5f9286e6c25594c6b88c108db77\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_4be2f7adf862634f5f803d246b8\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE \`query-result-cache\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NULL, \`time\` bigint NOT NULL, \`duration\` int NOT NULL, \`query\` text NOT NULL, \`result\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`query-result-cache\``);
    await queryRunner.query(
      `ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_4be2f7adf862634f5f803d246b8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_5f9286e6c25594c6b88c108db77\``,
    );
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
      `ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_3797a20ef5553ae87af126bc2fe\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4be2f7adf862634f5f803d246b\` ON \`user_roles_role\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5f9286e6c25594c6b88c108db7\` ON \`user_roles_role\``,
    );
    await queryRunner.query(`DROP TABLE \`user_roles_role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f8300efd87679e1e21532be980\` ON \`project_users_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9666c6dcd769c698bed4aa4bf5\` ON \`project_users_user\``,
    );
    await queryRunner.query(`DROP TABLE \`project_users_user\``);
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
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2fe7a278e6f08d2be55740a939\` ON \`task\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d6ce64ab404f3d213339b1d38c\` ON \`task\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_642459bdc10a7d4ffa960fdc1b\` ON \`task\``,
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
  }
}
