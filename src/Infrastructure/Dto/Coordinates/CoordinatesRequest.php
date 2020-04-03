<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Coordinates;

use App\Infrastructure\Exception\Coordinates\CoordinatesRequestException;

class CoordinatesRequest
{
    private float $latitude;
    private float $longitude;

    public function __construct(float $latitude, float $longitude)
    {
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
     * @throws CoordinatesRequestException
     */
    private function validateLat(float $value): void
    {
        if ($value < -90 || $value > 90) {
            throw new CoordinatesRequestException(sprintf('Latitude should be between -90 and 90. Got: %s', $value));
        }
    }

    /**
     * @throws CoordinatesRequestException
     */
    private function validateLng(float $value): void
    {
        if ($value < -180 || $value > 180) {
            throw new CoordinatesRequestException(sprintf('Longitude should be between -180 and 180. Got: %s', $value));
        }
    }
}
