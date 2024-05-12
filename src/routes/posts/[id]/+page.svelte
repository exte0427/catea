
<script lang="ts">
	import { acts } from '@tadashi/svelte-notification';
	import { isAdmin } from './../../../lib/modules/isAdmin';
	import { PageModule } from '$lib/modules/pageModule';
import {Server} from '../../../lib/modules/firebase';
	import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

	export let data;
    let title="",desc="";
	let adminable=false;

	isAdmin.subscribe((value)=>{
		adminable = value;
	})

	onMount(() => {
		Server.init();
		Server.getPost(data.id).then((e:Server.Post)=>{
			title = e.title;
            desc = e.desc;
		});
	});

	const deletePost=()=>{
		Server.deletePost(data.id).then(e=>{
			if(e){
				acts.add({message:`successfully deleted`, mode:'success', lifetime:5 });
				goto(`/posts/`);
			}
			else{
				acts.add({message:`failed deleting`, mode:'danger', lifetime:5 });
			}
		})
	}
</script>

<h1>
    {title}
</h1>
{@html PageModule.view(desc)}
{#if adminable}
	<button on:click = {deletePost}>delete</button>
{/if}