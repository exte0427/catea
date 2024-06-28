<script>

  import { fade } from "svelte/transition";

</script>
<!--loading-->
<div class="loading" transition:fade={{duration: 300 }}>
  <div class="loading__spinner"></div>
</div>

<style lang="scss">
    @import '../../lib/scss/variable.scss';
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    position: fixed;
    /*center arrangement*/
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: 1000;
    background-color: $white-color;

  }

  .loading__spinner {
    width: 50px;
    height: 50px;
    border-top: 5px solid $semi-black-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>