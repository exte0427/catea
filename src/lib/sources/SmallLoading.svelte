<script lang="ts">
    export let width:number=100;
</script>

<!--loading bar-->
<div class="loader" style='width: {width}px;height: {width}px;border-top: {width/120*16}px solid white;'>
</div>

<style lang="scss">
  @import '../../lib/scss/variable.scss';

  // make it spining circle
    .loader {
        display: inline-block;
        border-radius: 50%;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>