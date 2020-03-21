<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Commitment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Commitment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Commitment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Commitment[]    findAll()
 * @method Commitment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommitmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Commitment::class);
    }

    // /**
    //  * @return Commitment[] Returns an array of Commitment objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Commitment
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
