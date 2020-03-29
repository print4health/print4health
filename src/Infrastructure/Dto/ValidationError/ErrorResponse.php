<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\ValidationError;

use Swagger\Annotations as SWG;
use Symfony\Component\Validator\ConstraintViolationInterface;

class ErrorResponse
{
    /**
     * @var mixed
     * @SWG\Property(type="string")
     */
    public $message;

    /**
     * @SWG\Property(type="string")
     */
    public string $propertyPath;

    /**
     * @var mixed
     * @SWG\Property(type="string")
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
