<script lang="ts">
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import './styles.scss';
	
</script>

<div class="app">
	<Header />

	<main>
		<div id="article">
			<slot />
		</div>
		
		<Footer/>
	</main>
</div>

<style lang="scss" global>
	@use './styles.scss';
	@import '../lib/scss/responsive.scss';

	@include desktop{
		main{
			margin-left:200px;
			height: 100vh;
		}

	}

	@include mobile{
		main{
			height: calc(100vh - 100px);
		}
	}

	main {
		display: flex;
		flex-direction: column;
  		
	}

	#article{
		margin: 10px;
		flex:1;
	}
</style>
