<?php
namespace DrupalSiteFeedback;

use DrupalSiteFeedback\WebformNotFoundException;
use stdClass;

/**
 * Submit data to form
 *
 * @author  Ibrahim Abdullah <ibrahim@ingeniousdev.nl>
 * @package Drupal Site Feedback
 */
class Submission
{
    /**
     * Submit data to form
     *
     * @param integer $formId
     * @param integer $userId
     * @param array   $values
     * @param array   $captcha
     *
     * @return void
     */
    public function submit(int $formId, int $userId, array $values, array $captcha = null)
    {
        $node = node_load($formId);

        if (!isset($node->webform)) {
            throw new WebformNotFoundException(sprintf('Node with ID=%d is not a webform', $formId));
        }

        if (null !== $captcha) {

            if (false === $this->validateCaptcha($node, $captcha)) {
                throw new WebformCaptchaException(sprintf('Webform with ID=%d captcha invalid', $formId));
            }
        }

        $data = [];
        foreach ($values as $group => $items) {

            $cid        = check_plain($group);
            $data[$cid] = [];

            foreach ($items as $name => $item) {
                $data[$cid][check_plain($name)] = check_plain($item);
            }
        }

        module_load_include('inc', 'webform', 'webform.module');
        module_load_include('inc', 'webform', 'includes/webform.submissions');

        $data = _webform_client_form_submit_flatten($node, $data);
        $data = webform_submission_data($node, $data);

        $submission = (object)[

            'nid'         => $formId,
            'uid'         => $userId,
            'sid'         => null,
            'submitted'   => REQUEST_TIME,
            'completed'   => REQUEST_TIME,
            'remote_addr' => ip_address(),
            'is_draft'    => false,
            'data'        => $data,
        ];

        webform_submission_insert($node, $submission);
        webform_submission_send_mail($node, $submission);

        return $submission;
    }

    /**
     * Validating captcha
     *
     * @param stdClass $node
     * @param array $captcha
     */
    public function validateCaptcha(stdClass $node, array $captcha)
    {
        $webform = drupal_get_form('webform_client_form_' . $node->nid, $node);

        $element = [
            '#captcha_validate' => $webform['captcha']['#captcha_validate'],
        ];

        $solution = db_query(
          'SELECT solution FROM {captcha_sessions} WHERE csid = :csid',
          array(':csid' => $captcha['sid'])
          )
          ->fetchField();

        $validation = $webform['captcha']['#captcha_validate'];

        $element    = [];
        $form_state = [];

        if ($webform['captcha']['#captcha_type'] === 'recaptcha/reCAPTCHA') {
            $_POST['g-recaptcha-response'] = $captcha['response'];
        }

        return $validation($solution, $captcha['response'], $element, $form_state);
    }
}
