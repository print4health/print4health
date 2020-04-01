<?php

declare(strict_types=1);

namespace App\Domain;

use DateTimeImmutable;

/**
 * Use this everywhere to initiate DateTimeImmutable objects. This helps to mock it later in tests with ClockMock.
 */
class DateHelper
{
    private static int $counter = 0;
    private static bool $dummy = false;

    public static function create(): DateTimeImmutable
    {
        if (true === self::$dummy) {
            return self::createByFormatAndDate('U', (string) (time() + self::$counter++));
        }

        return self::createByFormatAndDate('U', (string) time());
    }

    public static function parseDateStringToDateTimeImmutable(string $dateString): DateTimeImmutable
    {
        return self::createByFormatAndDate('Y-m-d', $dateString);
    }

    private static function createByFormatAndDate(string $format, string $timestamp): DateTimeImmutable
    {
        $date = DateTimeImmutable::createFromFormat($format, $timestamp);

        if (false === $date) {
            throw new DateHelperException($format, $timestamp);
        }

        return $date;
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
