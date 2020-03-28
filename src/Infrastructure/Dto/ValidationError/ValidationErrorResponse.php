<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\ValidationError;

use App\Infrastructure\Exception\ValidationErrorException;
use Swagger\Annotations as SWG;

class ValidationErrorResponse
{
    /** @SWG\Property(type="string") */
    public string $type;

    /** @SWG\Property(type="string") */
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
