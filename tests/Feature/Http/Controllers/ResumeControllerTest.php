<?php

namespace Tests\Feature\Http\Controllers;

use Tests\TestCase;

class ResumeControllerTest extends TestCase
{
    /** @test */
    public function it_returns_an_ok_response()
    {
        $url = route('resume');

        $response = $this->get($url);

        $response->assertOk();
    }
}
