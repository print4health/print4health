<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\RequesterRegistration;

use App\Domain\User\Entity\Requester;
use Swagger\Annotations as SWG;

class RequesterRegistrationResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(type="string") */
    public string $email;

    public static function createFromRequester(Requester $requester): self
    {
        $self = new self();
        $self->id = $requester->getId();
        $self->email = $requester->getEmail();

        return $self;
    }
}
