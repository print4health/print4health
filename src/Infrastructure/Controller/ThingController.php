<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Thing\Entity\Thing;
use App\Domain\Thing\Repository\ThingRepository;
use App\Infrastructure\Dto\Thing\ThingRequest;
use App\Infrastructure\Dto\Thing\ThingResponse;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;

class ThingController
{
    private SerializerInterface $serializer;

    private EntityManagerInterface $entityManager;

    private ThingRepository $thingRepository;

    public function __construct(
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        ThingRepository $thingRepository
    ) {
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->thingRepository = $thingRepository;
    }

    /**
     * @Route(
     *     "/things",
     *     name="thing_list",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function listAction(): JsonResponse
    {
        $things = $this->thingRepository->findAll();

        $response = ['things' => []];

        foreach ($things as $thing) {
            $response['things'][] = ThingResponse::createFromThing($thing);
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/things/search/{searchstring}",
     *     name="thing_search",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function searchAction(string $searchstring): JsonResponse
    {
        $things = $this->thingRepository->searchNameDescription($searchstring);

        $response = ['things' => []];

        foreach ($things as $thing) {
            $response['things'][] = ThingResponse::createFromThing($thing);
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/things",
     *     name="thing_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function createAction(Request $request): JsonResponse
    {
        try {
            /** @var ThingRequest $ThingRequest */
            $ThingRequest = $this->serializer->deserialize($request->getContent(), ThingRequest::class, JsonEncoder::FORMAT);
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $thing = new Thing(
            $ThingRequest->name,
            $ThingRequest->imageUrl,
            $ThingRequest->url,
            $ThingRequest->description,
            $ThingRequest->specification
        );

        $this->entityManager->persist($thing);
        $this->entityManager->flush();

        $ThingResponse = ThingResponse::createFromThing($thing);

        return new JsonResponse(['thing' => $ThingResponse], 201);
    }

    /**
     * @Route(
     *     "/things/{uuid}",
     *     name="thing_show",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function showAction(string $uuid): JsonResponse
    {
        $thing = $this->thingRepository->find($uuid);

        if (null === $thing) {
            throw new NotFoundHttpException('Thing not found');
        }

        $ThingResponse = ThingResponse::createFromThing($thing);

        return new JsonResponse(['thing' => $ThingResponse]);
    }
}
