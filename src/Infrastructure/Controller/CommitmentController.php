<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Commitment\Entity\Commitment;
use App\Domain\Commitment\Repository\CommitmentRepository;
use App\Domain\Order\Entity\Order;
use App\Domain\Order\Repository\OrderRepository;
use App\Infrastructure\Dto\Commitment\CommitmentRequest;
use App\Infrastructure\Dto\Commitment\CommitmentResponse;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;

class CommitmentController
{
    private OrderRepository $orderRepository;
    private SerializerInterface $serializer;
    private EntityManagerInterface $entityManager;
    private CommitmentRepository $commitmentRepository;

    public function __construct(
        OrderRepository $orderRepository,
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        CommitmentRepository $commitmentRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->commitmentRepository = $commitmentRepository;
    }

    /**
     * @Route(
     *     "/commitments",
     *     name="commitments_list",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function listAction(): JsonResponse
    {
        $commitments = $this->commitmentRepository->findAll();

        $response = ['things' => []];

        foreach ($commitments as $commitment) {
            $response['commitments'][] = CommitmentResponse::createFromCommitment($commitment);
        }

        return new JsonResponse($response, Response::HTTP_OK);
    }

    /**
     * @Route(
     *     "/commitments/{uuid}",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function showAction(string $uuid): JsonResponse
    {
        $commitment = $this->commitmentRepository->find($uuid);

        if (null === $commitment) {
            throw new NotFoundHttpException('Thing not found');
        }

        $commitmentResponse = CommitmentResponse::createFromCommitment($commitment);

        return new JsonResponse(['commitment' => $commitmentResponse], Response::HTTP_OK);
    }

    /**
     * @Route(
     *     "/commitments",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_MAKER")
     */
    public function createAction(Request $request): JsonResponse
    {
        try {
            /** @var CommitmentRequest $commitmentRequest */
            $commitmentRequest = $this->serializer->deserialize($request->getContent(), CommitmentRequest::class, JsonEncoder::FORMAT);
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $order = $this->orderRepository->find($commitmentRequest->orderId);

        if (!$order instanceof Order) {
            throw new EntityNotFoundException('Order not found');
        }

        $commitment = new Commitment($order, $commitmentRequest->quantity);

        $this->entityManager->persist($commitment);
        $this->entityManager->flush();

        $commitmentResponse = CommitmentResponse::createFromCommitment($commitment);

        return new JsonResponse(['commitment' => $commitmentResponse], Response::HTTP_CREATED);
    }
}
