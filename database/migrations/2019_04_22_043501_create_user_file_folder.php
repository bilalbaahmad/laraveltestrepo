<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserFileFolder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_file_folder', function (Blueprint $table) {
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('file_folder_id');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('file_folder_id')
                ->references('id')
                ->on('file_folder')
                ->onDelete('cascade');

            $table->primary(['user_id', 'file_folder_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_file_folder');
    }
}
