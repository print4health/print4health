<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class ContactController
{
    private MailerInterface $mailer;
    private Environment $twig;


    public function __construct(MailerInterface $mailer, Environment $twig)
    {
        $this->mailer = $mailer;
        $this->twig = $twig;
    }

    /**
     * @Route(
     *     "/contact-form",
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
     */

    public function formDataAction(Request $request): JsonResponse
    {
        try {
            $formData = json_decode($request->getContent());
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        try {
            $params = $request->request->all();
            $file = $request->files->get('file');

            $mailBody = $this->twig->render(
                '/email/contact_form.html.twig',
                $params);

            $email = new Email();
            $email->subject($params['subject']);
            $email->html($mailBody);
            $email->to($params['email']);
            $email->bcc("contact@print4health.org");
            $email->from("contact@print4health.org");

            if($file){
                if($_FILES['file']['size'] <= 3000000) {
                    $fileContent = file_get_contents($_FILES['file']['tmp_name']);
                    $email->attach($fileContent, $file->getClientOriginalName());
                } else {
                    throw new \Exception("File larger than 3MB", 1);
                }
            }

            $this->mailer->send($email);
        } catch (Exception $err) {
            throw new \Exception();
        }

        return new JsonResponse(['status' => 'ok']);
    }
}
