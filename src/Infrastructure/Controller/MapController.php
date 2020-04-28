<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Infrastructure\Exception\GeoEncoding\RateLimitExceededException;
use App\Infrastructure\Services\GeoCoder;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class MapController
{
    private GeoCoder $geoCoder;

    public function __construct(GeoCoder $geoCoder)
    {
        $this->geoCoder = $geoCoder;
    }

    /**
     * @Route(
     *     "/map/geoencode",
     *     name="contact_form",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @SWG\Response(
     *     response=200,
     *     description="received contact form data",
     * )
     *
     * @throws \Exception
     */
    public function mapGeoEncodeAction(Request $request): JsonResponse
    {
        try {
            $geoEncodeRequest = $request->get('address');
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $geocode = [];

        try {
            // prevent a geocode request if we don't have the necessary data
            if ($geoEncodeRequest) {
                $geoLocation = $this->geoCoder->geoEncodeByAddressString((string) $geoEncodeRequest);

                $geocode['latitude'] = $geoLocation->getLatitude();
                $geocode['longitude'] = $geoLocation->getLongitude();
            }
        } catch (RateLimitExceededException $exception) {
            throw $exception;
        } catch (\Exception $exception) {
            // TODO: add sentry message on error?
            throw $exception;
        }

        return new JsonResponse(['geocode' => $geocode], Response::HTTP_CREATED);
    }
}
