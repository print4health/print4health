<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\User;

use App\Domain\User\UserInterface;
use Swagger\Annotations as SWG;

class UserResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(type="string") */
    public string $email;
    /**
     * @var string[]
     * @SWG\Property(type="array", @SWG\Items(type="string")))
     */
    public array $roles;

    public static function createFromUser(UserInterface $user): self
    {
        $self = new self();

        $self->id = $user->getId();
        $self->email = $user->getEmail();
        $self->roles = $user->getRoles();

        return $self;
    }
}
