<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\ValidationError;

use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationInterface;

class ErrorResponse
{

    public static function createFromConstraintViolation(ConstraintViolationInterface $constraintViolation) : ErrorResponse {

    }

}
