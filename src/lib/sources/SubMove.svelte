<script lang="ts">
  import { goto } from "$app/navigation";

    export let to:string = "/";
    export let name:string = "main";

    const move=(event:Event)=>{
        event?.stopPropagation();

        goto(to);
    }
</script>

<div id="sub">
    <button class="inner" on:click={move}>
        {name}
    </button>
</div>

<style lang="scss">
    .inner{
        display: block;
        margin: 0px;
        padding: 10px;
        border: 0;
        width:100%;

        background-color: transparent;
        color:white;
    }
</style>