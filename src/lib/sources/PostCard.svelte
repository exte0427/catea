<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Server } from "$lib/modules/firebase";
  import { PageModule } from "$lib/modules/pageModule";
  import type { Timestamp } from "firebase/firestore";
  import { fly } from "svelte/transition";
    export let postData:Server.Post;

    const move=()=>{
        goto(`/posts/${postData.id}`);
    }

</script>

<button on:click={move} id="inner" in:fly={{y:200, duration:200}}>
    <strong id="title">{postData.title}</strong>
    <p>{PageModule.getDate(postData.date)} <strong id="category">{postData.category}</strong></p>
</button>

<style lang="scss">
    @import '../../lib/scss/variable.scss';
    #inner{
        border-width: 0px;
        width: 100%;
        background-color: $semi-black-color;
        margin: 10px;
        margin-bottom: 0;
        padding: 10px;

        cursor: pointer;
        box-shadow: 5px 5px 0 rgba(50, 49, 47, 0.654);
        color:white;

        border-radius: 5px;
        transition: 0.3s;

        &:hover{
            box-shadow: 0px 0px 0 rgba(50, 49, 47, 0.654);
            transform: translate(5px,5px);
        }
    }

    #title{
        font-size: 1.5em;
    }

    #category{
        background-color: white;
        color: $semi-black-color;
        padding: 2px;
        border-radius: 5px;
    }
</style>