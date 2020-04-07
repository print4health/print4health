<?php

declare(strict_types=1);

namespace App\Domain;

use function sprintf;

class DateHelperException extends DomainException
{
    public function __construct(string $format, string $dateString)
    {
        parent::__construct(
            sprintf(
                'Could not create DateTimeImmutable from format %s by string %s',
                $format,
                $dateString
            )
        );
    }
}
