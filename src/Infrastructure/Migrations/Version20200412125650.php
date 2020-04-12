<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Statement;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200412125650 extends AbstractMigration
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

        $this->updateStateNameToShortcut('maker');
        $this->updateStateNameToShortcut('requester');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.');
    }

    private function updateStateNameToShortcut(string $tableName)
    {
        $qb = $this->connection->createQueryBuilder();
        $statement = $qb->select('m.id, m.address_state')->from($tableName, 'm')->execute();
        /** @var Statement $statement */
        $dataSets = $statement->fetchAll();
        foreach ($dataSets as $dataSet) {
            $germany = strtolower(trim($dataSet['address_state']));
            if ($germany === 'deutschland') {
                $this->connection->update(
                    $tableName,
                    ['address_state' => 'DE'],
                    ['id' => $dataSet['id']]
                );
            }
        }
    }
}
