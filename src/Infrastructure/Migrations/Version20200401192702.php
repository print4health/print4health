<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Statement;
use Doctrine\Migrations\AbstractMigration;
use Ramsey\Uuid\Uuid;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200401192702 extends AbstractMigration
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
        /** @var Statement $statement */
        $statement = $qb->select('t.id')->from($tableName, 't')->execute();
        $dataSets = $statement->fetchAll();
        foreach ($dataSets as $dataSet) {
            $date = new \DateTimeImmutable();
            $this->connection->update(
                $tableName,
                [
                    'created_date' => $date->format('Y-m-d H:i:s'),
                    'updated_date' => $date->format('Y-m-d H:i:s'),
                ],
                ['id' => $dataSet['id']]
            );
        }
    }
}
