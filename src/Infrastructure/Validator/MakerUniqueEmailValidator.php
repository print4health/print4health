<?php

declare(strict_types=1);

namespace App\Infrastructure\Validator;

use App\Domain\Exception\Maker\MakerByEmailNotFoundException;
use App\Domain\User\Repository\MakerRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class MakerUniqueEmailValidator extends ConstraintValidator
{
    private MakerRepository $makerRepository;

    public function __construct(MakerRepository $userRepository)
    {
        $this->makerRepository = $userRepository;
    }

    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof MakerUniqueEmail) {
            throw new UnexpectedTypeException($constraint, MakerUniqueEmail::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        try {
            $this->makerRepository->findOneByEmail($value);
        } catch (MakerByEmailNotFoundException $exception) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->setParameter('{{ email }}', $value)
            ->addViolation()
        ;
    }
}
