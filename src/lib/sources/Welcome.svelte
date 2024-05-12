<script lang="ts">
	import { Server } from './../modules/firebase';
	import Take from './Take.svelte';
    import {Notifications, acts} from '@tadashi/svelte-notification'

    acts.add({message:`this webpage doesn't support mobile device yet`, mode:'warn', lifetime:5 });
    console.log(Server.isAdmin());
</script>

<div>
    <h1>Im Catea</h1>
    <p>
        i draw and do shitty stuff
    </p>
    <h1>check out my works</h1>
    <h2>drawings</h2>
    <Take link="https://twitter.com/drawcatea">twitter(X)</Take>
    <Take link="https://twitter.com/drawcatea">pixiv</Take>

    <h2>development</h2>
    <Take link="https://itch.io/dashboard">itch.io</Take>
    <Take link="https://github.com/exte0427">github</Take>

    <h2>writings & video</h2>
    <blockquote>not yet!</blockquote>

</div>