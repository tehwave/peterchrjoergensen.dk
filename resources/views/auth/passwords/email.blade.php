@extends('layouts.admin')

@section('admin')
    <form method="POST" action="{{ route('password.email') }}">
        <article class="card">
            <header class="card-header bg-pcj text-white">
                <h1 class="h6 mb-0">Send password reset</h1>
            </header>
            <section class="card-body">
                    {{ csrf_field() }}

                    @if (session('status'))
                        <div class="form-row">
                            <div class="form-group col">
                                <div class="alert alert-success">
                                    {{ session('status') }}
                                </div>
                            </div>
                        </div>
                    @endif

                    <div class="form-row">
                        <div class="form-group col">
                            <label for="email">Email</label>
                            <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required>
                        </div>
                    </div>
            </section>
            <footer class="card-footer text-right">
                <button type="submit" class="btn btn-pcj">
                    Send
                </button>
            </footer>
        </article>
    </form>
@endsection
