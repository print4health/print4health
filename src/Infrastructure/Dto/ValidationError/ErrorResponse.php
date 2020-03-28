<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\ValidationError;

use Symfony\Component\Validator\ConstraintViolationInterface;

class ErrorResponse
{
    /**
     * @var mixed
     */
    public $message;

    public string $propertyPath;

    /**
     * @var mixed
     */
    public $invalidValue;

    public static function createFromConstraintViolation(ConstraintViolationInterface $constraintViolation): self
    {
        $self = new self();
        $self->message = $constraintViolation->getMessage();
        $self->propertyPath = $constraintViolation->getPropertyPath();
        $self->invalidValue = $constraintViolation->getInvalidValue();

        return $self;
    }
}
