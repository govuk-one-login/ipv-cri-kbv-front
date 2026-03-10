# Dynamic content

Multiple choice question and answer content for Knowledge Based Verification is provided by a 3rd party API.

It is useful to reword these question and answers to improve clarity or provide language translation.

## Form-Wizard configuration

The [hmpo-form-wizard](https://github.com/HMPO/hmpo-form-wiard) expects static configuration that is used to build up the appropriate form fields.

The question structure itself is static, however as the answers change, this configuration needs to be dynamically created.

The form-wizard framework will transparently use any config that is set on `req.form.options`
