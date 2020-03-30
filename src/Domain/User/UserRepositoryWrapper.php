<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\Exception\Maker\MakerByEmailNotFoundException;
use App\Domain\Exception\Maker\MakerByPasswordResetTokenNotFoundException;
use App\Domain\User\Entity\Maker;
use App\Domain\User\Entity\Requester;
use App\Domain\User\Entity\User;
use App\Domain\User\Repository\MakerRepository;
use App\Domain\User\Repository\RequesterRepository;
use App\Domain\User\Repository\UserRepository;

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

        $user = $this->userRepository->findOneByEmail($email);
        if ($user instanceof UserInterface) {
            return $user;
        }

        $user = $this->requesterRepository->findOneByEmail($email);
        if ($user instanceof UserInterface) {
            return $user;
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

        $user = $this->userRepository->findOneByPasswordResetToken($token);
        if ($user instanceof UserInterface) {
            return $user;
        }

        $user = $this->requesterRepository->findOneByPasswordResetToken($token);
        if ($user instanceof UserInterface) {
            return $user;
        }
        throw new NotFoundException(sprintf('User with token [%s] not found', $token));
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
        }
    }
}
