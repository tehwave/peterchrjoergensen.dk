<?php

use App\User;
use App\Post;
use App\Skill;
use App\Education;
use App\Experience;
use App\SkillGroup;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(User::class)
            ->create([
                'email' => 'user@example.com',
            ]);

        factory(Post::class, 15)
            ->create();

        factory(Education::class, 3)
            ->create();

        factory(Experience::class, 3)
            ->create();

        factory(SkillGroup::class, 3)
            ->create()
            ->each(function ($skillGroup) {
                $skills = factory(Skill::class, 15)->create();

                $skillGroup->skills()->saveMany($skills);
            });
    }
}
