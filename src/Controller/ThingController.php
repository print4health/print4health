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
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ThingController
{
    private NormalizerInterface $normalizer;
    private DenormalizerInterface $denormalizer;
    private EntityManagerInterface $entityManager;
    private ThingRepository $thingRepository;

    public function __construct(
        NormalizerInterface $normalizer,
        DenormalizerInterface $denormalizer,
        EntityManagerInterface $entityManager,
        ThingRepository $thingRepository
    ) {
        $this->normalizer = $normalizer;
        $this->denormalizer = $denormalizer;
        $this->entityManager = $entityManager;
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
            $response['things'][] = $this->normalizer->normalize(ThingOut::createFromThing($thing));
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/things",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_USER")
     */
    public function createAction(Request $request): JsonResponse
    {
        $jsonRequest = json_decode($request->getContent(), true);

        if (null === $jsonRequest) {
            throw new BadRequestHttpException();
        }

        /** @var ThingIn $thingIn */
        $thingIn = $this->denormalizer->denormalize($jsonRequest, ThingIn::class);

        $thing = new Thing($thingIn->name);

        $this->entityManager->persist($thing);
        $this->entityManager->flush();

        $thingOut = ThingOut::createFromThing($thing);

        return new JsonResponse(['thing' => $thingOut]);
    }

    /**
     * @Route(
     *     "/things/{uuid}",
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
