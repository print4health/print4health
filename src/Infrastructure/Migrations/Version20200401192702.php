<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Ramsey\Uuid\Uuid;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200401192701 extends AbstractMigration
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

        $this->updateTimestamps('`order`');
        $this->updateTimestamps('maker');
        $this->updateTimestamps('requester');
        $this->updateTimestamps('user');
        $this->updateTimestamps('maker');
        $this->updateTimestamps('thing');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.');
    }

    private function updateTimestamps(string $tableName)
    {
        $qb = $this->connection->createQueryBuilder();
        $statement = $qb->select('t.id')->from($tableName, 't')->execute();
        $dataSets = $statement->fetchAll();
        foreach ($dataSets as $dataSet) {
            $uuid = Uuid::fromString($dataSet['id']);
            $this->connection->update(
                $tableName,
                [
                    'created_date' => $uuid->getDateTime()->format('Y-m-d H:i:s'),
                    'updated_date' => $uuid->getDateTime()->format('Y-m-d H:i:s'),
                ],
                ['id' => $dataSet['id']]
            );
        }
    }
}
