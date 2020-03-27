<?php

declare(strict_types=1);

namespace App\Domain;

use const STR_PAD_LEFT;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use function sprintf;
use function str_pad;

class UuidGenerator
{
    private static int $counter = 0;
    private static bool $dummy = false;

    public static function generate(): UuidInterface
    {
        if (!self::$dummy) {
            return Uuid::uuid4();
        }

        self::$counter++;

        return Uuid::fromString(sprintf(
            '10000000-0000-0000-0000-%s',
            str_pad((string)self::$counter, 12, '0', STR_PAD_LEFT)
        ));
    }

    public static function dummy(): void
    {
        self::$dummy = true;
        self::$counter = 0;
    }

    public static function deactivateDummy(): void
    {
        self::$dummy = false;
    }
}
