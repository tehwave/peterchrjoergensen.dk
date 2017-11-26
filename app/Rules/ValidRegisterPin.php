<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ValidRegisterPin implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return $value === config('app.register_pin');
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The PIN is not valid.';
    }
}