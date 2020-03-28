<?php

declare(strict_types=1);

namespace App\Infrastructure\EventListener;

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

        if (false === $exception instanceof ValidationErrorException) {
            return;
        }

        $output = [
            'message' => $exception->getMessage(),
            'type' => $exception->getType(),
            'errors' => [],
        ];

        dump($exception->getErrors());

        $response = new JsonResponse($output, Response::HTTP_UNPROCESSABLE_ENTITY);

        $event->setResponse($response);
    }
}
