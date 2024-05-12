<script lang="ts" >
    export let to:string = "/";
    export let name:string = "main";

    const openLink= ()=>{
        window.open(to, '_blank')?.focus();
    }
</script>

<div id="main">
    <button id="inner" on:click={openLink}>
        {name}
    </button>
</div>

<style>
    #main{
        display: flex;
        width: 100%;
    }

    #inner{
        padding: 10px;
        width: 100%;
        height: 100%;
    }
</style>