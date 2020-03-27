<?php declare(strict_types=1);

namespace App\Tests\Integration;

use App\Domain\User\Repository\UserRepository;
use App\Domain\UuidGenerator;
use App\Infrastructure\Collector\ExceptionCollector;
use Spatie\Snapshots\MatchesSnapshots;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\HttpKernel\KernelInterface;

abstract class IntegrationTest extends WebTestCase
{
    use MatchesSnapshots;

    protected static $booted = false;
    /** @var KernelInterface */
    protected static $kernel;
    /** @var KernelBrowser */
    protected static $client;

    protected function setUp(): void
    {
        parent::setUp();

        UuidGenerator::dummy();

        static::$client = static::createClient();
    }

    protected function tearDown(): void
    {
        $em = static::getService('doctrine.orm.default_entity_manager');
        $em->clear();
        $em->getConnection()->close();

        parent::tearDown();

        static::$kernel = null;
        static::$client = null;
    }

    protected function runCommand(string $commandName, array $parameters = []): void
    {
        $baseParameters = [
            '--env' => 'test',
            '--quiet' => null,
            'command' => $commandName,
        ];

        $this->getConsoleApplication(static::$kernel)->run(
            new ArrayInput(array_merge($baseParameters, $parameters)),
            new NullOutput()
        );
    }

    private function getConsoleApplication(KernelInterface $kernel): Application
    {
        $app = new Application($kernel);
        $app->setAutoExit(false);
        $app->setCatchExceptions(false);

        return $app;
    }

    protected static function assertSuccessful(): void
    {
        $response = static::$client->getResponse();

        if (!$response->isSuccessful()) {
            /** @var ExceptionCollector $collector */
            $collector = static::getService(ExceptionCollector::class);
            $exception = $collector->peek();

            if ($exception) {
                throw $exception;
            }
        }

        self::assertTrue($response->isSuccessful(), 'got ' . $response->getStatusCode());
    }

    protected static function assertClientError(int $statusCode = 400): void
    {
        $response = static::$client->getResponse();
        $message = $response->isClientError() ? '' : self::extractMessage();

        self::assertEquals($statusCode, $response->getStatusCode(), $message);
    }

    protected static function assertStatusCode(int $statusCode): void
    {
        $response = static::$client->getResponse();
        $message = $response->isSuccessful() ? '' : self::extractMessage();

        self::assertEquals($statusCode, $response->getStatusCode(), $message);
    }

    protected static function post(string $url, array $data = [])
    {
        static::$client->request('POST', $url, [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($data));

        $response = static::$client->getResponse();

        if (strpos($response->headers->get('Content-Type'), 'application/json') !== false) {
            return json_decode($response->getContent(), true);
        }

        return $response->getContent();
    }

    protected static function get(string $url)
    {
        static::$client->request('GET', $url, [], [], ['CONTENT_TYPE' => 'application/json']);

        $response = static::$client->getResponse();

        if (strpos($response->headers->get('Content-Type'), 'application/json') !== false) {
            return json_decode($response->getContent(), true);
        }

        return $response->getContent();
    }

    protected static function getService(string $id)
    {
        return self::$container->get($id);
    }

    private static function extractMessage(): string
    {
        $response = static::$client->getResponse();
        $message = '';

        if (strpos($response->headers->get('Content-Type'), 'text/html') !== false) {
            $crawler = static::$client->getCrawler();

            if ($crawler && $crawler->filter('h1.exception-message')->count()) {
                $message = $crawler->filter('h1.exception-message')->text();

                foreach ($crawler->filter('.trace-message') as $node) {
                    $message .= "\n" . $node->textContent;
                }
            }
        }

        /** @var ExceptionCollector $collector */
        $collector = static::getService(ExceptionCollector::class);
        $exception = $collector->peek();

        if (!$message && $exception) {
            throw $exception;
        }

        return $message ?: $response->getContent();
    }

    protected static function getUserRepository(): UserRepository
    {
        return self::getService(UserRepository::class);
    }
}
