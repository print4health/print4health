<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use App\Infrastructure\Dto\Coordinates\Coordinates;
use Symfony\Component\HttpClient\HttpClient;

class GeoCoder
{
    private string $googleKey;
    private string $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

    public function __construct(
        string $googleApiKey
    ) {
        $this->googleKey = $googleApiKey;
    }

    public function geoEncodePostalCountry(
        string $countryCode,
        string $postalCode
    ): Coordinates {
        $components = [
            'country:' . $countryCode,
            'postal_code:' . $postalCode,
        ];

        try {
            $client = HttpClient::create(['http_version' => '2.0']);

            $response = $client->request('GET', $this->baseUrl, [
                'query' => [
                    'components' => implode('|', $components),
                    'key' => $this->googleKey,
                ],
            ]);

            $content = $response->toArray()['results'][0];
            $location = $content['geometry']['location'];

            return new Coordinates($location['lat'], $location['lng']);
        } catch (\Exception $err) {
            throw new \Exception($err->getMessage());
        }
    }
}
