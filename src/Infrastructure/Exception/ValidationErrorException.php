<?php

declare(strict_types=1);

namespace App\Infrastructure\Exception;

use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Throwable;

class ValidationErrorException extends \RuntimeException
{
    /**
     * @var ConstraintViolationListInterface|ConstraintViolationInterface[]
     */
    private ConstraintViolationListInterface $errors;

    private string $type;

    /**
     * ValidationErrorException constructor.
     *
     * @param string    $type
     * @param string    $message
     * @param int       $code
     * @param Throwable $previous
     */
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
