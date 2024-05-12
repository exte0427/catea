<script lang="ts">
  import { Notifications } from '@tadashi/svelte-notification';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import './styles.css';

	
</script>

<div class="app">
	<Header />

	<main>
		<div id="article">
			<slot />
		</div>
		
		<Footer/>
	</main>
	<Notifications />
</div>

<style>

	main {
		display: block;
		margin-left:200px;
	}

	#article{
		margin: 10px;
		min-height: calc(100vh - 200px);
	}
</style>
