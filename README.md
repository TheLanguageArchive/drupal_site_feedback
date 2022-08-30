# drupal_site_feedback
Drupal module for collecting user feedback

Module requires CAPTCHA en reCAPTCHA modules to be installed
To show the floating button, edit `sites/all/themes/bootstrap/templates/system/page.tpl.php` and add the following at the bottom:

```
<?php if (!empty($page['drupal_site_feedback'])): ?>
    <?php print render($page['drupal_site_feedback']); ?>
<?php endif; ?>
```
