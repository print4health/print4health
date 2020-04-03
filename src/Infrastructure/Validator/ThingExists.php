<?php

declare(strict_types=1);

namespace App\Infrastructure\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class ThingExists extends Constraint
{
    public string $message = 'Es gibt kein Teil mit dieser ID';
}
