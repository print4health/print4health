<?php

declare(strict_types=1);

namespace App\Domain\User\Repository;

use App\Domain\User\Entity\Maker;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Maker|null find($id, $lockMode = null, $lockVersion = null)
 * @method Maker|null findOneBy(array $criteria, array $orderBy = null)
 * @method Maker|null findOneByEmail(string $email)
 * @method Maker|null findOneByPasswordResetToken(string $passwordResetToken)
 * @method Maker[]    findAll()
 * @method Maker[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MakerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Maker::class);
    }
}
