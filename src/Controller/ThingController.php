<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\ThingIn;
use App\Dto\ThingOut;
use App\Entity\Thing;
use App\Repository\ThingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class ThingController
{
    private DenormalizerInterface $denormalizer;
    private EntityManagerInterface $entityManager;
    private ThingRepository $thingRepository;

    public function __construct(
        DenormalizerInterface $denormalizer,
        EntityManagerInterface $entityManager,
        ThingRepository $thingRepository
    ) {
        $this->denormalizer = $denormalizer;
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
            $response['things'][] = ThingOut::createFromThing($thing);
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
     * @IsGranted("ROLE_USER")
     */
    public function createAction(Request $request): JsonResponse
    {
        $content = (string) $request->getContent();
        $jsonRequest = json_decode($content, true, 512, JSON_THROW_ON_ERROR);

        if (null === $jsonRequest) {
            throw new BadRequestHttpException();
        }

        /** @var ThingIn $thingIn */
        $thingIn = $this->denormalizer->denormalize($jsonRequest, ThingIn::class);

        $thing = new Thing($thingIn->name, $thingIn->imageUrl, $thingIn->url, $thingIn->description);

        $this->entityManager->persist($thing);
        $this->entityManager->flush();

        $thingOut = ThingOut::createFromThing($thing);

        return new JsonResponse(['thing' => $thingOut], 201);
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

        $thingOut = ThingOut::createFromThing($thing);

        return new JsonResponse(['thing' => $thingOut]);
    }
}
