<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\User\Requester;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Requester|null find($id, $lockMode = null, $lockVersion = null)
 * @method Requester|null findOneBy(array $criteria, array $orderBy = null)
 * @method Requester|null findOneByEmail(string $email)
 * @method Requester|null findOneByPasswordResetToken(string $passwordResetToken)
 * @method Requester[]    findAll()
 * @method Requester[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RequesterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Requester::class);
    }
}
