<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200326113917 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE commitment ADD maker_id CHAR(36) NOT NULL COMMENT \'(DC2Type:guid)\'');
        $this->addSql('ALTER TABLE commitment ADD CONSTRAINT FK_F3E0CCBB68DA5EC3 FOREIGN KEY (maker_id) REFERENCES maker (id)');
        $this->addSql('CREATE INDEX IDX_F3E0CCBB68DA5EC3 ON commitment (maker_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE commitment DROP FOREIGN KEY FK_F3E0CCBB68DA5EC3');
        $this->addSql('DROP INDEX IDX_F3E0CCBB68DA5EC3 ON commitment');
        $this->addSql('ALTER TABLE commitment DROP maker_id');
    }
}
