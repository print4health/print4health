<?php

declare(strict_types=1);

namespace App\Tests\Service;

use App\Infrastructure\Dto\Coordinates\Coordinates;
use App\Infrastructure\Services\GeoCoder;

class GeoCoderServiceTest extends AbstractServiceTest
{
    private array $testPairs = [
        [['NL', '2671MH'], [51.9905014, 4.206367999999999]],
        [['FR', '01210'], [46.2824228, 6.0851112]]
    ];

    public function testGeoCodeToCoords(): void
    {
        $geoCoder = new GeoCoder();

        foreach ($this->testPairs as $pair)
        {
            $coords = $geoCoder->geoEncodePostalCountry($pair[0][0], $pair[0][1]);

            $this->assertTrue($coords instanceof Coordinates);
            $this->assertEquals($pair[1][0], $coords->getLatitude());
            $this->assertEquals($pair[1][1], $coords->getLongitude());
        }
    }
}
