<?php

declare(strict_types=1);

namespace DataProvider\Faker\Provider;

use Faker\Provider\Base as BaseProvider;

class CountryCodeProvider extends BaseProvider
{
    private const COUNTRY_CODES = ['DE', 'FR', 'ES', 'GB', 'IT', 'US', 'CH', 'AT', 'PL', 'DK', 'NL', 'PO'];

    /**
     * @return string[]
     */
    public static function getCountryCodes(): array
    {
        return self::COUNTRY_CODES;
    }

    public static function randomCountryCode(): string
    {
        return self::randomElement(self::getCountryCodes());
    }
}
