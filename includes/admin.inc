<?php
/**
 * Drupal Site Feedback Admin Form
 *
 * @param array $form
 * @param array $form_state
 *
 * @return array
 */
function drupal_site_feedback_admin_form($form, &$form_state) {

    $webforms = drupal_site_feedback_admin_get_webforms();
    $options  = [];

    foreach ($webforms as $webform) {
        $options[$webform->nid] = $webform->title;
    }

    $form['general'] = [

        '#type'   => 'fieldset',
        '#title'  => t('Drupal Site Feedback'),
        'webform' => [

            '#type'          => 'select',
            '#title'         => t('Feedback webform'),
            '#default_value' => variable_get('drupal_site_feedback_id', null),
            '#help_text'     => 'Which webform should be selected as the feedback form',
            '#options'       => $options,
        ],
    ];

    $form['actions'] = [

        '#type'  => 'actions',
        'submit' => [

            '#type'   => 'submit',
            '#value'  => t('Save Configuration'),
            '#weight' => 0,
            '#submit' => ['drupal_site_feedback_admin_form_submit'],
        ],
    ];

    return $form;
}

/**
 * Admin form submit handler
 *
 * @param array $form
 * @param array $form_state
 *
 * @return void
 */
function drupal_site_feedback_admin_form_submit($form, &$form_state) {

    if ($form_state['triggering_element']['#value'] === 'Save Configuration') {

        variable_set('drupal_site_feedback_id', $form_state['values']['webform']);
        drupal_set_message(t('Drupal Site Feedback Admin configuration was successfully saved'));
    }
}

/**
 * Fetching all available webforms
 *
 * @return array
 */
function drupal_site_feedback_admin_get_webforms() {

    $query = db_select('webform', 'w');
    $query->join('node', 'n', 'w.nid = n.nid');
    $query->fields('n', ['nid', 'title']);

    return $query->execute()->fetchAllAssoc('nid');
}
