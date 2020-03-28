<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\ValidationError;

use App\Infrastructure\Exception\ValidationErrorException;

class ValidationErrorResponse
{
    public string $type;

    public string $message;

    /**
     * @var ErrorResponse[]
     */
    public array $errors;

    public static function createFromValidationErrorException(ValidationErrorException $exception): self
    {
        $self = new self();
        $self->type = $exception->getType();
        $self->message = $exception->getMessage();

        foreach ($exception->getErrors() as $error) {
            $self->errors[] = ErrorResponse::createFromConstraintViolation($error);
        }

        return $self;
    }
}
