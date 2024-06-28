
<script lang="ts">
	import { editedPost } from './../../../lib/modules/editPost';
	import { isAdmin } from './../../../lib/modules/isAdmin';
	import { PageModule } from '$lib/modules/pageModule';
import {Server} from '../../../lib/modules/firebase';
	import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Loading from '$lib/sources/Loading.svelte';

	export let data;
    let postData:Server.Post;
	let adminable=false;

	isAdmin.subscribe((value)=>{
		adminable = value;
	})

	onMount(() => {
		Server.init();
		Server.getPost(data.id).then((e:Server.Post)=>{
			postData=e;
		});
	});

	const deletePost=()=>{
		Server.deletePost(data.id).then(e=>{
			if(e){
				//acts.add({message:`successfully deleted`, mode:'success', lifetime:5 });
				goto(`/posts/`);
			}
			else{
				//acts.add({message:`failed deleting`, mode:'danger', lifetime:5 });
			}
		})
	}

	const editPost=()=>{
		editedPost.set(data.id);
		goto(`/new/`);
	}
</script>

{#if postData==null}
<Loading></Loading>

{:else}

	<div id="title">
		<div id="titleText">
			{postData.title}
		</div>
		<div id="titleDate">
			{PageModule.getDate(postData.date)}
		</div>
	</div>
	{@html PageModule.view(postData.desc)}
	{#if adminable}
		<button on:click = {deletePost}>delete</button>
		<button on:click = {editPost}>edit</button>
	{/if}
{/if}
<style lang="scss">
	@import './../../../lib/scss/variable.scss';
	#title{
		margin:-10px;
		margin-bottom: 10px;
		background-color: $black-color;
		color:white;
		font-size: 40px;
		padding: 10px;
		font-weight: bold;
		display: flex;
		text-align: center;

		#titleDate{

			display: flex;
			font-size: 20px;
			font-weight: normal;
			align-items: center;
		}
	}
</style>