<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\CommitmentIn;
use App\Dto\CommitmentOut;
use App\Entity\Commitment;
use App\Entity\Order;
use App\Repository\OrderRepository;
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
    private EntityManagerInterface $entityManager;

    public function __construct(
        OrderRepository $orderRepository,
        DenormalizerInterface $denormalizer,
        EntityManagerInterface $entityManager
    ) {
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

        /** @var CommitmentIn $commitmentIn */
        $commitmentIn = $this->denormalizer->denormalize($jsonRequest, CommitmentIn::class);

        $order = $this->orderRepository->find($commitmentIn->orderId);

        if (!$order instanceof Order) {
            throw new EntityNotFoundException('Order not found');
        }

        $commitment = new Commitment($order, $commitmentIn->quantity);

        $this->entityManager->persist($commitment);
        $this->entityManager->flush();

        $commitmentOut = CommitmentOut::createFromCommitment($commitment);

        return new JsonResponse(['commitment' => $commitmentOut], 201);
    }
}
