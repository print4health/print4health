<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Thing;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityRepository;

/**
 * @method Thing|null find($id, $lockMode = null, $lockVersion = null)
 * @method Thing|null findOneBy(array $criteria, array $orderBy = null)
 * @method Thing[]    findAll()
 * @method Thing[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ThingRepository extends ServiceEntityRepository
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Thing::class);
        $this->registry = $registry;
    }

    /**
     * @return array<Thing>
     */
    public function searchNameDescription(string $searchstring): array
    {
        $builder = $this->getRepository()->createQueryBuilder('th');
        $builder->where('th.name LIKE :searchstring');
        $builder->orWhere('th.description LIKE :searchstring');
        $builder->setParameter('searchstring', '%' . $searchstring . '%');

        return $builder->getQuery()->getResult();
    }

    private function getRepository(): EntityRepository
    {
        $repository = $this->registry->getRepository(Thing::class);

        if (!$repository instanceof EntityRepository) {
            throw new \RuntimeException();
        }

        return $repository;
    }
}
