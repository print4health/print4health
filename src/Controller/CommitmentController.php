<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Commitment;
use App\Entity\Order;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class CommitmentController
{
    private OrderRepository $orderRepository;
    private DenormalizerInterface $denormalizer;
    private EntityManager $entityManager;

    public function __construct(OrderRepository $orderRepository,
                                DenormalizerInterface $denormalizer,
                                EntityManagerInterface $entityManager)
    {
        $this->orderRepository = $orderRepository;
        $this->denormalizer = $denormalizer;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route(
     *     "/commitments",
     *     methods={"POST"},
     *     format="json"
     * )
     */
    public function create(Request $request): JsonResponse
    {
        $jsonRequest = json_decode((string) $request->getContent(), true);

        if (null === $jsonRequest) {
            throw new BadRequestHttpException();
        }

        /** @var Commitment $commitmentDto */
        $commitmentDto = $this->denormalizer->denormalize($jsonRequest, Commitment::class);

        /** @var Order $order */
        $order = $this->orderRepository->find($commitmentDto->order);

        if (!$order instanceof $order) {
            throw new EntityNotFoundException('Order not found');
        }

        $commitment = new \App\Entity\Commitment($order, $commitmentDto->quantity);

        $this->entityManager->persist($commitment);
        $this->entityManager->flush();

        return new JsonResponse(['commitment' => $commitment]);
    }
}
