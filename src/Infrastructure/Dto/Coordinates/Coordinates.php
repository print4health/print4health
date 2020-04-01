<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Coordinates;

class Coordinates
{
    /**
     * @var float
     */
    private $latitude;

    /**
     * @var float
     */
    private $longitude;

    /**
     * @param float $latitude
     * @param float $longitude
     */
    public function __construct($latitude, $longitude)
    {
        $latitude = (float) $latitude;
        $longitude = (float) $longitude;

        $this->validateLat($latitude);
        $this->validateLng($longitude);

        $this->latitude = $latitude;
        $this->longitude = $longitude;
    }

    /**
     * Returns the latitude.
     */
    public function getLatitude(): float
    {
        return $this->latitude;
    }

    /**
     * Returns the longitude.
     */
    public function getLongitude(): float
    {
        return $this->longitude;
    }

    /**
     * @throws \Exception
     */
    private function validateLat(float $value): void
    {
        if ($value < -90 || $value > 90) {
            throw new \Exception(sprintf('Latitude should be between -90 and 90. Got: %s', $value));
        }
    }

    /**
     * @throws \Exception
     */
    private function validateLng(float $value): void
    {
        if ($value < -180 || $value > 180) {
            throw new \Exception(sprintf('Longitude should be between -180 and 180. Got: %s', $value));
        }
    }
}
