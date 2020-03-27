<?php

declare(strict_types=1);

namespace App\Infrastructure\Listener;

use App\Infrastructure\Collector\ExceptionCollector;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

final class ExceptionCollectorListener
{
    /**
     * @var ExceptionCollector
     */
    private $collector;

    public function __construct(ExceptionCollector $collector)
    {
        $this->collector = $collector;
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $this->collector->collect($event->getThrowable());
    }
}
