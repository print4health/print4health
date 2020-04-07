<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use App\Infrastructure\Dto\Coordinates\CoordinatesRequest;
use App\Infrastructure\Exception\Coordinates\CoordinatesRequestException;
use Symfony\Component\HttpClient\HttpClient;

class GeoCoder
{
    private string $googleKey;

    private string $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

    public function __construct(string $googleApiKey)
    {
        $this->googleKey = $googleApiKey;
    }

    public function geoEncodeByAddress(
        string $street,
        string $postalCode,
        string $city,
        string $countryCode
    ): CoordinatesRequest {
        $components = [
            'country:' . $countryCode,
            'postal_code:' . $postalCode,
        ];

        try {
            $client = HttpClient::create(['http_version' => '2.0']);

            $response = $client->request('GET', $this->baseUrl, [
                'query' => [
                    'address' => sprintf('%s %s', $street, $city),
                    'components' => implode('|', $components),
                    'key' => $this->googleKey,
                ],
            ]);

            $responseArray = $response->toArray();

            if (
                \array_key_exists('results', $responseArray) &&
                \array_key_exists(0, $responseArray['results']) &&
                \array_key_exists('geometry', $responseArray['results'][0]) &&
                \array_key_exists('location', $responseArray['results'][0]['geometry']) &&
                \array_key_exists('lat', $responseArray['results'][0]['geometry']['location']) &&
                \array_key_exists('lng', $responseArray['results'][0]['geometry']['location'])
            ) {
                $location = $responseArray['results'][0]['geometry']['location'];

                return new CoordinatesRequest((float) $location['lat'], (float) $location['lng']);
            }

            throw new CoordinatesRequestException(sprintf('Invalid data from Map Request [%s]', json_encode($responseArray, JSON_THROW_ON_ERROR)));
        } catch (CoordinatesRequestException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw new CoordinatesRequestException($exception->getMessage(), (int) $exception->getCode(), $exception);
        }
    }

    public function geoEncodePostalCountry(
        string $countryCode,
        string $postalCode
    ): CoordinatesRequest {
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

            $responseArray = $response->toArray();

            if (
                \array_key_exists('results', $responseArray) &&
                \array_key_exists(0, $responseArray['results']) &&
                \array_key_exists('geometry', $responseArray['results'][0]) &&
                \array_key_exists('location', $responseArray['results'][0]['geometry']) &&
                \array_key_exists('lat', $responseArray['results'][0]['geometry']['location']) &&
                \array_key_exists('lng', $responseArray['results'][0]['geometry']['location'])
            ) {
                $location = $responseArray['results'][0]['geometry']['location'];

                return new CoordinatesRequest((float) $location['lat'], (float) $location['lng']);
            }

            throw new CoordinatesRequestException(sprintf('Invalid data from Map Request [%s]', json_encode($responseArray, JSON_THROW_ON_ERROR)));
        } catch (CoordinatesRequestException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw new CoordinatesRequestException($exception->getMessage(), (int) $exception->getCode(), $exception);
        }
    }
}
