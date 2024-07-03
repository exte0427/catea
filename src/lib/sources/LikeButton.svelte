<!--like button-->
<script lang="ts">
	import SmallLoading from './SmallLoading.svelte';
  import { Server } from "$lib/modules/firebase";
  import { beforeUpdate } from "svelte";
  import { writable } from 'svelte/store';

    export let id:string;
    let isLoading=writable(true);
    let like=writable(0);

    const pressLike=(id:string)=>{
        $isLoading=true;
        Server.toggleLike(id).then(e=>{
            Server.getPost(id).then(e=>{
                getLike(id);
            });
        });
    }

    const getLike=(id:string)=>{
        Server.getPost(id).then(e=>{
            $like=e.like.length;
            $isLoading=false;
        });
    }

    getLike(id);
</script>

<button id="likeButton" on:click={()=>pressLike(id)}>
    {#if $isLoading==true}
        <SmallLoading width={10}/>
    {:else}
        🤍 {$like}
    {/if}
</button>

<style lang="scss">
    @import '../../lib/scss/variable.scss';

    #likeButton{
        border-width: 0px;
        background-color: $semi-black-color;
        margin: 10px;
        margin-bottom: 0;
        padding: 10px;

        cursor: pointer;
        box-shadow: 5px 5px 0 rgba(50, 49, 47, 0.654);
        color:white;

        border-radius: 5px;
        transition: 0.3s;
        font-family: "Jua", sans-serif;

        &:hover{
            box-shadow: 0px 0px 0 rgba(50, 49, 47, 0.654);
            transform: translate(5px,5px);
        }
    }
</style>