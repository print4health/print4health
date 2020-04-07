<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Statement;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200406193627 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE maker ADD enabled TINYINT(1) NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE requester ADD enabled TINYINT(1) NOT NULL DEFAULT 0, ADD contact_info LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD enabled TINYINT(1) NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE maker DROP enabled');
        $this->addSql('ALTER TABLE requester DROP enabled, DROP contact_info');
        $this->addSql('ALTER TABLE user DROP enabled');
    }
}
