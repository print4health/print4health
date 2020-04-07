<?php

declare(strict_types=1);

namespace App\Domain\User\Repository;

use App\Domain\Exception\Requester\RequesterByEmailNotFoundException;
use App\Domain\Exception\Requester\RequesterByIdNotFoundException;
use App\Domain\Exception\Requester\RequesterByPasswordResetTokenNotFoundException;
use App\Domain\User\Entity\Requester;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Ramsey\Uuid\UuidInterface;
use RuntimeException;

class RequesterRepository
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    public function save(Requester $requester): void
    {
        $requester->updateUpdatedDate();
        $this->getManager()->persist($requester);
        $this->getManager()->flush();
    }

    /**
     * @return array|Requester[]
     */
    public function findAll()
    {
        return $this->getRepository()->findAll();
    }

    public function find(UuidInterface $id): Requester
    {
        /** @var Requester|null $requester */
        $requester = $this->getRepository()->find($id);

        if (false === $requester instanceof Requester) {
            throw new RequesterByIdNotFoundException($id);
        }

        return $requester;
    }

    public function findOneByEmail(string $email): Requester
    {
        /** @var Requester|null $requester */
        $requester = $this->getRepository()->findOneBy(['email' => $email]);

        if (!$requester instanceof Requester) {
            throw new RequesterByEmailNotFoundException($email);
        }

        return $requester;
    }

    public function findOneByPasswordResetToken(string $passwordResetToken): Requester
    {
        $requester = $this->getRepository()->findOneBy(['passwordResetToken' => $passwordResetToken]);

        if (!$requester instanceof Requester) {
            throw new RequesterByPasswordResetTokenNotFoundException($passwordResetToken);
        }

        return $requester;
    }

    private function getManager(): EntityManager
    {
        $manager = $this->registry->getManagerForClass(Requester::class);

        if (!$manager instanceof EntityManager) {
            throw new RuntimeException();
        }

        return $manager;
    }

    private function getRepository(): EntityRepository
    {
        $repository = $this->registry->getRepository(Requester::class);

        if (!$repository instanceof EntityRepository) {
            throw new RuntimeException();
        }

        return $repository;
    }
}
