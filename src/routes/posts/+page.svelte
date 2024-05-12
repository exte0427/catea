
<script lang="ts">
  import PostCard from '$lib/sources/PostCard.svelte';
	import {Server} from '../../lib/modules/firebase';
	import { onMount } from 'svelte';


    let posts:Server.Post[]=[];

	onMount(() => {
        Server.init();
		Server.getPosts().then((e:Server.Post[])=>{
            posts=e;
        });
	});
</script>

<h1>
    post lists
</h1>
<div>
    {#each posts as post}
        <PostCard postData={post}/>
    {/each}
</div>