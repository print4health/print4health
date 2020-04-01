<?php

declare(strict_types=1);

namespace App\Tests\Service;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

abstract class AbstractServiceTest extends KernelTestCase
{
    protected $container;

    public function setUp(): void
    {
        $kernel = self::bootKernel();
        $kernel->boot();

        $this->container = $kernel->getContainer();
    }
}
