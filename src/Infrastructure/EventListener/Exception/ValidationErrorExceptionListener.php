<?php

declare(strict_types=1);

namespace App\Infrastructure\EventListener\Exception;

use App\Infrastructure\Dto\ValidationError\ValidationErrorResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Throwable;

class ValidationErrorExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        /** @var ValidationErrorException|Throwable $exception */
        $exception = $event->getThrowable();

        if ($exception instanceof ValidationErrorException === false) {
            return;
        }

        $validationErrorResponse = ValidationErrorResponse::createFromValidationErrorException($exception);
        $response = new JsonResponse($validationErrorResponse, Response::HTTP_UNPROCESSABLE_ENTITY);

        $event->setResponse($response);
    }
}
