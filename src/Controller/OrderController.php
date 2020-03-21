<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Order;
use App\Repository\OrderRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class OrderController
{
    private NormalizerInterface $normalizer;
    private OrderRepository $orderRepository;

    public function __construct(NormalizerInterface $normalizer, OrderRepository $orderRepository)
    {
        $this->normalizer = $normalizer;
        $this->orderRepository = $orderRepository;
    }

    /**
     * @Route(
     *     "/orders",
     *     methods={"GET"}
     * )
     */
    public function all(): JsonResponse
    {
        $orders = $this->orderRepository->findAll();

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = $this->normalizer->normalize(Order::createFromOrder($order));
        }

        return new JsonResponse($response);
    }
}
