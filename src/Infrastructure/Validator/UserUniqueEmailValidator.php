<?php

declare(strict_types=1);

namespace App\Infrastructure\Validator;

use App\Domain\Exception\NotFoundException;
use App\Domain\User\UserRepositoryWrapper;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class UserUniqueEmailValidator extends ConstraintValidator
{
    private UserRepositoryWrapper $userRepositoryWrapper;

    public function __construct(UserRepositoryWrapper $userRepositoryWrapper)
    {
        $this->userRepositoryWrapper = $userRepositoryWrapper;
    }

    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof UserUniqueEmail) {
            throw new UnexpectedTypeException($constraint, UserUniqueEmail::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        try {
            $this->userRepositoryWrapper->findByEmail($value);
        } catch (NotFoundException $exception) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->setParameter('{{ email }}', $value)
            ->addViolation()
        ;
    }
}
