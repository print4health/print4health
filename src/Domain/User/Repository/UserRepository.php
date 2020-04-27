<?php

declare(strict_types=1);

namespace App\Domain\User\Repository;

use App\Domain\Exception\User\UserByEmailNotFoundException;
use App\Domain\Exception\User\UserByIdNotFoundException;
use App\Domain\Exception\User\UserByPasswordResetTokenNotFoundException;
use App\Domain\User\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Ramsey\Uuid\UuidInterface;
use RuntimeException;

class UserRepository
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    public function save(User $user): void
    {
        $user->updateUpdatedDate();
        $this->getManager()->persist($user);
        $this->getManager()->flush();
    }

    public function find(UuidInterface $id): User
    {
        /** @var User|null $user */
        $user = $this->getRepository()->find($id);

        if ($user instanceof User === false) {
            throw new UserByIdNotFoundException($id);
        }

        return $user;
    }

    public function findOneByEmail(string $email): User
    {
        /** @var User|null $user */
        $user = $this->getRepository()->findOneBy(['email' => $email]);

        if ($user instanceof User === false) {
            throw new UserByEmailNotFoundException($email);
        }

        return $user;
    }

    public function findOneByPasswordResetToken(string $passwordResetToken): User
    {
        /** @var User|null $user */
        $user = $this->getRepository()->findOneBy(['passwordResetToken' => $passwordResetToken]);

        if ($user instanceof User === false) {
            throw new UserByPasswordResetTokenNotFoundException($passwordResetToken);
        }

        return $user;
    }

    private function getManager(): EntityManager
    {
        $manager = $this->registry->getManagerForClass(User::class);

        if (!$manager instanceof EntityManager) {
            throw new RuntimeException();
        }

        return $manager;
    }

    private function getRepository(): EntityRepository
    {
        $repository = $this->registry->getRepository(User::class);

        if (!$repository instanceof EntityRepository) {
            throw new RuntimeException();
        }

        return $repository;
    }
}
