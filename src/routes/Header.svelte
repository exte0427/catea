<script>
	import CateaImg from './../lib/sources/CateaImg.svelte';
	import SubMove from './../lib/sources/SubMove.svelte';
	import { isAdmin } from './../lib/modules/isAdmin';
  	import Move from '$lib/sources/Move.svelte';

  	let adminable = false;

	isAdmin.subscribe((value)=>{
		adminable = value;
	});
</script>

<header>
	<div id="text">
		catea
	</div>
	<div id="moveSector">
		<ul>
			<li><Move to="/" name="main" /></li>
			<li><Move to="/posts/" name="posts" >
			</Move></li>
			<li><Move to="/posts/0pyNOOKWWrvT0dSJiW5k/" name="contact" /></li>
			<li><Move to="/admin/" name="admin" /></li>
		</ul>

		<!--for admin-->
		{#if adminable}
			<Move to="/new/" name="new" />
		{/if}
	</div>

	<div id="imgContainer">
		<CateaImg/>
	</div>
</header>

<style lang="scss">

	@import './../lib/scss/responsive.scss';

	@include mobile{
		header{
			width: 100%;			
		}
		ul{
			text-align: center;
		}
		li{
			display: inline-block;
		}

		#imgContainer{
			display: none;
		}
	}

	@include desktop{
		header{
			position: fixed;
			height: 100vh;
			width: 200px;

			top:0;
			left:0;
		}
	
	}

	#imgContainer{
		width: 100%;
	}

	header {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #ebe5df;
		padding:10px;

		margin: 0;
		padding: 0;
	}

	#moveSector{
		width: 100%;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	#text{
		font-size: 30px;
		font-weight: bold;
	}
</style>
