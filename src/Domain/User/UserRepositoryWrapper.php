<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\Exception\Maker\MakerByEmailNotFoundException;
use App\Domain\Exception\Maker\MakerByPasswordResetTokenNotFoundException;
use App\Domain\Exception\NotFoundException;
use App\Domain\Exception\Requester\RequesterByEmailNotFoundException;
use App\Domain\Exception\Requester\RequesterByPasswordResetTokenNotFoundException;
use App\Domain\Exception\User\UserByEmailNotFoundException;
use App\Domain\Exception\User\UserByPasswordResetTokenNotFoundException;
use App\Domain\User\Entity\Maker;
use App\Domain\User\Entity\Requester;
use App\Domain\User\Entity\User;
use App\Domain\User\Repository\MakerRepository;
use App\Domain\User\Repository\RequesterRepository;
use App\Domain\User\Repository\UserRepository;
use Ramsey\Uuid\UuidInterface;

class UserRepositoryWrapper
{
    private UserRepository $userRepository;

    private MakerRepository $makerRepository;

    private RequesterRepository $requesterRepository;

    public function __construct(
        UserRepository $userRepository,
        MakerRepository $makerRepository,
        RequesterRepository $requesterRepository
    ) {
        $this->userRepository = $userRepository;
        $this->makerRepository = $makerRepository;
        $this->requesterRepository = $requesterRepository;
    }

    public function findByEmail(string $email): UserInterface
    {
        /* @var UserInterface|null $user */
        try {
            return $this->makerRepository->findOneByEmail($email);
        } catch (MakerByEmailNotFoundException $exception) {
        }

        try {
            return $this->userRepository->findOneByEmail($email);
        } catch (UserByEmailNotFoundException $exception) {
        }

        try {
            return $this->requesterRepository->findOneByEmail($email);
        } catch (RequesterByEmailNotFoundException $exception) {
        }

        throw new NotFoundException(sprintf('User with email [%s] not found', $email));
    }

    public function findByPasswordResetToken(string $token): UserInterface
    {
        /* @var UserInterface|null $user */
        try {
            return $this->makerRepository->findOneByPasswordResetToken($token);
        } catch (MakerByPasswordResetTokenNotFoundException $exception) {
        }

        try {
            return $this->userRepository->findOneByPasswordResetToken($token);
        } catch (UserByPasswordResetTokenNotFoundException $exception) {
        }

        try {
            return $this->requesterRepository->findOneByPasswordResetToken($token);
        } catch (RequesterByPasswordResetTokenNotFoundException $exception) {
        }
        throw new NotFoundException(sprintf('User with token [%s] not found', $token));
    }

    public function find(UuidInterface $uuid): UserInterface
    {
        try {
            return $this->makerRepository->find($uuid);
        } catch (NotFoundException $exception) {
        }

        try {
            return $this->requesterRepository->find($uuid);
        } catch (NotFoundException $exception) {
        }

        try {
            return $this->userRepository->find($uuid);
        } catch (NotFoundException $exception) {
        }

        throw new NotFoundException(sprintf('User with id [%s] not found', $uuid->toString()));
    }

    public function save(UserInterface $user): void
    {
        if ($user instanceof User) {
            $this->userRepository->save($user);

            return;
        }

        if ($user instanceof Maker) {
            $this->makerRepository->save($user);

            return;
        }

        if ($user instanceof Requester) {
            $this->requesterRepository->save($user);

            return;
        }

        throw new \RuntimeException(sprintf('Unknown UserInterface [%s]', \get_class($user)));
    }
}
