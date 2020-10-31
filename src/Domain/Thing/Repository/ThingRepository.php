<?php

declare(strict_types=1);

namespace App\Domain\Thing\Repository;

use App\Domain\Exception\Thing\ThingNotFoundException;
use App\Domain\Thing\Entity\Thing;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Ramsey\Uuid\UuidInterface;
use RuntimeException;

class ThingRepository
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    /**
     * @return array<Thing>
     */
    public function searchByNameAndDescription(string $searchstring): array
    {
        $builder = $this->getRepository()->createQueryBuilder('th');
        $builder->where('th.name LIKE :searchstring');
        $builder->orWhere('th.description LIKE :searchstring');
        $builder->setParameter('searchstring', '%' . $searchstring . '%');

        return $builder->getQuery()->getResult();
    }

    public function find(UuidInterface $id): Thing
    {
        $maker = $this->getRepository()->find($id);

        if (!$maker instanceof Thing) {
            throw new ThingNotFoundException($id->toString());
        }

        return $maker;
    }

    /**
     * @return array|Thing[]
     */
    public function findAll()
    {
        return $this->getRepository()->findAll();
    }

    public function save(Thing $thing): void
    {
        $thing->updateUpdatedDate();
        $this->getManager()->persist($thing);
        $this->getManager()->flush();
    }

    private function getManager(): EntityManager
    {
        $manager = $this->registry->getManagerForClass(Thing::class);

        if (!$manager instanceof EntityManager) {
            throw new RuntimeException();
        }

        return $manager;
    }

    private function getRepository(): EntityRepository
    {
        $repository = $this->registry->getRepository(Thing::class);

        if (!$repository instanceof EntityRepository) {
            throw new RuntimeException();
        }

        return $repository;
    }
}
