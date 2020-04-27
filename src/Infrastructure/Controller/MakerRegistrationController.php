<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\User\Entity\Maker;
use App\Domain\User\Repository\MakerRepository;
use App\Infrastructure\Dto\MakerRegistration\MakerRegistrationRequest;
use App\Infrastructure\Dto\MakerRegistration\MakerRegistrationResponse;
use App\Infrastructure\Dto\ValidationError\ValidationErrorResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use App\Infrastructure\Services\GeoCoder;
use Exception;
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
 * Class MakerRegistrationController.
 *
 * @Route(
 *     "/maker/registration",
 *     name="maker_registration",
 *     methods={"POST"},
 *     format="json"
 * )
 * @IsGranted("IS_AUTHENTICATED_ANONYMOUSLY")
 */
class MakerRegistrationController
{
    private SerializerInterface $serializer;

    private MakerRepository $makerRepository;

    private UserPasswordEncoderInterface $userPasswordEncoder;

    private GeoCoder $geoCoder;

    private ValidatorInterface $validator;

    public function __construct(
        SerializerInterface $serializer,
        MakerRepository $makerRepository,
        UserPasswordEncoderInterface $userPasswordEncoder,
        ValidatorInterface $validator,
        GeoCoder $geoCoder
    ) {
        $this->serializer = $serializer;
        $this->makerRepository = $makerRepository;
        $this->userPasswordEncoder = $userPasswordEncoder;
        $this->validator = $validator;
        $this->geoCoder = $geoCoder;
    }

    /**
     * @throws Exception
     * @throws \Doctrine\ORM\EntityNotFoundException
     *
     * @return JsonResponse
     *
     * @SWG\Tag(name="Maker")
     * @SWG\Parameter(
     *     name="maker-registration",
     *     in="body",
     *     type="json",
     *     @Model(type=MakerRegistrationRequest::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Maker created successfully",
     *     @Model(type=MakerRegistrationResponse::class)
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
     */
    public function __invoke(Request $request)
    {
        try {
            /** @var MakerRegistrationRequest $makerRegistrationRequest */
            $makerRegistrationRequest = $this->serializer->deserialize(
                $request->getContent(),
                MakerRegistrationRequest::class,
                JsonEncoder::FORMAT
            );
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $this->validator->validate($makerRegistrationRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors, 'MakerRegistrationValidationError');
        }

        $maker = new Maker($makerRegistrationRequest->email, $makerRegistrationRequest->name, true);
        $maker->setPassword($this->userPasswordEncoder->encodePassword($maker, $makerRegistrationRequest->password));
        $maker->setPostalCode($makerRegistrationRequest->postalCode);
        $maker->setAddressCity($makerRegistrationRequest->addressCity);
        $maker->setAddressState($makerRegistrationRequest->addressState);

        try {
            // prevent a geocode request if we don't have the necessary data
            if (
                $makerRegistrationRequest->hasPostalCodeAndCountryCode() &&
                $makerRegistrationRequest->hasLatLng() === false
            ) {
                $geoLocation = $this->geoCoder->geoEncodeByPostalCodeAndCountry(
                    (string) $makerRegistrationRequest->postalCode,
                    (string) $makerRegistrationRequest->addressState
                );

                $maker->setLatitude($geoLocation->getLatitude());
                $maker->setLongitude($geoLocation->getLongitude());
            }
        } catch (Exception $err) {
            // TODO: add sentry message on error?
        }

        $this->makerRepository->save($maker);

        // todo send email for activation ?

        $makerResponse = MakerRegistrationResponse::createFromMaker($maker);

        return new JsonResponse(['maker' => $makerResponse], Response::HTTP_CREATED);
    }
}
