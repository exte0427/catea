<script lang="ts">
	import { editedPost } from './../../../lib/modules/editPost';
	import { isAdmin } from './../../../lib/modules/isAdmin';
	import { PageModule } from '$lib/modules/pageModule';
import {Server} from '../../../lib/modules/firebase';
	import { afterUpdate, onMount } from 'svelte';
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

	afterUpdate(()=>{
		makeOverview();
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

	let overviewThings:string[] = [];

    const makeOverview=()=>{
        overviewThings=[];

        document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((e,i)=>{

            e.id=`_internalMovePoint_${i}`;
            overviewThings.push(`_internalMovePoint_${i}`);
        });
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
	<div id="articleWapper">
		{@html PageModule.view(postData.desc)}
	</div>
	{#if adminable}
		<button on:click = {deletePost}>delete</button>
		<button on:click = {editPost}>edit</button>
	{/if}

	
	<div id="overview">
		{#if overviewThings.length>0}
		<ul>
			{#each overviewThings as thing}
				<li>
					<a href={`#${thing}`}>{document.querySelector(`#${thing}`)?.innerHTML}</a>
				</li>
			{/each}
		</ul>
		{:else}
			<p>no overview</p>
		{/if}
		
		
	</div>
{/if}
<style lang="scss">
	@import './../../../lib/scss/variable.scss';
	@import './../../../lib/scss/responsive.scss';
	@import './../../../lib/scss/article.scss';

	@include mobile{
		#overview{
			display: none;
		}

		#articleWapper{
			margin-right:20px;
			margin-left:20px;
			width: calc(100% - 40px);
		}

		#title{
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
	}

	@include apply;

	:root{
		scroll-behavior: smooth;
	}

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

	#articleWapper{
		margin-right:220px;
		margin-left:20px;
	}

	#overview{
		position: fixed;
		top: 50%;
		right: 0;
		width: 200px;
		padding: 10px;
		color:$black-color;
		ul{
			list-style-type: none;
			padding: 0;
		}
		li{
			margin-bottom: 10px;
		}
		a{
			color:$black-color;
			text-decoration: none;
		}
	}
	
</style>