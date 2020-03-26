<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Commitment\Entity\Commitment;
use App\Domain\Commitment\Repository\CommitmentRepository;
use App\Domain\Order\Entity\Order;
use App\Domain\Order\Repository\OrderRepository;
use App\Domain\User\Entity\Maker;
use App\Infrastructure\Dto\Commitment\CommitmentRequest;
use App\Infrastructure\Dto\Commitment\CommitmentResponse;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;

class CommitmentController
{
    private OrderRepository $orderRepository;
    private SerializerInterface $serializer;
    private EntityManagerInterface $entityManager;
    private CommitmentRepository $commitmentRepository;
    private Security $security;

    public function __construct(
        OrderRepository $orderRepository,
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        CommitmentRepository $commitmentRepository,
        Security $security
    ) {
        $this->orderRepository = $orderRepository;
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->commitmentRepository = $commitmentRepository;
        $this->security = $security;
    }

    /**
     * Retrieves the collection of Requester resources.
     *
     * @Route(
     *     "/commitments",
     *     name="commitments_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Commitments")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Commitment collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=CommitmentResponse::class))
     *     )
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
     * Retrieves a Commitment resource.
     *
     * @Route(
     *     "/commitments/{uuid}",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Commitments")
     *
     * @SWG\Response(
     *     response=200,
     *     description="A Commitment",
     *     @Model(type=CommitmentResponse::class)
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
     * Creates a Commitment Resource.
     *
     * @Route(
     *     "/commitments",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_MAKER")
     * @SWG\Tag(name="Commitments")
     *
     * @SWG\Parameter(
     *     name="commitment",
     *     in="body",
     *     type="json",
     *     @Model(type=CommitmentRequest::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Commitment successfully created",
     *     @Model(type=CommitmentResponse::class)
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request"
     * )
     * @SWG\Response(
     *     response=401,
     *     description="Unauthorized"
     * )
     * @SWG\Response(
     *     response=404,
     *     description="Requested Order could not be found"
     * )
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

        $maker = $this->security->getUser();
        if (!$maker instanceof Maker) {
            throw new AccessDeniedHttpException('current User is not a maker account');
        }

        $commitment = new Commitment($order, $maker, $commitmentRequest->quantity);

        $this->entityManager->persist($commitment);
        $this->entityManager->flush();

        $commitmentResponse = CommitmentResponse::createFromCommitment($commitment);

        return new JsonResponse(['commitment' => $commitmentResponse], Response::HTTP_CREATED);
    }
}
