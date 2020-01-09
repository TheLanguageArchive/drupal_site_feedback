<?php
namespace DrupalSiteFeedback;

use DrupalSiteFeedback\WebformNotFoundException;
use stdClass;

/**
 * Parsing webform
 *
 * @author  Ibrahim Abdullah <ibrahim@ingeniousdev.nl>
 * @package Drupal Site Feedback
 */
class ParseForm
{
    /**
     * Parse form
     *
     * @param integer $formId
     */
    public function parse(int $formId)
    {
        $node = node_load($formId);
        $form = $this->parseForm($node);

        return $this->normalizeOrder($form);
    }

    /**
     * Parse form
     *
     * @param stdClass $node
     *
     * @return array
     */
    private function parseForm(stdClass $node)
    {
        if (!isset($node->webform)) {
            throw new WebformNotFoundException(sprintf('Node with ID=%d is not a webform', $node->nid));
        }

        $webform = $node->webform;
        $form    = [

            'id'         => strtolower($node->title),
            'title'      => $node->title,
            'captcha'    => $this->renderCaptcha($node),
            'components' => [],
        ];

        foreach ($webform['components'] as $component) {

            $cid = (int)$component['cid'];
            $pid = (int)$component['pid'];

            if ($pid === 0) {

                $form['components'][$cid] = $this->parseFieldset($component);

                if (true === $this->allowed($component['type'])) {

                    // component is not inside a fieldset, so let's create one
                    $form['components'][$cid]['items'][] = $this->parseItem($component);
                }

            } elseif (isset($form['components'][$pid]) && true === $this->allowed($component['type'])) {
                $form['components'][$pid]['items'][] = $this->parseItem($component);
            }
        }

        return $form;
    }

    /**
     * Normalizing order
     *
     * @param array $form
     *
     * @return array
     */
    private function normalizeOrder(array $form)
    {
        $componentOrder = 1;

        foreach ($form['components'] as $cid => $component) {

            $form['components'][$cid]['order'] = $componentOrder;

            $componentOrder += 1;
            $itemOrder       = 1;

            foreach ($component['items'] as $tid => $item) {

                $form['components'][$cid]['items'][$tid]['order'] = $itemOrder;
                $itemOrder += 1;
            }
        }

        return $form;
    }

    /**
     * Parsing fieldset
     *
     * @param array $component
     *
     * @return array
     */
    private function parseFieldset(array $component)
    {
        return [

            'value'       => '',
            'key'         => $component['form_key'],
            'placeholder' => $component['value'],
            'required'    => (int)$component['required'] === 1,
            'title'       => $component['name'],
            'items'       => [],
            'order'       => 0,
            'type'        => 'fieldset',
        ];
    }

    /**
     * Parsing item
     *
     * @param array $component
     *
     * @return array
     */
    private function parseItem(array $component)
    {
        return [

            'value'       => '',
            'key'         => $component['form_key'],
            'label'       => $component['name'],
            'placeholder' => $component['value'],
            'required'    => (int)$component['required'] === 1,
            'order'       => 0,
            'type'        => $component['type'],
        ];
    }

    /**
     * Is type allowed
     *
     * @param string $type
     *
     * @return boolean
     */
    private function allowed(string $type)
    {
        return in_array($type, ['textfield', 'email', 'textarea']);
    }

    /**
     * Rendering captcha element
     *
     * @param stdClass $node
     *
     * @return string
     */
    private function renderCaptcha(stdClass $node)
    {
        $webform  = drupal_get_form('webform_client_form_' . $node->nid, $node);
        drupal_render($webform);

        if (!isset($webform['captcha']) || !in_array($webform['captcha']['#captcha_type'], ['captcha/Math', 'recaptcha/reCAPTCHA'])) {
            return false;
        }

        if ($webform['captcha']['#captcha_type'] === 'captcha/Math') {
            $html = $webform['captcha']['captcha_widgets']['captcha_response']['#field_prefix'];
        }

        if ($webform['captcha']['#captcha_type'] === 'recaptcha/reCAPTCHA') {
            $html = $webform['captcha']['captcha_widgets']['recaptcha_widget']['#markup'];
        }

        return [

            'type'       => $webform['captcha']['#captcha_type'],
            'csid'       => intval($webform['captcha']['captcha_sid']['#value']),
            'token'      => $webform['captcha']['captcha_token']['#value'],
            'response'   => $webform['captcha']['captcha_widgets']['captcha_response']['#value'],
            'html'       => $html,
            'sitekey'    => variable_get('recaptcha_site_key', ''),
        ];
    }
}
