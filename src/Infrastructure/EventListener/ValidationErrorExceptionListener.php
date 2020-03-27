<?php

declare(strict_types=1);

namespace App\Infrastructure\EventListener;

use App\Infrastructure\Exception\ValidationErrorException;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

class ValidationErrorExceptionListener
{

    public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event;
        if ($exception instanceof ValidationErrorException === false) {
            return;
        }


    }

}
