<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Thing;
use App\Repository\ThingRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ThingController
{
    private NormalizerInterface $normalizer;
    private ThingRepository $thingRepository;

    public function __construct(
        NormalizerInterface $normalizer,
        ThingRepository $thingRepository
    ) {
        $this->normalizer = $normalizer;
        $this->thingRepository = $thingRepository;
    }

    /**
     * @Route(
     *     "/things",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function listAction(): JsonResponse
    {
        $things = $this->thingRepository->findAll();

        $response = ['things' => []];

        foreach ($things as $thing) {
            $response['things'][] = $this->normalizer->normalize(Thing::createFromThing($thing));
        }

        return new JsonResponse($response);
    }
}
