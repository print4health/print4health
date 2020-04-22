<?php

declare(strict_types=1);

namespace App\Infrastructure\Validator;

use App\Domain\Exception\NotFoundException;
use App\Domain\Thing\Repository\ThingRepository;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class ThingExistsValidator extends ConstraintValidator
{
    private ThingRepository $thingRepository;

    public function __construct(ThingRepository $thingRepository)
    {
        $this->thingRepository = $thingRepository;
    }

    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof ThingExists) {
            throw new UnexpectedTypeException($constraint, ThingExists::class);
        }

        if (false === Uuid::isValid($value)) {
            return;
        }

        try {
            $this->thingRepository->find(Uuid::fromString($value));
        } catch (NotFoundException $exception) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ id }}', $value)
                ->addViolation()
            ;
        }
    }
}
