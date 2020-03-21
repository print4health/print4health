<?php

declare(strict_types=1);

namespace App\Dto;

use Doctrine\ORM\EntityNotFoundException;

class User
{
    public string $id;
    public string $username;

    public static function createFromUser(?\App\Entity\User $user): self
    {
        if (!$user instanceof \App\Entity\User) {
            throw new EntityNotFoundException('User is empty');
        }

        $self = new self();

        $self->id = $user->getId();
        $self->username = $user->getUsername();

        return $self;
    }
}
