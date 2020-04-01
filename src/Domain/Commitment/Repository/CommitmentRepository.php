<?php

declare(strict_types=1);

namespace App\Domain\Commitment\Repository;

use App\Domain\Commitment\Entity\Commitment;
use App\Domain\User\Entity\Maker;
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
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Commitment::class);
        $this->registry = $registry;
    }

    /**
     * @return Commitment[]
     */
    public function findByMaker(Maker $maker): array
    {
        return $this->findBy(['maker' => $maker->getId()]);
    }
}
