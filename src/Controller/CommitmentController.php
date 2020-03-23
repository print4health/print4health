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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;

class CommitmentController
{
    private OrderRepository $orderRepository;
    private SerializerInterface $serializer;
    private EntityManagerInterface $entityManager;

    public function __construct(
        OrderRepository $orderRepository,
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager
    )
    {
        $this->orderRepository = $orderRepository;
        $this->serializer = $serializer;
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
        try {
            /** @var CommitmentIn $commitmentIn */
            $commitmentIn = $this->serializer->deserialize($request->getContent(), CommitmentIn::class, JsonEncoder::FORMAT);
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $order = $this->orderRepository->find($commitmentIn->orderId);

        if (!$order instanceof Order) {
            throw new EntityNotFoundException('Order not found');
        }

        $commitment = new Commitment($order, $commitmentIn->quantity);

        $this->entityManager->persist($commitment);
        $this->entityManager->flush();

        $commitmentOut = CommitmentOut::createFromCommitment($commitment);

        return new JsonResponse(['commitment' => $commitmentOut], Response::HTTP_CREATED);
    }

    public function get(Request $request): JsonResponse
    {
        $commitment = 'test';
        return new JsonResponse(['commitment' => $commitment], Response::HTTP_OK);
    }
}
