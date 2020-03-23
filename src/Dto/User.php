<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\User\UserInterface;
use Doctrine\ORM\EntityNotFoundException;
use Swagger\Annotations as SWG;

class User
{
    /** @SWG\Property(type="string") */
    public string $id;
    /** @SWG\Property(type="string") */
    public string $email;
    /**
     * @var string[]
     * @SWG\Property(type="array")
     */
    public array $roles;

    public static function createFromUser(?UserInterface $user): self
    {
        if (!$user instanceof UserInterface) {
            throw new EntityNotFoundException('User is empty');
        }

        $self = new self();

        $self->id = $user->getId();
        $self->email = $user->getEmail();
        $self->roles = $user->getRoles();

        return $self;
    }
}
