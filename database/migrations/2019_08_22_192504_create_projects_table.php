<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('company_id')
                ->nullable()
                ->index();

            $table->foreign('company_id')
                ->references('id')
                ->on('companies')
                ->onDelete('set null');

            $table->unsignedBigInteger('institution_id')
                ->nullable()
                ->index();

            $table->foreign('institution_id')
                ->references('id')
                ->on('institutions')
                ->onDelete('set null');

            $table->string('title');

            $table->text('summary')
                ->nullable();

            $table->json('links')
                ->nullable();

            $table->timestamp('started_at')
                ->nullable();

            $table->timestamp('finished_at')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
}
