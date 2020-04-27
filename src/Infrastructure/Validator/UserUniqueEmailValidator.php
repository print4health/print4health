<?php

declare(strict_types=1);

namespace App\Infrastructure\Validator;

use App\Domain\Exception\NotFoundException;
use App\Domain\User\UserInterfaceRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class UserUniqueEmailValidator extends ConstraintValidator
{
    private UserInterfaceRepository $userRepositoryWrapper;

    public function __construct(UserInterfaceRepository $userRepositoryWrapper)
    {
        $this->userRepositoryWrapper = $userRepositoryWrapper;
    }

    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof UserUniqueEmail) {
            throw new UnexpectedTypeException($constraint, UserUniqueEmail::class);
        }

        if ($value === null || $value === '') {
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
