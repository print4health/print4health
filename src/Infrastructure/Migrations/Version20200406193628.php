<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200406193628 extends AbstractMigration
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

        $this->updateEnabled('maker');
        $this->updateEnabled('requester');
        $this->updateEnabled('user');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.');
    }

    private function updateEnabled(string $tableName): void
    {
        $qb = $this->connection->createQueryBuilder();
        $statement = $qb->select('m.id')->from($tableName, 'm')->execute();
        $dataSets = $statement->fetchAll();
        foreach ($dataSets as $dataSet) {
            $this->connection->update(
                $tableName,
                ['enabled' => 1],
                ['id' => $dataSet['id']]
            );
        }
    }
}
