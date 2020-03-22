<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200322005949 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE image (id CHAR(36) NOT NULL COMMENT \'(DC2Type:guid)\', filename VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE thing ADD image_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:guid)\', ADD file_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE thing ADD CONSTRAINT FK_5B4C2C833DA5256D FOREIGN KEY (image_id) REFERENCES image (id)');
        $this->addSql('CREATE INDEX IDX_5B4C2C833DA5256D ON thing (image_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE thing DROP FOREIGN KEY FK_5B4C2C833DA5256D');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP INDEX IDX_5B4C2C833DA5256D ON thing');
        $this->addSql('ALTER TABLE thing DROP image_id, DROP file_url');
    }
}
