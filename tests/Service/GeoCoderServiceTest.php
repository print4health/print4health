<?php

declare(strict_types=1);

namespace App\Tests\Service;

use App\Infrastructure\Dto\Coordinates\CoordinatesRequest;
use App\Infrastructure\Services\GeoCoder;

class GeoCoderServiceTest extends AbstractServiceTest
{
    private array $testPairs = [
        [['2671MH', 'NL'], [51.9905014, 4.206367999999999]],
        [['01210', 'FR'], [46.2824228, 6.0851112]],
    ];

    public function testGeoCodeToCoords(): void
    {
        $this->markTestSkipped('test geocoder without sharing google maps api key');
        $geoCoder = new GeoCoder();

        foreach ($this->testPairs as $pair) {
            $coords = $geoCoder->geoEncodeByPostalCodeAndCountry($pair[0][0], $pair[0][1]);

            $this->assertTrue($coords instanceof CoordinatesRequest);
            $this->assertEquals($pair[1][0], $coords->getLatitude());
            $this->assertEquals($pair[1][1], $coords->getLongitude());
        }
    }
}
