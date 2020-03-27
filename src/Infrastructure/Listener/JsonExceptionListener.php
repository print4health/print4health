<?php

declare(strict_types=1);

namespace App\Infrastructure\Listener;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

final class JsonExceptionListener
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var string
     */
    private $environment;

    public function __construct(LoggerInterface $logger, string $environment)
    {
        $this->logger = $logger;
        $this->environment = $environment;
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $response = $this->handleException($event->getThrowable());

        $event->setResponse($response);
    }

    private function handleException(Throwable $exception): Response
    {
        if ($exception instanceof HttpException) {
            return new JsonResponse(
                [
                    'code' => $exception->getStatusCode(),
                    'message' => 'Http error.',
                    'data' => null,
                ],
                $exception->getStatusCode()
            );
        }

        $this->logger->critical('exception', [
            'message' => $exception->getMessage(),
        ]);

        if ('dev' !== $this->environment) {
            return new JsonResponse(
                [
                    'code' => 400,
                    'message' => 'an error occured',
                    'data' => null,
                ],
                400
            );
        }

        return new JsonResponse(
            [
                'code' => 400,
                'message' => $exception->getMessage(),
                'exception' => $this->transformException($exception),
            ],
            500
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function transformException(Throwable $exception): array
    {
        $previousException = $exception->getPrevious();

        return [
            'class' => \get_class($exception),
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTrace(),
            'previous' => $previousException ? $this->transformException($previousException) : null,
        ];
    }
}
