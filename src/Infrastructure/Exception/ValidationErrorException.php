<?php

declare(strict_types=1);

namespace App\Infrastructure\Exception;

use RuntimeException;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use function sprintf;

class ValidationErrorException extends RuntimeException
{
    private ConstraintViolationListInterface $violationList;

    private string $type;

    public function __construct(ConstraintViolationListInterface $violationList, string $type = '')
    {
        $this->violationList = $violationList;
        $this->type = $type;
        $message = trim(sprintf("%s %s violations:\n", $type, $violationList->count()));
        /** @var ConstraintViolationInterface $violation */
        foreach ($violationList as $key => $violation) {
            /** @var string $message */
            $message = $violation->getMessage();
            $message .= sprintf(
                "%s. %s: %s\n",
                $key + 1,
                $violation->getPropertyPath(),
                $message
            );
        }
        parent::__construct($message);
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getErrors(): ConstraintViolationListInterface
    {
        return $this->violationList;
    }
}
