<form role="search" method="GET" action="{{ url()->current() }}">
    <div class="input-group">
        <input type="search" class="form-control" name="q" placeholder="..." value="{{ request()->input('q') }}">
        <span class="input-group-append">
            <button type="submit" class="btn btn-pcj">Search</button>
        </span>
    </div>
</form>
