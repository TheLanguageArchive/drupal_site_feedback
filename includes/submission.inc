<?php
namespace DrupalSiteFeedback;

use DrupalSiteFeedback\WebformNotFoundException;

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
     * @param array $data
     *
     * @return void
     */
    public function submit(int $formId, int $userId, array $values)
    {
        $node = node_load($formId);

        if (!isset($node->webform)) {
            throw new WebformNotFoundException(sprintf('Node with ID=%d is not a webform', $formId));
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

        return webform_submission_insert($node, $submission);
    }

    private function validateCaptcha($captcha)
    {
        $solution = db_query(
            'SELECT solution FROM {captcha_sessions} WHERE csid = :csid',
            [':csid' => $captcha['csid']],
        )->fetchField();

        if (false === $solution) {
            return false;
        }

        if ($captcha['validation']($solution, $captcha['response'], ))
    }
}
