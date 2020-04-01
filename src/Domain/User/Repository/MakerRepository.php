<?php

declare(strict_types=1);

namespace App\Domain\User\Repository;

use App\Domain\Exception\Maker\MakerByEmailNotFoundException;
use App\Domain\Exception\Maker\MakerByPasswordResetTokenNotFoundException;
use App\Domain\Exception\Maker\MakerNotFoundException;
use App\Domain\User\Entity\Maker;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Ramsey\Uuid\UuidInterface;
use RuntimeException;

class MakerRepository
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    public function find(UuidInterface $id): Maker
    {
        $maker = $this->getRepository()->find($id);

        if (!$maker instanceof Maker) {
            throw new MakerNotFoundException($id);
        }

        return $maker;
    }

    public function findOneByEmail(string $email): Maker
    {
        $maker = $this->getRepository()->findOneBy(['email' => $email]);

        if (!$maker instanceof Maker) {
            throw new MakerByEmailNotFoundException($email);
        }

        return $maker;
    }

    public function findOneByPasswordResetToken(string $passwordResetToken): Maker
    {
        $user = $this->getRepository()->findOneBy(['passwordResetToken' => $passwordResetToken]);

        if (!$user instanceof Maker) {
            throw new MakerByPasswordResetTokenNotFoundException($passwordResetToken);
        }

        return $user;
    }

    /**
     * @return array|Maker[]
     */
    public function findAll()
    {
        return $this->getRepository()->findAll();
    }

    public function save(Maker $maker): void
    {
        $this->getManager()->persist($maker);
        $this->getManager()->flush();
    }

    private function getManager(): EntityManager
    {
        $manager = $this->registry->getManagerForClass(Maker::class);

        if (!$manager instanceof EntityManager) {
            throw new RuntimeException();
        }

        return $manager;
    }

    private function getRepository(): EntityRepository
    {
        $repository = $this->registry->getRepository(Maker::class);

        if (!$repository instanceof EntityRepository) {
            throw new RuntimeException();
        }

        return $repository;
    }
}
