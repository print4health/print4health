<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\User\Entity\Requester;
use App\Domain\User\Repository\RequesterRepository;
use App\Infrastructure\Dto\RequesterRegistration\RequesterRegistrationRequest;
use App\Infrastructure\Dto\RequesterRegistration\RequesterRegistrationResponse;
use App\Infrastructure\Dto\ValidationError\ValidationErrorResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use App\Infrastructure\Services\GeoCoder;
use Nelmio\ApiDocBundle\Annotation\Model;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class RequesterRegistrationController.
 *
 * @Route(
 *     "/requester/registration",
 *     name="requester_registration",
 *     methods={"POST"},
 *     format="json"
 * )
 * @IsGranted("IS_AUTHENTICATED_ANONYMOUSLY")
 */
class RequesterRegistrationController
{
    private SerializerInterface $serializer;

    private UserPasswordEncoderInterface $userPasswordEncoder;

    private GeoCoder $geoCoder;

    private ValidatorInterface $validator;

    /**
     * @var RequesterRepository
     */
    private RequesterRepository $requesterRepository;

    public function __construct(
        SerializerInterface $serializer,
        RequesterRepository $requesterRepository,
        UserPasswordEncoderInterface $userPasswordEncoder,
        ValidatorInterface $validator,
        GeoCoder $geoCoder
    ) {
        $this->serializer = $serializer;
        $this->requesterRepository = $requesterRepository;
        $this->userPasswordEncoder = $userPasswordEncoder;
        $this->validator = $validator;
        $this->geoCoder = $geoCoder;
    }

    /**
     * @return JsonResponse
     *
     * @SWG\Tag(name="Requester")
     * @SWG\Parameter(
     *     name="requester-registration",
     *     in="body",
     *     type="json",
     *     @Model(type=RequesterRegistrationRequest::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Requester created successfully",
     *     @Model(type=RequesterRegistrationResponse::class)
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request or wrong content type"
     * )
     * @SWG\Response(
     *     response=422,
     *     description="Validation failed due to missing mandatory fields or invalid field data",
     *     @Model(type=ValidationErrorResponse::class)
     * )
     * @throws \Exception
     *
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function __invoke(Request $request)
    {
        try {
            /** @var RequesterRegistrationRequest $requesterRegistrationRequest */
            $requesterRegistrationRequest = $this->serializer->deserialize(
                $request->getContent(),
                RequesterRegistrationRequest::class,
                JsonEncoder::FORMAT
            );
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $this->validator->validate($requesterRegistrationRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors, 'RequesterRegistrationValidationError');
        }

        $requester = new Requester($requesterRegistrationRequest->email, $requesterRegistrationRequest->name);
        $requester->setPassword(
            $this->userPasswordEncoder->encodePassword($requester, $requesterRegistrationRequest->password)
        );
        $requester->setName($requesterRegistrationRequest->name);
        $requester->setInstitutionType($requesterRegistrationRequest->institutionType);
        $requester->setDescription($requesterRegistrationRequest->description);
        $requester->setAddressStreet($requesterRegistrationRequest->addressStreet);
        $requester->setPostalCode($requesterRegistrationRequest->postalCode);
        $requester->setAddressCity($requesterRegistrationRequest->addressCity);
        $requester->setAddressState($requesterRegistrationRequest->addressState);
        $requester->setHub($requesterRegistrationRequest->isHub());

        try {
            // prevent a geocode request if we don't have the necessary data
            if (false === $requesterRegistrationRequest->hasLatLng()) {

                $geoLocation = $this->geoCoder->geoEncodeByAddress(
                    (string)$requesterRegistrationRequest->addressStreet,
                    (string)$requesterRegistrationRequest->postalCode,
                    (string)$requesterRegistrationRequest->addressCity,
                    (string)$requesterRegistrationRequest->addressState
                );

                $requester->setLatitude($geoLocation->getLatitude());
                $requester->setLongitude($geoLocation->getLongitude());
            }
        } catch (\Exception $err) {
            // TODO: add sentry message on error?
        }

        $this->requesterRepository->save($requester);

        // todo send email for activation ?

        $requesteResponse = RequesterRegistrationResponse::createFromRequester($requester);

        return new JsonResponse(['requester' => $requesteResponse], Response::HTTP_CREATED);
    }
}
