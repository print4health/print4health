<?php declare(strict_types=1);

namespace App\Infrastructure\Collector;

use Throwable;

final class ExceptionCollector
{
    /**
     * @var Throwable[]
     */
    private $exceptions;

    public function __construct()
    {
        $this->exceptions = [];
    }

    public function collect(Throwable $exception): void
    {
        $this->exceptions[] = $exception;
    }

    public function peek(): ?Throwable
    {
        $entries = count($this->exceptions);
        if ($entries === 0) {
            return null;
        }

        return $this->exceptions[$entries - 1];
    }
}
