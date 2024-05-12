<script>
	import { isAdmin } from './../lib/modules/isAdmin';
  import Move from '$lib/sources/Move.svelte';

  	let adminable = false;

	isAdmin.subscribe((value)=>{
		adminable = value;
	})
</script>

<header>
	<div id="text">
		catea
	</div>
	<div id="moveSector">
		<Move to="/" name="main" />
		<Move to="/posts/" name="posts" />
		<Move to="/contact/" name="contact" />
		<Move to="/admin/" name="admin" />

		<!--for admin-->
		{#if adminable}
			<Move to="/new/" name="new" />
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #ebe5df;
		padding:10px;

		position: fixed;
		height: 100vh;
		width: 200px;

		margin: 0;
		padding: 0;

		top:0;
		left:0;
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
