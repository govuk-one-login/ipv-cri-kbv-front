# Dynamic content

Multiple choice question and answer content for Knowledge Based Verification is provided by a 3rd party API.

It is useful to reword these question and answers to improve clarity or provide language translation.

## Form-Wizard configuration

The [hmpo-form-wizard](https://github.com/HMPO/hmpo-form-wiard) expects static configuration that is used to build up the appropriate form fields.

The question structure itself is static, however as the answers change, this configuration needs to be dynamically created.

The form-wizard framework will transparently use any config that is set on `req.form.options`

## i18n configuration

The internationalisation functionality provided by [hmpo-i18n](https://github.com/HMPO/hmpo-i18n) expects static locale files. (hmpo-i18n is an older fork of [i18next](https://www.i18next.com/) a popular i18n library.)

> Given the content is dynamic we can't 100% guarantee that all content will have localisation available - although that is always the expected situation.

In order to always display the dynamic content, fallback translations in the correct structure can be dynamically created. We can wrap the existing translation function with one that conditionally uses fallback translations.

The i18n framework will use any translation funciton that is set on `req.form.options.translate`
