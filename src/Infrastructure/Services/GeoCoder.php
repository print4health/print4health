<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use App\Infrastructure\Dto\Coordinates\CoordinatesRequest;
use App\Infrastructure\Exception\GeoEncoding\CoordinatesRequestException;
use App\Infrastructure\Exception\GeoEncoding\RateLimitExceededException;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class GeoCoder
{
    public const DAILY_LIMIT_KEY = 'DAILY_LIMIT';
    public const GEO_KEY = 'GEO';

    private string $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

    private string $googleKey;

    private int $googleApiDailyLimit;

    private CacheInterface $geoRequestCache;

    private FilesystemAdapter $dailyLimitCache;

    public function __construct(
        string $googleApiKey,
        int $googleApiDailyLimit,
        CacheInterface $geoRequestCache
    ) {
        $this->googleKey = $googleApiKey;
        $this->googleApiDailyLimit = $googleApiDailyLimit;
        $this->geoRequestCache = $geoRequestCache;
        $this->dailyLimitCache = new FilesystemAdapter('app.cache');
    }

    private function geoEncode(array $queryParams): CoordinatesRequest
    {
        $cacheKey = sprintf('%s-%s', self::GEO_KEY, sha1(json_encode($queryParams, JSON_THROW_ON_ERROR)));
        $value = $this->geoRequestCache->get($cacheKey, function (ItemInterface $item) use ($queryParams) {
            $this->checkDailyLimit();
            $response = $this->executeRequest($queryParams);
            $json = $response->toJson();
            $item->set($json);

            return $json;
        });

        return CoordinatesRequest::fromJson((string) $value);
    }

    private function executeRequest(array $queryParams): CoordinatesRequest
    {
        try {
            $queryParams['query']['key'] = $this->googleKey;
            $client = HttpClient::create(['http_version' => '2.0']);
            $response = $client->request('GET', $this->baseUrl, $queryParams);
            $responseArray = $response->toArray();

            $lat = $responseArray['results'][0]['geometry']['location']['lat'] ?? 0;
            $lng = $responseArray['results'][0]['geometry']['location']['lng'] ?? 0;

            if (0 !== $lat && 0 !== $lng) {
                return new CoordinatesRequest((float) $lat, (float) $lng);
            }

            throw new CoordinatesRequestException(sprintf('Invalid data from Map Request [%s]', json_encode($responseArray, JSON_THROW_ON_ERROR)));
        } catch (CoordinatesRequestException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw new CoordinatesRequestException($exception->getMessage(), (int) $exception->getCode(), $exception);
        }
    }

    private function checkDailyLimit(): void
    {
        /** @var CacheItem $cacheItem */
        $cacheItem = $this->dailyLimitCache->getItem(self::DAILY_LIMIT_KEY);
        $limit = $cacheItem->get();
        if (null === $limit) {
            $cacheItem->set(0);
        } else {
            $cacheItem->set($limit + 1);
        }

        $this->dailyLimitCache->save($cacheItem);

        if ($limit > $this->googleApiDailyLimit) {
            throw new RateLimitExceededException();
        }
    }

    public function geoEncodeByAddressString(string $address): CoordinatesRequest
    {
        $queryParams = [
            'query' => [
                'address' => $address,
            ],
        ];

        return $this->geoEncode($queryParams);
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

        $queryParams = [
            'query' => [
                'address' => sprintf('%s %s', $street, $city),
                'components' => implode('|', $components),
            ],
        ];

        return $this->geoEncode($queryParams);
    }

    public function geoEncodeByPostalCodeAndCountry(
        string $postalCode,
        string $countryCode
    ): CoordinatesRequest {
        $components = [
            'country:' . $countryCode,
            'postal_code:' . $postalCode,
        ];

        $queryParams = [
            'query' => [
                'components' => implode('|', $components),
            ],
        ];

        return $this->geoEncode($queryParams);
    }
}
