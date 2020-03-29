<?php

declare(strict_types=1);

namespace App\Domain\User;

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
        /** @var UserInterface|null $user */
        $user = $this->makerRepository->findOneByEmail($email);

        if ($user instanceof UserInterface) {
            return $user;
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
}
