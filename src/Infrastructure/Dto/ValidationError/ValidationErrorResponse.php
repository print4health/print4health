<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\ValidationError;

use App\Infrastructure\Exception\ValidationErrorException;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class ValidationErrorResponse
{
    public string $type;

    public string $message;

    /**
     * @var ErrorResponse[]
     */
    public array $errors;

    public static function createFromValidationErrorException(
        ValidationErrorException $exception
    ): ValidationErrorResponse {
        $self = new self();
        $self->type =
        $self->message = $exception->getMessage();
        foreach ($exception->getErrors() as $error) {
            /** @var $error ConstraintViolationInterface */
            $self->errors[] = ErrorResponse::createFromConstraintViolation($error);
        }

        return $self;
    }
}
