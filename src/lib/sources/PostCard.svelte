<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Server } from "$lib/modules/firebase";
  import { fly } from "svelte/transition";
    export let postData:Server.Post;

    const move=()=>{
        goto(`/posts/${postData.id}`);
    }
</script>

<button on:click={move} id="inner" in:fly={{y:200, duration:200}}>
    <h2>{postData.title}</h2>
    {postData.desc}
</button>

<style lang="scss">
    #inner{
        border-width: 0px;
        width: 100%;
        background-color: white;
        margin-bottom: 10px;
        padding: 10px;
    }
</style>