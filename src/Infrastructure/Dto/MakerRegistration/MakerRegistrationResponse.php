<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\MakerRegistration;

use App\Domain\User\Entity\Maker;
use Swagger\Annotations as SWG;

class MakerRegistrationResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(type="string") */
    public string $email;

    public static function createFromMaker(Maker $maker): self
    {
        $self = new self();
        $self->id = $maker->getId();
        $self->email = $maker->getEmail();

        return $self;
    }
}
