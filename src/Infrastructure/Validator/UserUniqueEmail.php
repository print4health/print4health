<?php

declare(strict_types=1);

namespace App\Infrastructure\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UserUniqueEmail extends Constraint
{
    public string $message = 'Die E-Mail "{{ email }}" ist bereits vergeben.';
}
