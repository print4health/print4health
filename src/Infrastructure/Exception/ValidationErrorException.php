<?php

declare(strict_types=1);

namespace App\Infrastructure\Exception;

use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Throwable;

class ValidationErrorException extends \RuntimeException
{

    private string $type;

    private ConstraintViolationListInterface $errors;

    public function __construct(
        ConstraintViolationListInterface $errors,
        $type = '',
        $message = 'Data is invalid',
        $code = 0,
        Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->errors = $errors;
        $this->type = $type;
    }

    public function getErrors(): ConstraintViolationListInterface
    {
        return $this->errors;
    }

    public function getType(): string
    {
        return $this->type;
    }
}
